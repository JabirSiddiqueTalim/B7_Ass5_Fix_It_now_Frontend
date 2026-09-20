"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { ApiClientError, apiFetch, getToken } from "@/lib/api-client";
import type { User } from "@/lib/types";
import { formatBDT } from "@/lib/utils";
import {
  createBooking,
  type CreateBookingResult,
} from "../../_actions/createBooking";

const inputClass =
  "w-full rounded-none border-2 border-ink/70 bg-ticket px-3 py-2.5 font-mono text-sm text-ink placeholder:text-steel/60 focus:border-safety focus:outline-none";

const labelClass =
  "mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-steel";

function minDate(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function loginHref(serviceId: string): string {
  return `/login?next=${encodeURIComponent(`/services/${serviceId}`)}`;
}

export function BookServiceButton({
  serviceId,
  title,
  price,
  durationMins,
  location,
  serial,
}: {
  serviceId: string;
  title: string;
  price: string;
  durationMins: number;
  location: string | null;
  serial: string;
}) {
  const router = useRouter();
  const { user, status, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const touched = useRef(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  async function handleOpen() {
    if (!getToken() || status === "unauthenticated") {
      router.push(loginHref(serviceId));
      return;
    }
    touched.current = false;
    setAddress(user?.address ?? "");
    setError(null);
    setOpen(true);
    setLoadingProfile(true);
    try {
      const me = await apiFetch<User>("/api/auth/me");
      if (!touched.current) {
        setAddress(me.address ?? "");
      }
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 401) {
        setOpen(false);
        router.push(loginHref(serviceId));
      }
    } finally {
      setLoadingProfile(false);
    }
  }

  function handleClose() {
    setOpen(false);
    setError(null);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!date || !time) {
      setError("Pick a date and time for the visit.");
      return;
    }

    const scheduledAt = new Date(`${date}T${time}`);
    if (scheduledAt.getTime() <= Date.now()) {
      setError("That time has already passed — pick one in the future.");
      return;
    }

    const trimmedAddress = address.trim();
    if (!trimmedAddress) {
      setError("Add the address where the work happens.");
      return;
    }

    if (
      location &&
      !trimmedAddress.toLowerCase().includes(location.toLowerCase())
    ) {
      setError(
        `The technician only works in ${location} — your address must include it.`,
      );
      return;
    }

    startTransition(async () => {
      let res: CreateBookingResult | undefined;
      try {
        res = await createBooking({
          serviceId,
          scheduledAt: scheduledAt.toISOString(),
          address: trimmedAddress,
          notes: notes.trim() || undefined,
        });
      } catch {
        return;
      }
      if (!res) return;
      if (res.statusCode === 401) {
        setOpen(false);
        await logout();
        toast.error(res.message);
        router.push(loginHref(serviceId));
        return;
      }
      setError(res.message);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-sm border-2 border-ink bg-ink px-6 font-display text-base font-bold text-bone transition-colors hover:bg-safety hover:text-ink"
      >
        Book this job <span aria-hidden>{"\u2192"}</span>
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-board/80 p-4 backdrop-blur-sm"
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-label={`Book ${title}`}
          >
            <div
              className="my-auto w-full max-w-lg animate-ticket border-2 border-ink bg-ticket-hi shadow-[10px_10px_0_rgba(33,30,25,0.35)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-4 border-b-2 border-dashed border-ink/25 px-5 py-3 sm:px-6">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-steel">
                  {"// Book this job \u00b7 "}
                  {serial}
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close booking form"
                  className="flex size-8 shrink-0 items-center justify-center border-2 border-ink/40 font-mono text-sm text-ink transition-colors hover:border-safety hover:bg-safety"
                >
                  {"\u00d7"}
                </button>
              </div>

              <div className="flex items-baseline justify-between gap-4 border-b-2 border-dashed border-ink/25 px-5 py-4 sm:px-6">
                <div className="min-w-0">
                  <h2 className="truncate font-display text-2xl font-bold tracking-tight text-ink">
                    {title}
                  </h2>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-steel">
                    {durationMins} min
                    {location ? ` \u00b7 ${location}` : ""}
                  </p>
                </div>
                <p className="shrink-0 font-display text-2xl font-bold tabular-nums text-ink">
                  {formatBDT(price)}
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5 px-5 py-5 sm:px-6"
              >
                <div>
                  <p className={labelClass}>Schedule the visit</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="book-date" className="sr-only">
                        Date
                      </label>
                      <input
                        id="book-date"
                        type="date"
                        min={minDate()}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="book-time" className="sr-only">
                        Time
                      </label>
                      <input
                        id="book-time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>
                  <p className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-steel/70">
                    Slots must be in the future — same-day times still count.
                  </p>
                </div>

                <div>
                  <label htmlFor="book-address" className={labelClass}>
                    Address
                  </label>
                  <input
                    id="book-address"
                    type="text"
                    autoComplete="street-address"
                    value={address}
                    onChange={(e) => {
                      touched.current = true;
                      setAddress(e.target.value);
                    }}
                    placeholder="House, road, area"
                    className={inputClass}
                    required
                  />
                  {loadingProfile ? (
                    <p className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-steel/70">
                      Pulling your saved address…
                    </p>
                  ) : (
                    location && (
                      <p className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-steel/70">
                        Must include “{location}” — the technician only works
                        there.
                      </p>
                    )
                  )}
                </div>

                <div>
                  <label htmlFor="book-notes" className={labelClass}>
                    Notes{" "}
                    <span className="normal-case tracking-normal text-steel/70">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    id="book-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Door code, parking, anything the technician should know…"
                    className={inputClass}
                  />
                </div>

                {error && (
                  <p
                    role="alert"
                    className="flex items-start gap-2 border-2 border-dashed border-safety bg-ticket px-3 py-2.5 text-sm leading-relaxed text-ink"
                  >
                    <span
                      aria-hidden
                      className="font-mono text-sm font-bold text-safety"
                    >
                      {"\u2717"}
                    </span>
                    <span>{error}</span>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={pending || loadingProfile}
                  className="flex w-full items-center justify-center gap-2 rounded-none border-2 border-ink bg-ink px-4 py-3 font-display text-base font-bold text-bone transition-colors hover:bg-safety hover:text-ink disabled:pointer-events-none disabled:opacity-60"
                >
                  {pending ? (
                    <>
                      <span
                        aria-hidden
                        className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                      />
                      Booking…
                    </>
                  ) : loadingProfile ? (
                    "Checking your account…"
                  ) : (
                    "Book this job"
                  )}
                </button>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
