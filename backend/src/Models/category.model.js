import mongoose from "mongoose";
const category = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);
export const Category = mongoose.model("Category", category);
