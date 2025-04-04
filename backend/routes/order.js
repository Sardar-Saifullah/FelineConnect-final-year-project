import express from "express";
import {
  createOrder,
  getOrders,
  updateOrderStatus,
} from "../controllers/order.js";
const router = express.Router();
router.get("/", getOrders);
router.post("/create", createOrder);
router.post("/update", updateOrderStatus);

export default router;
