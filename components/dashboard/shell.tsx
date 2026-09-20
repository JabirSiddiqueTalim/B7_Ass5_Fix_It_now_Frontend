"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function DashboardShell({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex min-h-dvh bg-ticket-hi">
      <Sidebar
        role={role}
        user={user ?? undefined}
        mobileOpen={open}
        onClose={() => setOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar role={role} user={user ?? undefined} onMenu={() => setOpen(true)} />
        <main className="flex-1 bg-[repeating-linear-gradient(0deg,var(--sheet-line)_0px,var(--sheet-line)_1px,transparent_1px,transparent_32px)]">
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
