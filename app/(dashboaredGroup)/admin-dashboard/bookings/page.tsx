import type { BookingStatus } from "@/lib/types";
import { getAdminBookings } from "../../_actions/getAdminBookings";
import { AdminBookingsBoard } from "../../_components/admin-bookings-board";

interface AdminBookingsSearchParams {
  [key: string]: string | string[] | undefined;
}

const BOOKING_STATUSES: BookingStatus[] = [
  "REQUESTED",
  "ACCEPTED",
  "DECLINED",
  "PAID",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<AdminBookingsSearchParams>;
}) {
  const sp = await searchParams;

  const search = typeof sp.search === "string" ? sp.search : "";
  const status = BOOKING_STATUSES.includes(sp.status as BookingStatus)
    ? (sp.status as BookingStatus)
    : undefined;
  const fromDate = typeof sp.fromDate === "string" ? sp.fromDate : undefined;
  const toDate = typeof sp.toDate === "string" ? sp.toDate : undefined;
  const page = Math.max(1, Number(typeof sp.page === "string" ? sp.page : "1") || 1);

  const { data, meta } = await getAdminBookings({
    status,
    fromDate,
    toDate,
    search: search || undefined,
    page,
    limit: 10,
  }).catch(() => ({
    data: [],
    meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
  }));

  return (
    <AdminBookingsBoard
      bookings={data}
      meta={meta}
      search={search}
      status={status}
      fromDate={fromDate}
      toDate={toDate}
    />
  );
}
