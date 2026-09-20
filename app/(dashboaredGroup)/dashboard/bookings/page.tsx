import { getMyBookings } from "../../_actions/getMyBookings";
import { BookingsList } from "../../_components/bookings-list";
import { PaymentConfirmWatcher } from "../../_components/payment-confirm-watcher";

export default async function UserBookingsPage() {
  const bookings = await getMyBookings();

  return (
    <>
      <BookingsList bookings={bookings} />
      <PaymentConfirmWatcher bookings={bookings} />
    </>
  );
}
