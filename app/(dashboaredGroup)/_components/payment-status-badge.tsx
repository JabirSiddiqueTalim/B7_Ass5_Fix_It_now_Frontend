import type { PaymentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<PaymentStatus, string> = {
  PENDING: "border-amber-700/60 bg-ticket text-amber-900 dark:border-amber-400/60 dark:text-amber-300",
  COMPLETED: "border-green-800/60 bg-ticket text-green-900 dark:border-green-400/60 dark:text-green-300",
  FAILED: "border-red-700/60 bg-ticket text-red-800 dark:border-red-400/60 dark:text-red-300",
  REFUNDED: "border-ink/40 bg-ticket text-steel",
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
