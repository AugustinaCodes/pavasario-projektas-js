import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (name === "password" || name === "confirmPassword") {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    try {
      const { confirmPassword, ...payload } = formData;
      const user = await register(payload);

      if (user) {
        navigate("/dashboard", { replace: true });
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
              Create account
            </p>
            <h1 className="max-w-lg text-4xl font-black leading-tight sm:text-5xl">
              Start booking workouts with FitBook.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 fit-text-muted">
              Register a FitBook profile to save bookings, follow your schedule
              and keep your session history in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <Link className="fit-btn-secondary" to="/login">
                I already have an account
              </Link>
              <Link className="fit-btn-secondary" to="/sessions">
                Browse sessions
              </Link>
            </div>
          </section>

          <section className="fit-panel p-6 sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-fit-primary">
                Register
              </p>
              <h2 className="mt-2 text-3xl font-black">Create your profile</h2>
              <p className="mt-2 text-sm fit-text-muted">
                Add your details below to start using FitBook.
              </p>
            </div>

            <form className="grid gap-4" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm font-semibold">
                Name
                <input
                  className="fit-input"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Lina User"
                  required
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold">
                Email
                <input
                  className="fit-input"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="lina@example.com"
                  required
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold">
                Password
                <input
                  className="fit-input"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password123!"
                  required
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold">
                Confirm password
                <input
                  className="fit-input"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Password123!"
                  required
                />
              </label>

              <p className="text-xs leading-5 fit-text-muted">
                Password must include at least one uppercase letter, one
                lowercase letter, one number and one special character.
              </p>

              {confirmPasswordError ? (
                <div className="rounded-fit-lg border border-fit-amber/30 bg-fit-amber/10 p-4 text-sm text-fit-amber">
                  {confirmPasswordError}
                </div>
              ) : null}

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
                {isLoading ? "Creating account..." : "Create account"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

export default RegisterPage;
