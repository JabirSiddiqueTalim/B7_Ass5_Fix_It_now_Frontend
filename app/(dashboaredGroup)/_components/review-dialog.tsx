"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import type { BookingListItem } from "@/lib/types";
import { createReview } from "../_actions/createReview";

const VERDICTS: Record<number, string> = {
  1: "Wouldn\u2019t rebook",
  2: "Rough work",
  3: "Got the job done",
  4: "Good, minor gripes",
  5: "Straight back to this pro",
};

const ALLOWED = "\u2605"; // ★
const IDLE = "\u2606"; // ☆

export function ReviewDialog({
  open,
  onClose,
  onReviewed,
  booking,
}: {
  open: boolean;
  onClose: () => void;
  onReviewed: () => void;
  booking: BookingListItem;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (dir) {
        e.preventDefault();
        setRating((r) => Math.min(5, Math.max(1, (r || 0) + dir)));
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const shown = hovered || rating;

  function handleSubmit() {
    if (rating < 1) {
      toast.error("Pick a rating first.");
      return;
    }
    startTransition(async () => {
      const res = await createReview(booking.id, rating, comment.trim());
      if (res.success) {
        toast.success(res.message);
        onReviewed();
        onClose();
        router.refresh();
      } else if (res.status === 409) {
        // Server says this booking is already reviewed. Update local state
        // so the UI reflects the reviewed status and close the dialog.
        toast.success(res.message || "You already reviewed this booking.");
        onReviewed();
        onClose();
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  }

  return (
    <Dialog open={open} onClose={onClose} title="Leave a review">
      <p className="text-sm text-muted-foreground">
        Rate the work on{" "}
        <span className="font-semibold text-foreground">
          {booking.service?.title ?? "this booking"}
        </span>
        . One review per booking — you can&apos;t change it later.
      </p>

      <div
        className="mt-4 flex items-center justify-between"
        role="radiogroup"
        aria-label="Rating from 1 to 5"
      >
        {[1, 2, 3, 4, 5].map((value) => {
          const active = value <= shown;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} star${value === 1 ? "" : "s"}`}
              className="group relative inline-flex size-10 items-center justify-center text-3xl leading-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              onPointerEnter={() => setHovered(value)}
              onPointerLeave={() => setHovered(0)}
              onClick={() => setRating(value)}
            >
              <span
                className={
                  active
                    ? "animate-punch text-amber-500"
                    : "text-zinc-300 transition-colors group-hover:text-amber-500"
                }
              >
                {active ? ALLOWED : IDLE}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-3 min-h-5 text-sm text-muted-foreground">
        {rating >= 1 ? `${rating}/5 — ${VERDICTS[rating]}` : "Tap a star to rate."}
      </p>

      <label
        htmlFor="review-note"
        className="mb-1 mt-4 block text-sm font-medium text-foreground"
      >
        Comment <span className="font-normal text-muted-foreground">(optional)</span>
      </label>
      <textarea
        id="review-note"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        maxLength={500}
        placeholder="What should the next customer know?"
        className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
      />

      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={pending}
          className="rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-60"
        >
          Not now
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={pending || rating < 1}
          className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 disabled:opacity-60"
        >
          {pending && (
            <span
              aria-hidden
              className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent"
            />
          )}
          {pending ? "Posting\u2026" : "Post review"}
        </button>
      </div>
    </Dialog>
  );
}