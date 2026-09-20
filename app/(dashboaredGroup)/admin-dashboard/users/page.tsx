import type {
  AdminUserListItem,
  PaginationMeta,
  Role,
  UserStatus,
} from "@/lib/types";
import { getAdminUsers } from "../../_actions/getAdminUsers";
import { UsersBoard } from "../../_components/users-board";

interface AdminUsersSearchParams {
  [key: string]: string | string[] | undefined;
}

const ROLES: Role[] = ["CUSTOMER", "TECHNICIAN"];
const STATUSES: UserStatus[] = ["ACTIVE", "BANNED"];

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<AdminUsersSearchParams>;
}) {
  const sp = await searchParams;

  const search = typeof sp.search === "string" ? sp.search : "";
  const role = ROLES.includes(sp.role as Role)
    ? (sp.role as Role)
    : undefined;
  const status = STATUSES.includes(sp.status as UserStatus)
    ? (sp.status as UserStatus)
    : undefined;
  const page = Math.max(1, Number(typeof sp.page === "string" ? sp.page : "1") || 1);

  let data: AdminUserListItem[] = [];
  let meta: PaginationMeta = { page, limit: 100, total: 0, totalPages: 0 };
  let error: string | null = null;

  try {
    const result = await getAdminUsers({
      role,
      status,
      search: search || undefined,
      page,
      limit: 100,
    });
    data = result.data;
    meta = result.meta;
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
  }

  return (
    <UsersBoard
      users={data}
      meta={meta}
      error={error}
      search={search}
      role={role}
      status={status}
    />
  );
}
