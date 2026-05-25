import { create } from "zustand";
import api from "../api/axios";

const getErrorMessage = (error) =>
  error.response?.data?.message || "Something went wrong";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  checkAuth: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.get("/auth/me");
      const user = response.data.data.user;

      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: getErrorMessage(error),
      });

      return null;
    }
  },

  register: async (credentials) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post("/auth/register", credentials);
      const user = response.data.data.user;

      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
      throw error;
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post("/auth/login", credentials);
      const user = response.data.data.user;

      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });

    try {
      await api.post("/auth/logout");
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
      throw error;
    }
  },

  setUser: (user) => {
    set({ user, isAuthenticated: Boolean(user) });
  },

  clearUser: () => {
    set({ user: null, isAuthenticated: false });
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useAuthStore;
