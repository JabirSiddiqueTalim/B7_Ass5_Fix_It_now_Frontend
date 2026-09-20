"use server";

import { z } from "zod";
import { updateTag } from "next/cache";
import type { Category, CreateCategoryRequest } from "@/lib/types";
import { mutateBackend, type MutationResult } from "./mutate";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  description: z.string().trim().optional(),
});

export async function createCategory(
  input: CreateCategoryRequest
): Promise<MutationResult<Category>> {
  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid category data.",
    };
  }

  const result = await mutateBackend<Category>(
    "/api/admin/categories",
    "POST",
    parsed.data
  );

  if (result.success) {
    updateTag("public-categories");
  }

  return result;
}
