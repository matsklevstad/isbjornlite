import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/user";
import { generateToken } from "@/utils/auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    customJwt?: string;
  }
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        try {
          await connectDB();

          if (!profile) {
            return false;
          }

          // Check if user exists by googleId
          let dbUser = await UserModel.findOne({ googleId: profile.sub });

          // If not found by googleId, try email
          if (!dbUser && profile.email) {
            dbUser = await UserModel.findOne({ email: profile.email });

            // If found by email, update with googleId
            if (dbUser) {
              dbUser.googleId = profile.sub;
              await dbUser.save();
            } else {
              // Create new user if not found
              dbUser = await UserModel.create({
                googleId: profile.sub,
                email: profile.email,
                username:
                  (profile.name || "user").replace(/\s+/g, "").toLowerCase() +
                  Math.floor(Math.random() * 1000),
                // No password needed for OAuth users
              });
            }
          }

          return true;
        } catch (error) {
          console.error("Error during OAuth sign in:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, account, profile }) {
      // Initial sign in
      if (account && profile) {
        await connectDB();
        // Find the MongoDB user associated with this OAuth account
        const dbUser = await UserModel.findOne({ googleId: profile.sub });

        if (dbUser) {
          // Add MongoDB data to the token
          token.userId = dbUser._id.toString();
          token.username = dbUser.username;

          // Generate compatible JWT for your existing system
          const customJwt = generateToken(dbUser._id.toString());
          token.customJwt = customJwt;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.userId) {
        // Add MongoDB user data to the session
        session.user.id = token.userId as string;
        session.user.username = token.username as string;

        // If you need to maintain compatibility with your existing JWT system
        session.customJwt = token.customJwt as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
