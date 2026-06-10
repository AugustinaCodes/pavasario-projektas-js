import { create } from "zustand";
import api from "../api/axios";

const getErrorMessage = (error) =>
  error.response?.data?.message || "Something went wrong";

const getAnalyticsFromResponse = (response) =>
  response.data.data?.analytics || response.data.analytics || response.data.data || null;

const useAnalyticsStore = create((set) => ({
  adminAnalytics: null,
  myAnalytics: null,
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchAdminAnalytics: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.get("/analytics/admin");

      set({
        adminAnalytics: getAnalyticsFromResponse(response),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: getErrorMessage(error),
        isLoading: false,
      });
    }
  },

  fetchMyAnalytics: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.get("/analytics/me");

      set({
        myAnalytics: getAnalyticsFromResponse(response),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: getErrorMessage(error),
        isLoading: false,
      });
    }
  },
}));

export default useAnalyticsStore;