import mongoose, { Document, Schema } from "mongoose";

// Define interface for Beer document
export interface IBeer extends Document {
  name: string;
  brewery: string;
  volume: string;
  image?: string;
  createdBy: mongoose.Schema.Types.ObjectId; // Reference to User
  createdByUsername: string; // Store username directly
  createdAt: Date;
  updatedAt: Date;
}

// For frontend TypeScript usage (keep existing interface)
export interface Beer {
  _id?: string;
  name: string;
  brewery: string;
  volume: string;
  image?: string;
  createdBy: string; // User ID
  createdByUsername: string; // Username
  createdAt?: Date;
  updatedAt?: Date;
}

const beerSchema = new Schema<IBeer>(
  {
    name: {
      type: String,
      required: [true, "Please provide a beer name"],
      trim: true,
    },
    brewery: {
      type: String,
      required: [true, "Please provide a brewery name"],
      trim: true,
    },
    volume: {
      type: String,
      required: [true, "Please provide a volume"],
      trim: true,
    },
    image: {
      type: String,
      required: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdByUsername: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Important: Check if the model exists before creating it
// This is necessary for Next.js hot reloading and serverless functions
export const BeerModel =
  mongoose.models.Beer || mongoose.model<IBeer>("Beer", beerSchema);
