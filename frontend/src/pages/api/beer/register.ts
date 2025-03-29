import type { NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import { BeerModel } from "@/models/beer";
import { UserModel } from "@/models/user";
import { withAuth, AuthenticatedRequest } from "@/utils/withAuth";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  // Check if the request method is POST
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  // Connect to the database
  await connectDB();

  try {
    // Get user ID from the authenticated token
    const userId = req.user?.userId;

    // Get username from the database
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { name, volume } = req.body;
    if (!name || !volume) {
      return res.status(400).json({
        success: false,
        message: "Please provide both name and volume for the beer",
      });
    }

    // Convert userId to ObjectId if it's a string
    const userObjectId =
      typeof userId === "string" ? new mongoose.Types.ObjectId(userId) : userId;

    // Include the creator's user ID with the beer
    const newBeer = await BeerModel.create({
      ...req.body,
      createdBy: userObjectId, // Convert to ObjectId if needed
      createdByUsername: user.username,
    });

    return res.status(201).json({ success: true, data: newBeer });
  } catch (error) {
    // Improved error logging
    console.error("POST error details:", {
      message: (error as Error).message,
      stack: (error as Error).stack,
      name: (error as Error).name,
    });

    return res.status(500).json({
      success: false,
      message: "Server error during beer creation",
      error: (error as Error).message,
    });
  }
}

// Export the handler wrapped with authentication
export default withAuth(handler);
