import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useBookingStore from "../store/useBookingStore";
import Calendar from "../components/Calendar";

const bookingStatuses = ["pending", "confirmed", "completed", "cancelled"];

const getBookingSessionTitle = (booking) =>
  booking.session?.title ||
  booking.session?.name ||
  booking.session_title ||
  booking.session_name ||
  booking.title ||
  booking.name ||
  "Unknown session";

const getBookingSearchText = (booking) =>
  [
    getBookingSessionTitle(booking),
    booking.session?.title,
    booking.session?.name,
    booking.session_title,
    booking.session_name,
    booking.title,
    booking.name,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

function DashboardPage() {
  const bookings = useBookingStore((state) => state.bookings);
  const isLoading = useBookingStore((state) => state.isLoading);
  const error = useBookingStore((state) => state.error);
  const fetchMyBookings = useBookingStore((state) => state.fetchMyBookings);
  const cancelMyBooking = useBookingStore((state) => state.cancelMyBooking);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  const filteredBookings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesDate =
        !selectedDate || booking.booking_date === selectedDate;
      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;
      const matchesSearch =
        !query || getBookingSearchText(booking).includes(query);

      return matchesDate && matchesStatus && matchesSearch;
    });
  }, [bookings, searchQuery, selectedDate, statusFilter]);

  const hasActiveFilters = Boolean(
    selectedDate || searchQuery.trim() || statusFilter !== "all",
  );

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending",
  ).length;
  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed",
  ).length;
  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed",
  ).length;

  const getStatusClassName = (status) =>
    `fit-status fit-status-${status || "pending"}`;

  const canCancelBooking = (status) =>
    status === "pending" || status === "confirmed";

  const handleResetFilters = () => {
    setSelectedDate("");
    setSearchQuery("");
    setStatusFilter("all");
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await cancelMyBooking(bookingId);
    } catch {
      // Booking store already keeps the error.
    }
  };

  return (
    <main className="fit-page">
      <div className="mx-auto w-full max-w-6xl px-5 py-10">
        <header className="my-8">
          <h2 className="text-4xl font-black">Your training schedule</h2>

          <p className="mt-3 fit-text-muted">
            Track your booked sessions, statuses and cancellation options.
          </p>
        </header>
        <div className="mb-6">
          <Calendar
            bookings={bookings}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          {selectedDate ? (
            <button
              className="fit-btn-secondary mt-4"
              type="button"
              onClick={() => setSelectedDate("")}
            >
              Show all bookings
            </button>
          ) : null}
        </div>

        <section className="fit-panel mb-6 p-6">
          <div className="flex flex-col gap-4 border-b border-fit-border pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="fit-brand-kicker">Filter bookings</p>
              <h3 className="text-2xl font-black">Refine your schedule</h3>

              <p className="mt-2 fit-text-muted">
                Search by session title, filter by status and combine it with a
                date selection.
              </p>
            </div>

            {hasActiveFilters ? (
              <button
                className="fit-btn-secondary w-full lg:w-auto"
                type="button"
                onClick={handleResetFilters}
              >
                Reset filters
              </button>
            ) : null}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
            <label className="grid gap-2 text-sm font-semibold">
              Session search
              <input
                className="fit-input"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by session title or name"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold">
              Booking status
              <select
                className="fit-select fit-booking-select"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">All statuses</option>

                {bookingStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm fit-text-muted">
            <span>
              Showing {filteredBookings.length} of {bookings.length} bookings.
            </span>

            {selectedDate ? (
              <span className="rounded-full border border-fit-primary/20 bg-fit-primary/10 px-3 py-1 font-semibold text-fit-primary">
                Date: {selectedDate}
              </span>
            ) : null}
          </div>
        </section>

        <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="fit-panel p-5">
            <p className="fit-text-muted">Total bookings</p>
            <strong className="mt-2 block text-3xl font-black">
              {totalBookings}
            </strong>
          </article>

          <article className="fit-panel p-5">
            <p className="fit-text-muted">Pending</p>
            <strong className="mt-2 block text-3xl font-black text-fit-amber">
              {pendingBookings}
            </strong>
          </article>

          <article className="fit-panel p-5">
            <p className="fit-text-muted">Confirmed</p>
            <strong className="mt-2 block text-3xl font-black text-fit-primary">
              {confirmedBookings}
            </strong>
          </article>

          <article className="fit-panel p-5">
            <p className="fit-text-muted">Completed</p>
            <strong className="mt-2 block text-3xl font-black text-fit-sky">
              {completedBookings}
            </strong>
          </article>
        </section>
        {isLoading ? (
          <section className="fit-panel p-6">
            <p className="fit-text-muted">Loading bookings...</p>
          </section>
        ) : null}

        {error ? (
          <section className="rounded-fit-lg border border-fit-rose/30 bg-fit-rose/10 p-6 text-fit-rose">
            <p className="font-bold">{error}</p>
          </section>
        ) : null}

        {!isLoading && !error && filteredBookings.length === 0 ? (
          <section className="fit-panel p-8">
            <h2 className="text-2xl font-black">
              {hasActiveFilters
                ? "No bookings match your filters"
                : selectedDate
                  ? "No bookings on this day"
                  : "No bookings yet"}
            </h2>

            <p className="mt-3 fit-text-muted">
              {hasActiveFilters
                ? "Try another session title or status, or reset the filters to see everything again."
                : selectedDate
                  ? "Choose another day or show all bookings."
                  : "Book a training session to see it here."}
            </p>

            {hasActiveFilters ? (
              <button
                className="fit-btn-primary mt-6 inline-flex"
                type="button"
                onClick={handleResetFilters}
              >
                Clear filters
              </button>
            ) : selectedDate ? null : (
              <Link className="fit-btn-primary mt-6 inline-flex" to="/sessions">
                Browse sessions
              </Link>
            )}
          </section>
        ) : null}

        {!isLoading && !error && filteredBookings.length > 0 ? (
          <section className="grid gap-5 md:grid-cols-2">
            {filteredBookings.map((booking) => (
              <article
                className="fit-card flex flex-col gap-4"
                key={booking.id}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      {getBookingSessionTitle(booking)}
                    </h3>

                    <p className="mt-1 text-sm font-semibold text-fit-primary">
                      {booking.session_type === "group"
                        ? "Group"
                        : "One-to-one"}
                    </p>

                    <p className="mt-2 fit-text-muted">
                      {booking.booking_date} at {booking.booking_time}
                    </p>
                  </div>

                  <span className={getStatusClassName(booking.status)}>
                    {booking.status}
                  </span>
                </div>
                {booking.notes ? (
                  <p className="rounded-fit-md bg-white/[0.04] p-4 fit-text-muted">
                    {booking.notes}
                  </p>
                ) : (
                  <p className="rounded-fit-md bg-white/[0.04] p-4 fit-text-muted">
                    No notes added.
                  </p>
                )}
                {canCancelBooking(booking.status) ? (
                  <div className="mt-auto">
                    <button
                      className="fit-btn-secondary border-fit-rose/30 text-fit-rose"
                      type="button"
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={isLoading}
                    >
                      Cancel booking
                    </button>
                  </div>
                ) : null}
              </article>
            ))}
          </section>
        ) : null}
      </div>
    </main>
  );
}

export default DashboardPage;
