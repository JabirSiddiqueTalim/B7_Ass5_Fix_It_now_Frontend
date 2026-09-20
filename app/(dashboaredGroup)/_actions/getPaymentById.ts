"use server";

import { getAccessToken, serverFetch } from "@/lib/api";
import type { PaymentListItem } from "@/lib/types";

export const getPaymentById = async (id: string): Promise<PaymentListItem> => {
  const token = await getAccessToken();
  return serverFetch<PaymentListItem>(`/api/payment/${id}`, undefined, token);
};