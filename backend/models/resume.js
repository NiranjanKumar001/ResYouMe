const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resumeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    filename: {
      type: String,
      required: true
    },
    originalName: String,
    path: {
      type: String,
      required: true
    },
    size: Number,
    mimetype: String,
    parsedData: {
      name: String,
      email: String,
      phone: String,
      jobRole: String,
      about: String,
      skills: [String],
      socialLinks: {
        github: String,
        linkedin: String,
        email: String // ✅ Added inside socialLinks instead of portfolio
      },
      education: [
        {
          institution: String,
          degree: String,
          field: String,
          startDate: String,
          endDate: String
        }
      ],
      experience: [
        {
          company: String,
          position: String,
          startDate: String,
          endDate: String,
          description: String
        }
      ],
      projects: [
        {
          name: String,
          description: String,
          technologies: [String],
          url: String
        }
      ],
      certifications: [String],
      languages: [String],
      rawContent: { type: String, select: false }
    },
    status: {
      type: String,
      enum: ['uploaded', 'parsing', 'parsed', 'failed'],
      default: 'uploaded'
    },
    parseError: String
  },
  { timestamps: true }
);

module.exports = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
