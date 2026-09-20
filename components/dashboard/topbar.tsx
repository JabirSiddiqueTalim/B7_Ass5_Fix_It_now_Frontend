"use client";

import { usePathname } from "next/navigation";
import type { User } from "@/lib/types";
import { breadcrumb, sectionTitle } from "./nav";
import { ThemeToggle } from "@/components/theme-toggle";

export function Topbar({
  role,
  user,
  onMenu,
}: {
  role: string;
  user?: User;
  onMenu: () => void;
}) {
  const pathname = usePathname();

  const today = new Date()
    .toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    })
    .toUpperCase()
    .replace(/\s+/g, " · ");

  return (
    <header className="sticky top-0 z-30 border-b-2 border-dashed border-ink/25 bg-bone/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open navigation"
          className="flex size-10 shrink-0 items-center justify-center rounded-sm border-2 border-ink/25 text-ink transition-colors hover:border-ink hover:bg-ticket lg:hidden"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M2 4h12M2 8h12M2 12h12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="flex min-w-0 items-baseline gap-3">
          <span className="hidden font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-safety sm:inline">
            {breadcrumb(pathname)}
          </span>
          <h1 className="truncate font-display text-xl font-bold tracking-tight text-ink">
            {sectionTitle(pathname)}
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-steel md:inline">
            {today}
          </span>
          <span className="hidden h-5 w-px bg-ink/20 md:block" />
          <div className="hidden items-center gap-2.5 md:flex">
            <span className="max-w-40 truncate font-mono text-[11px] font-bold uppercase tracking-widest text-steel">
              {user?.name ?? "…"}
            </span>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink font-display text-xs font-bold text-bone">
              {user?.name?.trim().charAt(0).toUpperCase() ?? role.charAt(0)}
            </span>
          </div>
          <span className="animate-stamp rounded-sm border-2 border-ink px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink shadow-[2px_2px_0_rgba(33,30,25,0.18)]">
            {role}
          </span>
          <span className="text-ink">
            <ThemeToggle />
          </span>
        </div>
      </div>
    </header>
  );
}
