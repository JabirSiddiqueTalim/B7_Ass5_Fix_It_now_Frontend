export default function PaymentsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-3 w-44 rounded bg-ink/10" />
        <div className="h-8 w-40 rounded bg-ink/10" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="rounded-md border-2 border-ink/10 bg-bone p-5"
        >
          <div className="flex items-center justify-between border-b-2 border-dashed border-ink/10 pb-3">
            <div className="h-3 w-36 rounded bg-ink/10" />
            <div className="h-6 w-20 rounded bg-ink/10" />
          </div>
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="h-5 w-52 rounded bg-ink/10" />
              <div className="h-3 w-40 rounded bg-ink/10" />
            </div>
            <div className="h-8 w-20 rounded bg-ink/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
