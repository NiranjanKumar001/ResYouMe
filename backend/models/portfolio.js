const mongoose=require("mongoose")


const portfolioSchema=new Schema({
    user:{
        type:Schema.Type.ObjectId,
        ref:"User",
        require:true,
        index:true
    },
    resume:{
        type:Schema.Type.ObjectId,
        ref:"Resume",
        require:true
    },
     template: {
    type: String,
    required: true,
    enum: ['modern', 'classic', 'minimal', 'creative', 'professional']
  },
   deploymentStatus: {
    type: String,
    enum: ['pending', 'generating', 'deployed', 'failed'],
    default: 'pending'
  },
    generatedContent: {
    about: String,
    skills: [String],
    projects: [{
      title: String,
      description: String,
      technologies: [String]
    }],
    experience: [{
      title: String,
      company: String,
      period: String,
      description: String
    }]
  },
    lastBuild: Date
},
 { timestamps: true });

 module.exports = mongoose.model('Portfolio', portfolioSchema);

