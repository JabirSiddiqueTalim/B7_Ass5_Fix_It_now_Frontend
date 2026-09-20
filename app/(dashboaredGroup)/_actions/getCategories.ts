"use server";

import { serverFetch } from "@/lib/api";
import type { Category } from "@/lib/types";

interface CategoryListResponse {
  meta: { page: number; limit: number; total: number; totalPages: number };
  data: Category[];
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await serverFetch<CategoryListResponse>("/api/category/");
  return response?.data ?? [];
};
