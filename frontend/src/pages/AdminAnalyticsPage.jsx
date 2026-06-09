import { useEffect } from "react";
import { Link } from "react-router-dom";
import AnalyticsBarChart from "../components/AnalyticsBarChart";
import useAnalyticsStore from "../store/useAnalyticsStore";

const formatPercent = (value) => `${(Number(value) || 0).toFixed(1)}%`;

function AdminAnalyticsPage() {
  const analytics = useAnalyticsStore((state) => state.adminAnalytics);
  const isLoading = useAnalyticsStore((state) => state.isLoading);
  const error = useAnalyticsStore((state) => state.error);
  const fetchAdminAnalytics = useAnalyticsStore(
    (state) => state.fetchAdminAnalytics,
  );

  useEffect(() => {
    fetchAdminAnalytics();
  }, [fetchAdminAnalytics]);

  const summary = analytics?.summary || {};
  const attendanceRate = summary.total_bookings
    ? (Number(summary.completed_bookings || 0) /
        Math.max(
          Number(summary.total_bookings || 0) -
            Number(summary.cancelled_bookings || 0),
          1,
        )) *
      100
    : 0;

  return (
    <main className="fit-page">
      <div className="mx-auto w-full max-w-7xl px-5 py-10">
        <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.24em] text-fit-primary">
              Admin analytics
            </p>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl">
              Reporting overview
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 fit-text-muted">
              Track user growth, booking flow and session demand in one place.
            </p>
          </div>

          <Link className="fit-btn-secondary inline-flex w-fit" to="/admin">
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

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="fit-panel p-5">
            <p className="text-sm font-bold uppercase tracking-[0.18em] fit-text-muted">
              Total users
            </p>
            <p className="mt-3 text-3xl font-black">
              {summary.total_users ?? 0}
            </p>
            <p className="mt-2 text-sm fit-text-muted">
              {summary.admin_users ?? 0} admins, {summary.regular_users ?? 0}{" "}
              regular users
            </p>
          </article>

          <article className="fit-panel p-5">
            <p className="text-sm font-bold uppercase tracking-[0.18em] fit-text-muted">
              Total sessions
            </p>
            <p className="mt-3 text-3xl font-black">
              {summary.total_sessions ?? 0}
            </p>
            <p className="mt-2 text-sm fit-text-muted">
              {summary.group_sessions ?? 0} group,{" "}
              {summary.individual_sessions ?? 0} individual
            </p>
          </article>

          <article className="fit-panel p-5">
            <p className="text-sm font-bold uppercase tracking-[0.18em] fit-text-muted">
              Total bookings
            </p>
            <p className="mt-3 text-3xl font-black">
              {summary.total_bookings ?? 0}
            </p>
            <p className="mt-2 text-sm fit-text-muted">
              {summary.new_users_last_30_days ?? 0} new users in 30 days
            </p>
          </article>

          <article className="fit-panel p-5">
            <p className="text-sm font-bold uppercase tracking-[0.18em] fit-text-muted">
              Attendance rate
            </p>
            <p className="mt-3 text-3xl font-black">
              {formatPercent(attendanceRate)}
            </p>
            <p className="mt-2 text-sm fit-text-muted">
              Completed bookings treated as attendance
            </p>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <AnalyticsBarChart
            title="Bookings by status"
            description="How the booking queue is currently distributed."
            items={analytics?.bookingsByStatus || []}
            formatValue={(value) => `${value} bookings`}
          />

          <AnalyticsBarChart
            title="New users over the last 7 days"
            description="Recent sign-up volume across the latest week."
            items={analytics?.userGrowth || []}
            formatValue={(value) => `${value} users`}
          />

          <AnalyticsBarChart
            title="Most booked sessions"
            description="Sessions with the highest booking volume overall."
            items={analytics?.topSessions || []}
            formatValue={(value) => `${value} bookings`}
          />

          <AnalyticsBarChart
            title="Booking activity over the last 7 days"
            description="Daily booking volume across the latest week."
            items={analytics?.bookingTrend || []}
            formatValue={(value) => `${value} bookings`}
          />
        </section>
      </div>
    </main>
  );
}

export default AdminAnalyticsPage;
