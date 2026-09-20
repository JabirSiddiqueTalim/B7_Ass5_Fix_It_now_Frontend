import Link from "next/link";

export function BoardError() {
  return (
    <section className="mx-auto flex min-h-[50vh] max-w-6xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-safety">
        {"// board \u00b7 unreachable"}
      </p>
      <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
        Couldn&apos;t reach the board.
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-steel">
        We had trouble loading this ticket. It may be a temporary hiccup, so
        try again in a moment or check the rest of the board.
      </p>
      <Link
        href="/services"
        className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-sm border-2 border-ink bg-ink px-6 font-display text-base font-bold text-bone transition-colors hover:bg-safety hover:text-ink"
      >
        {"\u2190"} Back to the board
      </Link>
    </section>
  );
}