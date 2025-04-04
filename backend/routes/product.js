import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductByTitle,
  getProductById,
  updateProduct,
  deleteProduct,
  search,
  filterByCategoryId,
  filterByDate,
} from "../controllers/product.js";
const router = express.Router();
router.get("/", getAllProducts);
router.get("/product/:title", getProductByTitle);
router.post("/create", createProduct);

router.post("/search", search);
router.post("/filter/category/id", filterByCategoryId);
router.post("/filter/date/sort", filterByDate);

router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
export default router;
