"use client";

import { useEffect, useState } from "react";
import { TicketStub } from "@/app/(public-route)/_components/home/ticket-stub";

const STATUSES = [
  "Matching you with a vetted pro\u2026",
  "Locking the price in taka\u2026",
  "Heading to your address\u2026",
];

const HOLES = 6;
const PUNCHED = 3;

export default function Loading() {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const id = setInterval(() => {
      setStatusIndex((i) => (i + 1) % STATUSES.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="grid min-h-dvh place-items-center bg-ticket px-4 text-ink">
      <div className="w-full max-w-sm">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-safety">
          {"// FixItNow \u00b7 dispatch"}
        </p>

        <article className="mt-4 grid grid-cols-[44px_1fr] overflow-hidden rounded-sm border-2 border-ink/80 bg-ticket-hi shadow-[10px_10px_0_rgba(20,17,13,0.25)]">
          <TicketStub top="FixItNow" bottom="FIN-.." width="w-11" hole="size-6" />

          <div className="p-5 sm:p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-steel">
              Job ticket \u00b7 printing
            </p>
            <h1 className="mt-1 font-display text-xl font-bold leading-tight">
              Getting your job ticket ready.
            </h1>

            <div className="mt-5 flex items-center gap-2" aria-hidden>
              {Array.from({ length: HOLES }).map((_, i) => {
                const isPunched = i < PUNCHED;
                const isNext = i === PUNCHED;
                return (
                  <span
                    key={i}
                    className="relative flex size-3.5 items-center justify-center"
                  >
                    {isNext && (
                      <span className="animate-punch-ring absolute inset-0 rounded-full border-2 border-dashed border-safety" />
                    )}
                    <span
                      className={
                        isPunched
                          ? "animate-punch size-3 rounded-full bg-ink"
                          : isNext
                            ? "size-3 rounded-full bg-safety/40"
                            : "size-3 rounded-full border-2 border-ink/35 bg-transparent"
                      }
                      style={{ animationDelay: `${i * 0.12}s` }}
                    />
                  </span>
                );
              })}
            </div>

            <p
              role="status"
              aria-live="polite"
              className="mt-4 h-4 font-mono text-[11px] uppercase tracking-wider text-steel"
            >
              {STATUSES[statusIndex]}
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
