const fs = require("fs").promises;
const path = require("path");
const pdf = require("pdf-parse");
const mongoose = require("mongoose");
const Resume = require("../models/resume");
const User = require("../models/User");
const logger = require("../utils/logger");
require('dotenv').config();
const axios = require('axios');

// Helper to extract structured data from raw text using Groq
async function parseWithGroq(text) {

  const API_KEY = process.env.GROQ_API_KEY;
  //console.log(API_KEY);

  const prompt =
   `You're a resume parser. Extract the following from the resume text:

- Name
- Email
- Phone
- Skills (as an array)
- Education (as an array of institutions, degrees, fields, and years if available)
- Experience (as an array of companies, positions, years, and short descriptions)
- Projects (as an array of project names, descriptions, technologies)

Respond in strict JSON format like:
{
  "name": "",
  "email": "",
  "phone": "",
  "skills": [],
  "education": [],
  "experience": [],
  "projects": []
}

Resume Text:
${text}`;

  try {
    const response = await axios.post(
  'https://api.groq.com/openai/v1/chat/completions',
  {
    model: "llama-3.3-70b-versatile", // Change to a supported model
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.1
  },
  {
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    }
  }
);


    const content = response.data.choices[0]?.message?.content;
    if (typeof content === 'string') {
      // Sometimes the response comes as a string with JSON inside
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(content);
    }
    return content;
  } catch (err) {
    logger.error("Error parsing with Groq", err);
    throw new Error("Failed to parse resume with Groq API");
  }
}

// POST /api/resume/upload
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { originalname, filename, path: filepath, mimetype, size } = req.file;

    const buffer = await fs.readFile(filepath);
    const { text } = await pdf(buffer); // Extract raw text from PDF

    const resumeData = await parseWithGroq(text);

    const resume = new Resume({
      user: req.user.id , // fallback for testing remove this NIRUUUUU
      filename,
      originalname,
      path: filepath,
      size,
      mimetype,
      parsedData: {
        ...resumeData,
        rawContent: text
      },
      status: "parsed"
    });

    await resume.save();

    return res.status(201).json({
      message: "Resume uploaded and parsed successfully",
      resume: {
        id: resume._id,
        filename: resume.filename,
        originalname: resume.originalname,
        parsedData: resume.parsedData
      }
    });

  } catch (error) {
    logger.error("RESUME UPLOAD ERROR", error);
    return res.status(500).json({ 
      message: "Error uploading resume",
      error: error.message 
    });
  }
};

// GET /api/resumes
exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id })
      .select("-parsedData.rawContent")
      .sort({ createdAt: -1 });

    return res.status(200).json({ resumes });
  } catch (error) {
    logger.error("GET RESUMES ERROR", error);
    return res.status(500).json({ message: "Error retrieving resumes" });
  }
};

// GET /api/resumes/:id
exports.getResumesById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id
    }).select("-parsedData.rawContent");

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    logger.error("GET RESUME BY ID ERROR", error);
    return res.status(500).json({ message: "Error getting resume by ID" });
  }
};

// DELETE /api/resume/:id
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    try {
      await fs.unlink(resume.path);
    } catch (unlinkError) {
      logger.warn(`File not found for deletion: ${resume.path}`);
    }

    await Resume.deleteOne({ _id: resume._id });

    return res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    logger.error("DELETE RESUME ERROR", error);
    return res.status(500).json({ message: "Error deleting resume" });
  }
};

// POST /api/resume/:id/reparse
exports.reparseResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const buffer = await fs.readFile(resume.path);
    const { text } = await pdf(buffer);
    const resumeData = await parseWithGroq(text);

    resume.parsedData = {
      ...resumeData,
      rawContent: text
    };
    resume.status = "parsed";

    await resume.save();

    return res.status(200).json({
      message: "Resume re-parsed successfully",
      resume: {
        id: resume._id,
        parsedData: resume.parsedData
      }
    });

  } catch (error) {
    logger.error("REPARSE RESUME ERROR", error);
    return res.status(500).json({ 
      message: "Error reparsing resume",
      error: error.message 
    });
  }
};

// PATCH /api/resumes/:id
exports.updateResumeData = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const { name, email, phone, skills, education, experience, projects } = req.body;

    if (name) resume.parsedData.name = name;
    if (email) resume.parsedData.email = email;
    if (phone) resume.parsedData.phone = phone;
    if (skills) resume.parsedData.skills = skills;
    if (education) resume.parsedData.education = education;
    if (experience) resume.parsedData.experience = experience;
    if (projects) resume.parsedData.projects = projects;

    await resume.save();

    return res.status(200).json({
      message: "Resume data updated successfully",
      resume: {
        id: resume._id,
        parsedData: resume.parsedData
      }
    });

  } catch (error) {
    logger.error("UPDATE RESUME ERROR", error);
    return res.status(500).json({ message: "Error updating resume data" });
  }
};
