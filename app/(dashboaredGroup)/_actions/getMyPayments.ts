import { getAccessToken, serverFetch } from "@/lib/api";
import type { PaymentListItem } from "@/lib/types";

export const getMyPayments = async (): Promise<PaymentListItem[]> => {
  const token = await getAccessToken();
  return serverFetch<PaymentListItem[]>("/api/payment/", undefined, token);
};
