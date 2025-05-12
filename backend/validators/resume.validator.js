// src/validators/resume.validator.js
const { z } = require('zod');

// MongoDB ObjectId pattern
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

// Schema for resume upload
// Note: File validation is handled by multer middleware
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
    name: z.string().min(1, "Name cannot be empty").optional(),
    email: z.string().email("Invalid email format").optional(),
    phone: z.string().optional(),
    skills: z.array(z.string()).optional(),
    education: z.array(
      z.object({
        institution: z.string().optional(),
        degree: z.string().optional(),
        field: z.string().optional(),
        startDate: z.string().optional().nullable(),
        endDate: z.string().optional().nullable()
      })
    ).optional(),
    experience: z.array(
      z.object({
        company: z.string().optional(),
        position: z.string().optional(),
        startDate: z.string().optional().nullable(),
        endDate: z.string().optional().nullable(),
        description: z.string().optional()
      })
    ).optional(),
    projects: z.array(
      z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        technologies: z.array(z.string()).optional(),
        url: z.string().url("Invalid URL format").optional().nullable()
      })
    ).optional()
  }).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update"
  })
});

module.exports = {
  uploadResumeSchema,
  getResumeSchema,
  deleteResumeSchema,
  reparseResumeSchema,
  updateResumeSchema
};
