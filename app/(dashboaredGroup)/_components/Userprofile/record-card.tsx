import { Check, Star } from "lucide-react";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";

function fmtDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function FieldRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-dashed border-edge/60 py-3 last:border-none sm:flex-row sm:items-baseline sm:gap-4">
      <dt className="w-36 shrink-0 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-steel">
        {label}
      </dt>
      <dd
        className={cn(
          "min-w-0 break-words text-sm text-ink",
          mono && "font-mono text-[13px] tracking-tight"
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function WorkshopFile({ user }: { user: User }) {
  const profile = user.technicianProfile;

  return (
    <div className="relative overflow-hidden rounded-md border-2 border-ink bg-bone shadow-[4px_4px_0_rgba(33,30,25,0.1)]">
      <div className="flex items-center justify-between gap-3 border-b-2 border-dashed border-ink/20 px-6 py-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-safety">
          Workshop file
        </p>
        {profile?.isVerified ? (
          <span className="inline-flex items-center gap-1.5 rounded-sm border-2 border-ink px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink shadow-[2px_2px_0_rgba(33,30,25,0.18)]">
            <Check className="size-3" aria-hidden />
            Verified
          </span>
        ) : (
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-steel">
            Not verified
          </span>
        )}
      </div>

      <div className="px-6 py-6">
        {profile?.bio && (
          <p className="max-w-prose text-sm leading-relaxed text-ink">
            {profile.bio}
          </p>
        )}

        {profile && profile.skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-sm border border-ink/30 bg-ticket px-2 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-ink"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {profile && (
          <>
            <dl className="mt-6 grid grid-cols-2 gap-px border border-dashed border-edge/60 bg-edge/50 sm:grid-cols-4">
              <div className="bg-bone px-4 py-3">
                <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-steel">
                  Hourly rate
                </dt>
                <dd className="mt-1 font-display text-lg font-bold text-ink">
                  ৳{profile.hourlyRate}/hr
                </dd>
              </div>
              <div className="bg-bone px-4 py-3">
                <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-steel">
                  Experience
                </dt>
                <dd className="mt-1 font-display text-lg font-bold text-ink">
                  {profile.experienceYrs} yrs
                </dd>
              </div>
              <div className="bg-bone px-4 py-3">
                <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-steel">
                  Rating
                </dt>
                <dd className="mt-1 flex items-center gap-1.5 font-display text-lg font-bold text-ink">
                  <Star className="size-4 fill-safety text-safety" aria-hidden />
                  {profile.avgRating ? profile.avgRating.toFixed(1) : "—"}
                </dd>
              </div>
              <div className="bg-bone px-4 py-3">
                <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-steel">
                  Reviews
                </dt>
                <dd className="mt-1 font-display text-lg font-bold text-ink">
                  {profile.totalReviews}
                </dd>
              </div>
            </dl>

            {profile.location && (
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-steel">
                Base · {profile.location}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function RecordCard({ user }: { user: User }) {
  const initial =
    user.name?.trim().charAt(0).toUpperCase() ?? user.role.charAt(0);
  const fileNo = user.id.slice(0, 8).toUpperCase();
  const active = user.status === "ACTIVE";

  return (
    <section className="mx-auto w-full max-w-3xl animate-ticket space-y-6">
      <header className="space-y-1">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-safety">
          Personnel file
        </p>
        <p className="text-sm text-steel">
          Your record on file with the dispatch desk.
        </p>
      </header>

      <div className="relative overflow-hidden rounded-md border-2 border-ink bg-bone shadow-[4px_4px_0_rgba(33,30,25,0.1)]">
        <span
          aria-hidden
          className="absolute left-3 top-3 size-4 rounded-full bg-ticket-hi ring-2 ring-edge"
        />

        <div className="flex flex-col gap-2 border-b-2 border-dashed border-ink/20 px-6 py-4 pl-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-safety">
            Dispatch record
          </p>
          <p
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-steel"
            title={user.id}
          >
            File no. {fileNo}
          </p>
        </div>

        <div className="flex flex-col gap-6 border-b border-dashed border-ink/20 px-6 py-7 sm:flex-row sm:items-center sm:gap-8">
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt=""
              className="size-24 shrink-0 rounded-full object-cover ring-2 ring-ink/15"
            />
          ) : (
            <span
              aria-hidden
              className="flex size-24 shrink-0 items-center justify-center rounded-full bg-safety font-display text-4xl font-bold text-ink shadow-[inset_0_-3px_0_rgba(33,30,25,0.18)] ring-2 ring-ink/15"
            >
              {initial}
            </span>
          )}
          <div className="min-w-0">
            <h2 className="truncate font-display text-3xl font-bold tracking-tight text-ink">
              {user.name}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="animate-stamp rounded-sm border-2 border-ink px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink shadow-[2px_2px_0_rgba(33,30,25,0.18)]">
                {user.role}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-sm border border-ink/25 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-steel">
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    active ? "bg-safety" : "bg-steel"
                  )}
                  aria-hidden
                />
                {user.status.toLowerCase()}
              </span>
            </div>
          </div>
        </div>

        <dl className="px-6 py-2">
          <FieldRow label="Email" value={user.email} mono />
          <FieldRow label="Phone" value={user.phone || "—"} mono />
          <FieldRow label="Address" value={user.address || "Not on file"} />
          <FieldRow label="Member since" value={fmtDate(user.createdAt)} mono />
          <FieldRow label="Record id" value={fileNo} mono />
        </dl>
      </div>

      {user.technicianProfile && <WorkshopFile user={user} />}
    </section>
  );
}
