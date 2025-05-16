const path = require("path");
const fs = require("fs").promises;
const Handlebars = require("handlebars");
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
    let templateSource = await fs.readFile(templatePath, "utf-8");
    
    // Register Handlebars helper for the current year
    Handlebars.registerHelper('currentYear', function() {
      return new Date().getFullYear();
    });
    
    const template = Handlebars.compile(templateSource);
    
    // Prepare data for the template
    const templateData = {
      name: parsed.name || "",
      email: parsed.email || "",
      phone: parsed.phone || "",
      jobRole: parsed.jobRole || "",
      about: parsed.about || "",
      skills: parsed.skills || [],
      languages: parsed.languages || [],
      certifications: parsed.certifications || [],
      github: parsed.socialLinks?.github || "",
      linkedin: parsed.socialLinks?.linkedin || "",
      projects: parsed.projects?.map(project => ({
        name: project.name || "",
        description: project.description || "",
        link: project.url || ""
      })) || [],
      experience: parsed.experience?.map(exp => ({
        role: exp.position || exp.company || "",
        company: exp.company || "",
        duration: `${exp.startDate || ""} - ${exp.endDate || ""}`,
        description: exp.description || ""
      })) || [],
      education: parsed.education?.map(edu => ({
        degree: edu.degree || "",
        institution: edu.institution || "",
        year: `${edu.startDate || ""} - ${edu.endDate || ""}`,
        description: edu.field || ""
      })) || []
    };

    const filledHtml = template(templateData);

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
