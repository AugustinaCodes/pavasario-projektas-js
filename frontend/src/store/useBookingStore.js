import { create } from "zustand";
import api from "../api/axios";

const getErrorMessage = (error) =>
  error.response?.data?.message || "Something went wrong";

const updateBookingInList = (bookings, updatedBooking) =>
  bookings.map((booking) =>
    String(booking.id) === String(updatedBooking.id) ? updatedBooking : booking
  );

const getBookingFromResponse = (response) =>
  response.data.data?.booking ||
  response.data.booking ||
  response.data.data ||
  null;

const getBookingsFromResponse = (response) => {
  const bookings =
    response.data.data?.bookings ||
    response.data.bookings ||
    response.data.data ||
    [];

  return Array.isArray(bookings) ? bookings : [];
};

const defaultPagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

const getPaginationFromResponse = (response) =>
  response.data.pagination || defaultPagination;

const useBookingStore = create((set, get) => ({
  bookings: [],
  allBookingsPagination: defaultPagination,
  myBookingsPagination: defaultPagination,
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchMyBookings: async ({ page = 1, limit = 10 } = {}) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.get("/bookings/me", {
        params: {
          page,
          limit,
        },
      });

      set({
        bookings: getBookingsFromResponse(response),
        myBookingsPagination: getPaginationFromResponse(response),
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

      const newBooking = getBookingFromResponse(response);

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

      const updatedBooking = getBookingFromResponse(response);

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

  fetchAllBookings: async ({ page = 1, limit = 10 } = {}) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.get("/bookings", {
        params: {
          page,
          limit,
        },
      });

      set({
        bookings: getBookingsFromResponse(response),
        allBookingsPagination: getPaginationFromResponse(response),
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

      const updatedBooking = getBookingFromResponse(response);

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

      const updatedBooking = getBookingFromResponse(response);

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

      const updatedBooking = getBookingFromResponse(response);

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
