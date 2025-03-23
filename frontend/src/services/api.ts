"use client";

import axios from "axios";

// Create an axios instance with default configs
const api = axios.create({
  // No baseURL needed when API routes are in the same Next.js app
  // The requests will be relative to the current domain
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // For server-side rendering, localStorage might not be available
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
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
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        // If you implement Zustand later, you could import your store here
        // and call its logout function instead

        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
