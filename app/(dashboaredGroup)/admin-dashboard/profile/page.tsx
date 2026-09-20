import type { User } from "@/lib/types";
import { RecordCard } from "../../_components/Userprofile/record-card";
import { RecordError } from "../../_components/Userprofile/record-error";
import { getMyProfile } from "../../_actions/getMyProfile";

async function loadProfile(): Promise<User | null> {
  try {
    return await getMyProfile();
  } catch {
    return null;
  }
}

export default async function AdminProfilePage() {
  const user = await loadProfile();

  if (!user) {
    return <RecordError retryHref="/admin-dashboard/profile" />;
  }

  return <RecordCard user={user} />;
}
