"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Dialog } from "@/components/ui/dialog";
import type { PaymentStatus } from "@/lib/types";
import { cn, formatBDT, formatDate, formatDateTime } from "@/lib/utils";
import { getPaymentById } from "../_actions/getPaymentById";

const STAMP: Record<PaymentStatus, { text: string; cls: string }> = {
  COMPLETED: { text: "PAID", cls: "border-safety text-safety/90" },
  PENDING: { text: "AWAITING", cls: "border-amber-600 text-amber-700" },
  FAILED: { text: "VOID", cls: "border-red-600 text-red-700" },
  REFUNDED: { text: "REFUNDED", cls: "border-steel text-steel" },
};

function Stamp({ status }: { status: PaymentStatus }) {
  const { text, cls } = STAMP[status];
  return (
    <div
      className={cn(
        "animate-stamp pointer-events-none absolute bottom-5 right-4 select-none",
        "font-mono text-xl font-black uppercase leading-none tracking-[0.18em]",
        "border-[3px] px-3 py-1.5",
        cls
      )}
    >
      {text}
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-steel">
        {label}
      </dt>
      <dd className="text-right font-mono text-[11px] uppercase tracking-wider text-ink">
        {children}
      </dd>
    </div>
  );
}

export function PaymentDetailDialog({
  paymentId,
  open,
  onClose,
}: {
  paymentId: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<Awaited<
    ReturnType<typeof getPaymentById>
  > | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !paymentId) return;
    let cancelled = false;

    getPaymentById(paymentId)
      .then((data) => {
        if (!cancelled) {
          setDetail(data);
          setError(null);
          setLoadedFor(paymentId);
        }
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setError(e.message || "Couldn\u2019t load this payment.");
          setLoadedFor(paymentId);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open, paymentId]);

  const loading = open && !!paymentId && loadedFor !== paymentId;

  return (
    <Dialog open={open} onClose={onClose} title="Payment receipt">
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 w-40 rounded bg-ink/10" />
          <div className="h-4 w-64 rounded bg-ink/10" />
          <div className="h-4 w-52 rounded bg-ink/10" />
        </div>
      ) : detail ? (
        <div className="relative overflow-hidden rounded-md border-2 border-ink bg-ticket-hi shadow-[4px_4px_0_rgba(33,30,25,0.15)]">
          <Stamp status={detail.status} />

          <header className="border-b-2 border-dashed border-ink/25 px-5 py-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-safety">
                  FixItNow
                </p>
                <p className="mt-1 font-display text-2xl font-bold tracking-tight text-ink">
                  Payment receipt
                </p>
              </div>
              <p className="pb-1 font-mono text-[11px] uppercase tracking-wider text-steel">
                {formatDate(detail.createdAt)}
              </p>
            </div>
          </header>

          <dl className="space-y-2.5 px-5 py-5">
            <Row label="Transaction">
              <span className="font-bold">{detail.transactionId}</span>
            </Row>

            <div className="my-3 border-t-2 border-dashed border-ink/25" />

            <div>
              <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-steel">
                For
              </dt>
              <dd className="mt-1 font-display text-lg font-bold leading-snug text-ink">
                {detail.booking?.service?.title ?? "Booking payment"}
              </dd>
              {detail.booking?.service?.description && (
                <dd className="mt-0.5 text-sm text-steel">
                  {detail.booking.service.description}
                </dd>
              )}
            </div>

            {detail.booking && (
              <Row label="Booking">
                <Link
                  href="/dashboard/bookings"
                  className="font-bold text-safety underline-offset-2 hover:underline"
                >
                  #{detail.booking.id.slice(0, 8).toUpperCase()}
                </Link>
              </Row>
            )}

            <Row label="Method">{detail.provider}</Row>
            <Row label={detail.paidAt ? "Paid at" : "Recorded"}>
              {formatDateTime(detail.paidAt ?? detail.createdAt)}
            </Row>

            {detail.failureReason && (
              <p className="text-sm text-red-700">{detail.failureReason}</p>
            )}
          </dl>

          <div className="flex items-center justify-between gap-4 border-t-2 border-dashed border-ink/25 bg-bone px-5 py-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-steel">
              Total
            </p>
            <p className="font-display text-3xl font-black tracking-tight text-ink">
              {formatBDT(detail.amount)}
            </p>
          </div>
        </div>
      ) : null}
    </Dialog>
  );
}