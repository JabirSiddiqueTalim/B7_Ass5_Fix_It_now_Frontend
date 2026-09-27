import type { BookingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<BookingStatus, string> = {
  REQUESTED: "border-amber-700/60 bg-ticket text-amber-900 dark:border-amber-400/60 dark:text-amber-300",
  ACCEPTED: "border-blue-800/60 bg-ticket text-blue-900 dark:border-blue-400/60 dark:text-blue-300",
  DECLINED: "border-red-700/60 bg-ticket text-red-800 dark:border-red-400/60 dark:text-red-300",
  PAID: "border-green-800/60 bg-ticket text-green-900 dark:border-green-400/60 dark:text-green-300",
  IN_PROGRESS: "border-purple-800/60 bg-ticket text-purple-900 dark:border-purple-400/60 dark:text-purple-300",
  COMPLETED: "border-emerald-800/60 bg-ticket text-emerald-900 dark:border-emerald-400/60 dark:text-emerald-300",
  CANCELLED: "border-ink/40 bg-ticket text-steel",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-sm border-2 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em]",
        statusStyles[status]
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {status.replace("_", " ")}
    </span>
  );
}
