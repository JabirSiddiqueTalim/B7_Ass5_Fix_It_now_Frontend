import { getMyTechnician } from "../../_actions/getMyTechnician";
import { getCategories } from "../../_actions/getCategories";
import { ServicesBoard } from "../../_components/services-board";
import { RecordError } from "../../_components/Userprofile/record-error";

export default async function TechnicianServicesPage() {
  const [technician, categories] = await Promise.all([
    getMyTechnician(),
    getCategories(),
  ]);

  if (!technician) {
    return <RecordError retryHref="/technician-dashboard/services" />;
  }

  return (
    <ServicesBoard services={technician.services ?? []} categories={categories} />
  );
}
