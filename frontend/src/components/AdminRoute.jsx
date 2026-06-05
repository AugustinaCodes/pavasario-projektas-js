import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

function AdminRoute() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasCheckedAuth = useAuthStore((state) => state.hasCheckedAuth);
  const user = useAuthStore((state) => state.user);
  const error = useAuthStore((state) => state.error);

  if (!hasCheckedAuth) {
    return (
      <main className="fit-page">
        <div className="mx-auto w-full max-w-3xl px-5 py-10 lg:py-16">
          <section className="fit-panel p-8 text-center sm:p-10">
            <p className="text-sm font-bold fit-text-muted">
              Checking permissions...
            </p>
          </section>
        </div>
      </main>
    );
  }

  if (error && !isAuthenticated) {
    return (
      <main className="fit-page">
        <div className="mx-auto w-full max-w-3xl px-5 py-10 lg:py-16">
          <section className="fit-panel p-8 text-center sm:p-10">
            <p className="mb-3 text-sm font-bold text-fit-rose">
              Unable to verify your session
            </p>
            <p className="fit-text-muted">{error.message}</p>
          </section>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user?.role !== "admin") {
    return (
      <main className="fit-page">
        <div className="mx-auto w-full max-w-3xl px-5 py-10 lg:py-16">
          <section className="fit-panel p-8 text-center sm:p-10">
            <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.24em] text-fit-primary">
              Access denied
            </p>

            <h1 className="text-4xl font-black leading-tight">
              No permission
            </h1>

            <p className="mt-4 text-base leading-7 fit-text-muted">
              You do not have permission to view the Admin Panel. This area is
              available only for admin users.
            </p>

            <Link className="fit-btn-secondary mt-6 inline-flex" to="/sessions">
              Back to sessions
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return <Outlet />;
}

export default AdminRoute;
