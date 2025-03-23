import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import { BeerModel } from "@/models/beer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
        const { name, type } = req.body;
        if (!name || !type) {
          return res.status(400).json({
            success: false,
            message: "Please provide both name and type for the beer",
          });
        }
        const newBeer = await BeerModel.create(req.body);
        return res.status(201).json({ success: true, data: newBeer });
      } catch (error) {
        console.error("POST error:", error);
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
