"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import type { DayOfWeek, TechnicianAvailability } from "@/lib/types";
import { DAYS_OF_WEEK } from "@/lib/booking-status";
import { cn } from "@/lib/utils";
import { setTechnicianAvailability } from "../_actions/setTechnicianAvailability";

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
}

const DAY_LABELS: Record<DayOfWeek, string> = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
  SUNDAY: "Sun",
};

function emptyDraft(): Record<DayOfWeek, { start: string; end: string }> {
  return Object.fromEntries(
    DAYS_OF_WEEK.map((day) => [day, { start: "09:00", end: "17:00" }])
  ) as Record<DayOfWeek, { start: string; end: string }>;
}

export function AvailabilitySheet({
  initialSlots,
}: {
  initialSlots: TechnicianAvailability[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [drafts, setDrafts] = useState(emptyDraft);

  const [slots, setSlots] = useState<Record<DayOfWeek, Slot[]>>(() => {
    const grouped = Object.fromEntries(
      DAYS_OF_WEEK.map((day) => [day, [] as Slot[]])
    ) as Record<DayOfWeek, Slot[]>;

    for (const slot of initialSlots) {
      grouped[slot.dayOfWeek].push({
        id: slot.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
    }
    return grouped;
  });

  const totalSlots = useMemo(
    () => Object.values(slots).reduce((sum, list) => sum + list.length, 0),
    [slots]
  );

  function addSlot(day: DayOfWeek) {
    const { start, end } = drafts[day];
    if (!start || !end) {
      toast.error("Pick a start and end time.");
      return;
    }
    if (start >= end) {
      toast.error("Start time must be before end time.");
      return;
    }
    setSlots((prev) => ({
      ...prev,
      [day]: [...prev[day], { id: crypto.randomUUID(), startTime: start, endTime: end }],
    }));
  }

  function removeSlot(day: DayOfWeek, id: string) {
    setSlots((prev) => ({
      ...prev,
      [day]: prev[day].filter((s) => s.id !== id),
    }));
  }

  function handleSave() {
    const payload = DAYS_OF_WEEK.flatMap((day) =>
      slots[day].map((slot) => ({
        dayOfWeek: day,
        startTime: slot.startTime,
        endTime: slot.endTime,
      }))
    );

    startTransition(async () => {
      const res = await setTechnicianAvailability(payload);
      if (res.success) {
        toast.success(res.message);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-3xl animate-ticket space-y-6">
      <header className="space-y-1">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-safety">
          Workshop file · schedule
        </p>
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink">
          Availability
        </h2>
        <p className="text-sm text-steel">
          Weekly working hours — customers can only book within these windows.
        </p>
      </header>

      <div className="rounded-md border-2 border-ink bg-bone shadow-[4px_4px_0_rgba(33,30,25,0.1)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-dashed border-ink/15 px-5 py-3">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-steel">
            Weekly hours · {totalSlots} slot{totalSlots === 1 ? "" : "s"}
          </p>
          <button
            type="button"
            onClick={handleSave}
            disabled={pending || totalSlots === 0}
            className="rounded-sm border-2 border-ink bg-ink px-4 py-1.5 font-display text-sm font-bold text-bone transition-colors hover:bg-safety hover:text-ink disabled:pointer-events-none disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save schedule"}
          </button>
        </div>

        <ul className="divide-y divide-dashed divide-ink/15">
          {DAYS_OF_WEEK.map((day) => {
            const daySlots = slots[day];
            return (
              <li key={day} className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-safety">
                      {DAY_LABELS[day]} · {day}
                    </p>

                    {daySlots.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {daySlots.map((slot) => (
                          <span
                            key={slot.id}
                            className="inline-flex items-center gap-1.5 rounded-sm border border-ink/30 bg-ticket px-2 py-1 font-mono text-[11px] font-medium tracking-wider text-ink"
                          >
                            {slot.startTime}–{slot.endTime}
                            <button
                              type="button"
                              onClick={() => removeSlot(day, slot.id)}
                              aria-label={`Remove ${slot.startTime}–${slot.endTime}`}
                              className="text-ink/50 transition-colors hover:text-red-700"
                            >
                              <X className="size-3" aria-hidden />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-steel/60">
                        No hours set
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <label className="sr-only" htmlFor={`av-${day}-start`}>
                      Start time
                    </label>
                    <input
                      id={`av-${day}-start`}
                      type="time"
                      value={drafts[day].start}
                      onChange={(e) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [day]: { ...prev[day], start: e.target.value },
                        }))
                      }
                      className="rounded-sm border-2 border-ink/30 bg-bone px-2 py-1 font-mono text-xs text-ink focus:border-safety focus:outline-none"
                    />
                    <span className="font-mono text-[10px] text-steel">→</span>
                    <label className="sr-only" htmlFor={`av-${day}-end`}>
                      End time
                    </label>
                    <input
                      id={`av-${day}-end`}
                      type="time"
                      value={drafts[day].end}
                      onChange={(e) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [day]: { ...prev[day], end: e.target.value },
                        }))
                      }
                      className="rounded-sm border-2 border-ink/30 bg-bone px-2 py-1 font-mono text-xs text-ink focus:border-safety focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => addSlot(day)}
                      aria-label={`Add hours on ${DAY_LABELS[day]}`}
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-sm border-2 border-ink bg-ink text-bone transition-colors hover:bg-safety hover:text-ink"
                      )}
                    >
                      <Plus className="size-4" aria-hidden />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {totalSlots === 0 && (
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-steel/70">
          No schedule saved yet — add at least one block and hit save.
        </p>
      )}
    </div>
  );
}
