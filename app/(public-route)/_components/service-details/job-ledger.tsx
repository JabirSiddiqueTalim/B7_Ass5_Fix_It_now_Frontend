import type { TechnicianReview } from "@/lib/types";

function Stars({ rating }: { rating: number }) {
  const full = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <span
      className="font-mono text-sm tracking-tight"
      aria-label={`Rated ${rating} out of 5`}
    >
      <span className="text-safety">{"\u2605".repeat(full)}</span>
      <span className="text-steel/40">{"\u2605".repeat(5 - full)}</span>
    </span>
  );
}

export function JobLedger({
  reviews,
  dispatched,
}: {
  reviews: TechnicianReview[];
  dispatched: number;
}) {
  return (
    <section className="border-t-2 border-dashed border-ink/20">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-safety">
          {"// job history"}
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          The record so far.
        </h2>
        <p className="mt-3 text-steel">
          {dispatched} job{dispatched === 1 ? "" : "s"} dispatched for this
          ticket {reviews.length} reviewed by the people who booked it.
        </p>

        {reviews.length > 0 ? (
          <div className="mt-8 overflow-hidden border-2 border-ink/80 bg-ticket-hi">
            <div className="hidden border-b-2 border-ink/80 bg-ink px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-bone sm:grid sm:grid-cols-[1fr_auto]">
              <span>What the pro did well</span>
              <span className="text-right">Rating</span>
            </div>
            <ul className="divide-y-2 divide-dashed divide-ink/20">
              {reviews.map((review, index) => (
                <li
                  key={index}
                  className="grid gap-2 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-6"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-ink/50 bg-ticket font-mono text-[9px] font-bold text-ink">
                        {"\u2713"}
                      </span>
                      <span className="truncate text-sm font-semibold text-ink">
                        Verified customer
                      </span>
                    </div>
                    {review.comment && (
                      <p className="mt-1 text-sm leading-relaxed text-steel">
                        {review.comment}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                    <Stars rating={review.rating} />
                    <span className="-rotate-6 rounded-none border-2 border-safety/70 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-safety">
                      done {"\u2713"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-8 border-2 border-dashed border-ink/30 p-10 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-steel">
              Nothing logged yet
            </p>
            <p className="mx-auto mt-2 max-w-md font-display text-xl font-bold">
              This ticket is new to the board.
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-steel">
              No completed jobs on record. Be the first to tear it off{" "}
              \u2014 and set the standard for everyone after.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
