export default function AvailabilityLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-3 w-40 rounded bg-ink/10" />
        <div className="h-8 w-52 rounded bg-ink/10" />
      </div>
      <div className="rounded-md border-2 border-ink/10 bg-bone">
        <div className="flex items-center justify-between border-b-2 border-dashed border-ink/10 px-5 py-3">
          <div className="h-3 w-32 rounded bg-ink/10" />
          <div className="h-8 w-28 rounded bg-ink/10" />
        </div>
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 border-b border-dashed border-ink/10 px-5 py-4 last:border-none"
          >
            <div className="space-y-2">
              <div className="h-3 w-24 rounded bg-ink/10" />
              <div className="h-5 w-28 rounded bg-ink/10" />
            </div>
            <div className="h-8 w-44 rounded bg-ink/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
