"use client";

import { useState } from "react";
import type {
  AdminBookingListItem,
  BookingStatus,
  PaginationMeta,
} from "@/lib/types";
import { formatBDT, formatDateTime } from "@/lib/utils";
import { Pagination } from "./pagination";
import { BookingStatusBadge } from "./booking-status-badge";
import { BookingDetailDialog } from "./booking-detail-dialog";
import { EmptyState } from "./empty-state";

const BOOKING_STATUSES: BookingStatus[] = [
  "REQUESTED",
  "ACCEPTED",
  "DECLINED",
  "PAID",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

const selectCls =
  "rounded-sm border-2 border-ink/30 bg-bone px-3 py-2 text-sm text-ink focus:border-safety focus:outline-none";

function makeHref(
  search: string,
  status?: string,
  fromDate?: string,
  toDate?: string,
  page?: number
) {
  const q = new URLSearchParams();
  if (search) q.set("search", search);
  if (status) q.set("status", status);
  if (fromDate) q.set("fromDate", fromDate);
  if (toDate) q.set("toDate", toDate);
  if (page && page > 1) q.set("page", String(page));
  const qs = q.toString();
  return qs ? `/admin-dashboard/bookings?${qs}` : "/admin-dashboard/bookings";
}

export function AdminBookingsBoard({
  bookings,
  meta,
  search,
  status,
  fromDate,
  toDate,
}: {
  bookings: AdminBookingListItem[];
  meta: PaginationMeta;
  search: string;
  status?: BookingStatus;
  fromDate?: string;
  toDate?: string;
}) {
  const [detailId, setDetailId] = useState<string | null>(null);
  const detailBooking = bookings.find((b) => b.id === detailId) ?? null;
  const hasFilters = Boolean(search || status || fromDate || toDate);

  return (
    <div className="space-y-6 animate-ticket">
      <header className="space-y-1">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-safety">
          Operations · tickets
        </p>
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink">
          Bookings
        </h2>
        <p className="text-sm text-steel">
          Every ticket on the platform, across every technician.
        </p>
      </header>

      <form
        action="/admin-dashboard/bookings"
        method="get"
        className="flex flex-wrap items-end gap-3 rounded-md border-2 border-ink bg-bone p-4 shadow-[4px_4px_0_rgba(33,30,25,0.1)]"
      >
        <div className="min-w-0 flex-1 basis-48">
          <label
            htmlFor="admin-bookings-search"
            className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-steel"
          >
            Find
          </label>
          <input
            id="admin-bookings-search"
            name="search"
            type="search"
            defaultValue={search}
            placeholder="Customer or technician name…"
            className="mt-1.5 w-full rounded-sm border-2 border-ink/30 bg-ticket px-3 py-2 text-sm text-ink placeholder:text-ink/30 focus:border-safety focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="admin-bookings-status"
            className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-steel"
          >
            Status
          </label>
          <select
            id="admin-bookings-status"
            name="status"
            defaultValue={status ?? ""}
            className={`mt-1.5 ${selectCls}`}
          >
            <option value="">Any status</option>
            {BOOKING_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="admin-bookings-from"
            className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-steel"
          >
            From
          </label>
          <input
            id="admin-bookings-from"
            name="fromDate"
            type="date"
            defaultValue={fromDate ?? ""}
            className={`mt-1.5 ${selectCls}`}
          />
        </div>
        <div>
          <label
            htmlFor="admin-bookings-to"
            className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-steel"
          >
            To
          </label>
          <input
            id="admin-bookings-to"
            name="toDate"
            type="date"
            defaultValue={toDate ?? ""}
            className={`mt-1.5 ${selectCls}`}
          />
        </div>
        <button
          type="submit"
          className="h-10 rounded-sm border-2 border-ink bg-ink px-4 font-mono text-xs font-bold uppercase tracking-widest text-bone transition-colors hover:bg-safety hover:text-ink"
        >
          Apply
        </button>
        {hasFilters && (
          <a
            href="/admin-dashboard/bookings"
            className="h-10 rounded-sm border-2 border-safety px-3 py-2 font-mono text-xs font-bold uppercase tracking-widest text-safety transition-colors hover:bg-safety hover:text-ink"
          >
            Clear
          </a>
        )}
      </form>

      <p className="font-mono text-[11px] uppercase tracking-wider text-steel">
        {"// "}
        {meta.total} ticket{meta.total === 1 ? "" : "s"} on file
        {status && <> · {status.replace("_", " ")}</>}
      </p>

      {bookings.length > 0 ? (
        <div className="overflow-hidden rounded-md border-2 border-ink bg-bone shadow-[4px_4px_0_rgba(33,30,25,0.1)]">
          <ul className="divide-y divide-dashed divide-ink/15">
            {bookings.map((b) => (
              <li
                key={b.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4"
              >
                <div className="min-w-0 flex-1 basis-40">
                  <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-steel">
                    Ticket · {b.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="truncate font-display text-[15px] font-bold text-ink">
                    {b.customer?.name ?? "Customer"}
                  </p>
                  <p className="truncate font-mono text-[11px] text-steel">
                    {b.technician?.user?.name ?? "Technician"}
                  </p>
                </div>
                <div className="w-40 min-w-0">
                  <p className="font-mono text-[11px] text-steel">
                    {formatDateTime(b.scheduledAt)}
                  </p>
                  {b.address && (
                    <p className="truncate text-xs text-steel/70">
                      {b.address}
                    </p>
                  )}
                </div>
                <span className="font-display text-sm font-bold text-ink">
                  {formatBDT(b.priceAtBooking)}
                </span>
                <BookingStatusBadge status={b.status} />
                <button
                  type="button"
                  onClick={() => setDetailId(b.id)}
                  className="rounded-sm border-2 border-ink bg-ink px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-bone transition-colors hover:bg-safety hover:text-ink"
                >
                  Details
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <EmptyState
          title="No bookings match."
          description="Try a different status, date range, or clear the filters."
          actionHref="/admin-dashboard/bookings"
          actionLabel="Clear filters"
        />
      )}

      <Pagination
        currentPage={meta.page}
        totalPages={meta.totalPages}
        makeHref={(page) => makeHref(search, status, fromDate, toDate, page)}
      />

      <BookingDetailDialog
        bookingId={detailId}
        customerName={detailBooking?.customer?.name ?? null}
        open={detailId !== null}
        onClose={() => setDetailId(null)}
      />
    </div>
  );
}
