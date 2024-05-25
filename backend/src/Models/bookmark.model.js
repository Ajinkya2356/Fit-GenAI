import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    resource_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    collection_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
    },
    bookmark_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
export const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
