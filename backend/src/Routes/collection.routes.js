import { Router } from "express";
import {
  createCollection,
  deleteCollection,
  updateCollection,
  getCollections,
} from "../controllers/collection.controller.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
const router = Router();
router.post("/create", verifyJWT, createCollection);
router.put("/update/:id", verifyJWT, updateCollection);
router.delete("/delete/:id", verifyJWT, deleteCollection);
router.get("/",verifyJWT, getCollections);
export default router;
