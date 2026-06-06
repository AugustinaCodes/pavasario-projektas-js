import { useEffect, useRef, useState } from "react";
import SessionCard from "../components/SessionCard";
import useSessionStore from "../store/useSessionStore";
import { useLocation, useNavigate } from "react-router-dom";
import useBookingStore from "../store/useBookingStore";
import useAuthStore from "../store/useAuthStore";

const getTodayDateString = () => {
  const today = new Date();

  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
};

const formatSlotLabel = (slot) => {
  const date = new Date(`${slot.session_date}T00:00:00`).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return `${date} at ${slot.start_time.slice(0, 5)} · ${
    slot.available_places
  } places available`;
};

const isPastSlot = (slot) =>
  new Date(`${slot.session_date}T${slot.start_time}`) < new Date();

function SessionPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { sessions, isLoading, error, fetchSessions } = useSessionStore();

  const createBooking = useBookingStore((state) => state.createBooking);
  const isBookingLoading = useBookingStore((state) => state.isLoading);
  const bookingError = useBookingStore((state) => state.error);
  const clearBookingError = useBookingStore((state) => state.clearError);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [selectedSession, setSelectedSession] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");

  const [bookingForm, setBookingForm] = useState({
    session_slot_id: "",
    booking_date: "",
    booking_time: "",
    notes: "",
  });

  const bookingFormRef = useRef(null);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    if (selectedSession && bookingFormRef.current) {
      bookingFormRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedSession]);

  const handleBookSession = (session) => {
    if (!isAuthenticated) {
      navigate("/login", {
        replace: true,
        state: {
          from: location,
        },
      });

      return;
    }

    clearBookingError();
    setSuccessMessage("");
    setFormError("");
    setSelectedSession(session);

    setBookingForm({
      session_slot_id: "",
      booking_date: "",
      booking_time: "",
      notes: "",
    });
  };

  const handleBookingChange = (event) => {
    const { name, value } = event.target;

    setBookingForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCloseBookingForm = () => {
    setSelectedSession(null);
    setFormError("");
    clearBookingError();
  };

  const handleBookingSubmit = async (event) => {
    event.preventDefault();

    if (!selectedSession) {
      return;
    }

    const isGroup = selectedSession.session_type === "group";

    if (isGroup && !bookingForm.session_slot_id) {
      setSuccessMessage("");
      setFormError("Please select an available session time.");
      return;
    }

    if (!isGroup && !bookingForm.booking_date && !bookingForm.booking_time) {
      setSuccessMessage("");
      setFormError("Date and time are required.");
      return;
    }

    if (!isGroup && !bookingForm.booking_date) {
      setSuccessMessage("");
      setFormError("Date is required.");
      return;
    }

    if (!isGroup && !bookingForm.booking_time) {
      setSuccessMessage("");
      setFormError("Time is required.");
      return;
    }

    try {
      setFormError("");

      const payload = {
        session_id: selectedSession.id,
        notes: bookingForm.notes,
      };

      if (isGroup) {
        payload.session_slot_id = Number(bookingForm.session_slot_id);
      } else {
        payload.booking_date = bookingForm.booking_date;
        payload.booking_time = bookingForm.booking_time;
      }

      await createBooking(payload);

      setSuccessMessage("Booking created successfully.");
      await fetchSessions();

      setBookingForm({
        session_slot_id: "",
        booking_date: "",
        booking_time: "",
        notes: "",
      });
    } catch {
      setSuccessMessage("");
      // Booking store already saves backend error state.
    }
  };

  return (
    <main className="fit-page">
      <div className="mx-auto w-full max-w-6xl px-5 py-10">
        <header className="my-8">
          <h2 className="text-4xl font-bold">Available training sessions</h2>
          <p className="mt-3 fit-text-muted">
            Choose a session and book your next workout.
          </p>
        </header>
        {isLoading && (
          <p className="fit-panel p-6 fit-text-muted">Loading sessions...</p>
        )}

        {error && (
          <p className="rounded-fit-lg border border-fit-rose/30 bg-fit-rose/10 p-6 text-fit-rose">
            {error}
          </p>
        )}

        {!isLoading && !error && sessions.length === 0 && (
          <p className="fit-panel p-6 fit-text-muted">No sessions available.</p>
        )}

        {!isLoading && !error && sessions.length > 0 && (
          <section className="grid gap-5 md:grid-cols-2">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onBook={handleBookSession}
              />
            ))}
          </section>
        )}

        {bookingError && !selectedSession ? (
          <div className="mt-6 rounded-fit-lg border border-fit-rose/30 bg-fit-rose/10 p-4 text-sm text-fit-rose">
            <p className="font-bold">{bookingError}</p>
          </div>
        ) : null}

        {selectedSession ? (
          <section ref={bookingFormRef} className="fit-panel mt-6 p-6 sm:p-8">
            <div className="mb-5">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-fit-primary">
                Book session
              </p>

              <h2 className="mt-2 text-2xl font-black">
                {selectedSession.title || selectedSession.name}
              </h2>

              <p className="mt-2 text-sm fit-text-muted">
                {selectedSession.session_type === "group"
                  ? "Choose one of the available scheduled times. Notes are optional."
                  : "Choose date and time for your booking. Notes are optional."}
              </p>
            </div>

            <form
              noValidate
              className="grid gap-4"
              onSubmit={handleBookingSubmit}
            >
              {selectedSession.session_type === "group" ? (
                <label className="grid gap-2 text-sm font-semibold">
                  Available time
                  <select
                    className="fit-input max-w-xl"
                    name="session_slot_id"
                    value={bookingForm.session_slot_id}
                    onChange={handleBookingChange}
                    required
                  >
                    <option value="">Select a session time</option>
                    {(selectedSession.slots || []).map((slot) => {
                      const isDisabled =
                        isPastSlot(slot) || slot.available_places <= 0;

                      return (
                        <option
                          disabled={isDisabled}
                          key={slot.id}
                          value={slot.id}
                        >
                          {isPastSlot(slot)
                            ? `${formatSlotLabel(slot)} · ended`
                            : slot.available_places <= 0
                              ? `${formatSlotLabel(slot)} · fully booked`
                              : formatSlotLabel(slot)}
                        </option>
                      );
                    })}
                  </select>
                </label>
              ) : (
                <>
                  <label className="grid gap-2 text-sm font-semibold">
                    Date
                    <input
                      className="fit-input"
                      name="booking_date"
                      type="date"
                      min={getTodayDateString()}
                      value={bookingForm.booking_date}
                      onChange={handleBookingChange}
                      required
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-semibold">
                    Time
                    <input
                      className="fit-input"
                      name="booking_time"
                      type="time"
                      value={bookingForm.booking_time}
                      onChange={handleBookingChange}
                      required
                    />
                  </label>
                </>
              )}

              <label className="grid gap-2 text-sm font-semibold">
                Notes
                <textarea
                  className="fit-input min-h-28 resize-none py-4 placeholder:text-zinc-600"
                  name="notes"
                  value={bookingForm.notes}
                  onChange={handleBookingChange}
                  placeholder="Optional notes"
                />
              </label>

              {formError ? (
                <div className="rounded-fit-lg border border-fit-rose/30 bg-fit-rose/10 p-4 text-sm text-fit-rose">
                  <p className="font-bold">{formError}</p>
                </div>
              ) : null}

              {bookingError ? (
                <div className="rounded-fit-lg border border-fit-rose/30 bg-fit-rose/10 p-4 text-sm text-fit-rose">
                  <p className="font-bold">{bookingError}</p>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <button
                  className="fit-btn-primary"
                  type="submit"
                  disabled={isBookingLoading}
                >
                  {isBookingLoading ? "Booking..." : "Submit booking"}
                </button>

                <button
                  className="fit-btn-secondary"
                  type="button"
                  onClick={handleCloseBookingForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        ) : null}

        {successMessage ? (
          <div className="fit-feedback-success mt-6 p-4 text-sm">
            <p className="font-bold">{successMessage}</p>
          </div>
        ) : null}
      </div>
    </main>
  );
}

export default SessionPage;
