import ApiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import { Step } from "../Models/step.model.js";
import mongoose from "mongoose";
import zod from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import jsf from "json-schema-faker";
const schema = zod.object({
  title: zod.string(),
  calories: zod.string(),
  time: zod.string(),
  exerciseID: zod.string(),
  steps: zod.array(
    zod.object({
      heading: zod.string(),
      description: zod.string(),
      video: zod.string(),
    })
  ),
});

const createStep = AsyncHandler(async (req, res) => {
  const { success } = schema.safeParse(req.body);
  if (!success) {
    throw new apiError(400, "Invalid Input");
  }
  const step = await Step.create(req.body);
  res
    .status(201)
    .json(new ApiResponse(201, { step }, "Step created successfully"));
});
const getSteps = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const steps = await Step.aggregate([
    {
      $match: {
        exerciseID: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $project: {
        title: 1,
        calories: 1,
        time: 1,
        steps: 1,
      },
    },
  ]);
  if (!steps) {
    throw new apiError(404, "No Steps Found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, steps, "Steps Fetched Successfully"));
});
const generateSteps = AsyncHandler(async (req, res) => {
  const { exercise } = req.body;
  const exercisePrompt = `
  Fill in the following JSON structure with information for at least three different ${exercise} exercise routines.
  [
    {
      "title": "[EXERCISE_TITLE]",
      "calories": "[CALORIES_PER_MINUTE]",
      "time": "[RECOMMENDED_TIME]",
      "steps": [
        {
          "heading": "[STEP_1_HEADING]",
          "description": "[STEP_1_DESCRIPTION]",
          "video": "[STEP_1_VIDEO_LINK]"
        },
        // ... more steps
      ]
    }
  ]
`;
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
  const result = await model.generateContent(exercisePrompt, generationConfig);
  const response = result.response;
  const text = response.text();
  console.log(text);
  const jsonResponse = JSON.parse(text);
  if (jsonResponse.error) {
    throw new apiError(400, jsonResponse.error);
  }
  return res
    .status(200)
    .json(new ApiResponse(200, jsonResponse, "Steps Generated Successfully"));
});
const saveSteps = AsyncHandler(async (req, res) => {
  const { steps, id } = req.body;
  const existingSteps = await Step.find({ exerciseID: id });
  if (existingSteps.length > 0) {
    await Step.deleteMany({ exerciseID: id });
  }
  for (let step of steps) {
    await Step.create({
      title: step.title,
      calories: step.calories,
      time: step.time,
      exerciseID: id,
      steps: step.steps,
    });
  }
  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Steps saved successfully"));
});
const updateStep = AsyncHandler(async (req, res) => {
  try {
    const { step } = req.body;
    console.log(step);
    const updatedStep = await Step.findByIdAndUpdate(
      step._id,
      {
        title: step.title,
        calories: step.calories,
        time: step.time,
        exerciseID: step.exerciseID,
        steps: step.steps,
      },
      { new: true }
    );
    if (!updatedStep) {
      throw new apiError(404, "Step not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, updatedStep, "Step updated successfully"));
  } catch (error) {
    throw new apiError(400, error.message);
  }
});
const deleteStep = AsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const step = await Step.findByIdAndDelete(id);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Step Deleted Successfully"));
  } catch (error) {
    throw new apiError(400, error.message);
  }
});
export { createStep, getSteps, generateSteps, saveSteps, updateStep,deleteStep };
