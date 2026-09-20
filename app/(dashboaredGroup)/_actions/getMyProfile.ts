import { getAccessToken, serverFetch } from "@/lib/api";
import type { User } from "@/lib/types";

export const getMyProfile = async (): Promise<User> => {
  const token = await getAccessToken();
  return serverFetch<User>("/api/auth/me", undefined, token);
};
