import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const user = await login(formData);

      if (user) {
        const destination = location.state?.from?.pathname || "/dashboard";

        navigate(destination, { replace: true });
      }
    } catch {
      // The store already saves the backend error state.
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="fit-page">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-5 py-10">
        <div className="grid w-full gap-7 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-fit-xl border border-fit-border bg-white/[0.04] p-8 lg:p-10">
            <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.24em] text-fit-primary">
              Welcome back
            </p>
            <h1 className="max-w-lg text-4xl font-black leading-tight sm:text-5xl">
              Log in to manage your training schedule.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 fit-text-muted">
              Use your FitBook account to review upcoming sessions, manage your
              bookings and keep your schedule in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <Link className="fit-btn-secondary" to="/register">
                Create account
              </Link>
              <Link className="fit-btn-secondary" to="/sessions">
                Browse sessions
              </Link>
            </div>
          </section>

          <section className="fit-panel p-6 sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-fit-primary">
                Login
              </p>
              <h2 className="mt-2 text-3xl font-black">Enter your account</h2>
              <p className="mt-2 text-sm fit-text-muted">
                Use the email and password connected to your FitBook profile.
              </p>
            </div>

            <form className="grid gap-4" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm font-semibold">
                Email
                <input
                  className="fit-input"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.smith@example.com"
                  required
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold">
                Password
                <input
                  className="fit-input"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </label>

              {error ? (
                <div className="grid gap-2 rounded-fit-lg border border-fit-rose/30 bg-fit-rose/10 p-4 text-sm text-fit-rose">
                  <p className="font-bold">{error.message}</p>
                  {error.errors?.length ? (
                    <ul className="grid gap-1">
                      {error.errors.map((item) => (
                        <li key={`${item.field}-${item.message}`}>
                          {item.field ? `${item.field}: ` : ""}
                          {item.message}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}

              <button
                className="fit-btn-primary mt-2 inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
