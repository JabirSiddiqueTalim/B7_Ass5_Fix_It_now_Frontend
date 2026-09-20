import type { Metadata } from "next";
import RegisterForm from "../_components/RegisterForm";

export const metadata: Metadata = {
  title: "Join the crew \u2014 FixItNow",
};

export default function RegisterPage() {
  return (
    <section className="grid min-h-[80dvh] bg-ticket lg:grid-cols-[1fr_1.15fr]">
      <div className="hero-grid flex items-center border-b-2 border-dashed border-bone/15 bg-board px-6 py-16 text-bone sm:px-10 lg:border-b-0 lg:border-r-2 lg:border-r-dashed lg:border-r-bone/15">
        <div className="mx-auto w-full max-w-md">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-safety">
            {"// FixItNow \u00b7 crew intake"}
          </p>
          <h1 className="mt-4 font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl">
            Join the crew.
          </h1>
          <p className="mt-5 max-w-sm text-lg leading-relaxed text-bone/75">
            Whether you need a fix at home or want to get hired, it starts with
            one ticket. Pick your side \u2014 the form on the right changes to match.
          </p>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-wider text-bone/60">
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-safety" />
              Vetted pros
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-safety" />
              Fixed prices in taka
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-safety" />
              Booked in minutes
            </li>
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16 sm:px-10">
        <RegisterForm />
      </div>
    </section>
  );
}
