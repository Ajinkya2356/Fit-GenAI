import mongoose from "mongoose";
const challenge = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    goal: {
      type: String,
      required: true,
    },
    reward: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "upcoming",
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    participants_limit: {
      type: Number,
      required: true,
    },
    cover_image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export const Challenge = mongoose.model("Challenge", challenge);