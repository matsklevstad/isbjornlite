import mongoose, { Document, Schema } from "mongoose";

// Define interface for Beer document
export interface IBeer extends Document {
  name: string;
  brewery: string;
  volume: number;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

// For frontend TypeScript usage (keep existing interface)
export interface Beer {
  _id?: string;
  name: string;
  brewery: string;
  volume: number;
  image: string;
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
      type: Number,
      required: [true, "Please provide a volume"],
      min: [0, "Volume cannot be negative"],
    },
    image: {
      type: String,
      required: false,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Important: Check if the model exists before creating it
// This is necessary for Next.js hot reloading and serverless functions
export const BeerModel =
  mongoose.models.Beer || mongoose.model<IBeer>("Beer", beerSchema);
