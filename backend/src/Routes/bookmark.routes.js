import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import {
  createBookmark,
  removeBookmark,
} from "../controllers/bookmark.controller.js";
const router = Router();
router.route("/create").post(verifyJWT, createBookmark);
router.route("/remove/:id").delete(verifyJWT, removeBookmark);
export default router;
