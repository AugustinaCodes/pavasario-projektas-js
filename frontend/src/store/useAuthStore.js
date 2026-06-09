import { create } from "zustand";
import api from "../api/axios";

const getErrorData = (error) => {
  const data = error.response?.data;

  return {
    message: data?.message || "Something went wrong",
    errors: Array.isArray(data?.errors) ? data.errors : [],
  };
};

const getUserFromResponse = (response) => response.data.data.user;

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  hasCheckedAuth: false,
  error: null,

  checkAuth: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.get("/auth/me");
      const user = getUserFromResponse(response);

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        hasCheckedAuth: true,
        error: null,
      });

      return user;
    } catch (error) {
      const isUnauthenticated = error.response?.status === 401;

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        hasCheckedAuth: true,
        error: isUnauthenticated ? null : getErrorData(error),
      });

      return null;
    }
  },

  register: async (credentials) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post("/auth/register", credentials);
      const user = getUserFromResponse(response);

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        hasCheckedAuth: true,
        error: null,
      });

      return user;
    } catch (error) {
      const errorData = getErrorData(error);

      set({
        isLoading: false,
        error: errorData,
      });

      throw new Error(errorData.message, { cause: error });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post("/auth/login", credentials);
      const user = getUserFromResponse(response);

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        hasCheckedAuth: true,
        error: null,
      });

      return user;
    } catch (error) {
      const errorData = getErrorData(error);

      set({
        isLoading: false,
        error: errorData,
      });

      throw new Error(errorData.message, { cause: error });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post("/auth/logout");

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        hasCheckedAuth: true,
        error: null,
      });

      return response.data?.message || "You have successfully logged out.";
    } catch (error) {
      const errorData = getErrorData(error);

      set({
        isLoading: false,
        error: errorData,
      });

      throw new Error(errorData.message, { cause: error });
    }
  },

  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.patch("/auth/me", profileData);
      const user = getUserFromResponse(response);

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        hasCheckedAuth: true,
        error: null,
      });

      return user;
    } catch (error) {
      const errorData = getErrorData(error);

      set({
        isLoading: false,
        error: errorData,
      });

      throw new Error(errorData.message, { cause: error });
    }
  },

  deleteAccount: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.delete("/auth/me");

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        hasCheckedAuth: true,
        error: null,
      });

      return response.data?.message || "Your account has been deleted.";
    } catch (error) {
      const errorData = getErrorData(error);

      set({
        isLoading: false,
        error: errorData,
      });

      throw new Error(errorData.message, { cause: error });
    }
  },

  setUser: (user) => {
    set({
      user,
      isAuthenticated: Boolean(user),
    });
  },

  clearUser: () => {
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useAuthStore;
