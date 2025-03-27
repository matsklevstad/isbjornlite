// frontend/src/pages/api/users/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/user";
import { generateToken } from "@/utils/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST for this endpoint
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    console.log("Registering user...");

    // Connect to database
    await connectDB();

    console.log("Connected to database");

    const { username, email, password, image } = req.body;
    console.log("Request body:", req.body);

    // Check if user exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    // Create user
    const user = await UserModel.create({
      username,
      email,
      password,
      image: image || "default-profile.png",
    });

    console.log("User created:", user._id);

    // Generate token
    const token = generateToken(String(user._id));

    // Return success response
    return res.status(201).json({
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
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: (error as Error).message,
    });
  }
}
