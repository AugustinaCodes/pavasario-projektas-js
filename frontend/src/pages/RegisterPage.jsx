import { Link } from "react-router-dom";

function RegisterPage() {
  return (
    <main className="fit-page">
      <div className="mx-auto flex min-h-[70vh] w-full max-w-6xl items-center px-5 py-10">
        <section className="fit-panel w-full max-w-xl p-8">
          <p className="mb-2 text-sm font-bold uppercase text-fit-primary">
            Auth
          </p>
          <h1 className="text-4xl font-bold">Register</h1>
          <p className="mt-3 fit-text-muted">
            Placeholder registration page. Connect the real form here later.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link className="fit-button" to="/login">
              Go to login
            </Link>
            <Link className="fit-button fit-button-secondary" to="/sessions">
              Back to sessions
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default RegisterPage;
