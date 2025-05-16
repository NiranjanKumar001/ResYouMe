const path = require("path");
const fs = require("fs").promises;
const { Octokit } = require("@octokit/rest");
const logger = require("../utils/logger");
const User = require("../models/User");
const Portfolio = require("../models/portfolio.js"); // ✅ Portfolio model
const { setTimeout } = require("timers/promises");

// POST /api/deploy
exports.deployToGitHub = async (req, res) => {
  try {
    const userId = req.user.id;
    const { outputDir, repoName, resumeId } = req.body;

    if (!outputDir || !repoName || !resumeId) {
      return res.status(400).json({ message: "Missing outputDir, repoName, or resumeId" });
    }

    const user = await User.findById(userId);
    if (!user || !user.username || !user.accessToken) {
      return res
        .status(401)
        .json({ message: "GitHub account not properly connected" });
    }

    // 🔒 Restrict to one portfolio per user
    const existingPortfolio = await Portfolio.findOne({ user: userId });
    if (existingPortfolio) {
      return res.status(400).json({
        message: "You have already deployed a portfolio. Only one deployment is allowed per account.",
        existingUrl: existingPortfolio.pagesUrl,
      });
    }

    const githubToken = user.accessToken;
    const octokit = new Octokit({ auth: githubToken });

    let repo;
    try {
      const response = await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        auto_init: true,
        private: false,
      });
      repo = response.data;
    } catch (error) {
      if (error.status === 422 && error.response.data.errors?.[0]?.message?.includes("already exists")) {
        try {
          const { data: refData } = await octokit.git.getRef({
            owner: user.username,
            repo: repoName,
            ref: "heads/main",
          });

          const { data: commitData } = await octokit.git.getCommit({
            owner: user.username,
            repo: repoName,
            commit_sha: refData.object.sha,
          });

          const { data: emptyTree } = await octokit.git.createTree({
            owner: user.username,
            repo: repoName,
            tree: [],
          });

          const { data: commit } = await octokit.git.createCommit({
            owner: user.username,
            repo: repoName,
            message: "Clearing repository for new deployment",
            tree: emptyTree.sha,
            parents: [refData.object.sha],
          });

          await octokit.git.updateRef({
            owner: user.username,
            repo: repoName,
            ref: "heads/main",
            sha: commit.sha,
          });

          repo = { owner: { login: user.username }, name: repoName };
        } catch (getRepoError) {
          logger.error("Error getting existing repository:", getRepoError);
          throw new Error(
            `Failed to access existing repository: ${getRepoError.message}`
          );
        }
      } else {
        throw error;
      }
    }

    const owner = repo.owner.login;

    const { data: refData } = await octokit.git.getRef({
      owner,
      repo: repoName,
      ref: "heads/main",
    });

    const { data: commitData } = await octokit.git.getCommit({
      owner,
      repo: repoName,
      commit_sha: refData.object.sha,
    });
    const baseTreeSha = commitData.tree.sha;

    const entries = await fs.readdir(outputDir, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
      const fullPath = path.join(outputDir, entry.name);
      if (entry.isFile()) {
        files.push(fullPath);
      }
    }

    if (files.length === 0) {
      return res.status(400).json({ message: "No files found in output directory" });
    }

    const blobs = await Promise.all(
      files.map(async (filePath) => {
        const content = await fs.readFile(filePath, "utf-8");
        const { data: blob } = await octokit.git.createBlob({
          owner,
          repo: repoName,
          content,
          encoding: "utf-8",
        });

        return {
          path: path.relative(outputDir, filePath),
          mode: "100644",
          type: "blob",
          sha: blob.sha,
        };
      })
    );

    const { data: newTree } = await octokit.git.createTree({
      owner,
      repo: repoName,
      tree: blobs,
      base_tree: baseTreeSha,
    });

    const { data: commit } = await octokit.git.createCommit({
      owner,
      repo: repoName,
      message: "Deploy portfolio",
      tree: newTree.sha,
      parents: [refData.object.sha],
    });

    await octokit.git.updateRef({
      owner,
      repo: repoName,
      ref: "heads/main",
      sha: commit.sha,
    });

    let retries = 3;
    let pagesEnabled = false;
    let pagesError = null;

    while (retries > 0 && !pagesEnabled) {
      try {
        await octokit.repos.createPagesSite({
          owner,
          repo: repoName,
          source: {
            branch: "main",
            path: "/",
          },
        });
        pagesEnabled = true;
      } catch (error) {
        pagesError = error;
        retries--;
        if (retries > 0) await setTimeout(2000);
      }
    }

    if (!pagesEnabled) {
      throw (
        pagesError ||
        new Error("Failed to enable GitHub Pages after multiple attempts")
      );
    }

    const pagesUrl = `https://${owner}.github.io/${repoName}`;
    const githubRepoLink = `https://github.com/${owner}/${repoName}`;

    // ✅ Save the deployment details to Portfolio model
    await Portfolio.create({
      user: userId,
      resume: resumeId,
      repoName,
      githubRepoLink,
      pagesUrl,
    });

    // ✅ Clean up temp output directory
    await fs.rm(outputDir, { recursive: true, force: true });

    return res.status(200).json({
      message: "Portfolio deployed successfully",
      url: pagesUrl,
      git: githubRepoLink
    });
  } catch (error) {
    logger.error("GitHub Deploy Error:", error);
    return res.status(500).json({
      message: "Failed to deploy portfolio to GitHub",
      error: error.message,
    });
  }
};
