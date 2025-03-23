"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/models/user";
import api from "@/services/api";

interface RegisterData {
  username: string;
  email: string;
  password: string;
  image?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
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
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      // Add register function
      register: async (data: RegisterData) => {
        try {
          set({ isLoading: true, error: null });

          // Call register API
          const response = await api.post("/api/users/register", data);
          const { token, ...userData } = response.data.data;

          // Update state with user data and token
          set({
            user: userData,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          // Update axios headers for future requests
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

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
          const response = await api.post("/api/users/login", {
            username,
            password,
          });
          const { token, ...userData } = response.data.data;

          // Update state with user data and token
          set({
            user: userData,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          // Update axios headers for future requests
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

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
        // Clear auth data
        set({ user: null, token: null, isAuthenticated: false });

        // Remove auth header
        delete api.defaults.headers.common["Authorization"];

        // Optionally redirect (needs to be done in component)
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) return;

        try {
          set({ isLoading: true });

          // Set auth header
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Verify token by fetching user profile
          const response = await api.get("/api/users/profile");
          set({
            user: response.data.data,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          // Token invalid, logout
          get().logout();
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);
