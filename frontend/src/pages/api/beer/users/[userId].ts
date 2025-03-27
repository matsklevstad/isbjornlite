import type { NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import { BeerModel } from "@/models/beer";
import { withAuth, AuthenticatedRequest } from "@/utils/withAuth";

// Fetch all beers created by the logged-in user
async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      // Fetch all beers created by the user
      const userBeers = await BeerModel.find({ createdBy: userId }).sort({
        createdAt: -1,
      });

      return res.status(200).json({ success: true, data: userBeers });
    } catch (error) {
      console.error("Error fetching user beers:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
}

export default withAuth(handler);
