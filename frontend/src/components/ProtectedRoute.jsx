import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasCheckedAuth = useAuthStore((state) => state.hasCheckedAuth);
  const error = useAuthStore((state) => state.error);
  const location = useLocation();

  if (!hasCheckedAuth) {
    return (
      <main className="fit-page">
        <div className="mx-auto w-full max-w-3xl px-5 py-10 lg:py-16">
          <section className="fit-panel p-8 text-center sm:p-10">
            <p className="text-sm font-bold fit-text-muted">
              Checking session...
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

  return <Outlet />;
}

export default ProtectedRoute;
