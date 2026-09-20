import type { BookingStatus, DayOfWeek, Role, UpdateBookingStatusRequest } from "@/lib/types";

export interface StatusAction {
  status: UpdateBookingStatusRequest;
  label: string;
  kind: "primary" | "danger";
}

export const ACTIVE_STATUSES: BookingStatus[] = [
  "REQUESTED",
  "ACCEPTED",
  "PAID",
  "IN_PROGRESS",
];

export const DAYS_OF_WEEK: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

/**
 * Allowed next technician actions per booking status.
 * Mirrors the lifecycle in ApiDocumentation §3.5:
 *   REQUESTED → ACCEPTED | DECLINED
 *   PAID → IN_PROGRESS
 *   IN_PROGRESS → COMPLETED
 */
export function nextActionsForBooking(
  status: BookingStatus,
  role: Role
): StatusAction[] {
  if (role !== "TECHNICIAN") return [];

  switch (status) {
    case "REQUESTED":
      return [
        { status: "ACCEPTED", label: "Accept", kind: "primary" },
        { status: "DECLINED", label: "Decline", kind: "danger" },
      ];
    case "PAID":
      return [{ status: "IN_PROGRESS", label: "Start job", kind: "primary" }];
    case "IN_PROGRESS":
      return [{ status: "COMPLETED", label: "Complete job", kind: "primary" }];
    default:
      return [];
  }
}
