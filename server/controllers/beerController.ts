import { Request, Response } from "express";
import Beer from "../models/Beer";

// Get all beers
export const getAllBeers = async (req: Request, res: Response) => {
  try {
    const beers = await Beer.find({});
    res.status(200).json({ success: true, data: beers });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch beers",
      error: (error as Error).message,
    });
  }
};

// Get a single beer
export const getBeer = async (req: Request, res: Response) => {
  try {
    const beer = await Beer.findById(req.params.id);

    if (!beer) {
      res.status(404).json({ success: false, message: "Beer not found" });
      return; // Return early but don't return the response object
    }

    res.status(200).json({ success: true, data: beer });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch beer",
      error: (error as Error).message,
    });
  }
};

// Create a beer
export const createBeer = async (req: Request, res: Response) => {
  try {
    const beer = await Beer.create(req.body);
    res.status(201).json({ success: true, data: beer });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create beer",
      error: (error as Error).message,
    });
  }
};

// Delete a beer
export const deleteBeer = async (req: Request, res: Response) => {
  try {
    const beer = await Beer.findByIdAndDelete(req.params.id);
    if (!beer) {
      res.status(404).json({ success: false, message: "Beer not found" });
      return; // Just use return (no res object) to exit early
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete beer",
      error: (error as Error).message,
    });
  }
};
