const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resume",
    required: true,
  },
  repoName: {
    type: String,
    required: true,
  },
  githubRepoLink: {
    type: String,
    required: true,
  },
  pagesUrl: {
    type: String,
    required: true,
  },
  deployedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Portfolio", portfolioSchema);
