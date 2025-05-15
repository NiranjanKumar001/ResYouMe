// src/validators/resume.validator.js
const { z } = require('zod');

// MongoDB ObjectId pattern
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

// Schema for resume upload
const uploadResumeSchema = z.object({
  body: z.object({}).optional() // No required fields in body for file upload
});

// Schema for getting a specific resume by ID
const getResumeSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: "Resume ID is required"
    }).regex(objectIdPattern, "Invalid resume ID format")
  })
});

// Schema for deleting a resume
const deleteResumeSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: "Resume ID is required"
    }).regex(objectIdPattern, "Invalid resume ID format")
  })
});

// Schema for re-parsing a resume
const reparseResumeSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: "Resume ID is required"
    }).regex(objectIdPattern, "Invalid resume ID format")
  })
});

// Schema for updating resume data manually
const updateResumeSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: "Resume ID is required"
    }).regex(objectIdPattern, "Invalid resume ID format")
  }),
  body: z.object({
    parsedData: z.object({
      name: z.string().min(1, "Name cannot be empty"),
      email: z.string().email("Invalid email format"),
      phone: z.string().optional(),
      skills: z.array(z.string()).optional(),
      education: z.array(
        z.object({
          institution: z.string().min(1, "Institution cannot be empty"),
          degree: z.string().min(1, "Degree cannot be empty"),
          field: z.string().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional()
        })
      ).optional(),
      experience: z.array(
        z.object({
          company: z.string().min(1, "Company cannot be empty"),
          position: z.string().min(1, "Position cannot be empty"),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          description: z.string().optional()
        })
      ).optional(),
      projects: z.array(
        z.object({
          name: z.string().min(1, "Project name cannot be empty"),
          description: z.string().optional(),
          technologies: z.array(z.string()).optional(),
          url: z.string().url("Invalid URL format").optional()
        })
      ).optional(),
      rawContent: z.string().optional()
    })
  })
});

module.exports = {
  uploadResumeSchema,
  getResumeSchema,
  deleteResumeSchema,
  reparseResumeSchema,
  updateResumeSchema
};