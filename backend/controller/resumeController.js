const fs = require("fs").promises;
const path = require("path");
const pdf = require("pdf-parse");
const mongoose = require("mongoose");
const Resume = require("../models/resume");
const User = require("../models/User");
const logger = require("../utils/logger");
require('dotenv').config();


const { GoogleGenerativeAI } = require("@google/generative-ai");
// console.log("API Key value:", process.env.GEMINI_API_KEY);
// Check if it's undefined or doesn't match your expected key

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper to extract structured data from raw text using Gemini
async function parseWithGemini(text) {
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = `
You're a resume parser. Extract the following from the resume text:

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
${text}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const jsonString = response.text().replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(jsonString);
  } catch (err) {
    logger.error("Error parsing JSON from Gemini response", err);
    return {};
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

    const resumeData = await parseWithGemini(text);

    const resume = new Resume({
      user: req.user.id || "6579e2a1b54d7e3a5c8b4567", // fallback for testing remove this NIRUUUUU
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
    return res.status(500).json({ message: "Error uploading resume" });
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
    const resumeData = await parseWithGemini(text);

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
    return res.status(500).json({ message: "Error reparsing resume" });
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
