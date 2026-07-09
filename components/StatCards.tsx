type Props = {
  total: number;
  withoutWebsite: number;
};

export default function StatCards({ total, withoutWebsite }: Props) {
  const claimed = total - withoutWebsite;
  const unclaimedPct = total ? Math.round((withoutWebsite / total) * 100) : 0;

  const cards = [
    { label: "Total leads", value: total },
    { label: "No website", value: withoutWebsite, accent: true },
    { label: "Has a website", value: claimed },
    { label: "Unclaimed rate", value: `${unclaimedPct}%`, accent: true },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl border border-line bg-card px-4 py-3.5"
        >
          <p className="text-xs text-slate-2">{c.label}</p>
          <p
            className={`font-data mt-1 text-2xl font-semibold ${
              c.accent ? "text-signal" : "text-ink"
            }`}
          >
            {c.value}
          </p>
        </div>
      ))}
    </div>
  );
}
