"use server";

import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/api";
import { BACKEND_URL } from "@/lib/backend";
import { backendFetch } from "@/lib/fetch-backend";

export interface CreateBookingResult {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: { id: string };
}

export async function createBooking(input: {
  serviceId: string;
  scheduledAt: string;
  address: string;
  notes?: string;
}): Promise<CreateBookingResult> {
  const token = await getAccessToken();
  if (!token) {
    return {
      success: false,
      message: "You need to sign in before booking a service.",
    };
  }

  let res: Response;
  try {
    res = await backendFetch(`${BACKEND_URL}/api/bookings/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
      cache: "no-store",
    });
  } catch {
    return {
      success: false,
      message:
        "Could not reach the server. Check your connection and try again.",
    };
  }

  const result = (await res.json().catch(() => null)) as {
    success: boolean;
    statusCode: number;
    message: string;
    data?: { id: string };
  } | null;

  if (!res.ok || !result?.success) {
    const status = result?.statusCode ?? res.status;
    let message = result?.message ?? "Booking failed. Try again.";
    if (status === 401) {
      message = "Your session has expired — please sign in again.";
    } else if (status === 400 && !result?.message) {
      message =
        "Couldn't book that slot. Check the time and address, then try again.";
    }
    return { success: false, message, statusCode: status };
  }

  redirect("/dashboard/bookings");
}
