import mongoose from "mongoose";
const workout = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    calories_burnt: {
      type: Number,
      required: true,
    },
    start_time: {
      type: Date,
      required: true,
    },
    end_time: {
      type: Date,
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cover_image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export const Workout = mongoose.model("Workout", workout);
