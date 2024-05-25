import { Router } from "express";
import {
  createExercise,
  getExercises,
  updateExercise,
  deleteExercise,
  getAllExercises,
  likeExercise,
  dislikeExercise,
  getSingleExercise,
  getUserExercises,
} from "../controllers/exercise.controller.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { upload } from "../Middlewares/multer.middleware.js";
const router = Router();
router.route("/create").post(
  upload.fields([
    {
      name: "video",
      maxCount: 1,
    },
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  verifyJWT,
  createExercise
);
router.route("/getExercises").get(getExercises);
router.route("/update/:id").put(
  upload.fields([
    {
      name: "video",
      maxCount: 1,
    },
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  verifyJWT,
  updateExercise
);
router.route("/delete/:id").delete(verifyJWT, deleteExercise);
router.route("/getMultipleExercises").post(verifyJWT, getAllExercises);
router.route("/like/:id").post(verifyJWT, likeExercise);
router.route("/dislike/:id").post(verifyJWT, dislikeExercise);
router.route("/single/:id").get(getSingleExercise);
router.route("/my-exercises").get(verifyJWT, getUserExercises);
export default router;
