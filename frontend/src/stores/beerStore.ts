"use client";

import { create } from "zustand";
import api from "@/services/api";
import { IBeer } from "@/models/beer";



interface BeerState {
  beers: IBeer[];
  isLoading: boolean;
  error: string | null;

  // Actions
  getBeers: () => Promise<IBeer[]>;
  addBeer: (beer: IBeer) => Promise<IBeer>;
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
      return beers as IBeer[];
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch beers",
        isLoading: false,
      });
      throw error;
    }
  },

  addBeer: async (beer: IBeer) => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.post("/api/beer", beer);
      const newBeer = response.data.data;

      console.log("New beer added:", newBeer);

      // Update the beers array with the new beer
      set((state) => ({
        beers: [...state.beers, newBeer],
        isLoading: false,
      }));

      return newBeer;
    } catch (error: any) {
        console.error("Error adding beer:", error);
      set({
        error: error.response?.data?.message || "Failed to add beer",
        isLoading: false,
      });
      throw error;
    }
  },

  resetError: () => set({ error: null }),
}));
