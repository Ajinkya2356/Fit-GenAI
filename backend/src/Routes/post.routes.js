import { Router } from "express";
import {
  createPost,
  updatePost,
  deletePost,
  likePost,
  dislikePost,
  commentPost,
  updateComment,
  deleteComment,
  getPost,
  getComments,
  getPostById,
} from "../controllers/post.controller.js";
import { upload } from "../Middlewares/multer.middleware.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
const router = Router();
router.post("/create", verifyJWT, upload.single("image"), createPost);
router.put("/update/:id", verifyJWT, upload.single("image"), updatePost);
router.delete("/delete/:id", verifyJWT, deletePost);
router.get("/like/:id", verifyJWT, likePost);
router.get("/dislike/:id", verifyJWT, dislikePost);
router.post("/comment/:id", verifyJWT, commentPost);
router.put("/:postId/update/:commentId", verifyJWT, updateComment);
router.delete("/:postId/delete/:commentId", verifyJWT, deleteComment);
router.get("/", getPost);
router.get("/comments/:postId", getComments);
router.get("/:postId", getPostById);
export default router;
