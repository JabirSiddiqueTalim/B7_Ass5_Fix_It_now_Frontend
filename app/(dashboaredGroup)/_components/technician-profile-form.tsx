"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X } from "lucide-react";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { updateTechnicianProfile } from "../_actions/updateTechnicianProfile";

const labelCls =
  "font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-steel";
const inputCls =
  "mt-1.5 w-full rounded-sm border-2 border-ink/30 bg-bone px-3 py-2 text-sm text-ink placeholder:text-ink/30 focus:border-safety focus:outline-none";

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelCls}>
        {label}
      </label>
      {children}
      {hint && (
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-steel/70">
          {hint}
        </p>
      )}
    </div>
  );
}

export function TechnicianProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [name, setName] = useState(user.name ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [address, setAddress] = useState(user.address ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? "");
  const [bio, setBio] = useState(user.technicianProfile?.bio ?? "");
  const [location, setLocation] = useState(user.technicianProfile?.location ?? "");
  const [hourlyRate, setHourlyRate] = useState(user.technicianProfile?.hourlyRate ?? "");
  const [experienceYrs, setExperienceYrs] = useState(
    user.technicianProfile ? String(user.technicianProfile.experienceYrs) : ""
  );

  const [skills, setSkills] = useState<string[]>(user.technicianProfile?.skills ?? []);
  const [skillDraft, setSkillDraft] = useState("");

  function addSkill() {
    const value = skillDraft.trim().replace(/\s+/g, " ").toLowerCase();
    if (!value) return;
    setSkills((prev) => (prev.includes(value) ? prev : [...prev, value]));
    setSkillDraft("");
  }

  function removeSkill(skill: string) {
    setSkills((prev) => prev.filter((s) => s !== skill));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    startTransition(async () => {
      const res = await updateTechnicianProfile({
        name: name.trim() || undefined,
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        avatarUrl: avatarUrl.trim() || undefined,
        bio: bio.trim() || undefined,
        location: location.trim() || undefined,
        hourlyRate: hourlyRate === "" ? undefined : Number(hourlyRate),
        experienceYrs: experienceYrs === "" ? undefined : Number(experienceYrs),
        skills,
      });

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
          Workshop file · edit
        </p>
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink">
          Edit profile
        </h2>
        <p className="text-sm text-steel">
          Update your record — customers see this on your public profile.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-md border-2 border-ink bg-bone p-6 shadow-[4px_4px_0_rgba(33,30,25,0.1)]"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor="tp-name">
            <input
              id="tp-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputCls}
              placeholder="Karim Hossain"
            />
          </Field>
          <Field label="Phone" htmlFor="tp-phone">
            <input
              id="tp-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className={inputCls}
              placeholder="+88017…"
            />
          </Field>
          <Field label="Address" htmlFor="tp-address" hint="Where customers find you">
            <input
              id="tp-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={inputCls}
              placeholder="Mirpur, Dhaka"
            />
          </Field>
          <Field label="Avatar URL" htmlFor="tp-avatar" hint="Paste an image link to update your photo">
            <div className="mt-1.5 flex items-center gap-3">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt="Avatar preview"
                  className="size-14 shrink-0 rounded-full border-2 border-ink/20 object-cover"
                />
              ) : (
                <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-safety font-display text-xl font-bold text-ink ring-2 ring-ink/15">
                  {(name.trim()[0] ?? "?").toUpperCase()}
                </span>
              )}
              <input
                id="tp-avatar"
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className={inputCls}
                placeholder="https://…"
              />
            </div>
          </Field>
          <Field label="Hourly rate (৳)" htmlFor="tp-rate" hint="Positive number">
            <input
              id="tp-rate"
              type="number"
              min="0"
              step="0.01"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              className={inputCls}
              placeholder="500"
            />
          </Field>
          <Field label="Experience (years)" htmlFor="tp-exp" hint="Zero or more">
            <input
              id="tp-exp"
              type="number"
              min="0"
              step="1"
              value={experienceYrs}
              onChange={(e) => setExperienceYrs(e.target.value)}
              className={inputCls}
              placeholder="8"
            />
          </Field>
          <Field label="Service location" htmlFor="tp-location" hint="Must appear in booking addresses">
            <input
              id="tp-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={inputCls}
              placeholder="Mirpur"
            />
          </Field>
        </div>

        <Field label="Bio" htmlFor="tp-bio">
          <textarea
            id="tp-bio"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className={cn(inputCls, "resize-y")}
            placeholder="Plumbing expert with 8 years experience…"
          />
        </Field>

        <Field label="Skills" htmlFor="tp-skill-input" hint="Enter a skill, then press Add">
          <div className="mt-1.5 flex gap-2">
            <input
              id="tp-skill-input"
              value={skillDraft}
              onChange={(e) => setSkillDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              className={cn(inputCls, "mt-0 flex-1")}
              placeholder="plumbing"
            />
            <button
              type="button"
              onClick={addSkill}
              className="shrink-0 rounded-sm border-2 border-ink bg-ink px-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-bone transition-colors hover:bg-safety hover:text-ink"
            >
              Add
            </button>
          </div>
          {skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-ink/30 bg-ticket px-2 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-ink"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    aria-label={`Remove ${skill}`}
                    className="text-ink/50 transition-colors hover:text-red-700"
                  >
                    <X className="size-3" aria-hidden />
                  </button>
                </span>
              ))}
            </div>
          )}
        </Field>

        <div className="flex items-center justify-end gap-3 border-t-2 border-dashed border-ink/15 pt-5">
          <button
            type="submit"
            disabled={pending}
            className="rounded-sm border-2 border-ink bg-ink px-5 py-2.5 font-display text-sm font-bold text-bone transition-colors hover:bg-safety hover:text-ink disabled:pointer-events-none disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
