const path = require("path");
const fs = require("fs").promises;
const Resume = require("../models/resume.js");

const allowedTemplates = ["template1", "template2", "template3", "template4"];

exports.buildTemplateController = async (req, res) => {
  try {
    const { resumeId, templateName } = req.body;

    if (!resumeId || !templateName) {
      return res.status(400).json({ message: "resumeId and templateName are required." });
    }

    if (!allowedTemplates.includes(templateName)) {
      return res.status(400).json({ message: "Invalid template selected." });
    }

    const resume = await Resume.findOne({ _id: resumeId, user: req.user.id });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const parsed = resume.parsedData;

    const templatePath = path.join(__dirname, "..", "templates", templateName, "index.html");
    let templateHtml = await fs.readFile(templatePath, "utf-8");

    const filledHtml = templateHtml
      .replace(/{{\s*name\s*}}/g, parsed.name || "")
      .replace(/{{\s*email\s*}}/g, parsed.email || "")
      .replace(/{{\s*phone\s*}}/g, parsed.phone || "")
      .replace(/{{\s*jobRole\s*}}/g, parsed.jobRole || "")
      .replace(/{{\s*about\s*}}/g, parsed.about || "")
      .replace(/{{\s*skills\s*}}/g, (parsed.skills || []).join(", "))
      .replace(/{{\s*languages\s*}}/g, (parsed.languages || []).join(", "))
      .replace(/{{\s*certifications\s*}}/g, formatCertifications(parsed.certifications || []))
      .replace(/{{\s*github\s*}}/g, parsed.socialLinks?.github || "")
      .replace(/{{\s*linkedin\s*}}/g, parsed.socialLinks?.linkedin || "")
      .replace(/{{\s*projects\s*}}/g, formatProjects(parsed.projects || []))
      .replace(/{{\s*experience\s*}}/g, formatExperience(parsed.experience || []))
      .replace(/{{\s*education\s*}}/g, formatEducation(parsed.education || []));

    const outputDir = path.join(__dirname, "..", "tmp", `${resumeId}-${templateName}`);
    await fs.mkdir(outputDir, { recursive: true });
    const outputPath = path.join(outputDir, "index.html");
    await fs.writeFile(outputPath, filledHtml, "utf-8");

    return res.status(200).json({
      message: "Template generated successfully",
      outputDir,
      templateName
    });
  } catch (err) {
    console.error("BuildTemplate Error:", err);
    return res.status(500).json({ message: "Failed to build portfolio template" });
  }
};

// Helper Functions

function formatExperience(experience) {
  return experience.map(exp => `
    <div>
      <h3>${exp.position || ""} at ${exp.company || ""}</h3>
      <p>${exp.startDate || ""} - ${exp.endDate || ""}</p>
      <p>${exp.description || ""}</p>
    </div>
  `).join("");
}

function formatEducation(education) {
  return education.map(edu => `
    <div>
      <h3>${edu.degree || ""} - ${edu.institution || ""}</h3>
      <p>${edu.field || ""}</p>
      <p>${edu.startDate || ""} - ${edu.endDate || ""}</p>
    </div>
  `).join("");
}

function formatProjects(projects) {
  return projects.map(project => `
    <div>
      <h3>${project.name || ""}</h3>
      <p>${project.description || ""}</p>
      <p><strong>Tech:</strong> ${(project.technologies || []).join(", ")}</p>
    </div>
  `).join("");
}

function formatCertifications(certs) {
  return certs.map(c => `<li>${c}</li>`).join("");
}
