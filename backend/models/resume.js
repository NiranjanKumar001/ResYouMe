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
    filename: {                //system saved in this name
      type: String,
      required: true
    },
    originalName: String,             //user gave
    path: {
      type: String,
      required: true
    },
    size: Number,               //prevent uploading large file
    mimetype: String,            //the type of file uploded msword,pdf,ppt
    parsedData: {
      name: String,
      email: String,
      phone: String,
      skills: [String],
      education: [{
        institution: String,
        degree: String,
        field: String,
        startDate: String,  // Changed from Date to String
        endDate: String     // Changed from Date to String
      }],
      experience: [{
        company: String,
        position: String,
        startDate: String,  // Changed from Date to String
        endDate: String,    // Changed from Date to String
        description: String
      }],
      projects: [{
        name: String,
        description: String,
        technologies: [String],
        url: String
      }],
      // Other parsed sections
      rawContent: { type: String, select: false } // Full text content
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
