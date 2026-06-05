function SessionCard({ session, onBook }) {
  return (
    <article className="fit-card flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold">{session.title}</h3>
          <p className="mt-2 fit-text-muted">{session.description}</p>
        </div>

        <p className="whitespace-nowrap text-lg font-bold text-fit-primary">
          EUR {session.price}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between gap-4">
        <span className="fit-text-muted">
            {session.duration_minutes} min
        </span>

        <button
          className="fit-btn-primary"
          type="button"
          onClick={() => onBook(session)}
        >
            Book Session
        </button>

      </div>
    </article>
  );
}

export default SessionCard;
