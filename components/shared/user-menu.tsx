"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import type { User } from "@/lib/types";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";

const dashboardByRole: Record<User["role"], string> = {
  CUSTOMER: "/dashboard",
  TECHNICIAN: "/technician-dashboard",
  ADMIN: "/admin-dashboard",
};

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function UserMenu() {
  const router = useRouter();
  const { user, status, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    router.refresh();
  };

  return (
    <div ref={rootRef} className="relative">
      {status === "loading" ? (
        <div className="flex items-center gap-2">
          <span className="hidden size-9 animate-pulse rounded-full bg-white/10 dark:bg-black/10 sm:block" />
          <span className="hidden h-4 w-16 animate-pulse rounded bg-white/10 dark:bg-black/10 sm:block" />
        </div>
      ) : user === null ? (
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-md px-3 py-2 text-sm font-medium text-bone/80 transition-colors hover:text-bone"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-safety font-display font-bold text-ink transition-colors hover:brightness-110 px-4 py-2 text-sm"
          >
            Book a service
          </Link>
        </div>
      ) : (
        <>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-white/10 dark:hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety"
          >
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt=""
                className="size-9 rounded-full object-cover"
                width={36}
                height={36}
              />
            ) : (
              <span className="flex size-9 items-center justify-center rounded-full bg-safety font-display text-sm font-bold text-ink">
                {initialsOf(user.name)}
              </span>
            )}
            <span className="hidden max-w-40 truncate text-sm font-medium text-bone sm:block">
              {user.name}
            </span>
            <ChevronDown
              className={`size-4 text-bone/70 transition-transform ${open ? "rotate-180" : ""}`}
              aria-hidden
            />
          </button>

          {open && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-lg border border-white/10 bg-ink py-1.5 shadow-2xl shadow-black/40 dark:border-black/10"
            >
              <div className="border-b border-white/10 px-4 py-3 dark:border-black/10">
                <p className="truncate text-sm font-semibold text-bone">
                  {user.name}
                </p>
                <p className="truncate text-xs text-bone/60">{user.email}</p>
              </div>
              <Link
                href={dashboardByRole[user.role]}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-bone/85 transition-colors hover:bg-white/10 hover:text-bone dark:hover:bg-black/10"
              >
                <LayoutDashboard className="size-4" aria-hidden />
                Dashboard
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-bone/85 transition-colors hover:bg-white/10 hover:text-bone dark:hover:bg-black/10"
              >
                <LogOut className="size-4" aria-hidden />
                Log out
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}