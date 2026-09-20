import "server-only";
import { getAccessToken } from "@/lib/api";
import { BACKEND_URL } from "@/lib/backend";
import { backendFetch } from "@/lib/fetch-backend";

export interface MutationResult<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export async function mutateBackend<T = unknown>(
  path: string,
  method: "POST" | "PATCH" | "PUT",
  body: unknown
): Promise<MutationResult<T>> {
  const token = await getAccessToken();

  let res: Response;
  try {
    res = await backendFetch(`${BACKEND_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Check your connection and try again.",
    };
  }

  const result = (await res.json().catch(() => null)) as {
    success: boolean;
    statusCode: number;
    message: string;
    data?: T;
  } | null;

  if (!res.ok || !result?.success) {
    return {
      success: false,
      message: result?.message ?? "Something went wrong. Try again.",
    };
  }

  return {
    success: true,
    message: result.message ?? "Done.",
    data: result.data,
  };
}
