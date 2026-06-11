import { create } from "zustand";
import api from "../api/axios";

const getErrorMessage = (error) =>
  error.response?.data?.message || "Something went wrong";

const getSessionFromResponse = (response) =>
  response.data.data?.session || response.data.session || response.data.data || null;

const updateSessionInList = (sessions, updatedSession) =>
  sessions.map((session) =>
    String(session.id) === String(updatedSession.id) ? updatedSession : session
  );

const useSessionStore = create((set, get) => ({
  sessions: [],
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

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
        error: getErrorMessage(error),
        isLoading: false,
      });
    }
  },

  createSession: async (sessionData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post("/sessions", sessionData);
      const newSession = getSessionFromResponse(response);

      set({
        sessions: newSession ? [newSession, ...get().sessions] : get().sessions,
        isLoading: false,
      });

      return newSession;
    } catch (error) {
      const message = getErrorMessage(error);

      set({
        error: message,
        isLoading: false,
      });

      throw new Error(message, { cause: error });
    }
  },

  updateSession: async (sessionId, sessionData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.patch(`/sessions/${sessionId}`, sessionData);
      const updatedSession = getSessionFromResponse(response);

      set({
        sessions: updatedSession
          ? updateSessionInList(get().sessions, updatedSession)
          : get().sessions,
        isLoading: false,
      });

      return updatedSession;
    } catch (error) {
      const message = getErrorMessage(error);

      set({
        error: message,
        isLoading: false,
      });

      throw new Error(message, { cause: error });
    }
  },

  createSessionSlot: async (sessionId, slotData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post(`/sessions/${sessionId}/slots`, slotData);
      const updatedSession = getSessionFromResponse(response);

      set({
        sessions: updatedSession
          ? updateSessionInList(get().sessions, updatedSession)
          : get().sessions,
        isLoading: false,
      });

      return updatedSession;
    } catch (error) {
      const message = getErrorMessage(error);

      set({
        error: message,
        isLoading: false,
      });

      throw new Error(message, { cause: error });
    }
  },

  deleteSessionSlot: async (sessionId, slotId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.delete(`/sessions/${sessionId}/slots/${slotId}`);
      const updatedSession = getSessionFromResponse(response);

      set({
        sessions: updatedSession
          ? updateSessionInList(get().sessions, updatedSession)
          : get().sessions,
        isLoading: false,
      });

      return updatedSession;
    } catch (error) {
      const message = getErrorMessage(error);

      set({
        error: message,
        isLoading: false,
      });

      throw new Error(message, { cause: error });
    }
  },

  deleteSession: async (sessionId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.delete(`/sessions/${sessionId}`);
      const deletedSession = getSessionFromResponse(response);
      const deletedSessionId = deletedSession?.id ?? sessionId;

      set({
        sessions: get().sessions.filter(
          (session) => String(session.id) !== String(deletedSessionId)
        ),
        isLoading: false,
      });

      return deletedSession;
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

export default useSessionStore;
