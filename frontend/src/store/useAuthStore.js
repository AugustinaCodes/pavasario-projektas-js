import { create } from "zustand";

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

const useAuthStore = create((set) => ({
  user: initialUser,
  isAuthenticated: Boolean(initialUser),

  setUser: (user) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }

    set({ user, isAuthenticated: Boolean(user) });
  },

  clearUser: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }

    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;