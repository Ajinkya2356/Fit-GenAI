import AsyncHandler from "../utils/AsyncHandler.js";
import zod from "zod";
import apiError from "../utils/apiError.js";
import { Workout } from "../Models/workout.model.js";
import ApiResponse from "../utils/apiResponse.js";
import { Plan } from "../Models/plan.model.js";
import { User } from "../Models/user.model.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
const workoutScheme = zod.object({
  name: zod.string(),
  calories_burnt: zod.string(),
  start_time: zod.string(),
  end_time: zod.string(),
});
const updateBody = zod.object({
  name: zod.string().optional(),
  calories_burnt: zod.number().optional(),
  start_time: zod.string().optional(),
  end_time: zod.string().optional(),
});
const createWorkout = AsyncHandler(async (req, res) => {
  const { success, error } = workoutScheme.safeParse(req.body);
  if (!success) {
    console.log(error);
    throw new apiError(400, "Invalid Input");
  }
  const { name, calories_burnt, start_time, end_time, plan } = req.body;
  const workoutExists = await Workout.find({ name });
  if (workoutExists.length > 0) {
    throw new apiError(400, "Workout already exists");
  }
  const startTime = new Date(start_time);
  const endTime = new Date(end_time);
  if (startTime > endTime) {
    throw new apiError(400, "End time should be greater than start time");
  }
  const usersExists = await User.findById(req.user._id);
  if (!usersExists) {
    throw new apiError(400, "User does not exist");
  }
  if (!plan) {
    throw new apiError(400, "Plan is required");
  }
  const planExists = await Plan.findById(plan);
  if (!planExists) {
    throw new apiError(404, "Plan not found");
  }
  const workout_duration = endTime.getDay() - startTime.getDay();
  const coverImageLocalPath = req.file.path;
  if (!coverImageLocalPath) {
    throw new apiError(400, "Cover Image is required");
  }
  const cover_image = await uploadOnCloudinary(coverImageLocalPath);
  if (!cover_image) {
    throw new apiError(400, "Something went wrong while uploading image");
  }
  const workout = await Workout.create({
    name,
    duration: workout_duration,
    calories_burnt: parseInt(calories_burnt),
    start_time: startTime,
    end_time: endTime,
    participants: [req.user._id],
    plan,
    createdBy: req.user._id,
    cover_image: cover_image.url,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, workout, "New Workout Created Successfully"));
});
const updateWorkout = AsyncHandler(async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    throw new apiError(400, "Invalid Input");
  }
  const { name, calories_burnt, start_time, end_time, plan } = req.body;
  const exists = await Workout.find({ name });
  if (exists.length > 0) {
    throw new apiError(400, "Workout already exists");
  }
  const workout = await Workout.findById(req.params.id);
  if (!workout) {
    throw new apiError(404, "Workout not found");
  }
  const startTime = start_time ? new Date(start_time) : workout.start_time;
  const endTime = end_time ? new Date(end_time) : workout.end_time;
  if (startTime >= endTime) {
    throw new apiError(400, "End time should be greater than start time");
  }
  if (plan) {
    const planExists = await Plan.findById(plan);
    if (!planExists) {
      throw new apiError(404, "Plan not found");
    }
  }

  const workout_duration = endTime.getHours() - startTime.getHours();
  const updatedWorkout = await Workout.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name,
        duration: workout_duration,
        calories_burnt,
        start_time: startTime,
        end_time: endTime,
        plan,
      },
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, updatedWorkout, "Workout Updated Successfully"));
});
const getWorkouts = AsyncHandler(async (req, res) => {
  const workouts = await Workout.find();
  if (workouts.length === 0) {
    throw new apiError(404, "No Workouts Found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, workouts, "Workouts Found Successfully"));
});
const deleteWorkouts = AsyncHandler(async (req, res) => {
  const workout = await Workout.findByIdAndDelete(req.params.id);
  if (!workout) {
    throw new apiError(404, "Workout not found");
  }
  await Workout.findByIdAndDelete(req.params.id);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Workout Deleted Successfully"));
});
const joinWorkout = AsyncHandler(async (req, res) => {
  const workout = await Workout.findById(req.params.id);
  if (!workout) {
    throw new apiError(404, "Workout not found");
  }
  const alreadyExists = workout.participants.some((item) => {
    return item.toString() === req.user?._id.toString();
  });
  if (alreadyExists) {
    throw new apiError(404, "User already joined");
  }
  workout.participants.push(req.user?._id);
  await workout.save();
  return res
    .status(200)
    .json(new ApiResponse(200, workout, "User joined workout successfully"));
});
const leaveWorkout = AsyncHandler(async (req, res) => {
  const workout = await Workout.findById(req.params.id);
  if (!workout) {
    throw new apiError(400, "Workout not found");
  }

  const existsInWorkout = workout.participants.some((item) => {
    return item.toString() === req.user?._id.toString();
  });
  if (!existsInWorkout) {
    throw new apiError(404, "User not found");
  }
  workout.participants = workout.participants.filter((item) => {
    return item.toString() !== req.user?._id.toString();
  });
  await workout.save();
  return res
    .status(200)
    .json(new ApiResponse(200, workout, "User left workout successfully"));
});
const getSingleWorkout = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  /* console.log(id); */
  const workout = await Workout.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "users",
        let: { participants: "$participants" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$_id", "$$participants"],
              },
            },
          },
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
      $lookup: {
        from: "plans",
        let: { plan: "$plan" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$plan"],
              },
            },
          },
          {
            $unwind: "$exercises",
          },
          {
            $lookup: {
              from: "exercises",
              localField: "exercises.exercise",
              foreignField: "_id",
              as: "exercises.exercise",
            },
          },
          {
            $unwind: "$exercises.exercise",
          },
          {
            $group: {
              _id: "$_id",
              name: { $first: "$name" },
              exercises: { $push: "$exercises" },
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              exercises: 1,
            },
          },
        ],
        as: "plan",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        cover_image: 1,
        duration: 1,
        calories_burnt: 1,
        start_time: 1,
        end_time: 1,
        createdAt: 1,
        participants: "$participants",
        plan: "$plan",
        createdBy: { $arrayElemAt: ["$createdBy", 0] },
      },
    },
  ]);
  if (!workout) throw new apiError(400, "Workout not found");
  return res
    .status(200)
    .json(new ApiResponse(200, workout[0], "Workout found successfully"));
});
export {
  createWorkout,
  updateWorkout,
  getWorkouts,
  deleteWorkouts,
  joinWorkout,
  leaveWorkout,
  getSingleWorkout,
};
