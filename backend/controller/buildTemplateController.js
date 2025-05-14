const path = require("path");
const fs = require("fs").promises;
const Resume = require("../models/resume");

// Define allowed templates
//ONLY ALLOW TO SELECT FROM THESE PREEXISTING TEMPLATES
const allowedTemplates = ["template1", "template2", "template3", "template4"];

exports.buildTemplateController = async (req, res) => {
  try {
    const { resumeId, templateName } = req.body;

    // Validate input
    if (!resumeId || !templateName) {
      return res.status(400).json({ message: "resumeId and templateName are required." });
    }

    // Ensure selected template is valid
    if (!allowedTemplates.includes(templateName)) {
      return res.status(400).json({ message: "Invalid template selected." });
    }
    
    // FETCH RESUME IN MONGODB BY RESUMEID AND ENSURE IT BELONGS TO LOGGED IN USER
    //THIS WILL REQUIRE A MIDDLEWARE THAT WILL GIVE THE USER.ID   
    //const resume = await Resume.findOne({ _id: resumeId, user: req.user.id });
    
    const resume = await Resume.findOne({ _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
 
    const parsedData = resume.parsedData;  //EXTRACT PARSEDATA FROM RESUME

    // Load selected template HTML
    //CONSTRUCT PATH LIKE _DIRNAME:/TEMPLATES/TEMPLATE2/INDEX.HTML
    const templatePath = path.join(__dirname, "..", "templates", templateName, "index.html");
    let templateHtml = await fs.readFile(templatePath, "utf-8");

    // Replace placeholders in template
    //INJECT DATA INTO TEMPLATE
    const filledHtml = templateHtml
      .replace(/{{\s*name\s*}}/g, parsedData.name || "")
      .replace(/{{\s*email\s*}}/g, parsedData.email || "")
      .replace(/{{\s*phone\s*}}/g, parsedData.phone || "")
      .replace(/{{\s*skills\s*}}/g, (parsedData.skills || []).join(", "))
      .replace(/{{\s*projects\s*}}/g, formatProjects(parsedData.projects || []))
      .replace(/{{\s*experience\s*}}/g, formatExperience(parsedData.experience || []))
      .replace(/{{\s*education\s*}}/g, formatEducation(parsedData.education || []));

    // Save to /tmp for later GitHub upload
    //CREATES A TEMPORARY FOLDER _DIRNAME AND SAVES THE FILLED HTML AS INDEX.HTML INSIDE THAT FOLDER
    const outputDir = path.join(__dirname, "..", "tmp", `${resumeId}-${templateName}`);
    await fs.mkdir(outputDir, { recursive: true });
    const outputPath = path.join(outputDir, "index.html");
    await fs.writeFile(outputPath, filledHtml, "utf-8");


    //RESPOND TO FRONTEND
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

// Helper: Format experience section
function formatExperience(experienceArray) {
  return experienceArray
    .map(exp => `<div><h3>${exp.position || ""} at ${exp.company || ""}</h3><p>${exp.description || ""}</p></div>`)
    .join("");
}

// Helper: Format education section
function formatEducation(educationArray) {
  return educationArray
    .map(edu => `<div><h3>${edu.degree || ""} - ${edu.institution || ""}</h3><p>${edu.year || ""}</p></div>`)
    .join("");
}

// Helper: Format project section
function formatProjects(projectArray) {
  return projectArray
    .map(project => `<div><h3>${project.name || ""}</h3><p>${project.description || ""}</p><p><strong>Tech:</strong> ${(project.technologies || []).join(", ")}</p></div>`)
    .join("");
}
