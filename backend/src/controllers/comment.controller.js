import AsyncHandler from "../utils/AsyncHandler.js";
import { Workout } from "../Models/workout.model.js";
import apiError from "../utils/apiError.js";
import zod from "zod";
import { Comment } from "../Models/comment.model.js";
import ApiResponse from "../utils/apiResponse.js";
import mongoose from "mongoose";
const commentBody = zod.object({
  rating: zod.number(),
  message: zod.string(),
});
const updateBody = zod.object({
  rating: zod.number().optional(),
  message: zod.string().optional(),
});
const addComment = AsyncHandler(async (req, res) => {
  const { workoutId } = req.params;
  const workout = await Workout.findById(workoutId);
  if (!workout) {
    throw new apiError(404, "Workout not found");
  }
  const { success } = commentBody.safeParse(req.body);
  if (!success) {
    throw new apiError(404, "Invalid input");
  }
  const { rating, message } = req.body;
  if (message === "") {
    throw new apiError(404, "Message required");
  }
  // Check if user already added comment and the user which are part of particular workout can only add comment
  const userExists = workout.participants?.some(
    (item) => item.toString() === req.user._id.toString()
  );
  if (!userExists) {
    throw new apiError(403, "Join Workout to add comment");
  }

  const commentExists = await Comment.findOne({
    user: req.user._id,
    workout: workoutId,
  });
  let comment;
  if (commentExists) {
    comment = await Comment.findByIdAndUpdate(
      commentExists._id,
      {
        rating,
        message,
      },
      { new: true }
    );
  } else {
    comment = await Comment.create({
      user: req.user._id,
      workout: workoutId,
      rating: rating ? rating : 3,
      message,
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment added successfully"));
});
const updateComment = AsyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new apiError(404, "Comment not exists");
  }
  //might implement the workoutId here
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    throw new apiError(404, "Invalid input");
  }
  const { rating, message } = req.body;
  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        rating,
        message,
      },
    },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment Updated Successfully"));
});
const deleteComment = AsyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new apiError(404, "Comment not exists");
  }
  await Comment.findByIdAndDelete(commentId);
  return res.status(200).json(new ApiResponse(200, {}, "Comment deleted"));
});
const getAllComments = AsyncHandler(async (req, res) => {
  const comments = await Comment.aggregate([
    {
      $lookup: {
        foreignField: "_id",
        localField: "user",
        from: "users",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
            },
          },
        ],
        as: "user",
      },
    },
    {
      $project: {
        message: 1,
        rating: 1,
        user: { $arrayElemAt: ["$user", 0] },
      },
    },
  ]);
  return res.status(200).json(new ApiResponse(200, comments, "All Comments"));
});
const getWorkoutComments = AsyncHandler(async (req, res) => {
  const { workoutId } = req.params;
  const comments = await Comment.aggregate([
    {
      $match: {
        workout: new mongoose.Types.ObjectId(workoutId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
        as: "user",
      },
    },
    {
      $project: {
        _id: 1,
        user: { $arrayElemAt: ["$user", 0] },
        rating: 1,
        message: 1,
      },
    },
  ]);
  if (!comments) {
    throw new apiError(404, "No comments found");
  }
  return res.status(200).json(new ApiResponse(200, comments, "All Comments"));
});
export {
  addComment,
  updateComment,
  deleteComment,
  getAllComments,
  getWorkoutComments,
};
