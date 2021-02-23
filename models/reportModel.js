const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      enum: ["spam", "inappropriate", "abuse"],
      default: "spam",
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
