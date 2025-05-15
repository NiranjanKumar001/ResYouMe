// src/routes/resume.routes.js
const express = require('express');
const router = express.Router();
const resumeController = require('../controller/resumeController');
const uploadMiddleware = require('../middleware/upload.middleware');
const { validate } = require('../middleware/validate.middleware');
const resumeValidator  = require('../validators/resume.validator');
const authMiddleware = require('../middleware/fakeAuthMiddleware');

// Apply auth middleware to all resume routes
router.use(authMiddleware);

// Upload and parse a resume
router.post('/upload',uploadMiddleware, 
  resumeController.uploadResume
);

// Get all resumes for the current user
router.get(
  '/',
  resumeController.getResumes
);

// Get a specific resume by ID
router.get(
  '/:id',
  validate(resumeValidator.getResumeSchema),
  resumeController.getResumesById
);

// Delete a resume
router.delete(
  '/:id',
  validate(resumeValidator.deleteResumeSchema),
  resumeController.deleteResume
);

// Re-parse an existing resume
router.post(
  '/:id/reparse',
  validate(resumeValidator.reparseResumeSchema),
  resumeController.reparseResume
);

// Update parsed data manually
router.patch(
  '/:id',
  validate(resumeValidator.updateResumeSchema),
  resumeController.updateResumeData
);
router.put(
  '/:id',
  validate(resumeValidator.updateResumeSchema),
  resumeController.updateResumeData
);

module.exports = router;
