import AsyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import { Challenge } from "../Models/challenge.model.js";
import { Category } from "../Models/category.model.js";
import { User } from "../Models/user.model.js";
import apiError from "../utils/apiError.js";
import zod from "zod";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import mongoose from "mongoose";
import { Task } from "../Models/task.model.js";
const challengeBody = zod.object({
  name: zod.string(),
  description: zod.string(),
  startDate: zod.string(),
  endDate: zod.string(),
  category: zod.string(),
  goal: zod.string(),
  reward: zod.string(),
  participants_limit: zod.string(),
});
const updateChallengeBody = zod.object({
  name: zod.string().optional(),
  description: zod.string().optional(),
  startDate: zod.string().optional(),
  endDate: zod.string().optional(),
  category: zod.string().optional(),
  goal: zod.string().optional(),
  reward: zod.string().optional(),
  participants_limit: zod.string().optional(),
  status: zod.string().optional(),
});
const createChallenge = AsyncHandler(async (req, res) => {
  const { success, data, error } = challengeBody.safeParse(req.body);
  if (!success) {
    error.errors.forEach((err) => {
      console.log(err.message);
    });
    throw new apiError(400, "Invalid data");
  }
  const {
    name,
    description,
    startDate,
    endDate,
    category,
    goal,
    reward,
    participants_limit,
  } = req.body;
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    throw new apiError(404, "Category not found");
  }
  const challenges = await Challenge.find();
  if (challenges.length > 0) {
    const challengeExists = challenges.find(
      (challenge) => challenge.name === name
    );
    if (challengeExists) {
      throw new apiError(400, "Challenge already exists");
    }
  }
  const start_Date = new Date(startDate);
  const end_Date = new Date(endDate);
  if (start_Date > end_Date || !startDate || !endDate) {
    throw new apiError(400, "Invalid date range");
  }
  const duration = Math.ceil(
    (end_Date.getTime() - start_Date.getTime()) / (1000 * 60 * 60 * 24)
  );
  const coverImageLocalPath = req.file.path;

  if (!coverImageLocalPath) {
    throw new apiError(400, "Cover Image is required");
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage || !coverImage.url) {
    throw new apiError(500, "Error uploading cover image");
  }

  try {
    const challengeData = {
      name,
      description,
      startDate: start_Date,
      endDate: end_Date,
      duration,
      createdBy: req.user._id,
      category: categoryExists._id,
      goal,
      reward,
      participants: [req.user._id],
      participants_limit: parseInt(participants_limit),
      cover_image: coverImage.url,
    };
    const createdChallenge = await Challenge.create(challengeData);
    return res
      .status(200)
      .json(
        new ApiResponse(200, createdChallenge, "Challenge created successfully")
      );
  } catch (e) {
    return res.status(404).json(new ApiResponse(404, {}, e.message));
  }
});
const getChallenges = AsyncHandler(async (req, res) => {
  const { searchKeyword, status } = req.query;
  const challenges = await Challenge.aggregate([
    {
      $match: {
        name: { $regex: searchKeyword, $options: "i" },
        status: { $regex: status, $options: "i" },
      },
    },
  ]);
  return res.status(200).json(new ApiResponse(200, challenges));
});
const getChallenge = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const challenge = await Challenge.findById(id);
  if (!challenge) {
    throw new apiError(404, "Challenge not found");
  }
  return res.status(200).json(new ApiResponse(200, challenge));
});
const joinChallenge = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const challenge = await Challenge.findById(id);
  if (!challenge) {
    throw new apiError(404, "Challenge not found");
  }
  if (challenge.status === "Expired") {
    throw new apiError(404, "Challenge Expired");
  }
  if (challenge.participants.length >= challenge.participants_limit) {
    throw new apiError(400, "Challenge is full");
  }
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new apiError(404, "User not found");
  }
  if (challenge.participants.includes(user._id)) {
    throw new apiError(400, "Already joined the challenge");
  }
  challenge.participants.push(user._id);
  await challenge.save();
  return res
    .status(200)
    .json(new ApiResponse(200, challenge, "Joined challenge successfully"));
});
const leaveChallenge = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const challenge = await Challenge.findById(id);
  if (!challenge) {
    throw new apiError(404, "Challenge not found");
  }
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new apiError(404, "User not found");
  }
  if (!challenge.participants.includes(user._id)) {
    throw new apiError(400, "Not joined the challenge");
  }
  const index = challenge.participants.indexOf(user._id);
  challenge.participants.splice(index, 1);
  await challenge.save();
  return res
    .status(200)
    .json(new ApiResponse(200, challenge, "Left challenge successfully"));
});
const updateChallenge = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const challenge = await Challenge.findById(id);
  if (!challenge) {
    throw new apiError(404, "Challenge not found");
  }
  const { success } = updateChallengeBody.safeParse(req.body);
  if (!success) {
    throw new apiError(400, "Invalid data");
  }
  const coverImageLocalPath = req.file?.path;
  let coverImage = null;
  if (coverImageLocalPath) {
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!coverImage) {
      throw new apiError(500, "Error uploading cover image");
    }
  }

  const {
    name,
    description,
    startDate,
    endDate,
    category,
    goal,
    reward,
    participants_limit,
    status,
  } = req.body;
  if (category) {
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      throw new apiError(404, "Category not found");
    }
  }
  const challenges = await Challenge.find();
  if (challenges.length > 0) {
    const challengeExists = challenges.filter(
      (challenge) => challenge.name === name
    );
    if (challengeExists > 1) {
      throw new apiError(400, "Challenge Name already Taken");
    }
  }
  const start_Date = startDate ? new Date(startDate) : challenge.startDate;
  const end_Date = endDate ? new Date(endDate) : challenge.endDate;
  if (start_Date > end_Date) {
    throw new apiError(400, "Invalid date range");
  }

  const duration = Math.ceil(
    (end_Date.getTime() - start_Date.getTime()) / (1000 * 60 * 60 * 24)
  );
  const newChallenge = await Challenge.findByIdAndUpdate(
    id,
    {
      $set: {
        name,
        description,
        startDate: start_Date ? start_Date : challenge.startDate,
        endDate: end_Date ? end_Date : challenge.endDate,
        duration: duration ? duration : challenge.duration,
        category,
        goal,
        reward,
        participants_limit,
        cover_image: coverImage ? coverImage.url : challenge.cover_image,
        status,
      },
    },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, newChallenge, "Challenge updated successfully"));
});
const deleteChallenge = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const challenge = await Challenge.findById(id);
  if (!challenge) {
    throw new apiError(404, "Challenge not found");
  }
  await Challenge.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Challenge deleted successfully"));
});
const getSingleChallenge = AsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const challenge = await Challenge.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "participants",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1,
                avatar: 1,
              },
            },
          ],
          as: "participants",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
              },
            },
          ],
          as: "category",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1,
                avatar: 1,
              },
            },
          ],
          as: "createdBy",
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          startDate: 1,
          endDate: 1,
          duration: 1,
          createdBy: { $arrayElemAt: ["$createdBy", 0] },
          category: { $arrayElemAt: ["$category", 0] },
          goal: 1,
          reward: 1,
          status: 1,
          participants: "$participants",
          participants_limit: 1,
          cover_image: 1,
          createdAt: 1,
        },
      },
    ]);

    return res.status(200).json(new ApiResponse(200, challenge[0]));
  } catch (error) {
    throw new apiError(400, error.message);
  }
});
const getUserChallenges = AsyncHandler(async (req, res) => {
  try {
    const userChallenges = await Challenge.aggregate([
      {
        $match: {
          createdBy: req?.user._id,
        },
      },
    ]);
    return res
      .status(200)
      .json(
        new ApiResponse(200, userChallenges, "Challenges Fetched successfully")
      );
  } catch (e) {
    throw new apiError(400, e.message);
  }
});
const getChallengeTask = AsyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json(new ApiResponse(400, "Invalid challenge ID"));
  }
  const tasks = await Task.aggregate([
    {
      $match: {
        challenge: new mongoose.Types.ObjectId(req.params.id),
      },
    },
    {
      $lookup: {
        from: "exercises",
        localField: "exercise",
        foreignField: "_id",
        pipeline: [
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
              _id: 1,
              name: 1,
              description: 1,
              category: "$category",
              difficulty_level: 1,
              video_url: 1,
              createdBy: 1,
            },
          },
        ],
        as: "exercise",
      },
    },
    {
      $project: {
        title: 1,
        exercise: { $arrayElemAt: ["$exercise", 0] },
        reps: 1,
        coin: 1,
        time_limit: 1,
        completed: 1,
      },
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});
const completeTask = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  if (!task) {
    throw new apiError(404, "Task not found");
  }
  if (task.completed.includes(req.user._id)) {
    task.completed.pull(req.user._id);
  } else {
    task.completed.push(req.user._id);
  }
  await task.save();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task completed successfully"));
});
const getTaskById = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "exercises",
        localField: "exercise",
        foreignField: "_id",
        as: "exercise",
      },
    },
  ]);
  if (!task) {
    throw new apiError(404, "Task not found");
  }
  return res.status(200).json(new ApiResponse(200, task[0]));
});
const creditCoins = AsyncHandler(async (req, res) => {
  const { coins, userId } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    throw new apiError(404, "User not found");
  }
  user.coinBalance += coins;
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Coins credited successfully"));
});
export {
  createChallenge,
  getChallenges,
  getChallenge,
  joinChallenge,
  leaveChallenge,
  updateChallenge,
  deleteChallenge,
  getSingleChallenge,
  getUserChallenges,
  getChallengeTask,
  completeTask,
  getTaskById,
  creditCoins,
};
