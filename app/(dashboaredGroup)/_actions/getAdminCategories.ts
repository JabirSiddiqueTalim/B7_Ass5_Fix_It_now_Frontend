"use server";

import { getAccessToken, serverFetch } from "@/lib/api";
import type { AdminCategoryListItem } from "@/lib/types";

export const getAdminCategories = async (): Promise<AdminCategoryListItem[]> => {
  const token = await getAccessToken();
  return serverFetch<AdminCategoryListItem[]>(
    "/api/admin/categories",
    undefined,
    token
  );
};
