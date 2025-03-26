import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/user";
import mongoose from "mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    await connectDB();

    // Get userId from the URL parameter
    const { userId } = req.query;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId as string)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    // Find the user by ID
    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Return public user data (may differ from what logged-in users see of themselves)
    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        image: user.image,
        // Note: You might exclude email or other private info for public profiles
      },
    });
  } catch (error) {
    console.error("GET error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during fetching user profile",
      error: (error as Error).message,
    });
  }
}
