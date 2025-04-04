import express from "express";
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/category.js";
const router = express.Router();
router.get("/", getAllCategories);
router.post("/create", createCategory);
router.put("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);
export default router;
