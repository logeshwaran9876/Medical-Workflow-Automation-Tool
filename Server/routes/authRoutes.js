// 📄 routes/authRoutes.js
import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/register (Admin only)
router.post("/register",  registerUser);

// POST /api/auth/login
router.post("/login", loginUser);

// GET /api/auth/me (Authenticated user info)
router.get("/me",  getMe);

export default router;


