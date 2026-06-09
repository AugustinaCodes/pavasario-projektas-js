import { useEffect } from "react";
import { Link } from "react-router-dom";
import AnalyticsBarChart from "../components/AnalyticsBarChart";
import useAnalyticsStore from "../store/useAnalyticsStore";

const formatPercent = (value) => `${(Number(value) || 0).toFixed(1)}%`;

function AnalyticsPage() {
  const analytics = useAnalyticsStore((state) => state.myAnalytics);
  const isLoading = useAnalyticsStore((state) => state.isLoading);
  const error = useAnalyticsStore((state) => state.error);
  const fetchMyAnalytics = useAnalyticsStore((state) => state.fetchMyAnalytics);

  useEffect(() => {
    fetchMyAnalytics();
  }, [fetchMyAnalytics]);

  const summary = analytics?.summary || {};

  return (
    <main className="fit-page">
      <div className="mx-auto w-full max-w-6xl px-5 py-10">
        <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.24em] text-fit-primary">
              My analytics
            </p>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl">
              Your progress overview
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 fit-text-muted">
              See how often you book sessions, how many you complete, and which
              classes you use the most.
            </p>
          </div>

          <Link className="fit-btn-secondary inline-flex w-fit" to="/dashboard">
            Back to bookings
          </Link>
        </header>

        {isLoading && !analytics ? (
          <section className="fit-panel p-6">
            <p className="fit-text-muted">Loading analytics...</p>
          </section>
        ) : null}

        {error ? (
          <section className="mb-6 rounded-fit-lg border border-fit-rose/30 bg-fit-rose/10 p-6 text-fit-rose">
            <p className="font-bold">{error}</p>
          </section>
        ) : null}

        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="fit-panel p-5">
            <p className="fit-text-muted">Total bookings</p>
            <strong className="mt-2 block text-3xl font-black">
              {summary.total_bookings ?? 0}
            </strong>
          </article>

          <article className="fit-panel p-5">
            <p className="fit-text-muted">Upcoming sessions</p>
            <strong className="mt-2 block text-3xl font-black text-fit-amber">
              {summary.upcoming_bookings ?? 0}
            </strong>
          </article>

          <article className="fit-panel p-5">
            <p className="fit-text-muted">Attended sessions</p>
            <strong className="mt-2 block text-3xl font-black text-fit-success">
              {summary.completed_bookings ?? 0}
            </strong>
          </article>

          <article className="fit-panel p-5">
            <p className="fit-text-muted">Attendance rate</p>
            <strong className="mt-2 block text-3xl font-black text-fit-sky">
              {formatPercent(summary.attendance_rate ?? 0)}
            </strong>
          </article>
        </section>

        <section className="mb-6 grid gap-6 lg:grid-cols-2">
          <AnalyticsBarChart
            title="Booking status breakdown"
            description="Your bookings grouped by status. Completed bookings are counted as attendance."
            items={analytics?.bookingsByStatus || []}
            formatValue={(value) => `${value} bookings`}
          />

          <AnalyticsBarChart
            title="Booking activity over the last 7 days"
            description="How many bookings you created each day over the last week."
            items={analytics?.recentBookings || []}
            formatValue={(value) => `${value} bookings`}
          />
        </section>

        <section className="fit-panel p-6">
          <div className="border-b border-fit-border pb-5">
            <p className="fit-brand-kicker">Favorite sessions</p>
            <h2 className="text-2xl font-black">What you book most</h2>
            <p className="mt-2 fit-text-muted">
              Sessions you return to most often, ordered by booking volume.
            </p>
          </div>

          {analytics?.favoriteSessions?.length ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {analytics.favoriteSessions.map((session) => (
                <article
                  className="rounded-fit-lg border border-fit-border bg-white/[0.04] p-5"
                  key={session.label}
                >
                  <p className="text-lg font-black">{session.label}</p>
                  <p className="mt-2 text-sm fit-text-muted">
                    {session.value} bookings, {session.completed ?? 0} attended
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-6 fit-text-muted">
              Book a few sessions and your top sessions will appear here.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

export default AnalyticsPage;
