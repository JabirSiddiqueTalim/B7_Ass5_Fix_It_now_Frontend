"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

export function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const priorFocus = document.activeElement as HTMLElement | null;
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      priorFocus?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const dialog = (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="w-full max-w-md rounded-sm border-2 border-ink/80 bg-ticket-hi p-6 text-ink shadow-[6px_6px_0_rgba(27,42,74,0.25)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 flex items-center justify-between border-b-2 border-dashed border-ink/25 pb-3">
            <h2 className="font-display text-lg font-bold tracking-tight">
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="flex size-8 items-center justify-center rounded-sm border-2 border-ink/40 text-steel transition-colors hover:border-ink hover:bg-ticket hover:text-ink"
            >
              ✕
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );

  return typeof document === "undefined" ? null : createPortal(dialog, document.body);
}
