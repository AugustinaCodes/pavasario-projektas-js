function SessionCard({ session, isAdmin = false, onBook, onEdit, onDelete }) {
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

      <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex items-center gap-3 text-sm fit-text-muted">
          <span>{session.duration_minutes} min</span>
          <span aria-hidden="true">·</span>
          <span>
            {session.session_type === "group"
              ? `Group · Max ${session.capacity}`
              : "One-to-one"}
          </span>
        </div>

        {isAdmin ? (
          <div className="flex flex-wrap gap-3">
            <button
              className="fit-btn-secondary"
              type="button"
              onClick={() => onEdit?.(session)}
            >
              Edit
            </button>

            <button
              className="fit-btn-danger px-5 py-3"
              type="button"
              onClick={() => onDelete?.(session)}
            >
              Delete
            </button>
          </div>
        ) : (
          <button
            className="fit-btn-primary"
            type="button"
            onClick={() => onBook(session)}
          >
            Book Session
          </button>
        )}
      </div>
    </article>
  );
}

export default SessionCard;
