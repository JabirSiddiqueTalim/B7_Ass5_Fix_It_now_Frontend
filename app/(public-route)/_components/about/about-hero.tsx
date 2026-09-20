export function AboutHero() {
  return (
    <section className="hero-grid border-b-2 border-dashed border-bone/15 bg-board text-bone">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-safety">
          {"// About FixItNow"}
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          Every fix starts
          <br />
          with a ticket.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-bone/75">
          FixItNow is Dhaka&apos;s home-services board. Vetted pros, fixed
          prices in taka, booked in minutes — the same way, every day.
        </p>
      </div>
    </section>
  );
}