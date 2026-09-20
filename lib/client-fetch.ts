export class ClientError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ClientError";
    this.status = status;
  }
}

interface Envelope<T> {
  data?: T;
  error?: string;
  message?: string;
}

export async function clientFetch<T = unknown>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const json = (await res.json().catch(() => null)) as Envelope<T> | null;

  if (!res.ok) {
    const message = json?.error ?? json?.message ?? res.statusText;
    throw new ClientError(message, res.status);
  }

  return json?.data as T;
}
