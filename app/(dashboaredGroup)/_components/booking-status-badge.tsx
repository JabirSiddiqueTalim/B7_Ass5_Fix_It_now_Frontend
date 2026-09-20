import type { BookingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<BookingStatus, string> = {
  REQUESTED: "border-amber-600/60 bg-amber-50 text-amber-900",
  ACCEPTED: "border-blue-600/60 bg-blue-50 text-blue-900",
  DECLINED: "border-red-600/60 bg-red-50 text-red-900",
  PAID: "border-green-700/60 bg-green-50 text-green-900",
  IN_PROGRESS: "border-purple-600/60 bg-purple-50 text-purple-900",
  COMPLETED: "border-emerald-700/60 bg-emerald-50 text-emerald-900",
  CANCELLED: "border-ink/30 bg-muted text-muted-foreground",
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
