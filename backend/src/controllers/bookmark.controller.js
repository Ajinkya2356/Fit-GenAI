import AsyncHandler from "../utils/AsyncHandler.js";
import apiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Post } from "../Models/post.model.js";
import { Collection } from "../Models/collection.model.js";
import { Bookmark } from "../Models/bookmark.model.js";
const createBookmark = AsyncHandler(async (req, res) => {
  const { resourceId, collectionId } = req.body;
  const resource = await Post.findById(resourceId);
  const collection = await Collection.findById(collectionId);
  if (!resource || !collection) {
    throw new apiError(400, "Invalid Data");
  }
  let bookmark;
  try {
    bookmark = await Bookmark.create({
      resource_id: resourceId,
      collection_id: collectionId,
      bookmark_by: req?.user?._id,
    });
  } catch (error) {
    throw new apiError(400, "Something went wrong");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, bookmark, "Bookmark Created Successfully"));
});
const removeBookmark = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const bookmark = await Bookmark.findByIdAndDelete(id);
  } catch (error) {
    throw new apiError(400, "Something went wrong");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Bookmark removed Successfully"));
});
export { createBookmark, removeBookmark };
