"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { cancelBooking } from "../_actions/cancelBooking";

export function CancelBookingDialog({
  open,
  onClose,
  bookingId,
  serviceTitle,
}: {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  serviceTitle: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [reason, setReason] = useState("");

  function handleConfirm() {
    startTransition(async () => {
      const res = await cancelBooking(bookingId, reason);
      if (res.success) {
        toast.success(res.message);
        setReason("");
        onClose();
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  }

  return (
    <Dialog open={open} onClose={onClose} title="Cancel booking?">
      <p className="text-sm text-muted-foreground">
        This will cancel{" "}
        <span className="font-semibold text-foreground">{serviceTitle}</span>.
        Once cancelled it can&apos;t be undone.
      </p>
      <label
        htmlFor="cancel-reason"
        className="mb-1 mt-4 block text-sm font-medium text-foreground"
      >
        Reason <span className="font-normal text-muted-foreground">(optional)</span>
      </label>
      <textarea
        id="cancel-reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={2}
        placeholder="Changed my mind…"
        className="w-full rounded-sm border-2 border-ink/50 bg-ticket px-3 py-2 text-sm text-ink placeholder:text-steel/60 focus-visible:border-safety focus-visible:ring-1 focus-visible:ring-safety/30 focus-visible:outline-none"
      />
      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-sm border-2 border-ink/40 px-3 py-2 text-sm font-medium text-steel transition-colors hover:border-ink hover:bg-ticket hover:text-ink"
        >
          Keep booking
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={pending}
          className="rounded-sm border-2 border-red-700/60 bg-transparent px-3 py-2 text-sm font-medium text-red-800 transition-colors hover:bg-red-700 hover:text-bone disabled:opacity-60"
        >
          {pending ? "Cancelling…" : "Cancel booking"}
        </button>
      </div>
    </Dialog>
  );
}
