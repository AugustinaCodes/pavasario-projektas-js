import { Link } from "react-router-dom";

function DashboardPage() {
  return (
    <main className="fit-page">
      <div className="mx-auto w-full max-w-6xl px-5 py-10">
        <section className="fit-panel p-8">
          <p className="mb-2 text-sm font-bold uppercase text-fit-primary">
            Protected
          </p>
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="mt-3 fit-text-muted">
            This route is protected and will only be visible to signed-in users.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link className="fit-button" to="/sessions">
              View sessions
            </Link>
            <Link className="fit-button fit-button-secondary" to="/admin">
              Admin area
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default DashboardPage;
