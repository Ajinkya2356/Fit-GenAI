import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import {
  createStep,
  generateSteps,
  getSteps,
  saveSteps,
} from "../controllers/steps.controller.js";
const router = Router();
router.route("/create").post(verifyJWT, createStep);
router.route("/generate/new").post(verifyJWT, generateSteps);
router.route("/:id").get(getSteps);
router.route("/save").post(verifyJWT, saveSteps);

export default router;
