import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/user";

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

export function verifyToken(req: NextApiRequest): string | null {
  try {
    // Check cookies first (for new cookie-based auth)
    const authCookie = req.cookies["auth-token"];

    // Then fall back to Authorization header (for backward compatibility)
    const authHeader = req.headers.authorization;

    // Get the token from either source
    let token: string | undefined;

    if (authCookie) {
      token = authCookie;
    } else if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // If no token found, return null
    if (!token) {
      return null;
    }

    // Verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;

    return decoded.userId;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

// Complete API route handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET request
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    // Verify the token and get userId
    const userId = verifyToken(req);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await connectDB();

    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Return the complete user object
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Profile API error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
