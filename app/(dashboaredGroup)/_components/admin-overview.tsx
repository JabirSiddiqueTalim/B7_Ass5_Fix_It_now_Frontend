import Link from "next/link";
import type {
  AdminBookingListItem,
  AdminCategoryListItem,
  AdminUserListItem,
  BookingStatus,
  PaginationMeta,
} from "@/lib/types";
import { formatBDT, formatDateTime } from "@/lib/utils";
import { ACTIVE_STATUSES } from "@/lib/booking-status";
import { StatCard } from "./stat-card";
import { BookingStatusBadge } from "./booking-status-badge";

const QUICK_LINKS = [
  {
    href: "/admin-dashboard/users",
    label: "Users",
    hint: "search · filter · ban",
  },
  {
    href: "/admin-dashboard/bookings",
    label: "Bookings",
    hint: "every ticket, every tech",
  },
  {
    href: "/admin-dashboard/categories",
    label: "Categories",
    hint: "the service directory",
  },
];

// Revenue is computed from bookings because the API exposes no admin
// payments route: sum priceAtBooking where the status implies the
// customer paid (PAID → IN_PROGRESS → COMPLETED).
const PAID_STATUSES: BookingStatus[] = ["PAID", "IN_PROGRESS", "COMPLETED"];

function countStatus(bookings: AdminBookingListItem[], statuses: BookingStatus[]): number {
  return bookings.filter((b) => statuses.includes(b.status)).length;
}

export function AdminOverview({
  users,
  bookings,
  categories,
}: {
  users: { data: AdminUserListItem[]; meta: PaginationMeta };
  bookings: { data: AdminBookingListItem[]; meta: PaginationMeta };
  categories: AdminCategoryListItem[];
}) {
  const technicians = users.data.filter((u) => u.role === "TECHNICIAN").length;
  const banned = users.data.filter((u) => u.status === "BANNED").length;
  const activeBookings = countStatus(bookings.data, ACTIVE_STATUSES);
  const completedBookings = countStatus(bookings.data, ["COMPLETED"]);
  const revenue = bookings.data.reduce((sum, b) => {
    if (!PAID_STATUSES.includes(b.status)) return sum;
    const amount = Number(b.priceAtBooking);
    return sum + (Number.isFinite(amount) ? amount : 0);
  }, 0);

  const recent = [...bookings.data]
    .sort(
      (a, b) =>
        new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-ticket">
      <header className="space-y-1">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-safety">
          Operations · overview
        </p>
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink">
          Dispatch board
        </h2>
        <p className="text-sm text-steel">
          Platform-wide health — people, tickets and revenue at a glance.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total users"
          value={users.meta.total}
          hint={`${technicians} technician${technicians === 1 ? "" : "s"} · ${banned} banned · ${categories.length} categor${categories.length === 1 ? "y" : "ies"}`}
        />
        <StatCard
          label="Total bookings"
          value={bookings.meta.total}
          hint={`${activeBookings} active right now`}
        />
        <StatCard
          label="Completed"
          value={completedBookings}
          hint="done & delivered"
        />
        <StatCard
          label="Revenue"
          value={formatBDT(revenue)}
          hint="paid bookings · computed from tickets"
        />
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group rounded-md border-2 border-ink bg-bone p-5 shadow-[4px_4px_0_rgba(33,30,25,0.1)] transition-transform hover:-translate-y-0.5"
          >
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-safety">
              {link.label}
            </p>
            <p className="mt-1.5 text-sm text-steel">{link.hint}</p>
            <p className="mt-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ink transition-colors group-hover:text-safety">
              Open →
            </p>
          </Link>
        ))}
      </section>

      <section className="rounded-md border-2 border-dashed border-ink/30 bg-ticket-hi p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-safety">
              Recent bookings
            </p>
            <p className="mt-1 text-sm text-steel">
              The five most recent tickets across the platform.
            </p>
          </div>
          <Link
            href="/admin-dashboard/bookings"
            className="rounded-sm border-2 border-ink bg-ink px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-bone transition-colors hover:bg-safety hover:text-ink"
          >
            View all
          </Link>
        </div>

        {recent.length > 0 ? (
          <ul className="mt-4">
            {recent.map((b) => (
              <li
                key={b.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b border-dashed border-ink/15 py-3 last:border-none"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-[15px] font-bold text-ink">
                    Ticket · {b.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-steel">
                    {b.customer?.name ?? "Customer"} ·{" "}
                    {b.technician?.user?.name ?? "Technician"} ·{" "}
                    {formatDateTime(b.scheduledAt)}
                  </p>
                </div>
                <span className="font-display text-sm font-bold text-ink">
                  {formatBDT(b.priceAtBooking)}
                </span>
                <BookingStatusBadge status={b.status} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-steel/70">
            No bookings on file yet.
          </p>
        )}
      </section>
    </div>
  );
}
