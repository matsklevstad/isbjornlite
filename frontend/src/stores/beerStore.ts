"use client";

import { create } from "zustand";
import api from "@/services/api";

// Define the Beer interface based on the API endpoint implementation
interface Beer {
  _id?: string;
  name: string;
  type: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BeerState {
  beers: Beer[];
  isLoading: boolean;
  error: string | null;

  // Actions
  getBeers: () => Promise<Beer[]>;
  addBeer: (beer: Beer) => Promise<Beer>;
  resetError: () => void;
}

export const useBeerStore = create<BeerState>()((set, get) => ({
  beers: [],
  isLoading: false,
  error: null,

  getBeers: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.get("/api/beer");
      const beers = response.data.data;

      set({ beers, isLoading: false });
      return beers;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch beers",
        isLoading: false,
      });
      throw error;
    }
  },

  addBeer: async (beer: Beer) => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.post("/api/beer", beer);
      const newBeer = response.data.data;

      // Update the beers array with the new beer
      set((state) => ({
        beers: [...state.beers, newBeer],
        isLoading: false,
      }));

      return newBeer;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to add beer",
        isLoading: false,
      });
      throw error;
    }
  },

  resetError: () => set({ error: null }),
}));
