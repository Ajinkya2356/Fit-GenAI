import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import {
  createPlan,
  deletePlan,
  updatePlan,
  addExercises,
  removeExercises,
  getAllPlans,
  getPlan,
  getMultiplePlans,
  generatePlan,
  savePlan,
} from "../controllers/plan.controller.js";
const router = Router();
router.route("/create").post(verifyJWT, createPlan);
router.route("/delete/:id").delete(verifyJWT, deletePlan);
router.route("/update/:id").put(verifyJWT, updatePlan);
router.route("/add-exercise/:id").put(verifyJWT, addExercises);
router
  .route("/delete-exercise/:planId/:exerciseId")
  .delete(verifyJWT, removeExercises);
router.route("/allPlans").get(getAllPlans);
router.route("/:id").get(getPlan);
router.route("/getMultiplePlans").post(getMultiplePlans);
router.route("/generate").post(verifyJWT, generatePlan);
router.route("/save").post(verifyJWT, savePlan);
export default router;
