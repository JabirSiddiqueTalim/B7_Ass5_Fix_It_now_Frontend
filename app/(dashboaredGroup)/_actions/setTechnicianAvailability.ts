"use server";

import { z } from "zod";
import type { AvailabilityRequest, TechnicianAvailability } from "@/lib/types";
import { mutateBackend, type MutationResult } from "./mutate";

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

const slotSchema = z
  .object({
    dayOfWeek: z.enum(DAYS),
    startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Times must be HH:mm."),
    endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Times must be HH:mm."),
  })
  .refine((s) => s.startTime < s.endTime, {
    message: "Start time must be before end time.",
  });

const schema = z
  .array(slotSchema)
  .min(1, "Add at least one time slot before saving.");

export async function setTechnicianAvailability(
  input: AvailabilityRequest
): Promise<MutationResult<TechnicianAvailability[]>> {
  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid availability data.",
    };
  }

  return mutateBackend<TechnicianAvailability[]>(
    "/api/technician/availability",
    "PUT",
    parsed.data
  );
}
