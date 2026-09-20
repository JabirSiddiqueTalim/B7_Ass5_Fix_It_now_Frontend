"use server";

import { getAccessToken, serverFetch } from "@/lib/api";
import type { BookingListItem } from "@/lib/types";

export async function getMyBookings(): Promise<BookingListItem[]> {
  const token = await getAccessToken();
  return serverFetch<BookingListItem[]>("/api/bookings", undefined, token);
}
