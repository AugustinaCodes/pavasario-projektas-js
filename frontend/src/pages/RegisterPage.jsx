import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import useAuthStore from "../store/useAuthStore";

const getFieldErrors = (error) => {
  const fieldErrors = {};

  if (!error?.errors?.length) {
    return fieldErrors;
  }

  error.errors.forEach((item) => {
    const field = item.field?.replace("body.", "");

    if (field) {
      fieldErrors[field] = item.message;
    }
  });

  return fieldErrors;
};

function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentUser = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const fieldErrors = getFieldErrors(error);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (error) {
      clearError();
    }

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
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      const user = await register(payload);

      if (user) {
        navigate("/dashboard", { replace: true });
      }
    } catch {
      // The store already saves the backend error state.
    }
  };

  if (isAuthenticated) {
    return (
      <Navigate
        to={currentUser?.role === "admin" ? "/admin" : "/dashboard"}
        replace
      />
    );
  }

  return (
    <main className="fit-page fit-auth-page">
      <div className="mx-auto flex w-full max-w-6xl flex-1 items-center px-5 py-10 lg:-translate-y-12">
        <div className="grid w-full gap-7 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="flex flex-col justify-center rounded-fit-xl border border-fit-border bg-fit-surface p-8 lg:p-10">
            <div className="-translate-y-6">
              <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.24em] text-fit-primary">
                Create account
              </p>
              <h1 className="max-w-lg text-4xl font-black leading-tight sm:text-5xl">
                Start booking workouts with FitBook.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 fit-text-muted">
                Register a FitBook profile to save bookings, follow your
                schedule and keep your session history in one place.
              </p>

              <div className="mt-8 flex flex-wrap gap-3 text-sm">
                <Link className="fit-btn-secondary" to="/login">
                  I already have an account
                </Link>
                <Link className="fit-btn-secondary" to="/sessions">
                  Browse sessions
                </Link>
              </div>
            </div>
          </section>

          <section className="fit-panel p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-fit-primary">
                Create your profile
              </h2>
              <p className="mt-2 text-sm fit-text-muted">
                Add your details below to start using FitBook.
              </p>
            </div>

            <form noValidate className="grid gap-4" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm font-semibold">
                Name
                <input
                  className={`fit-input ${
                    fieldErrors.name ? "border-fit-rose" : ""
                  }`}
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Lina User"
                  required
                />
                {fieldErrors.name ? (
                  <p className="text-xs leading-5 text-fit-rose">
                    {fieldErrors.name}
                  </p>
                ) : null}
              </label>

              <label className="grid gap-2 text-sm font-semibold">
                Email
                <input
                  className={`fit-input ${
                    fieldErrors.email ? "border-fit-rose" : ""
                  }`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="lina@example.com"
                  required
                />
                {fieldErrors.email ? (
                  <p className="text-xs leading-5 text-fit-rose">
                    {fieldErrors.email}
                  </p>
                ) : null}
              </label>

              <label className="grid gap-2 text-sm font-semibold">
                Password
                <PasswordInput
                  className={fieldErrors.password ? "border-fit-rose" : ""}
                  name="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password123!"
                  required
                />
                {fieldErrors.password ? (
                  <p className="text-xs leading-5 text-fit-rose">
                    {fieldErrors.password}
                  </p>
                ) : (
                  <p className="text-xs leading-5 fit-text-muted">
                    Password must be 8-64 characters and include at least one
                    uppercase letter, one lowercase letter, one number and one
                    special character.
                  </p>
                )}
              </label>

              <label className="grid gap-2 text-sm font-semibold">
                Confirm password
                <PasswordInput
                  className={confirmPasswordError ? "border-fit-amber" : ""}
                  visibilityLabel="confirm password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Password123!"
                  required
                />
                {confirmPasswordError ? (
                  <p className="text-xs leading-5 text-fit-amber">
                    {confirmPasswordError}
                  </p>
                ) : null}
              </label>

              {error?.message && !error?.errors?.length ? (
                <div className="rounded-fit-lg border border-fit-rose/30 bg-fit-rose/10 p-4 text-sm text-fit-rose">
                  <p className="font-bold">{error.message}</p>
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
