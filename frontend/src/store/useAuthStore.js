import { create } from "zustand";
import api from "../api/axios";

const STORAGE_KEY = "fitbook-auth-user";

const readStoredUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const storedUser = window.localStorage.getItem(STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

const initialUser = readStoredUser();

const readError = (error) => {
  const responseData = error?.response?.data;
  const validationErrors = Array.isArray(responseData?.errors)
    ? responseData.errors
    : [];

  return {
    message:
      responseData?.message || error?.message || "Something went wrong",
    errors: validationErrors,
  };
};

const persistUser = (user) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
};

const removeStoredUser = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
};

const useAuthStore = create((set) => ({
  user: initialUser,
  isAuthenticated: Boolean(initialUser),
  isLoading: false,
  error: null,

  setUser: (user) => {
    persistUser(user);

    set({ user, isAuthenticated: Boolean(user), error: null });
  },

  clearUser: () => {
    removeStoredUser();

    set({ user: null, isAuthenticated: false, error: null });
  },

  checkAuth: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.get("/auth/me");
      const user = response.data?.data?.user ?? null;

      if (user) {
        persistUser(user);
      } else {
        removeStoredUser();
      }

      set({
        user,
        isAuthenticated: Boolean(user),
        isLoading: false,
        error: null,
      });

      return user;
    } catch (error) {
      if (error?.response?.status === 401) {
        removeStoredUser();
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });

        return null;
      }

      set({
        isLoading: false,
        error: readError(error),
      });

      return null;
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post("/auth/register", payload);
      const user = response.data?.data?.user ?? null;

      if (user) {
        persistUser(user);
      }

      set({
        user,
        isAuthenticated: Boolean(user),
        isLoading: false,
        error: null,
      });

      return user;
    } catch (error) {
      set({
        isLoading: false,
        error: readError(error),
      });

      throw error;
    }
  },

  login: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post("/auth/login", payload);
      const user = response.data?.data?.user ?? null;

      if (user) {
        persistUser(user);
      }

      set({
        user,
        isAuthenticated: Boolean(user),
        isLoading: false,
        error: null,
      });

      return user;
    } catch (error) {
      set({
        isLoading: false,
        error: readError(error),
      });

      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });

    try {
      await api.post("/auth/logout");
    } catch (error) {
      set({ error: readError(error) });
    } finally {
      removeStoredUser();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));

export default useAuthStore;