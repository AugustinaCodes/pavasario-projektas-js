function AnalyticsBarChart({
  title,
  description,
  items = [],
  emptyMessage = "No analytics data available yet.",
  formatValue = (value) => String(value),
}) {
  const normalizedItems = items
    .map((item) => ({
      ...item,
      value: Number(item?.value) || 0,
    }))
    .filter((item) => item.label);

  const maxValue = Math.max(1, ...normalizedItems.map((item) => item.value));

  return (
    <section className="fit-panel p-6">
      <div className="flex flex-col gap-2 border-b border-fit-border pb-5">
        <p className="fit-brand-kicker mb-0">Analytics</p>
        <h3 className="text-2xl font-black">{title}</h3>
        {description ? <p className="fit-text-muted">{description}</p> : null}
      </div>

      {normalizedItems.length === 0 ? (
        <p className="py-6 fit-text-muted">{emptyMessage}</p>
      ) : (
        <div className="mt-6 grid gap-4">
          {normalizedItems.map((item) => {
            const width = `${Math.max((item.value / maxValue) * 100, 6)}%`;

            return (
              <div className="grid gap-2" key={item.label}>
                <div className="flex items-end justify-between gap-4 text-sm font-semibold">
                  <span className="min-w-0 truncate">{item.label}</span>
                  <span className="shrink-0 text-fit-primary">
                    {formatValue(item.value, item)}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-fit-primary to-fit-sky"
                    style={{ width }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default AnalyticsBarChart;
