import { useEffect } from "react";
import SessionCard from "../components/SessionCard";
import useSessionStore from "../store/useSessionStore";

function SessionPage() {
  const { sessions, isLoading, error, fetchSessions } = useSessionStore();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return (
    <main className="fit-page">
      <div className="mx-auto w-full max-w-6xl px-5 py-10">
        <header className="my-8">
          <h2 className="text-4xl font-bold">Available training sessions</h2>
          <p className="mt-3 fit-text-muted">
            Choose a session and book your next workout.
          </p>
        </header>
        {isLoading && (
          <p className="fit-panel p-6 fit-text-muted">Loading sessions...</p>
        )}

        {error && (
          <p className="rounded-fit-lg border border-fit-rose/30 bg-fit-rose/10 p-6 text-fit-rose">
            {error}
          </p>
        )}

        {!isLoading && !error && sessions.length === 0 && (
          <p className="fit-panel p-6 fit-text-muted">No sessions available.</p>
        )}

        {!isLoading && !error && sessions.length > 0 && (
          <section className="grid gap-5 md:grid-cols-2">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

export default SessionPage;
