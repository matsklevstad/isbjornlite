import express from "express";
import {
  getAllBeers,
  getBeer,
  createBeer,
  deleteBeer,
} from "../controllers/beerController";

const router = express.Router();

// GET all beers
router.get("/", getAllBeers);

// GET a single beer by ID
router.get("/:id", getBeer);

// POST create a new beer
router.post("/", createBeer);

// DELETE a beer by ID
router.delete("/:id", deleteBeer);

export default router;
