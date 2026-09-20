"use server";

import { getAccessToken, serverFetch } from "@/lib/api";
import type { BookingListItem } from "@/lib/types";

export const getAdminBookingDetail = async (
  id: string
): Promise<BookingListItem> => {
  const token = await getAccessToken();
  return serverFetch<BookingListItem>(`/api/bookings/${id}`, undefined, token);
};
