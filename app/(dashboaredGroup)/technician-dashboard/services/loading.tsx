export default function ServicesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-3 w-40 rounded bg-ink/10" />
        <div className="h-8 w-44 rounded bg-ink/10" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="h-3 w-32 rounded bg-ink/10" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-md border-2 border-ink/10 bg-bone p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-48 rounded bg-ink/10" />
                  <div className="h-3 w-64 max-w-full rounded bg-ink/10" />
                </div>
                <div className="h-6 w-16 rounded bg-ink/10" />
              </div>
            </div>
          ))}
        </div>
        <div className="h-96 rounded-md border-2 border-ink/10 bg-bone p-5">
          <div className="h-3 w-28 rounded bg-ink/10" />
          <div className="mt-5 space-y-4">
            <div className="h-16 rounded bg-ink/10" />
            <div className="h-24 rounded bg-ink/10" />
            <div className="h-16 rounded bg-ink/10" />
            <div className="h-10 rounded bg-ink/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
