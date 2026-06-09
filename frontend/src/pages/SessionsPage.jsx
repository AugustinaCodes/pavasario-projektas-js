import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SessionCard from "../components/SessionCard";
import useAuthStore from "../store/useAuthStore";
import useBookingStore from "../store/useBookingStore";
import useSessionStore from "../store/useSessionStore";

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
    },
  );

  return `${date} at ${slot.start_time.slice(0, 5)} · ${
    slot.available_places
  } places available`;
};

const isPastSlot = (slot) =>
  new Date(`${slot.session_date}T${slot.start_time}`) < new Date();

const CUSTOM_SESSION_TEMPLATE = "custom";

const sessionTemplates = [
  {
    value: CUSTOM_SESSION_TEMPLATE,
    label: "Custom session",
  },
  {
    value: "personal-training",
    label: "Personal Training",
    title: "Personal Training",
    description:
      "One-on-one training session with a personal coach focused on individual goals, technique and progress.",
    price: "40",
    duration_minutes: "60",
    session_type: "individual",
    capacity: "1",
  },
  {
    value: "strength-training",
    label: "Strength Training",
    title: "Strength Training",
    description:
      "Structured strength workout focused on building muscle, improving form and increasing overall power.",
    price: "35",
    duration_minutes: "60",
    session_type: "group",
    capacity: "12",
  },
  {
    value: "weight-loss-consultation",
    label: "Weight Loss Consultation",
    title: "Weight Loss Consultation",
    description:
      "Consultation session focused on weight loss goals, training direction and basic nutrition guidance.",
    price: "30",
    duration_minutes: "45",
    session_type: "individual",
    capacity: "1",
  },
  {
    value: "beginner-gym-introduction",
    label: "Beginner Gym Introduction",
    title: "Beginner Gym Introduction",
    description:
      "Introductory gym session for beginners covering basic exercises, equipment use and safe training habits.",
    price: "25",
    duration_minutes: "45",
    session_type: "individual",
    capacity: "1",
  },
  {
    value: "mobility-and-stretching",
    label: "Mobility and Stretching",
    title: "Mobility and Stretching",
    description:
      "Low-intensity session focused on mobility, flexibility, posture and recovery.",
    price: "20",
    duration_minutes: "30",
    session_type: "group",
    capacity: "16",
  },
  {
    value: "hiit-circuit",
    label: "HIIT Circuit",
    title: "HIIT Circuit",
    description:
      "High-intensity interval training combining cardio and full-body strength exercises.",
    price: "28",
    duration_minutes: "45",
    session_type: "group",
    capacity: "14",
  },
  {
    value: "yoga-flow",
    label: "Yoga Flow",
    title: "Yoga Flow",
    description:
      "Guided yoga session focused on mobility, balance, breathing and controlled movement.",
    price: "22",
    duration_minutes: "60",
    session_type: "group",
    capacity: "16",
  },
  {
    value: "boxing-fundamentals",
    label: "Boxing Fundamentals",
    title: "Boxing Fundamentals",
    description:
      "Beginner-friendly boxing session covering stance, footwork, combinations and conditioning.",
    price: "32",
    duration_minutes: "60",
    session_type: "group",
    capacity: "10",
  },
  {
    value: "posture-assessment",
    label: "Posture Assessment",
    title: "Posture Assessment",
    description:
      "Individual posture and movement assessment with personalised exercise recommendations.",
    price: "30",
    duration_minutes: "45",
    session_type: "individual",
    capacity: "1",
  },
  {
    value: "core-and-stability",
    label: "Core and Stability",
    title: "Core and Stability",
    description:
      "Group workout focused on core strength, balance and movement control.",
    price: "24",
    duration_minutes: "45",
    session_type: "group",
    capacity: "12",
  },
];

const getTemplateValueForSession = (session = {}) =>
  sessionTemplates.find((template) => template.title === session.title)?.value ||
  CUSTOM_SESSION_TEMPLATE;

