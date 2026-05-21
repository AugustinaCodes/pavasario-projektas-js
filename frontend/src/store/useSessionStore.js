import { create } from "zustand";
import api from "../api/axios";

const useSessionStore = create((set) => ({
  sessions: [],
  isLoading: false,
  error: null,

  fetchSessions: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.get("/sessions");

      set({
        sessions: response.data.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to fetch sessions",
        isLoading: false,
      });
    }
  },
}));

export default useSessionStore;