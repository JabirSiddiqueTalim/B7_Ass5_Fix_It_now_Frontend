"use client";

import { useSyncExternalStore, useState, useTransition } from "react";
import { toast } from "sonner";
import type { BookingListItem } from "@/lib/types";
import { CancelBookingDialog } from "./cancel-booking-dialog";
import { ReviewDialog } from "./review-dialog";
import { createPayment } from "../_actions/createPayment";

const primaryBtn =
  "inline-flex items-center justify-center rounded-sm border-2 border-ink bg-ink px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-bone transition-colors hover:bg-safety hover:text-ink disabled:pointer-events-none disabled:opacity-50";
const dangerBtn =
  "inline-flex items-center justify-center rounded-sm border-2 border-ink/70 bg-transparent px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:border-red-700 hover:bg-red-700 hover:text-white";
const reviewedBtn =
  "inline-flex items-center justify-center rounded-sm border-2 border-safety bg-safety px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink disabled:cursor-default disabled:opacity-80";

const REVIEWED_KEY = "fixitnow-reviewed-bookings";
const listeners = new Set<() => void>();

function readReviewedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(REVIEWED_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function subscribeReviewed(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function persistReviewed(id: string) {
  try {
    const ids = readReviewedIds();
    ids.add(id);
    localStorage.setItem(REVIEWED_KEY, JSON.stringify([...ids]));
  } catch {
    // storage unavailable — the store still updates for this session
  }
  for (const cb of listeners) cb();
}

export function BookingActions({ booking }: { booking: BookingListItem }) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewSession, setReviewSession] = useState(0);
  const [pendingPayment, startPayment] = useTransition();
  const { status, payment } = booking;
  const isConfirming = payment?.status === "PENDING";

  const locallyReviewed = useSyncExternalStore(
    subscribeReviewed,
    () => readReviewedIds().has(booking.id),
    () => false
  );
  const hasReview = locallyReviewed || booking.review != null;

  function openReview() {
    setReviewSession((s) => s + 1);
    setReviewOpen(true);
  }

  function handlePay() {
    startPayment(async () => {
      const res = await createPayment(booking.id);
      if (res.success && res.data?.paymentURL) {
        window.location.href = res.data.paymentURL;
      } else {
        toast.error(res.message);
      }
    });
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {status === "ACCEPTED" && (
          <button
            type="button"
            className={primaryBtn}
            onClick={handlePay}
            disabled={pendingPayment || isConfirming}
          >
            {isConfirming
              ? "Confirming…"
              : pendingPayment
                ? "Opening checkout…"
                : "Pay now"}
          </button>
        )}

        {(status === "REQUESTED" ||
          status === "ACCEPTED" ||
          status === "PAID") && (
          <button
            type="button"
            className={dangerBtn}
            onClick={() => setCancelOpen(true)}
          >
            Cancel
          </button>
        )}

        {status === "COMPLETED" && !hasReview && (
          <button
            type="button"
            className={primaryBtn}
            onClick={openReview}
          >
            Leave review
          </button>
        )}

        {status === "COMPLETED" && hasReview && (
          <button type="button" className={reviewedBtn} disabled>
            Reviewed
          </button>
        )}
      </div>

      <CancelBookingDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        bookingId={booking.id}
        serviceTitle={booking.service?.title ?? "this booking"}
      />

      <ReviewDialog
        key={reviewSession}
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        onReviewed={() => persistReviewed(booking.id)}
        booking={booking}
      />
    </>
  );
}
