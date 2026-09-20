"use server";

import { getAccessToken } from "@/lib/api";
import { BACKEND_URL } from "@/lib/backend";
import { backendFetch } from "@/lib/fetch-backend";

export interface CreatePaymentResult {
  success: boolean;
  message: string;
  data?: { transactionId: string; paymentURL: string };
}

export async function createPayment(
  bookingId: string
): Promise<CreatePaymentResult> {
  const token = await getAccessToken();

  let res: Response;
  try {
    res = await backendFetch(`${BACKEND_URL}/api/payment/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ bookingId }),
      cache: "no-store",
    });
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
    data?: { transactionId: string; paymentURL: string };
  } | null;

  if (!res.ok || !result?.success) {
    const status = result?.statusCode ?? res.status;
    let message = result?.message ?? "Starting payment failed. Try again.";
    if (status === 400 && !result?.message) {
      message = "This booking is no longer ACCEPTED. Ask your technician to re-accept it.";
    } else if (status === 409 && !result?.message) {
      message = "This booking is already paid.";
    }
    return { success: false, message };
  }

  return {
    success: true,
    message: result.message ?? "Payment started.",
    data: result.data,
  };
}
