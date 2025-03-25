import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import { BeerModel } from "@/models/beer";
import { UserModel } from "@/models/user";
import mongoose from "mongoose";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const beers = await BeerModel.aggregate([
      {
        $group: {
          _id: "$createdBy", // Group by user ID
          totalBeers: { $sum: 1 }, // Count total beers per user
          totalVolume: { $sum: { $toDouble: "$volume" } }, // Sum of volume as a number
        },
      },
      {
        $lookup: {
          from: "users", // Name of the users collection
          localField: "_id",
          foreignField: "_id",
          as: "userData",
        },
      },
      { $unwind: "$userData" }, // Convert array from $lookup to an object
      {
        $project: {
          _id: 0,
          userId: "$_id",
          username: "$userData.username",
          totalBeers: 1,
          totalVolume: 1,
        },
      },
      { $sort: { totalBeers: -1 } }, // Sort by most beers first
    ]);

    return res.status(200).json({ success: true, data: beers });
  } catch (error) {
    console.error("Error fetching toplist:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching toplist",
      error: (error as Error).message,
    });
  }
}

export default handler;
