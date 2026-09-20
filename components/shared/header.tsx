import Link from "next/link";
import { MobileNav } from "./mobile-nav";
import { UserMenu } from "./user-menu";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-ink text-bone">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label="FixItNow — back to home"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-safety font-mono text-base font-bold leading-none text-ink">
            &#10003;
          </span>
          <span className="font-display text-xl font-bold tracking-tight">
            FixItNow
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-bone/80 transition-colors hover:bg-white/10 hover:text-bone dark:hover:bg-black/10"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <UserMenu />
        </div>

        <MobileNav links={links} />
      </div>
    </header>
  );
}
