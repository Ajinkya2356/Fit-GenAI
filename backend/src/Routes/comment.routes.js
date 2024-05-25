import Router from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import {
  addComment,
  updateComment,
  deleteComment,
  getAllComments,
  getWorkoutComments,
} from "../controllers/comment.controller.js";
const router = Router();
router.route("/add/:workoutId").post(verifyJWT, addComment);
router.route("/update/:commentId").put(verifyJWT, updateComment);
router.route("/delete/:commentId").delete(verifyJWT, deleteComment);
router.route("/get").get(getAllComments);
router.route("/get/:workoutId").get(getWorkoutComments);
export default router;
