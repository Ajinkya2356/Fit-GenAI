import mongoose from "mongoose";
const plan = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  exercises: [
    {
      exercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exercise",
        required: true,
      },
      sets: {
        type: Number,
        required: true,
      },
      reps: {
        type: Number,
        required: true,
      },
      weight: {
        type: Number,
        required: true,
      },
    },
  ],
});
export const Plan = mongoose.model("Plan", plan);
