"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import type { BookingListItem } from "@/lib/types";
import { formatBDT, formatDateTime } from "@/lib/utils";
import { BookingStatusBadge } from "./booking-status-badge";
import { getAdminBookingDetail } from "../_actions/getAdminBookingDetail";

export function BookingDetailDialog({
  bookingId,
  customerName,
  open,
  onClose,
}: {
  bookingId: string | null;
  customerName: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<BookingListItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !bookingId) return;
    let cancelled = false;

    getAdminBookingDetail(bookingId)
      .then((data) => {
        if (!cancelled) {
          setDetail(data);
          setError(null);
          setLoadedFor(bookingId);
        }
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setError(e.message || "Couldn\u2019t load this booking.");
          setLoadedFor(bookingId);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open, bookingId]);

  const loading = open && !!bookingId && loadedFor !== bookingId;

  return (
    <Dialog open={open} onClose={onClose} title="Booking detail">
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 w-40 rounded bg-ink/10" />
          <div className="h-4 w-64 rounded bg-ink/10" />
          <div className="h-4 w-52 rounded bg-ink/10" />
        </div>
      ) : detail ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-[11px] uppercase tracking-wider text-steel">
              Ticket · {detail.id.slice(0, 8).toUpperCase()}
            </p>
            <BookingStatusBadge status={detail.status} />
          </div>

          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-steel">
              Service
            </p>
            <p className="font-display text-lg font-bold text-ink">
              {detail.service?.title ?? "—"}
            </p>
            <p className="text-sm text-steel">{detail.service?.description}</p>
          </div>

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="font-mono text-[10px] uppercase tracking-wider text-steel">
                Customer
              </dt>
              <dd className="text-ink">{customerName ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-mono text-[10px] uppercase tracking-wider text-steel">
                Technician
              </dt>
              <dd className="text-ink">
                {detail.technician?.user?.name ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-mono text-[10px] uppercase tracking-wider text-steel">
                Scheduled
              </dt>
              <dd className="text-ink">{formatDateTime(detail.scheduledAt)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-mono text-[10px] uppercase tracking-wider text-steel">
                Price
              </dt>
              <dd className="font-display font-bold text-ink">
                {formatBDT(detail.priceAtBooking)}
              </dd>
            </div>
          </dl>

          {detail.address && (
            <p className="text-sm text-steel">Address · {detail.address}</p>
          )}
          {detail.notes && (
            <p className="text-sm italic text-steel/80">“{detail.notes}”</p>
          )}
          {detail.cancelReason && (
            <p className="text-sm text-red-700">
              Cancelled: {detail.cancelReason}
            </p>
          )}
          {detail.payment && (
            <p className="font-mono text-[10px] uppercase tracking-wider text-steel">
              Payment · {detail.payment.status.toLowerCase()}
            </p>
          )}
        </div>
      ) : null}
    </Dialog>
  );
}
