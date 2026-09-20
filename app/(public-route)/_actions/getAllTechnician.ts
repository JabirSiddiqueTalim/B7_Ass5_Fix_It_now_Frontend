import { backendFetch } from "@/lib/fetch-backend";
import { BACKEND_URL } from "@/lib/backend";

const REVALIDATE_SECONDS = 7 * 24 * 60 * 60; // 7 days

export const getAllTechnician = async () => {
    const res = await backendFetch(`${BACKEND_URL}/api/technician`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "force-cache",
        next: {
            revalidate: REVALIDATE_SECONDS,
            tags: ["public-technicians"],
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch technicians");
    }

    return res.json();
}
