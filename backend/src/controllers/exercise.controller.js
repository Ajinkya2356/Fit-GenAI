import { Exercise } from "../Models/exercise.model.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import zod from "zod";
import apiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import mongoose from "mongoose";
import { Category } from "../Models/category.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
const exerciseScheme = zod.object({
  name: zod.string(),
  description: zod.string(),
  categoryID: zod.string(),
  difficulty_level: zod.enum(["beginner", "intermediate", "advanced"]),
});
const updateBody = zod.object({
  name: zod.string().optional(),
  description: zod.string().optional(),
  categoryID: zod.string().optional(),
  difficulty_level: zod
    .enum(["beginner", "intermediate", "advanced"])
    .optional(),
});
const createExercise = AsyncHandler(async (req, res) => {
  const { success, error } = exerciseScheme.safeParse(req.body);
  /* console.log(req.body); */
  if (!success) {
    /*  console.log(error); */
    throw new apiError(400, "Invalid Input");
  }
  const { name, description, categoryID, difficulty_level } = req.body;

  const exists = (await Exercise.find({ name })).length > 0;
  if (!mongoose.Types.ObjectId.isValid(categoryID)) {
    throw new apiError(400, "Invalid category ID");
  }
  const category = await Category.findById(categoryID);
  if (!category) {
    throw new apiError(400, "Category does not exist");
  }
  if (exists) {
    throw new apiError(400, "Exercise already exists");
  }
  const videoLocalPath = await req?.files?.video?.[0]?.path;
  const imageLocalPath = await req?.files?.image?.[0]?.path;
  if (!videoLocalPath) {
    throw new apiError(400, "Video is required");
  }
  if (!imageLocalPath) {
    throw new apiError(400, "Image is required");
  }
  const videoUrl = await uploadOnCloudinary(videoLocalPath);
  const imageUrl = await uploadOnCloudinary(imageLocalPath);
  if (!videoUrl || !imageUrl) {
    throw new apiError(500, "Error uploading files");
  }
  const exercise = await Exercise.create({
    name,
    description,
    categoryID,
    difficulty_level,
    video_url: videoUrl.url,
    image_url: imageUrl.url,
    createdBy: req?.user?._id,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, exercise, "New Exercise Created Successfully"));
});
const getExercises = AsyncHandler(async (req, res) => {
  const exercises = await Exercise.aggregate([
    {
      $match: {
        ...(req.query.search != "" && {
          name: {
            $regex: req.query.search ? req.query.search : "",
            $options: "i",
          },
        }),
        ...(req.query.difficulty != "" && {
          difficulty_level: {
            $regex: req.query.difficulty ? req.query.difficulty : "",
            $options: "i",
          },
        }),
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        category: "$category",
        description: 1,
        difficulty_level: 1,
        likedBy: 1,
        dislikedBy: 1,
        video_url: 1,
        image_url: 1,
        createdAt: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, exercises, "Exercises Found Successfully"));
});
const updateExercise = AsyncHandler(async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    throw new apiError(400, "Invalid Input");
  }
  const { name, description, categoryID, difficulty_level } = req.body;

  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id) || !id) {
    throw new apiError(400, "Invalid ID");
  }
  if (categoryID) {
    const category = await Category.findById(categoryID);
    if (!category) {
      throw new apiError(400, "Category does not exist");
    }
  }
  const exerciseExist = await Exercise.findById(id);
  if (!exerciseExist) {
    throw new apiError(400, "Exercise does not exist");
  }
  const imageLocalPath = req.files?.image?.[0]?.path;
  const imageUrl = imageLocalPath
    ? await uploadOnCloudinary(imageLocalPath)
    : null;
  if (imageLocalPath && !imageUrl) {
    throw new apiError(500, "Error uploading image");
  }
  const videoLocalPath = req.files?.video?.[0]?.path;
  const videoUrl = videoLocalPath
    ? await uploadOnCloudinary(videoLocalPath)
    : null;
  if (videoLocalPath && !videoUrl) {
    throw new apiError(500, "Error uploading video");
  }
  const exercise = await Exercise.findByIdAndUpdate(
    id,
    {
      $set: {
        name,
        description,
        categoryID,
        difficulty_level,
        ...(imageUrl && { image_url: imageUrl.url }),
        ...(videoUrl && { video_url: videoUrl.url }),
      },
    },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, exercise, "Exercise Updated Successfully"));
});
const deleteExercise = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id) || !id) {
    throw new apiError(400, "Invalid ID");
  }
  const exerciseExist = await Exercise.findById(id);
  if (!exerciseExist) {
    throw new apiError(400, "Exercise does not exist");
  }
  await Exercise.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Exercise Deleted Successfully"));
});
const getAllExercises = AsyncHandler(async (req, res) => {
  const exercises = await Exercise.find({ _id: { $in: req.body.ids } });
  if (exercises.length === 0) {
    throw new apiError(404, "No Exercises Found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, exercises, "Exercises Found Successfully"));
});
const likeExercise = AsyncHandler(async (req, res) => {
  const exerciseId = req.params.id;
  const exercise = await Exercise.findById(exerciseId);
  if (!exercise) {
    throw new apiError(404, "Exercise not found");
  }
  const alreadyDisliked = exercise.dislikedBy.includes(req.user._id);
  if (alreadyDisliked) {
    exercise.dislikedBy = exercise.dislikedBy.filter((user) => {
      return user.toString() !== req.user._id.toString();
    });
  }
  const alreadyExists = exercise.likedBy.includes(req.user._id);
  if (alreadyExists) {
    throw new apiError(400, "Already Liked Post");
  }
  exercise.likedBy.push(req.user._id);
  await exercise.save();
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { likedBy: exercise.likedBy, dislikedBy: exercise.dislikedBy },
        "Exercise liked successfully"
      )
    );
});
const dislikeExercise = AsyncHandler(async (req, res) => {
  const exerciseId = req.params.id;
  const exercise = await Exercise.findById(exerciseId);
  if (!exercise) {
    throw new apiError(404, "Exercise not found");
  }
  const alreadyExists = exercise.likedBy.includes(req.user._id);
  if (alreadyExists) {
    exercise.likedBy = exercise.likedBy.filter((user) => {
      return user.toString() !== req.user._id.toString();
    });
  }
  const alreadyDisliked = exercise.dislikedBy.includes(req.user._id);
  if (alreadyDisliked) {
    throw new apiError(400, "Already disliked exercise");
  }
  exercise.dislikedBy.push(req.user._id);
  await exercise.save();
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { likedBy: exercise.likedBy, dislikedBy: exercise.dislikedBy },
        "Exercise disliked successfully"
      )
    );
});
const getSingleExercise = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new apiError(400, "Invalid ID");
  }
  const exercise = await Exercise.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "categoryID",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $project: {
        name: 1,
        category: "$category",
        description: 1,
        difficulty_level: 1,
        likedBy: 1,
        dislikedBy: 1,
        video_url: 1,
        image_url: 1,
        createdAt: 1,
      },
    },
  ]);
  if (!exercise) {
    throw new apiError(404, "Exercise not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, exercise[0], "Exercise Found Successfully"));
});
const getUserExercises = AsyncHandler(async (req, res) => {
  const exercises = await Exercise.aggregate([
    {
      $match: {
        createdBy: req?.user?._id,
      },
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, exercises, "Exercises fetched successfully"));
});
export {
  createExercise,
  getExercises,
  updateExercise,
  deleteExercise,
  getAllExercises,
  likeExercise,
  dislikeExercise,
  getSingleExercise,
  getUserExercises,
};
