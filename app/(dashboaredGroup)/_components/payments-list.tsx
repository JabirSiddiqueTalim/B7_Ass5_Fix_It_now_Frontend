"use client";

import { useState } from "react";
import Link from "next/link";
import type { PaymentListItem } from "@/lib/types";
import { formatBDT, formatDate } from "@/lib/utils";
import { PaymentStatusBadge } from "./payment-status-badge";
import { PaymentDetailDialog } from "./payment-detail-dialog";
import { EmptyState } from "./empty-state";

export function PaymentsList({ payments }: { payments: PaymentListItem[] }) {
  const [receiptId, setReceiptId] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-ticket">
      <header className="space-y-1">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-safety">
          Ledger · payment history
        </p>
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink">
          Payments
        </h2>
        <p className="text-sm text-steel">
          Every charge against your account, in taka.
        </p>
      </header>

      {payments.length > 0 ? (
        <ul className="space-y-4">
          {payments.map((p) => (
            <li
              key={p.id}
              className="rounded-md border-2 border-ink bg-bone shadow-[4px_4px_0_rgba(33,30,25,0.1)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-dashed border-ink/15 px-5 py-3">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-steel">
                  {p.transactionId}
                </p>
                <PaymentStatusBadge status={p.status} />
              </div>

              <div className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate font-display text-lg font-bold text-ink">
                    {p.booking?.service?.title ?? "Booking payment"}
                  </p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-steel/70">
                    {formatDate(p.paidAt ?? p.createdAt)}
                  </p>
                  {p.booking?.id && (
                    <Link
                      href="/dashboard/bookings"
                      className="mt-2 inline-block font-mono text-[10px] font-bold uppercase tracking-widest text-safety underline-offset-2 hover:underline"
                    >
                      View booking →
                    </Link>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-display text-xl font-bold text-ink">
                    {formatBDT(p.amount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setReceiptId(p.id)}
                    className="rounded-sm border-2 border-ink bg-ink px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-bone transition-colors hover:bg-safety hover:text-ink"
                  >
                    Receipt
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="No payments yet."
          description="Payments appear here once you pay for an accepted booking."
          actionHref="/dashboard/bookings"
          actionLabel="See bookings"
        />
      )}

      <PaymentDetailDialog
        paymentId={receiptId}
        open={receiptId !== null}
        onClose={() => setReceiptId(null)}
      />
    </div>
  );
}