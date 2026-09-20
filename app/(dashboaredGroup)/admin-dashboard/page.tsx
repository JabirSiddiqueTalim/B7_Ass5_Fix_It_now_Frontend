import { getAdminUsers } from "../_actions/getAdminUsers";
import { getAdminBookings } from "../_actions/getAdminBookings";
import { getAdminCategories } from "../_actions/getAdminCategories";
import { AdminOverview } from "../_components/admin-overview";
import { RecordError } from "../_components/Userprofile/record-error";

export default async function AdminDashboardPage() {
  const [users, bookings, categories] = await Promise.all([
    getAdminUsers({ limit: 100 }).catch(() => null),
    getAdminBookings({ limit: 100 }).catch(() => null),
    getAdminCategories().catch(() => []),
  ]);

  if (!users || !bookings) {
    return <RecordError retryHref="/admin-dashboard" />;
  }

  return (
    <AdminOverview users={users} bookings={bookings} categories={categories} />
  );
}
