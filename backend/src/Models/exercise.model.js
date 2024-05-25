import mongoose from "mongoose";
const exercise = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    categoryID: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    difficulty_level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    video_url: {
      type: String,
    },
    image_url: [
      {
        type: String,
        required: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    steps: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Steps",
      },
    ],
  },
  {
    timestamps: true,
  }
);
export const Exercise = mongoose.model("Exercise", exercise);
