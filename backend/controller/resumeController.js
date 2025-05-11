const Resume = require('../models/resume');
const mongoose = require('mongoose');

// @desc    Get all resumes
// @route   GET /api/resumes
// @access  Private
const getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).select('-parsedData.rawContent');
    res.status(200).json(resumes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single resume
// @route   GET /api/resumes/:id
// @access  Private
const getResume = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid resume ID' });
    }

    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id
    }).select('-parsedData.rawContent');

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.status(200).json(resume);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create new resume
// @route   POST /api/resumes
// @access  Private
const createResume = async (req, res) => {
  try {
    const { originalName, path, size, mimeType } = req.body;

    // Basic validation
    if (!originalName || !path || !size || !mimeType) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const resume = await Resume.create({
      user: req.user.id,
      filename: req.file ? req.file.filename : `${Date.now()}-${originalName}`,
      originalName,
      path,
      size,
      mimeType,
      status: 'uploaded'
    });

    res.status(201).json(resume);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update resume
// @route   PUT /api/resumes/:id
// @access  Private
const updateResume = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid resume ID' });
    }

    const { parsedData, status } = req.body;
    const updateFields = {};

    if (parsedData) updateFields.parsedData = parsedData;
    if (status) updateFields.status = status;

    const resume = await Resume.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      updateFields,
      { new: true, runValidators: true }
    ).select('-parsedData.rawContent');

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.status(200).json(resume);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private
const deleteResume = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid resume ID' });
    }

    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Here you would also delete the actual file from storage
    // await deleteFile(resume.path);

    res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getAllResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume
};