const getEmptySessionForm = (session = {}) => ({
  template: getTemplateValueForSession(session),
  title: session.title || "",
  description: session.description || "",
  price:
    session.price !== undefined && session.price !== null
      ? String(session.price)
      : "",
  duration_minutes:
    session.duration_minutes !== undefined && session.duration_minutes !== null
      ? String(session.duration_minutes)
      : "",
  session_type: session.session_type || "individual",
  capacity:
    session.capacity !== undefined && session.capacity !== null
      ? String(session.capacity)
      : "1",
});

const validateSessionForm = (formData) => {
  const errors = {};
  const title = formData.title.trim();
  const description = formData.description.trim();
  const price = Number(formData.price);
  const durationMinutes = Number(formData.duration_minutes);
  const capacity = Number(formData.capacity);

  if (!title) {
    errors.title = "Session title is required.";
  } else if (title.length < 2) {
    errors.title = "Session title must be at least 2 characters.";
  }

  if (!description) {
    errors.description = "Description is required.";
  } else if (description.length < 10) {
    errors.description = "Description must be at least 10 characters.";
  }

  if (formData.price === "") {
    errors.price = "Price is required.";
  } else if (Number.isNaN(price)) {
    errors.price = "Price must be a valid number.";
  } else if (price < 0) {
    errors.price = "Price must be zero or greater.";
  }

  if (formData.duration_minutes === "") {
    errors.duration_minutes = "Duration is required.";
  } else if (!Number.isInteger(durationMinutes)) {
    errors.duration_minutes = "Duration must be a whole number.";
  } else if (durationMinutes <= 0) {
    errors.duration_minutes = "Duration must be greater than 0.";
  }

  if (!["individual", "group"].includes(formData.session_type)) {
    errors.session_type = "Session type must be individual or group.";
  }

  if (formData.session_type === "individual" && formData.capacity !== "1") {
    errors.capacity = "One-to-one sessions must have capacity 1.";
  }

  if (formData.session_type === "group") {
    if (formData.capacity === "") {
      errors.capacity = "Capacity is required for group sessions.";
    } else if (!Number.isInteger(capacity)) {
      errors.capacity = "Capacity must be a whole number.";
    } else if (capacity <= 0) {
      errors.capacity = "Capacity must be greater than 0.";
    }
  }

  return errors;
};

function SessionPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const sessions = useSessionStore((state) => state.sessions);
  const isLoading = useSessionStore((state) => state.isLoading);
  const error = useSessionStore((state) => state.error);
  const fetchSessions = useSessionStore((state) => state.fetchSessions);
  const createSession = useSessionStore((state) => state.createSession);
  const updateSession = useSessionStore((state) => state.updateSession);
  const deleteSession = useSessionStore((state) => state.deleteSession);
  const clearSessionError = useSessionStore((state) => state.clearError);

  const createBooking = useBookingStore((state) => state.createBooking);
  const isBookingLoading = useBookingStore((state) => state.isLoading);
  const bookingError = useBookingStore((state) => state.error);
  const clearBookingError = useBookingStore((state) => state.clearError);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentUser = useAuthStore((state) => state.user);
  const isAdmin = currentUser?.role === "admin";

  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionFormMode, setSessionFormMode] = useState(null);
  const [editingSession, setEditingSession] = useState(null);
  const [sessionFormData, setSessionFormData] = useState(getEmptySessionForm());
  const [sessionFormErrors, setSessionFormErrors] = useState({});
  const [sessionMessage, setSessionMessage] = useState("");
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");

  const [bookingForm, setBookingForm] = useState({
    session_slot_id: "",
    booking_date: "",
    booking_time: "",
    notes: "",
  });

  const bookingFormRef = useRef(null);
  const sessionFormRef = useRef(null);

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

  useEffect(() => {
    if (sessionFormMode && sessionFormRef.current) {
      sessionFormRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [sessionFormMode]);

  const openCreateSessionForm = () => {
    clearSessionError();
    setSessionMessage("");
    setSessionFormMode("create");
    setEditingSession(null);
    setSessionFormData(getEmptySessionForm());
    setSessionFormErrors({});
    setSessionToDelete(null);
    setSelectedSession(null);
    setSuccessMessage("");
    setFormError("");
    clearBookingError();
  };

  const openEditSessionForm = (session) => {
    clearSessionError();
    setSessionMessage("");
    setSessionFormMode("edit");
    setEditingSession(session);
    setSessionFormData(getEmptySessionForm(session));
    setSessionFormErrors({});
    setSessionToDelete(null);
    setSelectedSession(null);
    setSuccessMessage("");
    setFormError("");
    clearBookingError();
  };

  const closeSessionForm = () => {
    setSessionFormMode(null);
    setEditingSession(null);
    setSessionFormData(getEmptySessionForm());
    setSessionFormErrors({});
    clearSessionError();
  };

  const handleSessionFormChange = (event) => {
    const { name, value } = event.target;

    if (name === "template") {
      const selectedTemplate = sessionTemplates.find(
        (template) => template.value === value,
      );

      setSessionFormData((current) => ({
        ...current,
        ...(selectedTemplate?.title
          ? {
              title: selectedTemplate.title,
              description: selectedTemplate.description,
              price: selectedTemplate.price,
              duration_minutes: selectedTemplate.duration_minutes,
              session_type: selectedTemplate.session_type,
              capacity: selectedTemplate.capacity,
            }
          : {}),
        template: value,
      }));
    } else if (name === "session_type") {
      setSessionFormData((current) => ({
        ...current,
        session_type: value,
        capacity: value === "individual" ? "1" : current.capacity,
      }));
    } else {
      setSessionFormData((current) => ({
        ...current,
        [name]: value,
      }));
    }

    if (sessionFormErrors[name]) {
      setSessionFormErrors((current) => ({
        ...current,
        [name]: undefined,
      }));
    }

    if (sessionMessage) {
      setSessionMessage("");
    }

    if (error) {
      clearSessionError();
    }
  };

  const handleSessionSubmit = async (event) => {
    event.preventDefault();

    if (!isAdmin) {
      return;
    }

    const nextErrors = validateSessionForm(sessionFormData);

    if (Object.keys(nextErrors).length > 0) {
      setSessionFormErrors(nextErrors);
      setSessionMessage("");
      return;
    }

    const payload = {
      title: sessionFormData.title.trim(),
      description: sessionFormData.description.trim(),
      price: Number(sessionFormData.price),
      duration_minutes: Number(sessionFormData.duration_minutes),
      session_type: sessionFormData.session_type,
      capacity:
        sessionFormData.session_type === "individual"
          ? 1
          : Number(sessionFormData.capacity),
    };

    try {
      setSessionFormErrors({});
      setSessionMessage("");

      if (sessionFormMode === "edit" && editingSession) {
        await updateSession(editingSession.id, payload);
        setSessionMessage("Session updated successfully.");
      } else {
        await createSession(payload);
        setSessionMessage("Session created successfully.");
      }

      closeSessionForm();
    } catch {
      // The session store already records the API error state.
    }
  };

  const handleDeleteRequest = (session) => {
    clearSessionError();
    setSessionMessage("");
    setSessionFormMode(null);
    setEditingSession(null);
    setSessionFormErrors({});
    setSessionToDelete(session);
  };

  const handleDeleteCancel = () => {
    setSessionToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!sessionToDelete) {
      return;
    }

    try {
      await deleteSession(sessionToDelete.id);
      setSessionMessage("Session deleted successfully.");
      setSessionToDelete(null);
    } catch {
      // The session store already records the API error state.
    }
  };

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
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-4xl font-bold">
                {isAdmin
                  ? "Manage training sessions"
                  : "Available training sessions"}
              </h2>

              <p className="mt-3 fit-text-muted">
                {isAdmin
                  ? "Create, edit and delete sessions without leaving the Sessions page."
                  : "Choose a session and book your next workout."}
              </p>
            </div>

            {isAdmin ? (
              <button
                className="fit-btn-primary w-full lg:w-auto"
                type="button"
                onClick={openCreateSessionForm}
              >
                Create New Session
              </button>
            ) : null}
          </div>
        </header>

        {isLoading ? (
          <p className="fit-panel p-6 fit-text-muted">Loading sessions...</p>
        ) : null}

        {error ? (
          <p className="rounded-fit-lg border border-fit-rose/30 bg-fit-rose/10 p-6 text-fit-rose">
            {error}
          </p>
        ) : null}

        {!isLoading && !error && sessions.length === 0 ? (
          <div className="fit-panel p-6">
            <p className="fit-text-muted">
              {isAdmin
                ? "No sessions yet. Create one to get started."
                : "No sessions available."}
            </p>
          </div>
        ) : null}

        {!isLoading && !error && sessions.length > 0 ? (
          <section className="grid gap-5 md:grid-cols-2">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                isAdmin={isAdmin}
                onBook={handleBookSession}
                onEdit={openEditSessionForm}
                onDelete={handleDeleteRequest}
              />
            ))}
          </section>
        ) : null}

        {sessionMessage ? (
          <div className="fit-feedback-success mt-6 p-4 text-sm">
            <p className="font-bold">{sessionMessage}</p>
          </div>
        ) : null}

        {isAdmin && sessionFormMode ? (
          <section ref={sessionFormRef} className="fit-panel mt-6 p-6 sm:p-8">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-fit-primary">
                  {sessionFormMode === "edit"
                    ? "Edit session"
                    : "Create session"}
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  {sessionFormMode === "edit"
                    ? editingSession?.title || "Edit session"
                    : "Create a new training session"}
                </h2>

                <p className="mt-2 text-sm fit-text-muted">
                  {sessionFormMode === "edit"
                    ? "Update the core session details and keep the list in sync immediately."
                    : "Add a new session using the FitBook shared design system."}
                </p>
              </div>

              <button
                className="fit-btn-secondary w-full sm:w-auto"
                type="button"
                onClick={closeSessionForm}
              >
                Cancel
              </button>
            </div>

            <form
              noValidate
              className="grid gap-4"
              onSubmit={handleSessionSubmit}
            >
              <label className="grid gap-2 text-sm font-semibold">
                Session template
                <select
                  className="fit-input fit-booking-select"
                  name="template"
                  value={sessionFormData.template}
                  onChange={handleSessionFormChange}
                >
                  {sessionTemplates.map((template) => (
                    <option key={template.value} value={template.value}>
                      {template.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-semibold">
                Session title
                <input
                  className={`fit-input ${
                    sessionFormErrors.title ? "border-fit-rose" : ""
                  }`}
                  name="title"
                  type="text"
                  value={sessionFormData.title}
                  onChange={handleSessionFormChange}
                  placeholder="Strength Training"
                />
                {sessionFormErrors.title ? (
                  <p className="text-xs leading-5 text-fit-rose">
                    {sessionFormErrors.title}
                  </p>
                ) : null}
              </label>

              <label className="grid gap-2 text-sm font-semibold">
                Description
                <textarea
                  className={`fit-input min-h-32 resize-none py-4 placeholder:text-zinc-600 ${
                    sessionFormErrors.description ? "border-fit-rose" : ""
                  }`}
                  name="description"
                  value={sessionFormData.description}
                  onChange={handleSessionFormChange}
                  placeholder="Describe the workout, goals and what the session includes"
                />
                {sessionFormErrors.description ? (
                  <p className="text-xs leading-5 text-fit-rose">
                    {sessionFormErrors.description}
                  </p>
                ) : null}
              </label>

              <div
                className={`grid gap-4 ${
                  sessionFormData.session_type === "group"
                    ? "md:grid-cols-2"
                    : ""
                }`}
              >
                <label className="grid gap-2 text-sm font-semibold">
                  Session type
                  <select
                    className={`fit-input fit-booking-select ${
                      sessionFormErrors.session_type ? "border-fit-rose" : ""
                    }`}
                    name="session_type"
                    value={sessionFormData.session_type}
                    onChange={handleSessionFormChange}
                  >
                    <option value="individual">Individual / One-to-one</option>
                    <option value="group">Group</option>
                  </select>
                  {sessionFormErrors.session_type ? (
                    <p className="text-xs leading-5 text-fit-rose">
                      {sessionFormErrors.session_type}
                    </p>
                  ) : null}
                </label>

                {sessionFormData.session_type === "group" ? (
                  <label className="grid gap-2 text-sm font-semibold">
                    Capacity
                    <input
                      className={`fit-input ${
                        sessionFormErrors.capacity ? "border-fit-rose" : ""
                      }`}
                      name="capacity"
                      type="number"
                      min="1"
                      step="1"
                      value={sessionFormData.capacity}
                      onChange={handleSessionFormChange}
                      placeholder="12"
                    />
                    {sessionFormErrors.capacity ? (
                      <p className="text-xs leading-5 text-fit-rose">
                        {sessionFormErrors.capacity}
                      </p>
                    ) : null}
                  </label>
                ) : null}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold">
                  Price
                  <input
                    className={`fit-input ${
                      sessionFormErrors.price ? "border-fit-rose" : ""
                    }`}
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={sessionFormData.price}
                    onChange={handleSessionFormChange}
                    placeholder="35"
                  />
                  {sessionFormErrors.price ? (
                    <p className="text-xs leading-5 text-fit-rose">
                      {sessionFormErrors.price}
                    </p>
                  ) : null}
                </label>

                <label className="grid gap-2 text-sm font-semibold">
                  Duration
                  <input
                    className={`fit-input ${
                      sessionFormErrors.duration_minutes
                        ? "border-fit-rose"
                        : ""
                    }`}
                    name="duration_minutes"
                    type="number"
                    min="1"
                    step="1"
                    value={sessionFormData.duration_minutes}
                    onChange={handleSessionFormChange}
                    placeholder="60"
                  />
                  {sessionFormErrors.duration_minutes ? (
                    <p className="text-xs leading-5 text-fit-rose">
                      {sessionFormErrors.duration_minutes}
                    </p>
                  ) : null}
                </label>
              </div>

              {error ? (
                <div className="rounded-fit-lg border border-fit-rose/30 bg-fit-rose/10 p-4 text-sm text-fit-rose">
                  <p className="font-bold">{error}</p>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <button
                  className="fit-btn-primary"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading
                    ? sessionFormMode === "edit"
                      ? "Saving..."
                      : "Creating..."
                    : "Save"}
                </button>

                <button
                  className="fit-btn-secondary"
                  type="button"
                  onClick={closeSessionForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        ) : null}

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
      className="fit-input fit-booking-select max-w-xl"
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
        onClick={(event) => event.currentTarget.showPicker?.()}
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
        onClick={(event) => event.currentTarget.showPicker?.()}
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

        {sessionToDelete ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 py-8 backdrop-blur-sm"
            onClick={handleDeleteCancel}
          >
            <div
              className="fit-panel w-full max-w-lg p-6 sm:p-8"
              onClick={(event) => event.stopPropagation()}
            >
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-fit-rose">
                Delete session
              </p>

              <h2 className="mt-3 text-2xl font-black">
                Remove {sessionToDelete.title}?
              </h2>

              <p className="mt-3 fit-text-muted">
                This will permanently delete the session and any related slots.
                Bookings linked to it will also be removed.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  className="fit-btn-danger px-5 py-3"
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete session"}
                </button>

                <button
                  className="fit-btn-secondary"
                  type="button"
                  onClick={handleDeleteCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}

export default SessionPage;
