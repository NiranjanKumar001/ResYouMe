const express = require("express");
const router = express.Router();
const {buildTemplateController} = require("../controller/generateAIPortfolio");
const { deployToGitHub } = require("../controller/deploycontroller");
const authenticate = require("../middleware/fakeAuthMiddleware"); // JWT auth middleware
const portfolioController = require("../controller/portfolioController");

// Route: Build HTML template from resume data
router.post("/build-template",authenticate,buildTemplateController );

// Route: Deploy to GitHub
router.post("/deploy", authenticate, deployToGitHub);

// Create
router.post("/", portfolioController.createPortfolio);

// Read all
router.get("/", portfolioController.getAllPortfolios);

// Read one
router.get("/:id", portfolioController.getPortfolioById);

// Update
router.put("/:id", portfolioController.updatePortfolio);

// Delete
router.delete("/:id", portfolioController.deletePortfolio);

module.exports = router;
