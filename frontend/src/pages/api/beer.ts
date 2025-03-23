import type { NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import { BeerModel } from "@/models/beer";
import { UserModel } from "@/models/user";
import { withAuth, AuthenticatedRequest } from "@/utils/withAuth";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  await connectDB();

  switch (req.method) {
    case "GET":
      try {
        const beers = await BeerModel.find();
        return res.status(200).json({ success: true, data: beers });
      } catch (error) {
        console.error("GET error:", error);
        return res.status(500).json({
          success: false,
          message: "Server error during fetching beers",
          error: (error as Error).message,
        });
      }
    case "POST":
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
          typeof userId === "string"
            ? new mongoose.Types.ObjectId(userId)
            : userId;

        // Add detailed logging to see what's happening
        console.log("Creating beer with data:", {
          ...req.body,
          createdBy: userObjectId,
          createdByUsername: user.username,
        });

        // Include the creator's user ID with the beer
        const newBeer = await BeerModel.create({
          ...req.body,
          createdBy: userObjectId, // Convert to ObjectId if needed
          createdByUsername: user.username,
        });

        console.log("Beer created successfully:", newBeer);

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
    default:
      return res
        .status(405)
        .json({ success: false, message: "Method not allowed" });
  }
}

// Export the handler wrapped with authentication
export default withAuth(handler);
