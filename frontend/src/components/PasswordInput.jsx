import { useState } from "react";

function PasswordInput({
  className = "",
  visibilityLabel = "password",
  ...inputProps
}) {
  const [isVisible, setIsVisible] = useState(false);
  const actionLabel = isVisible ? "Hide" : "Show";

  return (
    <div className="relative">
      <input
        {...inputProps}
        className={`fit-input pr-12 ${className}`}
        type={isVisible ? "text" : "password"}
      />
      <button
        type="button"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-fit-muted transition hover:text-fit-primary focus-visible:text-fit-primary focus-visible:outline-none"
        onClick={() => setIsVisible((current) => !current)}
        aria-label={`${actionLabel} ${visibilityLabel}`}
        aria-pressed={isVisible}
      >
        {isVisible ? (
          <svg
            aria-hidden="true"
            className="size-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.5 12S6.5 5.2 12 5.2 21.5 12 21.5 12 17.5 18.8 12 18.8 2.5 12 2.5 12z"
            />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            className="size-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3l18 18M10.6 10.7a2 2 0 002.7 2.7M9.9 4.2A10.8 10.8 0 0112 4c5.5 0 9.5 5.2 9.5 5.2a13.7 13.7 0 01-3.1 3.7M6.2 6.2A14.3 14.3 0 002.5 9.2S6.5 16 12 16c1.2 0 2.3-.2 3.3-.6"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

export default PasswordInput;
