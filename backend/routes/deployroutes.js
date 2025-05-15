const express = require("express");
const router = express.Router();

// Correct path based on folder structure
const { deployToGitHub } = require("../controller/deploycontroller"); // Ensure the correct path here

// POST route to deploy the portfolio to GitHub
router.post("/deploy", deployToGitHub);

module.exports = router;
