"use server";

import { z } from "zod";
import type { UpdateTechnicianProfileRequest, User } from "@/lib/types";
import { mutateBackend, type MutationResult } from "./mutate";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  phone: z.string().trim().min(1, "Phone is required."),
  address: z.string().trim().optional(),
  avatarUrl: z.union([z.string().trim().url(), z.literal("")]).optional(),
  bio: z.string().trim().optional(),
  skills: z.array(z.string().trim().min(1)).optional(),
  hourlyRate: z.coerce.number().positive("Hourly rate must be a positive number.").optional(),
  experienceYrs: z.coerce.number().int().nonnegative("Experience must be zero or more.").optional(),
  location: z.string().trim().optional(),
});

export async function updateTechnicianProfile(
  input: UpdateTechnicianProfileRequest
): Promise<MutationResult<User>> {
  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid profile data.",
    };
  }

  const payload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(parsed.data)) {
    if (value === undefined) continue;
    if (typeof value === "string" && value.trim() === "") continue;
    payload[key] = value;
  }

  if (Object.keys(payload).length === 0) {
    return { success: false, message: "Nothing to update." };
  }

  return mutateBackend<User>("/api/technician/profile", "PATCH", payload);
}
