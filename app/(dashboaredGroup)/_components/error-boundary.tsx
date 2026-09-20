"use client";

export function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl rounded-md border-2 border-dashed border-ink/30 bg-bone px-6 py-16 text-center">
      <p className="font-display text-xl font-bold text-ink">
        Couldn&apos;t load this page.
      </p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-steel">
        {error.message ||
          "Something went wrong while talking to the dispatch desk. Try again."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-block rounded-sm border-2 border-ink bg-safety px-5 py-2.5 font-display text-sm font-bold text-ink shadow-[3px_3px_0_rgba(33,30,25,0.25)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
      >
        Try again
      </button>
    </div>
  );
}
