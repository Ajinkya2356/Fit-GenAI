import Router from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import {
  createChallenge,
  getChallenges,
  getChallenge,
  joinChallenge,
  leaveChallenge,
  updateChallenge,
  deleteChallenge,
  getSingleChallenge,
  getUserChallenges,
  getChallengeTask,
  completeTask,
  getTaskById,
  creditCoins,
  challengeLeaderBoard,
  addParticipantCoins,
  chooseWinner,
} from "../controllers/challenge.controller.js";
import { upload } from "../Middlewares/multer.middleware.js";
import { createTask } from "../controllers/task.controller.js";
const router = Router();
router
  .route("/create")
  .post(verifyJWT, upload.single("cover_image"), createChallenge);
router.route("/getAll").get(getChallenges);
router.route("/get/:id").get(getChallenge);
router.route("/join/:id").post(verifyJWT, joinChallenge);
router.route("/leave/:id").post(verifyJWT, leaveChallenge);
router
  .route("/update/:id")
  .put(verifyJWT, upload.single("cover_image"), updateChallenge);
router.route("/delete/:id").delete(verifyJWT, deleteChallenge);
router.route("/single/:id").get(getSingleChallenge);
router.route("/user").get(verifyJWT, getUserChallenges);
router.route("/addTask").post(verifyJWT, createTask);
router.route("/getTask/:id").get(verifyJWT, getChallengeTask);
router.route("/check/:id").get(verifyJWT, completeTask);
router.route("/task/:id").get(verifyJWT, getTaskById);
router.route("/task/credit").post(verifyJWT, creditCoins);
router.route("/board/:id").get(verifyJWT, challengeLeaderBoard);
router.route("/addCoins").post(verifyJWT, addParticipantCoins);
router.route("/winner").post(chooseWinner);
export default router;
