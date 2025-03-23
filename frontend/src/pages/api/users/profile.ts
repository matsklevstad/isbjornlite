import type { NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/user";
import { withAuth, AuthenticatedRequest } from "@/utils/withAuth";

// Define the handler that will run after authentication
async function profileHandler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    await connectDB();
    
    // Get the user ID from the token (set by withAuth middleware)
    const userId = req.user?.userId;
    
    // Find the user by the ID from the token
    const user = await UserModel.findById(userId).select('-password');

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("GET error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during fetching user profile",
      error: (error as Error).message,
    });
  }
}

// Export the handler wrapped with authentication
export default withAuth(profileHandler);