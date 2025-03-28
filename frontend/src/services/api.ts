import axios from "axios";
import { useAuthStore } from "@/stores/authStore"; // Import your auth store

// Create an axios instance with default configs
const api = axios.create({
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
