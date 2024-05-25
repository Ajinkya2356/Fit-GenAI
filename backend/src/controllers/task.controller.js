import AsyncHandler from "../utils/AsyncHandler.js";
import apiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import zod from "zod";
import { Task } from "../Models/task.model.js";
const taskBody = zod.object({
  title: zod.string(),
  exercise: zod.string(),
  challenge: zod.string(),
  reps: zod.number(),
  coin: zod.number(),
  time_limit: zod.number(),
});
const createTask = AsyncHandler(async (req, res) => {
  const { success, error } = taskBody.safeParse(req.body);
  const { title, exercise, reps, challenge, coin, time_limit } = req.body;
  if (!success) {
    console.log(error);
    throw new apiError(400, "Invalid Input");
  }
  const task = await Task.create({
    title,
    exercise,
    challenge,
    reps,
    coin,
    time_limit,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task created successfully"));
});
export { createTask };
