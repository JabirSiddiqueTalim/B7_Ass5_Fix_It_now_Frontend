import "server-only";
import { cookies } from "next/headers";
import type { ApiEnvelope, PaginationMeta } from "@/lib/types";
import { BACKEND_URL, TOKEN_COOKIE } from "@/lib/backend";
import { backendFetch } from "@/lib/fetch-backend";

function decodeCookieValue(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function getAccessToken(): Promise<string | null> {
  const store = await cookies();
  const cookie = store.get(TOKEN_COOKIE)?.value;
  return cookie ? decodeCookieValue(cookie) : null;
}

export function decodeJwtRole(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf-8")
    ) as { role?: string };
    return decoded.role ?? null;
  } catch {
    return null;
  }
}

export async function getRole(): Promise<string | null> {
  const token = await getAccessToken();
  if (!token) return null;
  return decodeJwtRole(token);
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function serverFetch<T = unknown>(
  path: string,
  init?: RequestInit,
  tokenOverride?: string | null
): Promise<T> {
  const token =
    tokenOverride !== undefined ? tokenOverride : await getAccessToken();

  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await backendFetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const json = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!res.ok || !json?.success) {
    throw new ApiError(json?.message ?? res.statusText, res.status);
  }

  return json.data as T;
}

export async function serverFetchPage<T>(
  path: string,
  init?: RequestInit,
  tokenOverride?: string | null
): Promise<{ data: T[]; meta: PaginationMeta }> {
  const token =
    tokenOverride !== undefined ? tokenOverride : await getAccessToken();

  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await backendFetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const json = (await res.json().catch(() => null)) as ApiEnvelope<T[]> | null;

  if (!res.ok || !json?.success) {
    throw new ApiError(json?.message ?? res.statusText, res.status);
  }

  const payload = json.data as unknown;

  const isNestedPayload =
    !!payload &&
    typeof payload === "object" &&
    !Array.isArray(payload) &&
    "data" in (payload as Record<string, unknown>);

  const data = isNestedPayload
    ? ((payload as { data?: T[] }).data ?? [])
    : Array.isArray(payload)
      ? (payload as T[])
      : [];

  const fallbackMeta: PaginationMeta = {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  };

  const meta = isNestedPayload
    ? (payload as { meta?: PaginationMeta }).meta ?? json.meta ?? fallbackMeta
    : json.meta ?? fallbackMeta;

  return { data, meta };
}
