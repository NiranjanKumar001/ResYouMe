const fs = require("fs").promises;
const path = require("path");
const pdf = require("pdf-parse");
const Resume = require("../models/resume");
const logger = require("../utils/logger");
const axios = require('axios');

async function parseWithGroq(text) {
  const prompt = `You're a resume parser. Extract the following from the resume text:

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
        model: "llama-3.3-70b-versatile",
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
    return typeof content === 'string' ? JSON.parse(content) : content;
  } catch (err) {
    logger.error("Error parsing with Groq", err);
    throw new Error("Failed to parse resume with Groq API");
  }
}

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { originalname, filename, path: filepath, mimetype, size } = req.file;
    const buffer = await fs.readFile(filepath);
    const { text } = await pdf(buffer);
    const resumeData = await parseWithGroq(text);

    const resume = new Resume({
      user: req.user.id,
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

exports.getResumesById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id
    }).select("-parsedData.rawContent -path");

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    logger.error("GET RESUME BY ID ERROR", error);
    return res.status(500).json({ message: "Error getting resume by ID" });
  }
};

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

exports.updateResumeData = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const { parsedData } = req.body;

    // Update only provided fields
    if (parsedData) {
      resume.parsedData = {
        ...resume.parsedData,
        ...parsedData
      };
    }

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
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation failed',
        errors
      });
    }
    
    return res.status(500).json({ 
      message: "Error updating resume data",
      error: error.message 
    });
  }
};