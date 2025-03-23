import api from "./api";
import { IBeer, Beer } from "@/models/beer";

export const beerService = {
  getAllBeers: async (): Promise<IBeer[]> => {
    try {
      const res = await api.get("/api/beer");
      return res.data.data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  },

  getBeer: async (id: string): Promise<IBeer> => {
    try {
      const res = await api.get(`api/beer/${id}`);
      return res.data.data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  },

  createBeer: async (beerData: Beer): Promise<Beer> => {
    try {
      const res = await api.post("api/beer/", beerData);
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
};
