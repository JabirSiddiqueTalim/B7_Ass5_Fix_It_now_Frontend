import { getMyBookings } from "../../_actions/getMyBookings";
import { TechnicianBookings } from "../../_components/technician-bookings";

export default async function TechnicianBookingsPage() {
  const bookings = await getMyBookings().catch(() => []);

  return <TechnicianBookings initialBookings={bookings} />;
}
