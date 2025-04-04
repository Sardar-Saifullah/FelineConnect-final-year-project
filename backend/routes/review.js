import express from "express";
import {
  getReviewById,
  getReviewsByProductId,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/review.js";

const router = express.Router();
router.get("/:reviewId", getReviewById);
router.get("/product/:productId", getReviewsByProductId);
router.post("/create", createReview);
router.put("/:reviewId", updateReview);
router.delete("/:reviewId", deleteReview);
export default router;
