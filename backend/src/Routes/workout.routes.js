import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import {
  createWorkout,
  updateWorkout,
  getWorkouts,
  deleteWorkouts,
  joinWorkout,
  leaveWorkout,
  getSingleWorkout,
} from "../controllers/workout.controller.js";
import { upload } from "../Middlewares/multer.middleware.js";
const router = Router();
router
  .route("/create")
  .post(verifyJWT, upload.single("cover_image"), createWorkout);
router.route("/update/:id").put(verifyJWT, updateWorkout);
router.route("/getWorkouts").get(getWorkouts);
router.route("/delete/:id").delete(verifyJWT, deleteWorkouts);
router.route("/join/:id").post(verifyJWT, joinWorkout);
router.route("/leave/:id").post(verifyJWT, leaveWorkout);
router.route("/single/:id").get(getSingleWorkout);
export default router;
