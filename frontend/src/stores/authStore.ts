"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/models/user";
import api from "@/services/api";
import Cookies from "js-cookie";

interface RegisterData {
  username: string;
  email: string;
  password: string;
  image?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  register: (data: RegisterData) => Promise<void>;
  login: (
    username: string,
    password: string,
    rememberMe: boolean
  ) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  checkAuth: () => Promise<boolean>;
  fetchProfile: (userId: string) => Promise<User | null>;
}

// Create an SSR-safe storage object
const createNoopStorage = () => {
  return {
    getItem: () => null,
    setItem: () => null,
    removeItem: () => null,
  };
};

// Create a storage that works in browser but does nothing on server
const storage =
  typeof window !== "undefined"
    ? createJSONStorage(() => localStorage)
    : createNoopStorage();

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      // Add register function
      register: async (data: RegisterData) => {
        try {
          set({ isLoading: true, error: null });

          // Call register API
          const response = await api.post("/api/user/register", data);
          const { ...userData } = response.data.data;

          // Update state with user data and token
          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          });

          return response.data;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Registration failed",
            isLoading: false,
          });
          throw error;
        }
      },

      login: async (
        username: string,
        password: string,
        rememberMe: boolean
      ) => {
        try {
          set({ isLoading: true, error: null });
          console.log(rememberMe);

          // Call login API
          const response = await api.post("/api/user/login", {
            username,
            password,
          });
          const { token, ...userData } = response.data.data;

          // Store token in cookie instead of localStorage
          Cookies.set("auth-token", token, {
            expires: rememberMe ? 30 : 1, // 30 days if "remember me" is checked
            path: "/",
            sameSite: "strict",
            // secure: true  // Uncomment in production with HTTPS
          });

          // Update state with user data and token
          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          });

          return response.data;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to login",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        // Remove the cookie
        Cookies.remove("auth-token");

        set({ user: null, isAuthenticated: false });
      },

      fetchProfile: async (userId: string) => {
        try {
          set({ isLoading: true });

          let response;

          // If no userId provided or it's "me", fetch current user's profile
          if (!userId || userId === "me") {
            response = await api.get("/api/user/profile");
          } else {
            // Otherwise fetch specific user by ID
            response = await api.get(`/api/user/${userId}`);
          }

          set({ isLoading: false });
          return response.data.data;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to fetch profile",
            isLoading: false,
          });
          return null;
        }
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      checkAuth: async () => {
        try {
          set({ isLoading: true });

          // Cookie is sent automatically with request due to withCredentials: true
          const response = await api.get("/api/user/profile");

          set({
            user: response.data.data,
            isAuthenticated: true,
            isLoading: false,
          });

          return true;
        } catch (error: any) {
          // Only logout on specific auth errors (401, 403)
          if (
            error?.response?.status === 401 ||
            error?.response?.status === 403
          ) {
            get().logout();
          }

          set({ isAuthenticated: false, isLoading: false });
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: storage,
      // Add this to limit what's stored in localStorage
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user
          ? {
              _id: state.user._id,
              username: state.user.username,
            }
          : null,
      }),
    }
  )
);
