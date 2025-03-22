import api from "./api";
import { Beer } from "@/models/beer";

export const beerService = {
  getAllBeers: () => api.get("/beers"),

  getBeer: (id: string) => api.get(`/beers/${id}`),

  createBeer: (beerData: Beer) => api.post("/beers", beerData),

  deleteBeer: (id: string) => api.delete(`/beers/${id}`),
};
