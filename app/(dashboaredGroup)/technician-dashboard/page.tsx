import { getMyProfile } from "../_actions/getMyProfile";
import { getMyBookings } from "../_actions/getMyBookings";
import { getMyTechnician } from "../_actions/getMyTechnician";
import { TechnicianOverview } from "../_components/technician-overview";
import { RecordError } from "../_components/Userprofile/record-error";

export default async function TechnicianDashboardPage() {
  const [user, bookings, technician] = await Promise.all([
    getMyProfile().catch(() => null),
    getMyBookings().catch(() => []),
    getMyTechnician(),
  ]);

  if (!user) {
    return <RecordError retryHref="/technician-dashboard" />;
  }

  return (
    <TechnicianOverview
      user={user}
      technician={technician}
      bookings={bookings}
    />
  );
}
