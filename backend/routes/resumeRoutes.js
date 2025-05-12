const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController.js');
const { protect } = require('../middleware/authMiddleware.js');
const upload = require('../config/multer.js'); // Configure multer for file uploads

router.route('/')
  .get(protect, resumeController.getAllResumes)
  .post(protect, upload.single('resume'), resumeController.createResume);

router.route('/:id')
  .get(protect, resumeController.getResume)
  .put(protect, resumeController.updateResume)
  .delete(protect, resumeController.deleteResume);

module.exports = router;