import Link from "next/link";
import type { BookingListItem, BookingStatus, TechnicianListItem, User } from "@/lib/types";
import { formatBDT, formatDate } from "@/lib/utils";
import { ACTIVE_STATUSES } from "@/lib/booking-status";
import { StatCard } from "./stat-card";
import { BookingStatusBadge } from "./booking-status-badge";
import { EmptyState } from "./empty-state";

const QUICK_LINKS = [
  { href: "/technician-dashboard/profile", label: "Profile", hint: "bio · rate · skills" },
  { href: "/technician-dashboard/availability", label: "Availability", hint: "weekly schedule" },
  { href: "/technician-dashboard/services", label: "Services", hint: "what you offer" },
  { href: "/technician-dashboard/bookings", label: "Bookings", hint: "accept · start · complete" },
];

function countStatus(bookings: BookingListItem[], statuses: BookingStatus[]): number {
  return bookings.filter((b) => statuses.includes(b.status)).length;
}

export function TechnicianOverview({
  user,
  technician,
  bookings,
}: {
  user: User;
  technician: TechnicianListItem | null;
  bookings: BookingListItem[];
}) {
  const firstName = user.name?.trim().split(/\s+/)[0] ?? "there";
  const pending = countStatus(bookings, ["REQUESTED"]);
  const active = countStatus(bookings, ACTIVE_STATUSES);
  const completed = countStatus(bookings, ["COMPLETED"]);
  const earned = bookings.reduce((sum, b) => {
    if (b.status !== "COMPLETED") return sum;
    const amount = Number(b.priceAtBooking);
    return sum + (Number.isFinite(amount) ? amount : 0);
  }, 0);
  const serviceCount = technician?._count?.services ?? technician?.services?.length ?? 0;

  const recent = [...bookings]
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-8 animate-ticket">
      <header className="space-y-1">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-safety">
          Workshop · overview
        </p>
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink">
          Good to see you, {firstName}.
        </h2>
        <p className="text-sm text-steel">
          Your jobs, earnings and open requests at a glance.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total jobs"
          value={bookings.length}
          hint={`${serviceCount} service${serviceCount === 1 ? "" : "s"} on your board`}
        />
        <StatCard
          label="Pending requests"
          value={pending}
          hint="awaiting your accept or decline"
        />
        <StatCard
          label="Active jobs"
          value={active}
          hint="accepted → in progress"
        />
        <StatCard
          label="Earned"
          value={formatBDT(earned)}
          hint={`${completed} completed job${completed === 1 ? "" : "s"}`}
        />
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              The four most recent tickets on your bench.
            </p>
          </div>
          <Link
            href="/technician-dashboard/bookings"
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
                    {b.customer?.name ?? "Customer"} · {formatDate(b.scheduledAt)}
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
              description="Once customers book your services, the tickets show up here with their status trail."
              actionHref="/technician-dashboard/services"
              actionLabel="Add a service"
            />
          </div>
        )}
      </section>
    </div>
  );
}
