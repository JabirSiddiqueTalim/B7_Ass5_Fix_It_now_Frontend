export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-3 w-40 rounded bg-ink/10" />
        <div className="h-8 w-72 max-w-full rounded bg-ink/10" />
        <div className="h-4 w-64 rounded bg-ink/10" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-md border-2 border-ink/10 bg-bone p-5">
            <div className="h-3 w-24 rounded bg-ink/10" />
            <div className="mt-3 h-8 w-16 rounded bg-ink/10" />
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 rounded-md border-2 border-ink/10 bg-bone p-5">
            <div className="h-3 w-20 rounded bg-ink/10" />
            <div className="mt-3 h-4 w-28 rounded bg-ink/10" />
          </div>
        ))}
      </div>

      <div className="rounded-md border-2 border-dashed border-ink/20 bg-ticket-hi p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="h-4 w-40 rounded bg-ink/10" />
          <div className="h-8 w-20 rounded bg-ink/10" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 border-b border-dashed border-ink/10 py-3 last:border-none"
          >
            <div className="space-y-2">
              <div className="h-4 w-48 rounded bg-ink/10" />
              <div className="h-3 w-32 rounded bg-ink/10" />
            </div>
            <div className="h-6 w-20 rounded bg-ink/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
