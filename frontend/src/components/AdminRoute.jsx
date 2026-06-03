import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

function AdminRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasCheckedAuth = useAuthStore((state) => state.hasCheckedAuth);
  const user = useAuthStore((state) => state.user);

  if (!hasCheckedAuth) {
    return (
      <main className="fit-page">
        <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-5 py-10">
          <section className="fit-panel p-8 text-center sm:p-10">
            <p className="text-sm font-bold fit-text-muted">
              Checking permissions...
            </p>
          </section>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return (
      <main className="fit-page">
        <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-5 py-10">
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
          </section>
        </div>
      </main>
    );
  }

  return <Outlet />;
}

export default AdminRoute;