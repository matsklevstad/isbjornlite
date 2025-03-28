// frontend/src/utils/withAuth.ts
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

// Define the decoded token type
interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

// Extend the NextApiRequest type
export interface AuthenticatedRequest extends NextApiRequest {
  user?: DecodedToken;
}

export function withAuth(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Get token from cookie first, fall back to Authorization header
      const cookies = req.cookies || {};
      let token = cookies["auth-token"];
      
      // Backward compatibility for Authorization header
      if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith("Bearer ")) {
          token = authHeader.split(" ")[1];
        }
      }

      // If no token is found, return 401
      if (!token) {
        return res.status(401).json({ 
          success: false, 
          message: "Authentication required" 
        });
      }

      // Verify token
      try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new Error("JWT_SECRET is not defined");
        }

        const decoded = jwt.verify(token, secret) as DecodedToken;
        (req as AuthenticatedRequest).user = decoded;
        return handler(req as AuthenticatedRequest, res);
      } catch {
        return res
          .status(401)
          .json({ success: false, message: "Authentication invalid" });
      }
    } catch {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
}
