import { getAccessToken, serverFetch } from "@/lib/api";
import type { TechnicianListItem } from "@/lib/types";
import { getMyProfile } from "./getMyProfile";

export const getMyTechnician = async (): Promise<TechnicianListItem | null> => {
  const user = await getMyProfile().catch(() => null);
  const profileId = user?.technicianProfile?.id;
  if (!profileId) return null;

  const token = await getAccessToken();
  return serverFetch<TechnicianListItem>(
    `/api/technician/${profileId}`,
    undefined,
    token
  );
};
