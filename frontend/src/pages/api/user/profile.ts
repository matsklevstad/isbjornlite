import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/user";
import { verifyToken } from "@/utils/auth";

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

    // Get the user ID from the auth token
    const userId = verifyToken(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Find the authenticated user
    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Return user data
    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt,
        // Add other fields as needed
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
