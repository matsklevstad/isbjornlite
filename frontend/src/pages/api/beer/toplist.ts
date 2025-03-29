import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import { BeerModel } from "@/models/beer";

async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  await connectDB();

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
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userData",
        },
      },
      { $unwind: "$userData" },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          username: "$userData.username",
          totalBeers: 1,
          totalVolume: 1,
          // Include user creation date to break ties
          userCreatedAt: "$userData.createdAt",
        },
      },
      // First sort by totalBeers desc, then by userCreatedAt asc
      { $sort: { totalBeers: -1, userCreatedAt: 1 } },
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
