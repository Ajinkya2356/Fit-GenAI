import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import {
  createStep,
  deleteStep,
  generateSteps,
  getSteps,
  saveSteps,
  updateStep,
} from "../controllers/steps.controller.js";
const router = Router();
router.route("/create").post(verifyJWT, createStep);
router.route("/generate/new").post(verifyJWT, generateSteps);
router.route("/:id").get(getSteps);
router.route("/save").post(verifyJWT, saveSteps);
router.route("/update").put(verifyJWT, updateStep);
router.route("/delete/:id").delete(verifyJWT, deleteStep);
export default router;
