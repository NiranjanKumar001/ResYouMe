const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    githubId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    githubAccessToken: {
      type: String,
      select: false // Not returned in queries by default
    },
    githubRefreshToken: {
      type: String,
      select: false
    },
    profile: {
      username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
      },
      name: String,
      email: {
        type: String,
        lowercase: true,
        trim: true
      },
      avatar: String,
      profileUrl: String,
      company: String,
      location: String,
      bio: String
    },
    subscription: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription'
    },
    lastLogin: {
      type: Date,
      default: Date.now
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
