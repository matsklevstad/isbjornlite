// frontend/src/models/user.ts
import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

// Define interface for User document
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  image: string;
  googleId?: string; // Optional field for Google OAuth
  githubId?: string; // Optional field for GitHub OAuth
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// For frontend TypeScript usage (keep your existing interface)
export interface User {
  _id?: string;
  username: string;
  email: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Please provide a username"],
      minlength: 3,
      maxlength: 20,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        // Only require password if no OAuth provider
        return !this.googleId;
      },
      minlength: 8,
      select: false, // Don't include password in query results by default
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      validate: {
        validator: function (value: string) {
          return validator.isEmail(value);
        },
        message: "Please provide a valid email",
      },
      unique: true,
      lowercase: true,
    },
    googleId: {
      type: String,
      required: false,
      unique: true,
    },
    githubId: {
      type: String,
      required: false,
      unique: true,
    },
    image: {
      type: String,
      required: false,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Pre-save hook to hash password before saving
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    // Generate a salt with cost factor 10
    const salt = await bcrypt.genSalt(10);

    // Hash password with the generated salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    // Compare the provided password with the hashed password
    return await bcrypt.compare(candidatePassword, this.password);
  } catch {
    throw new Error("Password comparison failed");
  }
};

// Important: Check if the model exists before creating it
// This is necessary for Next.js hot reloading and serverless functions
export const UserModel =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
