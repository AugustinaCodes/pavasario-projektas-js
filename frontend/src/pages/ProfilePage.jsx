import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import useAuthStore from "../store/useAuthStore";

const getFieldErrors = (error) => {
  const fieldErrors = {};

  if (!Array.isArray(error?.errors)) {
    return fieldErrors;
  }

  error.errors.forEach((item) => {
    const field = item.field
      ?.replace("body.", "")
      ?.replace("params.", "")
      ?.replace("query.", "");

    if (field) {
      fieldErrors[field] = item.message;
    }
  });

  return fieldErrors;
};

function ProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const deleteAccount = useAuthStore((state) => state.deleteAccount);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const fieldErrors = getFieldErrors(error);
  const hasFieldErrors = Object.keys(fieldErrors).length > 0;
  const isDeleteConfirmed = deleteConfirmation === "DELETE";

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (error) {
      clearError();
    }

    setSuccessMessage("");

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (name === "password" || name === "confirmPassword") {
      setConfirmPasswordError("");
    }
  };

  const handleDeleteConfirmationChange = (event) => {
    if (error) {
      clearError();
    }

    setDeleteConfirmation(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
    };

    if (formData.password) {
      payload.currentPassword = formData.currentPassword;
      payload.password = formData.password;
    }

    try {
      await updateProfile(payload);

      setSuccessMessage("Your profile has been updated.");
      setFormData((current) => ({
        ...current,
        currentPassword: "",
        password: "",
        confirmPassword: "",
      }));
    } catch {
      // The auth store already keeps the backend error state.
    }
  };

  const handleDeleteAccount = async () => {
    if (!isDeleteConfirmed) {
      return;
    }

    try {
      const message = await deleteAccount();

      navigate("/login", {
        replace: true,
        state: {
          successMessage: message,
        },
      });
    } catch {
      // The auth store already keeps the backend error state.
    }
  };

  return (
    <main className="fit-page">
      <div className="mx-auto w-full max-w-6xl px-5 py-10">
        <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="fit-brand-kicker">Your profile</p>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl">
              Manage your account details
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 fit-text-muted">
              Update the name and email linked to your FitBook account, change
              your password when needed, or delete the account entirely.
            </p>
          </div>

          <Link className="fit-btn-secondary inline-flex w-fit" to="/sessions">
            Back to sessions
          </Link>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="fit-panel p-6 sm:p-8">
            <div className="border-b border-fit-border pb-6">
              <p className="fit-brand-kicker">Profile details</p>
              <h2 className="text-2xl font-black">Edit your information</h2>
              <p className="mt-2 fit-text-muted">
                Keep the account details up to date. Leave password fields empty
                if you only want to change your name or email.
              </p>
            </div>

            <form
              noValidate
              className="mt-6 grid gap-4"
              onSubmit={handleSubmit}
            >
              <label className="grid gap-2 text-sm font-semibold">
                Name
                <input
                  className={`fit-input ${fieldErrors.name ? "border-fit-rose" : ""}`}
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
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
                  className={`fit-input ${fieldErrors.email ? "border-fit-rose" : ""}`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.email ? (
                  <p className="text-xs leading-5 text-fit-rose">
                    {fieldErrors.email}
                  </p>
                ) : null}
              </label>

              <section className="grid gap-4 rounded-fit-lg border border-fit-border bg-white/[0.03] p-4 sm:p-5">
                <div className="mb-4">
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-fit-primary">
                    Password update
                  </p>
                  <p className="mt-2 text-sm leading-6 fit-text-muted">
                    Leave these fields empty unless you want to change your
                    password.
                  </p>
                </div>

                <label className="grid gap-2 text-sm font-semibold">
                  Current password
                  <PasswordInput
                    className={
                      fieldErrors.currentPassword ? "border-fit-rose" : ""
                    }
                    name="currentPassword"
                    autoComplete="current-password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password"
                  />
                  {fieldErrors.currentPassword ? (
                    <p className="text-xs leading-5 text-fit-rose">
                      {fieldErrors.currentPassword}
                    </p>
                  ) : null}
                </label>

                <label className="grid gap-2 text-sm font-semibold">
                  New password
                  <PasswordInput
                    className={fieldErrors.password ? "border-fit-rose" : ""}
                    name="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep the current password"
                  />
                  {fieldErrors.password ? (
                    <p className="text-xs leading-5 text-fit-rose">
                      {fieldErrors.password}
                    </p>
                  ) : (
                    <p className="text-xs leading-5 fit-text-muted">
                      Password must include uppercase and lowercase letters, a
                      number and a special character.
                    </p>
                  )}
                </label>

                <label className="grid gap-2 text-sm font-semibold">
                  Confirm new password
                  <PasswordInput
                    className={confirmPasswordError ? "border-fit-amber" : ""}
                    visibilityLabel="confirm new password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat new password"
                  />
                  {confirmPasswordError ? (
                    <p className="text-xs leading-5 text-fit-amber">
                      {confirmPasswordError}
                    </p>
                  ) : null}
                </label>
              </section>

              {successMessage ? (
                <div className="fit-feedback-success p-4 text-sm">
                  <p className="font-bold">{successMessage}</p>
                </div>
              ) : null}

              {error?.message && !hasFieldErrors ? (
                <div className="rounded-fit-lg border border-fit-rose/30 bg-fit-rose/10 p-4 text-sm text-fit-rose">
                  <p className="font-bold">{error.message}</p>
                </div>
              ) : null}

              <button
                className="fit-btn-primary mt-2 inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Saving changes..." : "Save changes"}
              </button>
            </form>
          </div>

          <aside className="grid gap-6">
            <section className="fit-panel p-6 sm:p-8">
              <p className="fit-brand-kicker">Account summary</p>
              <h2 className="text-2xl font-black">Current profile</h2>

              <dl className="mt-5 grid gap-4 text-sm">
                <div className="rounded-fit-lg border border-fit-border bg-white/[0.04] p-4">
                  <dt className="fit-text-muted">Name</dt>
                  <dd className="mt-1 text-base font-semibold">{user?.name}</dd>
                </div>

                <div className="rounded-fit-lg border border-fit-border bg-white/[0.04] p-4">
                  <dt className="fit-text-muted">Email</dt>
                  <dd className="mt-1 text-base font-semibold">
                    {user?.email}
                  </dd>
                </div>

                <div className="rounded-fit-lg border border-fit-border bg-white/[0.04] p-4">
                  <dt className="fit-text-muted">Role</dt>
                  <dd className="mt-1 text-base font-semibold capitalize">
                    {user?.role}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="fit-panel border border-fit-rose/30 bg-fit-rose/10 p-6 sm:p-8">
              <p className="fit-brand-kicker text-fit-rose">Danger zone</p>
              <h2 className="text-2xl font-black text-fit-rose">
                Delete your account
              </h2>
              <p className="mt-2 text-sm leading-6 text-fit-rose/90">
                This removes your profile and all related bookings. Type DELETE
                to confirm the action.
              </p>

              <label className="mt-5 grid gap-2 text-sm font-semibold text-fit-rose">
                Confirmation
                <input
                  className="fit-input border-fit-rose/30 bg-white/[0.05] text-fit-text placeholder:text-fit-muted focus:border-fit-rose"
                  value={deleteConfirmation}
                  onChange={handleDeleteConfirmationChange}
                  placeholder="DELETE"
                />
              </label>

              <button
                className="fit-btn-danger mt-5 w-full px-5 py-3 disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
                disabled={isLoading || !isDeleteConfirmed}
                onClick={handleDeleteAccount}
              >
                {isLoading ? "Deleting account..." : "Delete account"}
              </button>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}

export default ProfilePage;
