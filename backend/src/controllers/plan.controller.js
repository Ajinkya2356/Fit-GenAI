import { Exercise } from "../Models/exercise.model.js";
import { Plan } from "../Models/plan.model.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import zod from "zod";
import ApiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import jsf from "json-schema-faker";
const planScheme = zod.object({
  exercise: zod.string(),
  sets: zod.number(),
  reps: zod.number(),
  weight: zod.number(),
});
const createPlan = AsyncHandler(async (req, res) => {
  const { name, exercises } = req.body;
  if (!name) {
    throw new apiError(400, "Name is required");
  }
  const planExists = await Plan.find({ name });
  if (planExists.length > 0) {
    throw new apiError(400, "Plan already exists");
  }
  if (!exercises || exercises.length === 0) {
    throw new apiError(400, "Exercises are required");
  }
  const plan = await Plan.create({
    name,
    exercises,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, plan, "New Plan Created Successfully"));
});
const deletePlan = AsyncHandler(async (req, res) => {
  const plan = await Plan.findById(req.params.id);
  if (!plan) {
    throw new apiError(404, "Plan not found");
  }
  await Plan.findByIdAndDelete(req.params.id);
  return res
    .status(200)
    .json(new ApiResponse(200, plan, "Plan Deleted Successfully"));
});
const updatePlan = AsyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new apiError(400, "Name is required");
  }
  const planExists = await Plan.find({ name });
  if (planExists.length > 0) {
    throw new apiError(400, "Name already taken");
  }
  const plan = await Plan.findById(req.params.id);
  if (!plan) {
    throw new apiError(404, "Plan not found");
  }
  const newPlan = await Plan.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, newPlan, "Plan Updated Successfully"));
});
const addExercises = AsyncHandler(async (req, res) => {
  const { success } = planScheme.safeParse(req.body);
  if (!success) {
    throw new apiError(400, "Invalid Input");
  }
  const { exercise, sets, reps, weight } = req.body;
  const plan = await Plan.findById(req.params.id);
  if (!plan) {
    throw new apiError(404, "Plan not found");
  }
  const exerciseExists = await Exercise.findById(exercise);
  if (!exerciseExists) {
    throw new apiError(400, "Exercise does not exist");
  }
  const alreadyAdded = plan.exercises.filter((e) => e.exercise == exercise);
  if (alreadyAdded.length > 0) {
    throw new apiError(400, "Exercise already added");
  }
  const newExercise = {
    exercise,
    sets,
    reps,
    weight,
  };
  plan.exercises.push(newExercise);
  await plan.save();
  return res
    .status(200)
    .json(new ApiResponse(200, plan, "Exercise Added Successfully"));
});
const removeExercises = AsyncHandler(async (req, res) => {
  const { planId, exerciseId } = req.params;
  const plan = await Plan.findById(planId);
  if (!plan) {
    throw new apiError(404, "Plan not found");
  }
  const exercise = plan.exercises.find((e) => e.exercise == exerciseId);
  if (!exercise) {
    throw new apiError(404, "Exercise not found");
  }
  plan.exercises = plan.exercises.filter((e) => e.exercise != exerciseId);
  await plan.save();
  return res
    .status(200)
    .json(new ApiResponse(200, plan, "Exercise Removed Successfully"));
});
const getAllPlans = AsyncHandler(async (req, res) => {
  const plans = await Plan.find();
  return res.status(200).json(new ApiResponse(200, plans, "All Plans"));
});
const getPlan = AsyncHandler(async (req, res) => {
  const plan = await Plan.findById(req.params.id);
  if (!plan) {
    throw new apiError(404, "Plan not found");
  }
  return res.status(200).json(new ApiResponse(200, plan, "Plan"));
});
const getMultiplePlans = AsyncHandler(async (req, res) => {
  const plans = await Plan.find({ _id: { $in: req.body.ids } });
  if (!plans) {
    throw new apiError(404, "Plans not found");
  }
  return res.status(200).json(new ApiResponse(200, plans, "Plans"));
});
const generatePlan = AsyncHandler(async (req, res) => {
  const { planName, exercises } = req.body;
  const planPrompt = `I need a workout plan generator that can tailor exercises based on the plan's goal. For a ${planName} plan, choose exercises from ${exercises} which are typically included in ${planName}, create a JSON workout plan.  Determine the sets, reps, and weight (in kg) appropriate for a person aiming to build muscle. 
  Only give the JSON object in response without any suffix or preffix.
  Use the following JSON structure:
 
  {
    "name": "[Plan Name]",
    "exercises": [
      {
        "exercise": "[Exercise Name]",
        "sets": [Number of Sets], 
        "reps": [Number of Reps],
        "weight": "[Weight in kg]"
      },
      // ... more exercises
    ]
  }`;
  const generationConfig = {
    stopSequences: ["red"],
    maxOutputTokens: 200,
    temperature: 0.7,
    topP: 0.1,
    topK: 16,
    response_mime_type: "application/json",
  };
  const genAI = new GoogleGenerativeAI(process.env.LLM_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-pro",
    /* generationConfig, */
  });
  const result = await model.generateContent(planPrompt, generationConfig);
  const response = result.response;
  const text = response.text();
  console.log(text);
  const jsonResponse = JSON.parse(text);
  if (jsonResponse.error) {
    throw new apiError(400, jsonResponse.error);
  }
  return res
    .status(200)
    .json(new ApiResponse(200, jsonResponse, "Plan Generated Successfully"));
});
const savePlan = AsyncHandler(async (req, res) => {
  const { name, exercises } = req.body;
  const newPlan = await Plan.create({
    name,
    exercises,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, newPlan, "Plan Saved Successfully"));
});
export {
  createPlan,
  deletePlan,
  updatePlan,
  addExercises,
  removeExercises,
  getAllPlans,
  getPlan,
  getMultiplePlans,
  generatePlan,
  savePlan
};
