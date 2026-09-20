"use server";

import { getAccessToken, serverFetchPage } from "@/lib/api";
import type {
  AdminBookingListItem,
  BookingStatus,
  PaginationMeta,
} from "@/lib/types";

export interface AdminBookingsFilters {
  status?: BookingStatus;
  customerId?: string;
  technicianId?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const getAdminBookings = async (
  filters: AdminBookingsFilters = {}
): Promise<{ data: AdminBookingListItem[]; meta: PaginationMeta }> => {
  const token = await getAccessToken();

  const qs = new URLSearchParams();
  if (filters.status) qs.set("status", filters.status);
  if (filters.customerId) qs.set("customerId", filters.customerId);
  if (filters.technicianId) qs.set("technicianId", filters.technicianId);
  if (filters.fromDate) qs.set("fromDate", filters.fromDate);
  if (filters.toDate) qs.set("toDate", filters.toDate);
  if (filters.search) qs.set("search", filters.search);
  if (filters.page) qs.set("page", String(filters.page));
  if (filters.limit) qs.set("limit", String(filters.limit));
  const query = qs.toString();

  return serverFetchPage<AdminBookingListItem>(
    query ? `/api/admin/bookings?${query}` : "/api/admin/bookings",
    undefined,
    token
  );
};
