import express from "express";
import { register, login, getProfile } from "../controllers/userController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/profile", authMiddleware, getProfile);

export default router;
