import { cn } from "@/lib/utils";

const areItems = [
  "Vetted & background-checked pros",
  "Fixed price printed before you book",
  "Paid securely up front",
  "Rated by the neighbours who hired them",
];

const notItems = [
  "Hourly surprises at the door",
  "Unvetted strangers in your home",
  "Handshake cash with no record",
  "A price that moves once you\u2019re stuck",
];

export function Contrast() {
  return (
    <section className="border-t-2 border-dashed border-ink/20">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-safety">
          {"// What we are \u2014 and what we\u2019re not"}
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          The fix, without the guesswork.
        </h2>

        <div className="relative mt-10 grid overflow-hidden border-2 border-ink/80 bg-ticket-hi md:grid-cols-2">
          <div
            aria-hidden
            className="absolute left-1/2 top-0 hidden h-full w-0 -translate-x-1/2 border-l-2 border-dashed border-ink/30 md:block"
          />
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 hidden size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink/80 bg-ticket md:block"
          />

          <div className="px-6 py-8 sm:px-8 sm:py-10">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-steel">
              {"// We are"}
            </p>
            <ul className="mt-5 space-y-4">
              {areItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-safety font-mono text-xs font-bold text-ink">
                    {"\u2713"}
                  </span>
                  <span className="text-base font-medium leading-snug text-ink">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t-2 border-dashed border-ink/30 px-6 py-8 sm:px-8 sm:py-10 md:border-l-0 md:border-t-0">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-steel">
              {"// We\u2019re not"}
            </p>
            <ul className="mt-5 space-y-4">
              {notItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-steel/80"
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-red-700/70 font-mono text-xs font-bold leading-none text-red-700">
                    {"\u00d7"}
                  </span>
                  <span className="text-base leading-snug [text-decoration:line-through] [text-decoration-color:color-mix(in_oklab,var(--steel)_60%,transparent)] [text-decoration-thickness:1px]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className={cn("mt-6 font-mono text-[11px] uppercase tracking-wider text-steel")}>
          {"// Tear along the dotted line \u2014 keep the fixed side."}
        </p>
      </div>
    </section>
  );
}