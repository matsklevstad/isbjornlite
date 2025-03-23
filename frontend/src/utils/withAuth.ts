// frontend/src/utils/withAuth.ts
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

// Define the decoded token type
interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

// Extend the NextApiRequest type
interface AuthenticatedRequest extends NextApiRequest {
  user?: DecodedToken;
}

export function withAuth(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Get token from header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Authentication invalid" });
      }
      
      const token = authHeader.split(" ")[1];
      
      // Verify token
      try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new Error("JWT_SECRET is not defined");
        }
        
        const decoded = jwt.verify(token, secret) as DecodedToken;
        
        // Add user to request object and call handler
        (req as AuthenticatedRequest).user = decoded;
        return handler(req as AuthenticatedRequest, res);
      } catch (error) {
        return res.status(401).json({ success: false, message: "Authentication invalid" });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
}