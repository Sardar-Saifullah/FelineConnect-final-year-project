import express from "express";
import {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getUsers,
  getStatistics,
  sendOtp,
  resetPassword
} from "../controllers/user.js";


const router = express.Router();
router.get("/", getUsers);
router.get("/stats", getStatistics);
router.post("/register", createUser);
router.post("/resetPassword", resetPassword);
router.post("/login", loginUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/otpSend", sendOtp);

export default router;
