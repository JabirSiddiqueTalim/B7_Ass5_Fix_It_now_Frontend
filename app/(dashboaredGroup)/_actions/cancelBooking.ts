"use server";

import { getAccessToken } from "@/lib/api";
import { BACKEND_URL } from "@/lib/backend";
import { backendFetch } from "@/lib/fetch-backend";

export interface CancelBookingResult {
  success: boolean;
  message: string;
}

export async function cancelBooking(
  bookingId: string,
  cancelReason?: string
): Promise<CancelBookingResult> {
  const token = await getAccessToken();

  let res: Response;
  try {
    res = await backendFetch(
      `${BACKEND_URL}/api/bookings/${bookingId}/cancel`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          cancelReason: cancelReason?.trim() || undefined,
        }),
        cache: "no-store",
      }
    );
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Check your connection and try again.",
    };
  }

  const result = (await res.json().catch(() => null)) as {
    success: boolean;
    statusCode: number;
    message: string;
    data?: unknown;
  } | null;

  if (!res.ok || !result?.success) {
    return {
      success: false,
      message: result?.message ?? "Cancelling the booking failed. Try again.",
    };
  }

  return { success: true, message: result.message ?? "Booking cancelled." };
}
