import { backendFetch } from "@/lib/fetch-backend";
import { BACKEND_URL } from "@/lib/backend";

export class ServiceNotFoundError extends Error {
  constructor(id: string) {
    super(`Service not found: ${id}`);
    this.name = "ServiceNotFoundError";
  }
}

export const getServiceById = async (id: string) => {
  const res = await backendFetch(`${BACKEND_URL}/api/services/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (res.status === 404) {
    throw new ServiceNotFoundError(id);
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch service (${res.status})`);
  }

  return res.json();
};
