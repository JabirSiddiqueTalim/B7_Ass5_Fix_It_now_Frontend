"use server";

import { getAccessToken, serverFetchPage } from "@/lib/api";
import type {
  AdminUserListItem,
  PaginationMeta,
  Role,
  UserStatus,
} from "@/lib/types";

export interface AdminUsersFilters {
  role?: Role;
  status?: UserStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export const getAdminUsers = async (
  filters: AdminUsersFilters = {}
): Promise<{ data: AdminUserListItem[]; meta: PaginationMeta }> => {
  const token = await getAccessToken();

  const qs = new URLSearchParams();
  if (filters.role) qs.set("role", filters.role);
  if (filters.status) qs.set("status", filters.status);
  if (filters.search) qs.set("search", filters.search);
  if (filters.page) qs.set("page", String(filters.page));
  if (filters.limit) qs.set("limit", String(filters.limit));
  const query = qs.toString();

  return serverFetchPage<AdminUserListItem>(
    query ? `/api/admin/allUsers?${query}` : "/api/admin/allUsers",
    undefined,
    token
  );
};
