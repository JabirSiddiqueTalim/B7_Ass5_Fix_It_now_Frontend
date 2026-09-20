export function RecordSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl animate-pulse space-y-6">
      <div className="h-3 w-40 rounded bg-ink/10" />
      <div className="rounded-md border-2 border-ink/15 bg-bone p-6">
        <div className="flex items-center gap-6">
          <div className="size-24 shrink-0 rounded-full bg-ink/10" />
          <div className="flex-1 space-y-3">
            <div className="h-7 w-52 max-w-full rounded bg-ink/10" />
            <div className="h-4 w-28 rounded bg-ink/10" />
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-5 rounded bg-ink/10" />
          ))}
        </div>
      </div>
    </div>
  );
}
