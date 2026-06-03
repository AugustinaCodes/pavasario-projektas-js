const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const getCalendarDays = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const firstWeekday = (firstDayOfMonth.getDay() + 6) % 7;

  const emptyDays = Array.from({ length: firstWeekday }, (_, index) => ({
    key: `empty-${index}`,
    day: null,
  }));

  const monthDays = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day,
    ).padStart(2, "0")}`;

    return {
      key: `day-${day}`,
      day,
      dateString,
    };
  });

  return [...emptyDays, ...monthDays];
};

function Calendar({ bookings = [], selectedDate = "", onSelectDate }) {
  const currentDate = new Date();
  const calendarDays = getCalendarDays(currentDate);

  const monthLabel = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const bookingDates = new Set(bookings.map((booking) => booking.booking_date));

  return (
    <section className="fit-panel p-6">
      <div className="mb-5">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-fit-primary">
          Calendar
        </p>

        <h2 className="mt-2 text-2xl font-black">{monthLabel}</h2>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {weekdayLabels.map((label) => (
          <span className="text-sm font-bold fit-text-muted" key={label}>
            {label}
          </span>
        ))}

        {calendarDays.map((item) => (
          <button
            className={`flex min-h-12 items-center justify-center rounded-fit-md text-sm font-bold transition ${
              item.dateString === selectedDate
                ? "bg-fit-sky text-fit-bg"
                : item.dateString && bookingDates.has(item.dateString)
                  ? "bg-fit-primary text-fit-bg"
                  : "bg-white/[0.04]"
            }`}
            disabled={!item.dateString}
            key={item.key}
            onClick={() => onSelectDate?.(item.dateString)}
            type="button"
          >
            {item.day}
          </button>
        ))}
      </div>
    </section>
  );
}

export default Calendar;
