import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
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
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ account, profile }) {
      // Handle both Google and GitHub authentication
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          await connectDB();

          if (!profile) {
            return false;
          }

          // Determine which ID field to use based on provider
          const providerId =
            account.provider === "google" ? profile.sub : (profile as any).id;
          const providerField =
            account.provider === "google" ? "googleId" : "githubId";

          // Check if user exists by provider ID
          let dbUser = await UserModel.findOne({ [providerField]: providerId });

          // If not found by provider ID, try email
          if (!dbUser && profile.email) {
            dbUser = await UserModel.findOne({ email: profile.email });

            // If found by email, update with provider ID
            if (dbUser) {
              dbUser[providerField] = providerId;
              await dbUser.save();
            } else {
              // Create new user if not found
              dbUser = await UserModel.create({
                [providerField]: providerId,
                email: profile.email,
                username:
                  (profile.name || "user").replace(/\s+/g, "").toLowerCase() +
                  Math.floor(Math.random() * 1000),
                image: "",
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

        // Determine which provider ID to use
        const providerId =
          account.provider === "google" ? profile.sub : (profile as any).id;
        const providerField =
          account.provider === "google" ? "googleId" : "githubId";

        // Find the MongoDB user associated with this OAuth account
        const dbUser = await UserModel.findOne({ [providerField]: providerId });

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

    // Your session callback can remain as is
    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = token.userId as string;
        session.user.username = token.username as string;
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
