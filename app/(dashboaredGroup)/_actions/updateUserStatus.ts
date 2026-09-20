"use server";

import { z } from "zod";
import type { User, UserStatus } from "@/lib/types";
import { mutateBackend, type MutationResult } from "./mutate";

const schema = z.enum(["ACTIVE", "BANNED"]);

export async function updateUserStatus(
  userId: string,
  status: UserStatus
): Promise<MutationResult<User>> {
  const parsed = schema.safeParse(status);

  if (!parsed.success) {
    return { success: false, message: "Status must be ACTIVE or BANNED." };
  }

  return mutateBackend<User>(`/api/admin/user/${userId}`, "PATCH", {
    status: parsed.data,
  });
}
