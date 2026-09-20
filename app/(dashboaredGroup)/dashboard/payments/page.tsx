import { getMyPayments } from "../../_actions/getMyPayments";
import { PaymentsList } from "../../_components/payments-list";

export default async function UserPaymentsPage() {
  const payments = await getMyPayments();

  return <PaymentsList payments={payments} />;
}
