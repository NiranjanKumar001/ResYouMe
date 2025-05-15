const express = require("express");
const router = express.Router();
const {buildTemplateController} = require("../controller/generateAIPortfolio");
const { deployToGitHub } = require("../controller/deploycontroller");
const authenticate = require("../middleware/fakeAuthMiddleware"); // JWT auth middleware

// Route: Build HTML template from resume data
router.post("/build-template",authenticate,buildTemplateController );

// Route: Deploy to GitHub
router.post("/deploy", authenticate, deployToGitHub);

module.exports = router;
