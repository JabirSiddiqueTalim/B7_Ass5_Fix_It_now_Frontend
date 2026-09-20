import "server-only";
import { Agent } from "undici";

const MAX_ATTEMPTS = 3;
const ATTEMPT_TIMEOUT_MS = 20000;
const CONNECT_TIMEOUT_MS = 5000;
const RETRY_DELAY_MS = 500;

const agent = new Agent({ connect: { timeout: CONNECT_TIMEOUT_MS } });

type FetchInit = RequestInit & { dispatcher?: Agent };

interface AttemptError extends Error {
  cause?: { code?: string };
}

function isTimeoutError(error: unknown): boolean {
  const e = error as { name?: string; message?: string };
  return (
    e?.name === "TimeoutError" ||
    e?.name === "AbortError" ||
    typeof e?.message === "string" &&
      e.message.includes("aborted due to timeout")
  );
}

function isNetworkError(error: unknown): boolean {
  const cause = (error as AttemptError)?.cause;
  const code = cause?.code;
  if (typeof code === "string") {
    return /^(ECONNREFUSED|ECONNRESET|ENOTFOUND|ETIMEDOUT|EAI_AGAIN|EHOSTUNREACH|ENETUNREACH|UND_ERR_CONNECT_TIMEOUT|UND_ERR_SOCKET|UND_ERR_HEADERS_TIMEOUT)/.test(
      code
    );
  }
  return error instanceof TypeError || isTimeoutError(error);
}

export async function backendFetch(
  url: string,
  init?: RequestInit
): Promise<Response> {
  let lastError: unknown;
  let lastAttempt = 0;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    lastAttempt = attempt;
    try {
      const res = await fetch(
        url,
        {
          ...init,
          signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
          dispatcher: agent,
        } as FetchInit as RequestInit
      );
      return res;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS && isNetworkError(error)) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        continue;
      }
      break;
    }
  }

  const reason =
    lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(
    `Could not reach the backend (attempt ${lastAttempt}/${MAX_ATTEMPTS}): ${reason}`
  );
}