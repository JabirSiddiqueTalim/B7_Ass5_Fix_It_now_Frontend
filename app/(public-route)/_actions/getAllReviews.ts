import { backendFetch } from "@/lib/fetch-backend";
import { BACKEND_URL } from "@/lib/backend";

const REVALIDATE_SECONDS = 7 * 24 * 60 * 60; // 7 days

export const getAllReviews = async () => {
    const res = await backendFetch(`${BACKEND_URL}/api/review`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "force-cache",
        next: {
            revalidate: REVALIDATE_SECONDS,
            tags: ["public-reviews"],
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch reviews");
    }

    const result = await res.json();

    return result
}
