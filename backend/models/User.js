const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
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
      required: true,
      select: true,
    },
    subscription: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
    },

    // Reference to Resume (1:1 relationship)
    resumeId: {
      type: Schema.Types.ObjectId,
      ref: "Resume",
      index: true,
      unique: true,
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
        type: Schema.Types.ObjectId,
        ref: "Portfolio",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for populated resume data
userSchema.virtual("resume", {
  ref: "Resume",
  localField: "resumeId",
  foreignField: "_id",
  justOne: true,
});

// Cascade delete resume when user is removed
userSchema.pre("remove", async function (next) {
  if (this.resumeId) {
    await mongoose.model("Resume").deleteOne({ _id: this.resumeId });
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
