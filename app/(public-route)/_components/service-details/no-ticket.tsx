import Link from "next/link";

export function NoTicket({ serial }: { serial: string }) {
  return (
    <section className="mx-auto flex min-h-[50vh] max-w-6xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-safety">
        {"// board \u00b7 no such ticket"}
      </p>
      <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
        Ticket {serial} isn&apos;t on the board.
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-steel">
        This service may have been taken down, or the link is wrong. Check the
        ticket number, or browse everything on the board.
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
