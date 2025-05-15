const mongoose = require('mongoose');  
const Resume = require('../models/resume');
const User = require('../models/User');
// Create a new user
exports.createUser = async (req, res) => {
    try {
      if (!req.body.accessToken) {
        return res.status(400).json({ error: "Access token is required" });
      }
  
      const user = new User(req.body);
      const savedUser = await user.save();
      res.status(201).json(savedUser);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  

// Get user by ID (with optional resume populated)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("resume");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user by ID
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete user by ID (will auto-delete resume from pre hook)
exports.deleteUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      
      // Use findByIdAndDelete to remove the user
      await User.findByIdAndDelete(req.params.id); // triggers the pre('remove') hook
      res.json({ message: "User and associated resume deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
// Link a resume to a user
exports.linkResume = async (req, res) => {
    const { userId, resumeId } = req.body;
  
    try {
      // Find the resume by its _id
      const resume = await Resume.findById(resumeId);
      if (!resume) return res.status(404).json({ message: "Resume not found" });
  
      // Check if the resume belongs to the correct user (this can be optional if your system doesn't require this check)
      if (resume.user.toString() !== userId)
        return res.status(403).json({ message: "Resume does not belong to this user" });
  
      // Find the user and update their resumeId (use the _id of the resume)
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { resumeId: resume._id },  // Store the _id of the resume, not a separate field
        { new: true }
      );
      
      // Respond with the updated user data
      res.json(updatedUser);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };