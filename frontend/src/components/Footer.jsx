const getCurrentDate = () =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

function Footer() {
  const currentYear = new Date().getFullYear();
  const currentDate = getCurrentDate();

  return (
    <footer className="border-t border-fit-border bg-fit-surface/80 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-6 sm:py-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <p className="text-xl font-black uppercase tracking-[0.14em] text-fit-primary">
            FitBook
          </p>
          <p className="mt-3 text-sm leading-6 fit-text-muted sm:text-base">
            Book, manage and track training sessions with a single FitBook
            account.
          </p>
        </div>

        <div className="grid gap-5 text-sm sm:grid-cols-2 sm:gap-8 lg:justify-items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-fit-primary">
              Contact
            </p>
            <a
              className="mt-3 block font-semibold text-fit-text transition hover:text-fit-primary"
              href="mailto:support@fitbook.app"
            >
              support@fitbook.app
            </a>
            <a
              className="mt-1 block fit-text-muted transition hover:text-fit-text"
              href="tel:+15550142026"
            >
              +1 (555) 014-2026
            </a>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-fit-primary">
              Current date
            </p>
            <p className="mt-3 font-semibold text-fit-text">{currentDate}</p>
            <p className="mt-1 fit-text-muted">© {currentYear} FitBook</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
