import axios from "axios";
import { useAuthStore } from "@/stores/authStore"; // Import your auth store

// Create an axios instance with default configs
const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Get token from Zustand store instead of directly from localStorage
    if (typeof window !== "undefined") {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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