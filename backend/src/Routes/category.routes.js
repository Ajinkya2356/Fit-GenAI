import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategory,
  updateCategory,
} from "../controllers/category.controller.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
const router = Router();
router.route("/create").post(verifyJWT, createCategory);
router.route("/getCategory").get(verifyJWT, getCategory);
router.route("/delete/:id").delete(verifyJWT, deleteCategory);
router.route("/update/:id").put(verifyJWT, updateCategory);
export default router;
