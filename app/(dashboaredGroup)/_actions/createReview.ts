"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getAccessToken } from "@/lib/api";
import { BACKEND_URL } from "@/lib/backend";
import { backendFetch } from "@/lib/fetch-backend";

export interface CreateReviewResult {
  success: boolean;
  message: string;
  status?: number;
}

export async function createReview(
  bookingId: string,
  rating: number,
  comment?: string
): Promise<CreateReviewResult> {
  const token = await getAccessToken();

  let res: Response;
  try {
    res = await backendFetch(`${BACKEND_URL}/api/review/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        bookingId,
        rating,
        comment: comment?.trim() || undefined,
      }),
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
  } | null;

  if (!res.ok || !result?.success) {
    const status = result?.statusCode ?? res.status;
    let message = result?.message ?? "Posting the review failed. Try again.";
    if (status === 409 && !result?.message) {
      message = "You already reviewed this booking.";
    } else if (status === 400 && !result?.message) {
      message = "This booking can't be reviewed yet.";
    }
    return { success: false, message, status };
  }

  updateTag("public-services");
  updateTag("public-reviews");
  revalidatePath("/services/[id]", "page");

  return { success: true, message: result.message ?? "Review posted." };
}