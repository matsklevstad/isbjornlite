import api from "./api";
import { IBeer, Beer } from "@/models/beer";

export const beerService = {
  getRecentBeers: async (): Promise<IBeer[]> => {
    try {
      const res = await api.get("/api/beer/recent");
      return res.data.data.reverse();
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  },

  getUserBeers: async (): Promise<Beer[]> => {
    try {
      const res = await api.get("/api/beer/user");
      return res.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user beers"
      );
    }
  },

  getBeersByUserId: async (userId: string): Promise<Beer[]> => {
    try {
      const res = await api.get(`/api/beer/users/${userId}`);
      return res.data.data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  },

  createBeer: async (beerData: Beer): Promise<Beer> => {
    try {
      const res = await api.post("api/beer/register", beerData);
      return res.data.data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  },

  deleteBeer: async (id: string): Promise<void> => {
    try {
      await api.delete(`api/beer/${id}`);
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  },

  getToplist: async (): Promise<any[]> => {
    try {
      const res = await api.get("/api/beer/toplist");
      return res.data.data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  },
};
