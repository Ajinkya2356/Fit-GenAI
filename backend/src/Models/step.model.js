import mongoose from "mongoose";
const stepSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    calories: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    steps: [
      {
        heading: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        video: {
          type: String,
          required: false,
        },
      },
    ],
    exerciseID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
    },
  },
  { timestamps: true }
);
export const Step = mongoose.model("Step", stepSchema);
