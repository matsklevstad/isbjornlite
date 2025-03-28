import axios from "axios";
import { useAuthStore } from "@/stores/authStore"; // Import your auth store

// Use absolute URL for server, relative for browser
const baseURL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    : "";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only run this code in the browser
    if (typeof window !== "undefined") {
      // Handle token expiration or other auth errors
      if (error.response?.status === 401) {
        // Use your auth store's logout method instead
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
