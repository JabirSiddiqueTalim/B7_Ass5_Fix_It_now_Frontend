export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-md border-2 border-ink/80 bg-bone p-5 shadow-[4px_4px_0_rgba(33,30,25,0.12)]">
      <span
        aria-hidden
        className="absolute right-3 top-3 size-3 rounded-full bg-ticket-hi ring-2 ring-edge"
      />
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-steel">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-bold tracking-tight text-ink">
        {value}
      </p>
      {hint && (
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-steel/70">
          {hint}
        </p>
      )}
    </div>
  );
}
