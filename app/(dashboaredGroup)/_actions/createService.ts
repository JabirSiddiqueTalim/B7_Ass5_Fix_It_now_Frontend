"use server";

import { z } from "zod";
import { updateTag } from "next/cache";
import type { CreateServiceRequest, Service } from "@/lib/types";
import { mutateBackend, type MutationResult } from "./mutate";

const schema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters."),
  description: z.string().trim().min(1, "Description is required."),
  category: z.string().trim().min(1, "Category is required."),
  price: z.coerce.number().positive("Price must be a positive number."),
  durationMins: z.coerce
    .number()
    .int()
    .positive("Duration must be a positive number.")
    .optional(),
});

export async function createService(
  input: CreateServiceRequest
): Promise<MutationResult<Service>> {
  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid service data.",
    };
  }

  const result = await mutateBackend<Service>("/api/services/", "POST", parsed.data);

  if (result.success) {
    updateTag("public-services");
  }

  return result;
}
