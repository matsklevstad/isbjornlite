// frontend/src/services/userService.ts
import api from "./api";
import { User } from "@/models/user";

interface Credentials {
  username: string;
  password: string;
}

export const userService = {
  register: (userData: User): Promise<any> =>
    api.post("/api/user/register", userData),

  login: (credentials: Credentials): Promise<any> =>
    api.post("/api/user/login", credentials),

  getProfile: (): Promise<any> => api.get("/api/user/profile"),

  getUserById: async (userId: string): Promise<User> => {
    try {
      let response;

      // If no userId provided or it's "me", fetch current user's profile
      if (!userId || userId === "me") {
        response = await api.get("/api/user/profile");
      } else {
        // Otherwise fetch specific user by ID
        response = await api.get(`/api/user/${userId}`);
      }

      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      throw error;
    }
  },
};
