const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    githubId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    name: String,
    email: {
      type: String,
      required: true,
    },
    avatar: String,
    githubUrl: String,
    accessToken: {
      type: String,
      select: false, 
    },
    subscription: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    portfolios: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Portfolio",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
