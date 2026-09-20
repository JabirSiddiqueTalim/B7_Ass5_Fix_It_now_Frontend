import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LiveCounter } from "./live-counter";
import { TicketStub } from "./ticket-stub";

export function Hero() {
  return (
    <section className="hero-grid border-b-2 border-dashed border-bone/15 bg-board text-bone">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-safety">
            {"// Home services \u00b7 Dhaka \u00b7 BDT"}
          </p>
          <h1 className="mt-4 font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Something broken?
            <br />
            <span className="underline decoration-safety decoration-[6px] underline-offset-10">
              Get it fixed now.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-bone/75">
            Vetted technicians for plumbing, electrics, AC and more — booked in
            minutes, priced in taka before anyone picks up a tool.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-md font-display text-base font-bold"
            >
              <Link href="/services">Browse services</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-md border-2 border-bone/30 bg-transparent font-display text-base font-bold text-bone hover:border-bone/60 hover:bg-transparent hover:text-bone"
            >
              <Link href="#pros">Book a technician</Link>
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-wider text-bone/60">
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-safety" />
              Vetted pros
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-safety" />
              Fixed prices
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-safety" />
              Booked in 2 minutes
            </li>
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end">
          <div className="absolute -inset-2 rounded-sm border-2 border-dashed border-safety/40" />
          <article className="animate-ticket relative grid grid-cols-[44px_1fr] overflow-hidden rounded-sm border-2 border-ink/80 bg-ticket-hi text-ink shadow-[10px_10px_0_rgba(20,17,13,0.45)]">
            <TicketStub top="FixItNow" bottom="FIN-0742" width="w-11" hole="size-6" />
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-steel">
                    Job ticket
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-bold leading-tight">
                    AC unit won&apos;t cool
                  </h2>
                </div>
                <span className="animate-stamp shrink-0 rotate-[-8deg] rounded-sm border-2 border-safety px-2 py-0.5 font-mono text-xs font-bold uppercase tracking-widest text-safety">
                  Done &#10003;
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-[70px_1fr] gap-y-2.5 text-sm">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-steel">
                  Technician
                </dt>
                <dd className="font-medium">{"Rafiq Uddin \u00b7 Electronics"}</dd>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-steel">
                  Time
                </dt>
                <dd className="font-medium">{"Today \u00b7 4:00 PM"}</dd>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-steel">
                  Area
                </dt>
                <dd className="font-medium">Mirpur 10, Dhaka</dd>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-steel">
                  Price
                </dt>
                <dd className="font-display text-2xl font-bold">
                  {"\u09F3"}450
                </dd>
              </dl>

              <div className="mt-4 border-t-2 border-dashed border-ink/25 pt-3">
                <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-steel">
                  <span>Requested</span>
                  <span aria-hidden>&#8594;</span>
                  <span>Accepted</span>
                  <span aria-hidden>&#8594;</span>
                  <span>Paid</span>
                  <span aria-hidden>&#8594;</span>
                  <span className="text-safety">Done</span>
                </div>
              </div>
            </div>
          </article>
          <p className="mt-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-bone/50">
            <span className="size-1.5 animate-pulse rounded-full bg-safety" />
            <LiveCounter /> jobs fixed across Dhaka today
          </p>
        </div>
      </div>
    </section>
  );
}
