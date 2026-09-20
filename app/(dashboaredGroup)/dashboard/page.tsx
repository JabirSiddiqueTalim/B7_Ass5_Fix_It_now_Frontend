import { getMyProfile } from "../_actions/getMyProfile";
import { getMyBookings } from "../_actions/getMyBookings";
import { getMyPayments } from "../_actions/getMyPayments";
import { DashboardOverview } from "../_components/dashboard-overview";
import { RecordError } from "../_components/Userprofile/record-error";

export default async function UserDashboardPage() {
  const [user, bookings, payments] = await Promise.all([
    getMyProfile().catch(() => null),
    getMyBookings(),
    getMyPayments(),
  ]);

  if (!user) {
    return <RecordError />;
  }

  return (
    <DashboardOverview user={user} bookings={bookings} payments={payments} />
  );
}
