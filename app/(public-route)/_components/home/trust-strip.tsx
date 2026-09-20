const claims = [
  "Vetted & background-checked",
  "Fixed prices, paid up front",
  "Booked in under 2 minutes",
  "Rated by your neighbours",
];

export function TrustStrip() {
  return (
    <section aria-label="Why trust FixItNow" className="border-t-2 border-dashed border-ink/20">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 font-mono text-xs uppercase tracking-wider text-steel">
          {claims.map((claim) => (
            <li key={claim} className="flex items-center gap-2">
              <span className="font-bold text-safety">{"\u2713"}</span>
              {claim}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
