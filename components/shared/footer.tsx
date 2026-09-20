import Link from "next/link";

const columns = [
  {
    title: "Services",
    links: [
      { href: "#services", label: "Plumbing" },
      { href: "#services", label: "Electrical" },
      { href: "#services", label: "AC & Cooling" },
      { href: "#services", label: "Cleaning" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "#how", label: "How it works" },
      { href: "#pros", label: "Technicians" },
      { href: "/login", label: "Log in" },
      { href: "/register", label: "Join as a technician" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t-2 border-dashed border-bone/15 bg-ink text-bone">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2.5" aria-label="FixItNow — back to home">
            <span className="flex size-8 items-center justify-center rounded-full bg-safety font-mono text-sm font-bold leading-none text-ink">
              {"\u2713"}
            </span>
            <span className="font-display text-xl font-bold tracking-tight">
              FixItNow
            </span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-bone/60">
            Home services across Dhaka. Vetted pros, fixed prices in taka,
            booked in minutes.
          </p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-bone/40">
            {"Open today \u00b7 8:00 AM \u2013 9:00 PM"}
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-bone/50">
              {column.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-bone/80 transition-colors hover:text-bone"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-bone/15">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 font-mono text-[10px] uppercase tracking-wider text-bone/40 sm:px-6">
          <span>{"\u00a9"} 2026 FixItNow</span>
          <span>Made for the homes of Dhaka</span>
          <span>Prices in BDT</span>
        </div>
      </div>
    </footer>
  );
}
