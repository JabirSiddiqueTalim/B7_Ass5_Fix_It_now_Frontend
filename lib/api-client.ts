import { TOKEN_COOKIE, TOKEN_KEY } from "./backend";

export { TOKEN_KEY, TOKEN_COOKIE };

export class ApiClientError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
  }
}

interface Envelope<T> {
  success?: boolean;
  message?: string;
  errorDetails?: string;
  error?: string;
  data?: T;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      window.localStorage.setItem(TOKEN_KEY, token);
      document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(
        token
      )}; Max-Age=2592000; Path=/; SameSite=Lax`;
    } else {
      window.localStorage.removeItem(TOKEN_KEY);
      document.cookie = `${TOKEN_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
    }
  } catch {
    // localStorage/cookies unavailable; ignore.
  }
}

const MAX_ATTEMPTS = 3;
const ATTEMPT_TIMEOUT_MS = 5000;
const RETRY_DELAY_MS = 150;

function isTimeoutError(error: unknown): boolean {
  return (
    error instanceof DOMException
      ? error.name === "TimeoutError"
      : (error as { name?: string })?.name === "TimeoutError" ||
        /timed out|aborted/i.test(
          (error as { message?: string })?.message ?? ""
        )
  );
}

function isNetworkError(error: unknown): boolean {
  const cause = (error as { cause?: { code?: string } })?.cause;
  const code = cause?.code;
  if (typeof code === "string") {
    return /^(ECONNREFUSED|ECONNRESET|ENOTFOUND|ETIMEDOUT|EAI_AGAIN|EHOSTUNREACH|ENETUNREACH|UND_ERR_CONNECT_TIMEOUT|UND_ERR_SOCKET|UND_ERR_HEADERS_TIMEOUT)/.test(
      code
    );
  }
  return error instanceof TypeError || isTimeoutError(error);
}

export async function apiFetch<T = unknown>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const token = getToken();
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let lastError: unknown;
  let res: Response | null = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const timeout = AbortSignal.timeout(ATTEMPT_TIMEOUT_MS);
      const signal = init?.signal
        ? AbortSignal.any([init.signal, timeout])
        : timeout;
      res = await fetch(path, {
        ...init,
        headers,
        cache: "no-store",
        signal,
      });
      break;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS && isNetworkError(error)) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        continue;
      }
      throw isTimeoutError(error)
        ? new ApiClientError("The server is taking too long to respond. Please check that the backend is running and try again.", 0)
        : error;
    }
  }

  if (!res) {
    throw lastError ?? new Error("Network request failed.");
  }

  const json = (await res.json().catch(() => null)) as Envelope<T> | null;

  if (!res.ok || json?.success === false) {
    throw new ApiClientError(
      json?.message ?? json?.error ?? res.statusText,
      res.status
    );
  }

  return json?.data as T;
}