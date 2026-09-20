export default function AdminCategoriesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-3 w-40 rounded bg-ink/10" />
        <div className="h-8 w-56 max-w-full rounded bg-ink/10" />
        <div className="h-4 w-72 rounded bg-ink/10" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-md border-2 border-ink/10 bg-bone p-5"
            >
              <div className="h-4 w-40 rounded bg-ink/10" />
              <div className="mt-2 h-3 w-56 rounded bg-ink/10" />
            </div>
          ))}
        </div>
        <div className="h-72 rounded-md border-2 border-ink/10 bg-bone p-5" />
      </div>
    </div>
  );
}
