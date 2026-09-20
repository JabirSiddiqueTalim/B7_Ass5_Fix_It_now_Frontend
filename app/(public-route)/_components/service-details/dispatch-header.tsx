import Link from "next/link";

export function DispatchHeader({ serial }: { serial: string }) {
  return (
    <section className="hero-grid border-b-2 border-dashed border-bone/15 bg-board text-bone">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-8 sm:px-6">
        <Link
          href="/services"
          className="font-mono text-xs uppercase tracking-[0.2em] text-bone/70 transition-colors hover:text-safety"
        >
          {"\u2190"} The board \u00b7 all services
        </Link>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-bone/50">
          ticket {serial}
        </span>
      </div>
    </section>
  );
}

export function BoardCta() {
  return (
    <section className="hero-grid border-t-2 border-dashed border-bone/15 bg-board text-bone">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-5 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-safety">
            {"// not the one?"}
          </p>
          <p className="mt-1 font-display text-2xl font-bold leading-snug">
            Something else on the board needs fixing.
          </p>
        </div>
        <Link
          href="/services"
          className="inline-flex items-center justify-center rounded-none border-2 border-bone/40 px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest text-bone transition-colors hover:border-safety hover:bg-safety hover:text-ink"
        >
          Browse all services
        </Link>
      </div>
    </section>
  );
}
