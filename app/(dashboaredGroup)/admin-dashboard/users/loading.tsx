export default function AdminUsersLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-3 w-40 rounded bg-ink/10" />
        <div className="h-8 w-56 max-w-full rounded bg-ink/10" />
        <div className="h-4 w-72 rounded bg-ink/10" />
      </div>

      <div className="h-24 rounded-md border-2 border-ink/10 bg-bone p-4" />

      <div className="rounded-md border-2 border-ink/10 bg-bone">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-dashed border-ink/10 px-5 py-4 last:border-none"
          >
            <div className="size-10 rounded-full bg-ink/10" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 rounded bg-ink/10" />
              <div className="h-3 w-32 rounded bg-ink/10" />
            </div>
            <div className="h-6 w-16 rounded bg-ink/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
