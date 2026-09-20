import type { BookingListItem } from "@/lib/types";
import { formatBDT, formatDateTime } from "@/lib/utils";
import { BookingStatusBadge } from "./booking-status-badge";
import { BookingActions } from "./booking-actions";
import { EmptyState } from "./empty-state";

export function BookingsList({ bookings }: { bookings: BookingListItem[] }) {
  return (
    <div className="space-y-6 animate-ticket">
      <header className="space-y-1">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-safety">
          Your book · all tickets
        </p>
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink">
          Bookings
        </h2>
        <p className="text-sm text-steel">
          {bookings.length} ticket{bookings.length === 1 ? "" : "s"} on file.
        </p>
      </header>

      {bookings.length > 0 ? (
        <ul className="space-y-4">
          {bookings.map((b) => (
            <li
              key={b.id}
              className="rounded-md border-2 border-ink bg-bone shadow-[4px_4px_0_rgba(33,30,25,0.1)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-dashed border-ink/15 px-5 py-3">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-steel">
                  Ticket · {b.id.slice(0, 8).toUpperCase()}
                </p>
                <BookingStatusBadge status={b.status} />
              </div>

              <div className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <p className="truncate font-display text-lg font-bold text-ink">
                    {b.service?.title ?? "Service"}
                  </p>
                  <p className="mt-1 text-sm text-steel">
                    {b.technician?.user?.name ?? "Technician"}
                    {b.technician?.location
                      ? ` · ${b.technician.location}`
                      : ""}
                  </p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-steel/70">
                    {formatDateTime(b.scheduledAt)}
                  </p>
                  {b.address && (
                    <p className="mt-1 text-sm text-steel/80">{b.address}</p>
                  )}
                  {b.notes && (
                    <p className="mt-1 text-sm italic text-steel/80">
                      “{b.notes}”
                    </p>
                  )}
                  {b.status === "CANCELLED" && b.cancelReason && (
                    <p className="mt-1 text-sm text-red-700">
                      Cancelled: {b.cancelReason}
                    </p>
                  )}
                  {b.payment && (
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-steel/70">
                      Payment · {b.payment.status.toLowerCase()}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-display text-xl font-bold text-ink">
                    {formatBDT(b.priceAtBooking)}
                  </span>
                  <BookingActions booking={b} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="No bookings yet."
          description="Once you book a service, the ticket shows up here with its full status trail."
          actionHref="/services"
          actionLabel="Browse services"
        />
      )}
    </div>
  );
}
