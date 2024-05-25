import AsyncHandler from "../utils/AsyncHandler.js";
import apiError from "../utils/apiError.js";
import zod from "zod";
import ApiResponse from "../utils/apiResponse.js";
import { Collection } from "../Models/collection.model.js";
const createCollection = AsyncHandler(async (req, res) => {
  const { name } = req.body;
  if (name == "") {
    throw new apiError(400, "Collection Name required");
  }
  const collection = await Collection.create({
    name,
    createdBy: req?.user?._id,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, collection, "New collection created"));
});
const updateCollection = AsyncHandler(async (req, res) => {
  const { name } = req.body;
  if (name == "") {
    throw new apiError(400, "Collection Name required");
  }
  let collection;
  try {
    collection = await Collection.findByIdAndUpdate(
      req.params.id,
      {
        name,
      },
      { new: true }
    );
  } catch (e) {
    throw new apiError(400, "Something went wrong while updating collection");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, collection, "Collection Updated"));
});
const deleteCollection = AsyncHandler(async (req, res) => {
  let collection;
  try {
    collection = await Collection.findByIdAndDelete(req.params.id, {
      new: true,
    });
  } catch (e) {
    throw new apiError(400, "Something went wrong");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, collection, "Collection Deleted"));
});
const getCollections = AsyncHandler(async (req, res) => {
  const collections = await Collection.aggregate([
    {
      $match: {
        createdBy: req?.user?._id,
      },
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, collections, "All collections"));
});
export { createCollection, updateCollection, deleteCollection, getCollections };
