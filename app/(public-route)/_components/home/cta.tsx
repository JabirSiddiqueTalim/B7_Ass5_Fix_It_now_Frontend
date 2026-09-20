import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Cta() {
  return (
    <section className="hero-grid border-t-2 border-dashed border-bone/15 bg-board text-bone">
      <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-safety">
          {"// Join the board"}
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Are you the fix?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-bone/75">
          Technicians: publish your services and let the neighbourhood book you
          in. Free to join, paid on every completed job.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-md font-display text-base font-bold"
          >
            <Link href="/register">Become a technician</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-md border-2 border-bone/30 bg-transparent font-display text-base font-bold text-bone hover:border-bone/60 hover:bg-transparent hover:text-bone"
          >
            <Link href="#services">Browse services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
