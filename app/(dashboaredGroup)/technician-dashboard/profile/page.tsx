import type { User } from "@/lib/types";
import { RecordError } from "../../_components/Userprofile/record-error";
import { TechnicianProfileForm } from "../../_components/technician-profile-form";
import { getMyProfile } from "../../_actions/getMyProfile";

export default async function TechnicianProfilePage() {
  const user: User | null = await getMyProfile().catch(() => null);

  if (!user) {
    return <RecordError retryHref="/technician-dashboard/profile" />;
  }

  return <TechnicianProfileForm user={user} />;
}
