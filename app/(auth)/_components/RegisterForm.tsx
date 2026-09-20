"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { registerAction } from "../_actions/authAction";
import type { Role } from "@/lib/types";
import { Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-none border-2 border-ink/70 bg-ticket px-3 py-2.5 font-mono text-sm text-ink placeholder:text-steel/60 focus:border-safety focus:outline-none";

const slipInputClass =
  "w-full rounded-none border-2 border-ink/70 bg-bone px-3 py-2.5 font-mono text-sm text-ink placeholder:text-steel/60 focus:border-safety focus:outline-none";

const labelClass =
  "mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-steel";

const roleOptions = [
  {
    value: "CUSTOMER",
    label: "Customer",
    note: "I need a fix at home",
  },
  {
    value: "TECHNICIAN",
    label: "Technician",
    note: "I want to get hired",
  },
] as const;

export default function RegisterForm() {
  const [role, setRole] = useState<Role>("CUSTOMER");
  const [state, formAction, pending] = useActionState(registerAction, {
    success: false,
    message: null,
  });

  return (
    <div className="w-full max-w-xl border-2 border-ink/80 bg-ticket-hi">
      <div className="flex items-center justify-between gap-4 border-b-2 border-dashed border-ink/25 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-steel sm:px-6">
        <span>{"// New member"}</span>
        <span aria-hidden>{"\u25cb"} Form 02</span>
      </div>

      <form action={formAction} className="px-5 py-6 sm:px-6">
        <input type="hidden" name="role" value={role} />

        <fieldset className="border-0 p-0">
          <legend className={labelClass}>Account type</legend>
          <div className="grid grid-cols-2 gap-3" role="group" aria-label="Account type">
            {roleOptions.map((option) => {
              const active = role === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setRole(option.value)}
                  className={cn(
                    "flex flex-col gap-1 border-2 px-3 py-2.5 text-left transition-colors",
                    active
                      ? "border-ink bg-ink text-bone"
                      : "border-ink/40 bg-ticket text-ink hover:border-ink/70"
                  )}
                >
                  <span className="flex w-full items-center justify-between gap-2 font-display text-sm font-bold uppercase tracking-wide">
                    {option.label}
                    <span
                      aria-hidden
                      className={cn(
                        "font-mono text-xs font-bold",
                        active ? "text-safety" : "text-steel/50"
                      )}
                    >
                      {active ? "\u2713" : "\u25CB"}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[10px] uppercase tracking-wider",
                      active ? "text-bone/60" : "text-steel"
                    )}
                  >
                    {option.note}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name" className={labelClass}>
              Full name
            </Label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              placeholder="e.g. Rahim Uddin"
              className={inputClass}
            />
          </div>
          <div>
            <Label htmlFor="email" className={labelClass}>
              Email
            </Label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>
          <div>
            <Label htmlFor="phone" className={labelClass}>
              Phone
            </Label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              placeholder="+8801711XXXXXX"
              className={inputClass}
            />
          </div>
          <div>
            <Label htmlFor="password" className={labelClass}>
              Password
            </Label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={1}
              placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="address" className={labelClass}>
              Address
              <span className="normal-case tracking-normal text-steel/60">
                {" "}
                \u00b7 optional
              </span>
            </Label>
            <input
              id="address"
              name="address"
              type="text"
              autoComplete="street-address"
              placeholder="Area, city \u2014 e.g. Dhanmondi, Dhaka"
              className={inputClass}
            />
          </div>
        </div>

        {role === "TECHNICIAN" && (
          <div className="animate-ticket">
            <div className="border-2 border-ink/70 bg-ticket">
              <div className="flex items-center justify-between gap-4 border-b-2 border-dashed border-ink/25 px-3.5 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-steel">
                <span>{"// Trade copy"}</span>
                <span aria-hidden>{"\u25cf"} F.02a</span>
              </div>
              <div className="grid gap-4 p-3.5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="bio" className={labelClass}>
                    Bio
                  </Label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    placeholder="What you do and how long you've done it"
                    className={cn(slipInputClass, "min-h-20 resize-y")}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="skills" className={labelClass}>
                    Skills
                  </Label>
                  <input
                    id="skills"
                    name="skills"
                    type="text"
                    placeholder="Comma separated \u2014 e.g. plumbing, pipe fitting"
                    className={slipInputClass}
                  />
                </div>
                <div>
                  <Label htmlFor="hourlyRate" className={labelClass}>
                    Hourly rate (BDT)
                  </Label>
                  <input
                    id="hourlyRate"
                    name="hourlyRate"
                    type="number"
                    min={0}
                    step="any"
                    inputMode="decimal"
                    placeholder="e.g. 500"
                    className={slipInputClass}
                  />
                </div>
                <div>
                  <Label htmlFor="experienceYrs" className={labelClass}>
                    Years of experience
                  </Label>
                  <input
                    id="experienceYrs"
                    name="experienceYrs"
                    type="number"
                    min={0}
                    step={1}
                    inputMode="numeric"
                    placeholder="e.g. 5"
                    className={slipInputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="location" className={labelClass}>
                    Service area
                  </Label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="e.g. Mirpur"
                    className={slipInputClass}
                  />
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-steel/70">
                    Bookings must contain this text in their address
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {state.message && (
          <p
            role="alert"
            className="mt-5 flex items-start gap-2 border-2 border-dashed border-safety bg-ticket px-3 py-2.5"
          >
            <span
              aria-hidden
              className="font-mono text-sm font-bold text-safety"
            >
              {"\u2717"}
            </span>
            <span className="text-sm leading-relaxed text-ink">
              {state.message}
            </span>
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-none border-2 border-ink bg-ink px-4 py-3 font-display text-base font-bold text-bone transition-colors hover:bg-safety hover:text-ink disabled:pointer-events-none disabled:opacity-60"
        >
          {pending && (
            <span
              aria-hidden
              className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            />
          )}
          {pending ? "Creating account\u2026" : "Create account"}
        </button>
      </form>

      <div className="border-t-2 border-dashed border-ink/25 px-5 py-4 sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-wider text-steel">
          Already a member?{" "}
          <Link
            href="/login"
            className="font-bold text-ink underline underline-offset-4 transition-colors hover:text-safety"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}