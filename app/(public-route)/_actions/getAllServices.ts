import { backendFetch } from "@/lib/fetch-backend";
import { BACKEND_URL } from "@/lib/backend";

export interface GetAllServicesParams {
  search?: string;
  category?: string;
  page?: number;
}

const REVALIDATE_SECONDS = 7 * 24 * 60 * 60; // 7 days

export const getAllServices = async (filters: GetAllServicesParams = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.page && filters.page > 1) params.set("page", String(filters.page));
    const query = params.toString();

    const res = await backendFetch(`${BACKEND_URL}/api/services/${query ? `?${query}` : ""}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "force-cache",
        next: {
            revalidate: REVALIDATE_SECONDS,
            tags: ["public-services"],
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch services");
    }

    return res.json();
}
