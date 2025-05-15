const fs = require("fs").promises;
const path = require("path");
const pdf = require("pdf-parse");
const axios = require("axios");
const Resume = require("../models/resume");
const logger = require("../utils/logger");
require('dotenv').config();

// List of GROQ API keys from environment
const GROQ_KEYS = [
  process.env.GROQ_API_KEY,
  process.env.GROQ_API_KEY_2,
  process.env.GROQ_API_KEY_3,
  process.env.GROQ_API_KEY_4,
].filter(Boolean); // Remove undefined ones

// Parse resume text using GROQ with fallback on multiple keys
async function parseWithGroq(text) {
  const prompt = `You're a resume parser. Extract the following information from the provided resume text. If any field is missing or unavailable, use null or an empty array where appropriate.

Return the result in strict valid JSON format with these fields:

- name: string
- email: string
- phone: string
- jobRole: string
- about: string
- skills: array of strings
- socialLinks: object with optional keys like "github", "linkedin", "email"
- education: array of objects (institution, degree, field, startDate, endDate)
- experience: array of objects (company, position, startDate, endDate, description)
- projects: array of objects (name, description, technologies)
- certifications: array of strings
- languages: array of strings

Strict JSON format:

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "jobRole": "Full Stack Developer",
  "about": "Enthusiastic software engineer...",
  "skills": ["JavaScript", "React"],
  "socialLinks": {
    "github": "https://github.com/johndoe",
    "linkedin": "https://linkedin.com/in/johndoe",
    "email": "john@example.com"
  },
  "education": [...],
  "experience": [...],
  "projects": [...],
  "certifications": [...],
  "languages": [...]
}

Resume Text:
${text}`;

  for (let apiKey of GROQ_KEYS) {
    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.1,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const content = response.data.choices[0]?.message?.content;
      return typeof content === "string" ? JSON.parse(content) : content;
    } catch (err) {
      logger.warn(`GROQ API key failed, switching to next if available: ${apiKey}`);
    }
  }

  throw new Error("All GROQ API keys failed or limit exceeded.");
}

// Upload and parse resume
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const { originalname, filename, path: filepath, mimetype, size } = req.file;
    const buffer = await fs.readFile(filepath);
    const { text } = await pdf(buffer);
    const resumeData = await parseWithGroq(text);

    const resume = new Resume({
      user: req.user.id,
      filename,
      originalName: originalname,
      path: filepath,
      size,
      mimetype,
      parsedData: {
        ...resumeData,
        rawContent: text,
      },
      status: "parsed",
    });

    await resume.save();

    return res.status(201).json({
      message: "Resume uploaded and parsed successfully",
      resume: {
        id: resume._id,
        parsedData: resume.parsedData,
      },
    });
  } catch (error) {
    logger.error("RESUME UPLOAD ERROR", error);
    return res.status(500).json({
      message: "Error uploading resume",
      error: error.message,
    });
  }
};

// Get all resumes for user
exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id })
      .select("-parsedData.rawContent -path")
      .sort({ createdAt: -1 });

    return res.status(200).json({ resumes });
  } catch (error) {
    logger.error("GET RESUMES ERROR", error);
    return res.status(500).json({ message: "Error retrieving resumes" });
  }
};

// Get single resume
exports.getResumesById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).select("-parsedData.rawContent -path");

    if (!resume) return res.status(404).json({ message: "Resume not found" });

    return res.status(200).json({ resume });
  } catch (error) {
    logger.error("GET RESUME BY ID ERROR", error);
    return res.status(500).json({ message: "Error getting resume by ID" });
  }
};

// Delete resume
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) return res.status(404).json({ message: "Resume not found" });

    try {
      await fs.unlink(resume.path);
    } catch {
      logger.warn(`File not found for deletion: ${resume.path}`);
    }

    await Resume.deleteOne({ _id: resume._id });
    return res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    logger.error("DELETE RESUME ERROR", error);
    return res.status(500).json({ message: "Error deleting resume" });
  }
};

// Re-parse resume
exports.reparseResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const buffer = await fs.readFile(resume.path);
    const { text } = await pdf(buffer);
    const resumeData = await parseWithGroq(text);

    resume.parsedData = {
      ...resumeData,
      rawContent: text,
    };
    resume.status = "parsed";

    await resume.save();

    return res.status(200).json({
      message: "Resume re-parsed successfully",
      resume: {
        id: resume._id,
        parsedData: resume.parsedData,
      },
    });
  } catch (error) {
    logger.error("REPARSE RESUME ERROR", error);
    return res.status(500).json({
      message: "Error reparsing resume",
      error: error.message,
    });
  }
};

// Update resume fields
exports.updateResumeData = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const { parsedData } = req.body;

    if (parsedData) {
      resume.parsedData = {
        ...resume.parsedData,
        ...parsedData,
      };
    }

    await resume.save();
    
    return res.status(200).json({
      message: "Resume data updated successfully",
      resume: {
        id: resume._id,
        parsedData: resume.parsedData,
      },
    });
  } catch (error) {
    logger.error("UPDATE RESUME ERROR", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    return res.status(500).json({
      message: "Error updating resume data",
      error: error.message,
    });
  }
};
