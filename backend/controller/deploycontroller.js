const path = require("path");
const fs = require("fs").promises;
const { Octokit } = require("@octokit/rest");
const logger = require("../utils/logger");
const User = require("../models/User");

// POST /api/deploy
exports.deployToGitHub = async (req, res) => {
  try {
    const userId = req.user.id;
    const { outputDir, repoName } = req.body;

    if (!outputDir || !repoName) {
      return res.status(400).json({ message: "Missing outputDir or repoName" });
    }

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    console.log({user})
    if (!user) {
      return res.status(401).json({ message: "GitHub account not connected" });
    }

    const githubToken = user.githubAccessToken;
    const octokit = new Octokit({ auth: githubToken });

    // 1. Create a new GitHub repo
    const { data: repo } = await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      auto_init: false,
      private: false,
    });

    const owner = repo.owner.login;

    // 2. Read all files from outputDir recursively
    async function readFilesRecursively(dir) {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      const files = [];

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          const nested = await readFilesRecursively(fullPath);
          files.push(...nested);
        } else {
          files.push(fullPath);
        }
      }

      return files;
    }

    const allFiles = await readFilesRecursively(outputDir);

    // 3. Create blobs for files
    const blobs = await Promise.all(
      allFiles.map(async (filePath) => {
        const content = await fs.readFile(filePath, "utf-8");
        const blob = await octokit.git.createBlob({
          owner,
          repo: repoName,
          content,
          encoding: "utf-8",
        });

        return {
          path: path.relative(outputDir, filePath),
          mode: "100644",
          type: "blob",
          sha: blob.data.sha,
        };
      })
    );

    // 4. Get base commit SHA
    const { data: baseCommitData } = await octokit.repos.getCommit({
      owner,
      repo: repoName,
      ref: "heads/main",
    });

    // 5. Create tree
    const { data: tree } = await octokit.git.createTree({
      owner,
      repo: repoName,
      base_tree: baseCommitData.sha,
      tree: blobs,
    });

    // 6. Create commit
    const { data: commit } = await octokit.git.createCommit({
      owner,
      repo: repoName,
      message: "Initial portfolio commit",
      tree: tree.sha,
      parents: [baseCommitData.sha],
    });

    // 7. Update the ref
    await octokit.git.updateRef({
      owner,
      repo: repoName,
      ref: "heads/main",
      sha: commit.sha,
      force: true,
    });

    // 8. Enable GitHub Pages
    await octokit.repos.updateInformationAboutPagesSite({
      owner,
      repo: repoName,
      source: {
        branch: "main",
        path: "/",
      },
    });

    const pagesUrl = `https://${owner}.github.io/${repoName}`;

    // ✅ 9. Cleanup: delete outputDir after successful deployment
    await fs.rm(outputDir, { recursive: true, force: true });

    // 10. Respond with the live GitHub Pages URL
    return res.status(200).json({
      message: "Portfolio deployed successfully",
      url: pagesUrl,
    });
  } catch (error) {
    logger.error("GitHub Deploy Error:", error);
    return res.status(500).json({
      message: "Failed to deploy portfolio to GitHub",
      error: error.message,
    });
  }
};
