import Link from "next/link";
import type {
  BookingListItem,
  BookingStatus,
  PaymentListItem,
  User,
} from "@/lib/types";
import { formatBDT, formatDate } from "@/lib/utils";
import { StatCard } from "./stat-card";
import { BookingStatusBadge } from "./booking-status-badge";
import { EmptyState } from "./empty-state";

const ACTIVE_STATUSES: BookingStatus[] = [
  "REQUESTED",
  "ACCEPTED",
  "PAID",
  "IN_PROGRESS",
];

export function DashboardOverview({
  user,
  bookings,
  payments,
}: {
  user: User;
  bookings: BookingListItem[];
  payments: PaymentListItem[];
}) {
  const firstName = user.name?.trim().split(/\s+/)[0] ?? "there";
  const totalSpent = payments.reduce((sum, payment) => {
    const amount = Number(payment.amount);
    return sum + (Number.isFinite(amount) ? amount : 0);
  }, 0);
  const activeCount = bookings.filter((b) =>
    ACTIVE_STATUSES.includes(b.status)
  ).length;
  const completedCount = bookings.filter((b) => b.status === "COMPLETED").length;

  const recent = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
    )
    .slice(0, 4);

  return (
    <div className="space-y-8 animate-ticket">
      <header className="space-y-1">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-safety">
          Dispatch desk · overview
        </p>
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink">
          Good to see you, {firstName}.
        </h2>
        <p className="text-sm text-steel">
          Here&apos;s the state of your bookings and payments.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total bookings"
          value={bookings.length}
          hint={`${activeCount} active right now`}
        />
        <StatCard
          label="Active jobs"
          value={activeCount}
          hint="requested → in progress"
        />
        <StatCard
          label="Completed"
          value={completedCount}
          hint="done & ready to review"
        />
        <StatCard
          label="Total spent"
          value={formatBDT(totalSpent)}
          hint={`${payments.length} payment${payments.length === 1 ? "" : "s"}`}
        />
      </div>

      <section className="rounded-md border-2 border-dashed border-ink/30 bg-ticket-hi p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-safety">
              Recent bookings
            </p>
            <p className="mt-1 text-sm text-steel">
              The four most recent tickets on your book.
            </p>
          </div>
          <Link
            href="/dashboard/bookings"
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
                    {b.service?.title ?? "Service"}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-steel">
                    {b.technician?.user?.name ?? "Technician"} ·{" "}
                    {formatDate(b.scheduledAt)}
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
          <div className="mt-4">
            <EmptyState
              title="No bookings yet."
              description="Head to the services board and tear off a ticket to get started."
              actionHref="/services"
              actionLabel="Browse services"
            />
          </div>
        )}
      </section>
    </div>
  );
}
