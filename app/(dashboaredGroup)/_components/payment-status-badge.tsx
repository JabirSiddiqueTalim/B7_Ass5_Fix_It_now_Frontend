import type { PaymentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<PaymentStatus, string> = {
  PENDING: "border-amber-600/60 bg-amber-50 text-amber-900",
  COMPLETED: "border-green-700/60 bg-green-50 text-green-900",
  FAILED: "border-red-600/60 bg-red-50 text-red-900",
  REFUNDED: "border-ink/30 bg-muted text-muted-foreground",
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-sm border-2 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em]",
        statusStyles[status]
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {status}
    </span>
  );
}
