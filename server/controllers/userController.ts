import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (userId: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ userId }, secret, {
    expiresIn: "30d",
  });
};

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, image } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: "Email already in use" });
      return;
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      image: image || "default-profile.png", // Use default if not provided
    });

    // Generate token
    const token = generateToken(String(user._id));

    // Return user info (without password)
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        image: user.image,
        token,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to register user",
      error: (error as Error).message,
    });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    // Generate token
    const token = generateToken(String(user._id));

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        image: user.image,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to login",
      error: (error as Error).message,
    });
  }
};

// Get user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - we'll add user to req in auth middleware
    const userId = req.user?.userId;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get profile",
      error: (error as Error).message,
    });
  }
};
