import { getMyTechnician } from "../../_actions/getMyTechnician";
import { AvailabilitySheet } from "../../_components/availability-sheet";
import { RecordError } from "../../_components/Userprofile/record-error";

export default async function TechnicianAvailabilityPage() {
  const technician = await getMyTechnician();

  if (!technician) {
    return <RecordError retryHref="/technician-dashboard/availability" />;
  }

  return <AvailabilitySheet initialSlots={technician.availability ?? []} />;
}
