"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { navByRole, sectionLabel } from "./nav";

export function Sidebar({
  role,
  user,
  mobileOpen,
  onClose,
}: {
  role: string;
  user?: User;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const links = navByRole[role] ?? navByRole.CUSTOMER;
  const initial = user?.name?.trim().charAt(0).toUpperCase() ?? role.charAt(0);

  async function handleLogout() {
    await logout();
    toast.success("Logged out");
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm dark:bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        aria-label="Dashboard navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r-2 border-dashed border-ink/25 bg-bone",
          "transition-transform duration-200 ease-out",
          "lg:sticky lg:top-0 lg:z-0 lg:h-dvh lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-dashed border-ink/20 px-6 pb-5 pt-6">
            <Link href="/" onClick={onClose} className="group block">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-safety">
                Dispatch desk
              </p>
              <p className="mt-1.5 font-display text-2xl font-bold tracking-tight text-ink">
                FixItNow
              </p>
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-5">
            <p className="px-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-steel">
              {sectionLabel[role] ?? "Manage"}
            </p>
            <div className="mt-2 space-y-1">
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group flex items-center gap-3 border-l-2 px-3 py-2.5 font-display text-[15px] font-semibold transition-colors",
                      active
                        ? "border-safety bg-ticket text-ink"
                        : "border-transparent text-steel hover:bg-ticket/60 hover:text-ink"
                    )}
                  >
                    <span
                      className={cn(
                        "size-1.5 shrink-0 rounded-full transition-colors",
                        active ? "bg-safety" : "bg-ink/25 group-hover:bg-ink/60"
                      )}
                    />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="relative border-t-2 border-dashed border-ink/20 p-4">
            <div className="absolute -top-0.75 left-1/2 flex -translate-x-1/2 gap-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="size-1.5 rounded-full bg-board ring-2 ring-bone"
                />
              ))}
            </div>
            <div className="flex items-center gap-3 px-1">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ticket font-display text-sm font-bold text-ink ring-1 ring-ink/20">
                {initial}
              </span>
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-bold text-ink">
                  {user?.name ?? "Loading…"}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-steel">
                  {role.toLowerCase()}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 w-full rounded-sm border-2 border-dashed border-ink/40 px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-steel transition-colors hover:border-ink hover:bg-ink hover:text-bone"
            >
              Log out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
