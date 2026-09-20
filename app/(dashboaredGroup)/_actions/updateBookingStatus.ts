"use server";

import { z } from "zod";
import type { UpdateBookingStatusRequest } from "@/lib/types";
import { mutateBackend, type MutationResult } from "./mutate";

const schema = z.enum(["ACCEPTED", "DECLINED", "IN_PROGRESS", "COMPLETED"]);

export async function updateBookingStatus(
  bookingId: string,
  status: UpdateBookingStatusRequest
): Promise<MutationResult> {
  const parsed = schema.safeParse(status);

  if (!parsed.success) {
    return { success: false, message: "Invalid status transition." };
  }

  return mutateBackend(
    `/api/bookings/status/${bookingId}`,
    "PATCH",
    { status: parsed.data }
  );
}
