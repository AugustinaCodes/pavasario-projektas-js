import { useEffect, useMemo, useState } from "react";
import useBookingStore from "../store/useBookingStore";

const getBookingStatusClass = (status) => {
  if (status === "pending") {
    return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
  }

  if (status === "confirmed") {
    return "border-blue-500/30 bg-blue-500/10 text-blue-300";
  }

  if (status === "completed") {
    return "border-green-500/30 bg-green-500/10 text-green-400";
  }

  if (status === "cancelled") {
    return "border-fit-rose/30 bg-fit-rose/10 text-fit-rose";
  }

  return "border-fit-border bg-white/5 fit-text-muted";
};

const getSessionTitle = (booking) =>
  booking.session?.title ||
  booking.session_title ||
  booking.title ||
  "Unknown session";

const getUserName = (booking) =>
  booking.user?.name || booking.user_name || booking.name || "Unknown user";

const getUserEmail = (booking) =>
  booking.user?.email || booking.user_email || booking.email || "No email";

function AdminPage() {
  const bookings = useBookingStore((state) => state.bookings);
  const isLoading = useBookingStore((state) => state.isLoading);
  const error = useBookingStore((state) => state.error);
  const fetchAllBookings = useBookingStore((state) => state.fetchAllBookings);
  const confirmBooking = useBookingStore((state) => state.confirmBooking);
  const completeBooking = useBookingStore((state) => state.completeBooking);
  const cancelBookingAsAdmin = useBookingStore(
    (state) => state.cancelBookingAsAdmin
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("upcoming");

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

  const filteredBookings = useMemo(() => {
  const query = searchQuery.trim().toLowerCase();

  const getBookingDateValue = (booking) => {
    const date = booking.booking_date || booking.date || "";
    const time = booking.booking_time || booking.time || "00:00";

    return new Date(`${date}T${time}`).getTime();
  };

  const filtered = bookings.filter((booking) => {
    const statusMatches =
      statusFilter === "all" || booking.status === statusFilter;

    const searchableText = [
      getUserName(booking),
      getUserEmail(booking),
      getSessionTitle(booking),
      booking.booking_date,
      booking.booking_time,
      booking.notes,
      booking.status,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const searchMatches = !query || searchableText.includes(query);

    return statusMatches && searchMatches;
  });

  return [...filtered].sort((a, b) => {
    const aDate = getBookingDateValue(a);
    const bDate = getBookingDateValue(b);

    if (sortBy === "oldest") {
      return aDate - bDate;
    }

    if (sortBy === "newest") {
      return bDate - aDate;
    }

    return aDate - bDate;
  });
}, [bookings, searchQuery, statusFilter, sortBy]);

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;
  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed"
  ).length;
  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  const handleConfirm = async (bookingId) => {
    try {
      await confirmBooking(bookingId);
    } catch {
      // Booking store already saves backend error state.
    }
  };

  const handleComplete = async (bookingId) => {
    try {
      await completeBooking(bookingId);
    } catch {
      // Booking store already saves backend error state.
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await cancelBookingAsAdmin(bookingId);
    } catch {
      // Booking store already saves backend error state.
    }
  };

  

  return (
  <main className="fit-page">
    <div className="mx-auto w-full max-w-7xl px-5 py-10">
      <header className="mb-8">
        <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.24em] text-fit-primary">
          Admin panel
        </p>

        <h1 className="text-4xl font-black leading-tight sm:text-5xl">
          Booking management
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-7 fit-text-muted">
          Review all bookings, track booking status and manage user booking
          requests.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="fit-panel p-5">
          <p className="text-sm font-bold uppercase tracking-[0.18em] fit-text-muted">
            Total
          </p>
          <p className="mt-3 text-3xl font-black">{totalBookings}</p>
        </article>

        <article className="fit-panel p-5">
          <p className="text-sm font-bold uppercase tracking-[0.18em] fit-text-muted">
            Pending
          </p>
          <p className="mt-3 text-3xl font-black">{pendingBookings}</p>
        </article>

        <article className="fit-panel p-5">
          <p className="text-sm font-bold uppercase tracking-[0.18em] fit-text-muted">
            Confirmed
          </p>
          <p className="mt-3 text-3xl font-black">{confirmedBookings}</p>
        </article>

        <article className="fit-panel p-5">
          <p className="text-sm font-bold uppercase tracking-[0.18em] fit-text-muted">
            Completed
          </p>
          <p className="mt-3 text-3xl font-black">{completedBookings}</p>
        </article>
      </section>

      {error ? (
        <div className="mt-6 rounded-fit-lg border border-fit-rose/30 bg-fit-rose/10 p-4 text-sm text-fit-rose">
          <p className="font-bold">{error}</p>
        </div>
      ) : null}

      <section className="fit-panel mt-8 p-0">
        <div className="border-b border-fit-border p-6">
          <h2 className="text-2xl font-black">All bookings</h2>
          <p className="mt-2 text-sm fit-text-muted">
            Confirm, complete or cancel user bookings.
          </p>
        </div>

        <div className="grid gap-4 border-b border-fit-border p-6 lg:grid-cols-[1fr_260px_260px]">
          <label className="grid gap-2 text-sm font-semibold">
            Search bookings
            <input
              className="fit-input"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by user, email, session, notes..."
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold">
  Status
  <div className="relative">
    <select
      className="h-14 w-full appearance-none rounded-full border border-fit-primary/60 bg-[#151b23] px-6 pr-12 text-sm font-black text-white outline-none transition hover:border-fit-primary focus:border-fit-primary focus:ring-2 focus:ring-fit-primary/20"
      value={statusFilter}
      onChange={(event) => setStatusFilter(event.target.value)}
    >
      <option className="bg-[#151b23] text-white" value="all">
        All statuses
      </option>
      <option className="bg-[#151b23] text-white" value="pending">
        Pending
      </option>
      <option className="bg-[#151b23] text-white" value="confirmed">
        Confirmed
      </option>
      <option className="bg-[#151b23] text-white" value="completed">
        Completed
      </option>
      <option className="bg-[#151b23] text-white" value="cancelled">
        Cancelled
      </option>
    </select>

    <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-fit-primary">
      ▾
    </span>
  </div>
</label>

<label className="grid gap-2 text-sm font-semibold">
  Sort by
  <div className="relative">
    <select
      className="h-14 w-full appearance-none rounded-full border border-fit-primary/60 bg-[#151b23] px-6 pr-12 text-sm font-black text-white outline-none transition hover:border-fit-primary focus:border-fit-primary focus:ring-2 focus:ring-fit-primary/20"
      value={sortBy}
      onChange={(event) => setSortBy(event.target.value)}
    >
      <option className="bg-[#151b23] text-white" value="upcoming">
        Upcoming first
      </option>
      <option className="bg-[#151b23] text-white" value="newest">
        Newest first
      </option>
      <option className="bg-[#151b23] text-white" value="oldest">
        Oldest first
      </option>
    </select>

    <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-fit-primary">
      ▾
    </span>
  </div>
</label>
        </div>

        <p className="border-b border-fit-border px-6 py-3 text-sm fit-text-muted">
          Showing {filteredBookings.length} of {bookings.length} bookings.
        </p>

        {isLoading ? (
          <p className="p-6 fit-text-muted">Loading bookings...</p>
        ) : null}

        {!isLoading && filteredBookings.length === 0 ? (
          <p className="p-6 fit-text-muted">No bookings found.</p>
        ) : null}

        {!isLoading && filteredBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-fit-border fit-text-muted">
                  <th className="p-4 font-bold">User</th>
                  <th className="p-4 font-bold">Session</th>
                  <th className="p-4 font-bold">Date</th>
                  <th className="p-4 font-bold">Time</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Notes</th>
                  <th className="p-4 font-bold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => (
                  <tr
                    className="border-b border-fit-border last:border-b-0"
                    key={booking.id}
                  >
                    <td className="p-4 align-top">
                      <p className="font-bold">{getUserName(booking)}</p>
                      <p className="mt-1 text-xs fit-text-muted">
                        {getUserEmail(booking)}
                      </p>
                    </td>

                    <td className="p-4 align-top">
                      <p className="font-bold">{getSessionTitle(booking)}</p>
                    </td>

                    <td className="p-4 align-top fit-text-muted">
                      {booking.booking_date || booking.date || "-"}
                    </td>

                    <td className="p-4 align-top fit-text-muted">
                      {booking.booking_time || booking.time || "-"}
                    </td>

                    <td className="p-4 align-top">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${getBookingStatusClass(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td className="max-w-xs p-4 align-top fit-text-muted">
                      {booking.notes || "-"}
                    </td>

                    <td className="p-4 align-top">
  <div className="flex min-w-48 flex-col gap-2">
    {booking.status === "pending" ? (
      <>
        <button
          className="inline-flex items-center justify-center rounded-full bg-fit-primary px-4 py-2 text-xs font-black text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          disabled={isLoading}
          onClick={() => handleConfirm(booking.id)}
        >
          Confirm booking
        </button>

        <button
          className="inline-flex items-center justify-center rounded-full border border-fit-rose/40 bg-fit-rose/10 px-4 py-2 text-xs font-black text-fit-rose transition hover:bg-fit-rose/20 disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          disabled={isLoading}
          onClick={() => handleCancel(booking.id)}
        >
          Cancel booking
        </button>
      </>
    ) : null}

    {booking.status === "confirmed" ? (
      <>
        <button
          className="inline-flex items-center justify-center rounded-full bg-green-500 px-4 py-2 text-xs font-black text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          disabled={isLoading}
          onClick={() => handleComplete(booking.id)}
        >
          Mark completed
        </button>

        <button
          className="inline-flex items-center justify-center rounded-full border border-fit-rose/40 bg-fit-rose/10 px-4 py-2 text-xs font-black text-fit-rose transition hover:bg-fit-rose/20 disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          disabled={isLoading}
          onClick={() => handleCancel(booking.id)}
        >
          Cancel booking
        </button>
      </>
    ) : null}

    {booking.status === "completed" ? (
      <div className="rounded-fit-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-xs font-bold text-green-400">
        Booking completed
      </div>
    ) : null}

    {booking.status === "cancelled" ? (
      <div className="rounded-fit-lg border border-fit-rose/20 bg-fit-rose/10 px-4 py-3 text-xs font-bold text-fit-rose">
        Booking cancelled
      </div>
    ) : null}
  </div>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </div>
  </main>
);
}

export default AdminPage;