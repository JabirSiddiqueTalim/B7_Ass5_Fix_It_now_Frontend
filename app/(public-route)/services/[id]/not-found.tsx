"use client";

import { useParams } from "next/navigation";
import { NoTicket } from "../../_components/service-details/no-ticket";

function serialOf(id: string): string {
  return `FIN-${id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;
}

export default function ServiceNotFound() {
  const params = useParams<{ id: string }>();
  const serial = serialOf(params.id ?? "");
  return <NoTicket serial={serial} />;
}