export function Why() {
  return (
    <section className="border-t-2 border-dashed border-ink/20">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-safety">
          {"// Why it exists"}
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Repairs shouldn&apos;t be a gamble.
        </h2>

        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-steel">
              {"// The old way"}
            </p>
            <p className="mt-3 text-base leading-relaxed text-ink/80">
              Finding someone to fix a leak in Dhaka means calling around,
              trusting a stranger&apos;s word, and hearing the real price only
              when the job is half done. No record, no recourse, no way to know
              who you just let into your home.
            </p>
            <p className="mt-3 text-base leading-relaxed text-steel">
              A small job becomes a gamble with your door open.
            </p>
          </div>
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-steel">
              {"// The FixItNow way"}
            </p>
            <p className="mt-3 text-base leading-relaxed text-ink/80">
              We rebuilt it like a ticket. The price is printed before you
              book, the pro is background-checked and rated by the people who
              hired them, and payment is settled up front — so nothing changes
              hands at your door.
            </p>
            <p className="mt-3 text-base leading-relaxed text-steel">
              You always know the what, the who, and the cost before the job
              starts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}