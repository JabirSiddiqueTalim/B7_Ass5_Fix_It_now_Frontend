"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { BookingListItem, UpdateBookingStatusRequest } from "@/lib/types";
import { formatBDT, formatDateTime } from "@/lib/utils";
import { nextActionsForBooking } from "@/lib/booking-status";
import { BookingStatusBadge } from "./booking-status-badge";
import { EmptyState } from "./empty-state";
import { updateBookingStatus } from "../_actions/updateBookingStatus";

const primaryBtn =
  "inline-flex items-center justify-center rounded-sm border-2 border-ink bg-ink px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-bone transition-colors hover:bg-safety hover:text-ink disabled:pointer-events-none disabled:opacity-50";
const dangerBtn =
  "inline-flex items-center justify-center rounded-sm border-2 border-ink/70 bg-transparent px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:border-red-700 hover:bg-red-700 hover:text-white disabled:pointer-events-none disabled:opacity-50";

export function TechnicianBookings({
  initialBookings,
}: {
  initialBookings: BookingListItem[];
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [bookings, setBookings] = useState(initialBookings);
  const [pendingId, setPendingId] = useState<string | null>(null);

  function handleAction(booking: BookingListItem, next: UpdateBookingStatusRequest) {
    const previous = booking.status;

    setBookings((prev) =>
      prev.map((b) => (b.id === booking.id ? { ...b, status: next } : b))
    );
    setPendingId(booking.id);

    startTransition(async () => {
      const res = await updateBookingStatus(booking.id, next);

      if (res.success) {
        toast.success(res.message);
        router.refresh();
      } else {
        setBookings((prev) =>
          prev.map((b) => (b.id === booking.id ? { ...b, status: previous } : b))
        );
        toast.error(res.message);
      }
      setPendingId(null);
    });
  }

  return (
    <div className="space-y-6 animate-ticket">
      <header className="space-y-1">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-safety">
          Workshop bench · incoming tickets
        </p>
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink">
          Bookings
        </h2>
        <p className="text-sm text-steel">
          {bookings.length} ticket{bookings.length === 1 ? "" : "s"} assigned to
          you.
        </p>
      </header>

      {bookings.length > 0 ? (
        <ul className="space-y-4">
          {bookings.map((b) => {
            const actions = nextActionsForBooking(b.status, "TECHNICIAN");
            const busy = pendingId === b.id;

            return (
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
                    {b.customer && (
                      <p className="mt-1 text-sm text-steel">
                        {b.customer.name}
                        {b.customer.phone ? ` · ${b.customer.phone}` : ""}
                      </p>
                    )}
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
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-3">
                    <span className="font-display text-xl font-bold text-ink">
                      {formatBDT(b.priceAtBooking)}
                    </span>
                    {actions.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        {actions.map((action) => (
                          <button
                            key={action.status}
                            type="button"
                            disabled={pendingId !== null}
                            onClick={() => handleAction(b, action.status)}
                            className={action.kind === "danger" ? dangerBtn : primaryBtn}
                          >
                            {busy ? "Working…" : action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState
          title="No bookings yet."
          description="When a customer books one of your services, the ticket lands here for you to accept."
          actionHref="/technician-dashboard/services"
          actionLabel="Manage services"
        />
      )}
    </div>
  );
}
