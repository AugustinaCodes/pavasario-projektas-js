import { create } from "zustand";
import api from "../api/axios";

const getErrorMessage = (error) =>
  error.response?.data?.message || "Something went wrong";

const updateBookingInList = (bookings, updatedBooking) =>
  bookings.map((booking) =>
    booking.id === updatedBooking.id ? updatedBooking : booking
  );

const useBookingStore = create((set, get) => ({
  bookings: [],
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchMyBookings: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.get("/bookings/me");

      set({
        bookings: Array.isArray(response.data.data) ? response.data.data: [],
        isLoading: false,
      });
    } catch (error) {
      set({
        error: getErrorMessage(error),
        isLoading: false,
      });
    }
  },

  createBooking: async (bookingData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post("/bookings", bookingData);

      const newBooking = response.data.data;

      set({
        bookings: newBooking
          ? [newBooking, ...get().bookings]
          : get().bookings,
        isLoading: false,
      });

      return newBooking;
    } catch (error) {
      const message = getErrorMessage(error);

      set({
        error: message,
        isLoading: false,
      });

      throw new Error(message, { cause: error });
    }
  },

  cancelMyBooking: async (bookingId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.patch(`/bookings/${bookingId}/cancel`);

      const updatedBooking = response.data.data;

      set({
        bookings: updatedBooking
          ? updateBookingInList(get().bookings, updatedBooking)
          : get().bookings,
        isLoading: false,
      });

      return updatedBooking;
    } catch (error) {
      const message = getErrorMessage(error);

      set({
        error: message,
        isLoading: false,
      });

      throw new Error(message, { cause: error });
    }
  },

  fetchAllBookings: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.get("/bookings");

      set({
        bookings: response.data.data?.bookings || response.data.bookings || [],
        isLoading: false,
      });
    } catch (error) {
      set({
        error: getErrorMessage(error),
        isLoading: false,
      });
    }
  },

  confirmBooking: async (bookingId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.patch(`/bookings/${bookingId}/confirm`);

      const updatedBooking =
        response.data.data?.booking || response.data.booking;

      set({
        bookings: updatedBooking
          ? updateBookingInList(get().bookings, updatedBooking)
          : get().bookings,
        isLoading: false,
      });

      return updatedBooking;
    } catch (error) {
      const message = getErrorMessage(error);

      set({
        error: message,
        isLoading: false,
      });

      throw new Error(message, { cause: error });
    }
  },

  completeBooking: async (bookingId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.patch(`/bookings/${bookingId}/complete`);

      const updatedBooking =
        response.data.data?.booking || response.data.booking;

      set({
        bookings: updatedBooking
          ? updateBookingInList(get().bookings, updatedBooking)
          : get().bookings,
        isLoading: false,
      });

      return updatedBooking;
    } catch (error) {
      const message = getErrorMessage(error);

      set({
        error: message,
        isLoading: false,
      });

      throw new Error(message, { cause: error });
    }
  },

  cancelBookingAsAdmin: async (bookingId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.patch(`/bookings/${bookingId}/cancel`);

      const updatedBooking =
        response.data.data?.booking || response.data.booking;

      set({
        bookings: updatedBooking
          ? updateBookingInList(get().bookings, updatedBooking)
          : get().bookings,
        isLoading: false,
      });

      return updatedBooking;
    } catch (error) {
      const message = getErrorMessage(error);

      set({
        error: message,
        isLoading: false,
      });

      throw new Error(message, { cause: error });
    }
  },
}));

export default useBookingStore;