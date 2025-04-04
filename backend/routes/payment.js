import express from "express";
import { createPayment, checkout } from "../controllers/payment.js";
const router = express.Router();
router.post("/create", createPayment);
router.post("/checkout", checkout);
export default router;
