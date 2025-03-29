import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import { BeerModel } from "@/models/beer";

async function hadler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  await connectDB();

  try {
    const beers = await BeerModel.find().sort({ createdAt: -1 }).limit(10);

    return res.status(200).json({ success: true, data: beers });
  } catch (error) {
    console.error("Error fetching recent beers:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching recent beers",
      error: (error as Error).message,
    });
  }
}

export default hadler;