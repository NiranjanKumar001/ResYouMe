const express = require('express');
const router = express.Router();
const authController = require('../controller/authController.js');
const rateLimit = require('express-rate-limit');

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: 'Too many requests from this IP, please try again later'
});

router.get('/github', authLimiter, authController.initiateGithubAuth);
router.get('/github/callback', authController.handleGithubCallback);
router.post('/logout', authController.logout);

module.exports = router;