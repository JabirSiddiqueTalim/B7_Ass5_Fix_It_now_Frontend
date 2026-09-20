import Link from "next/link";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-md border-2 border-dashed border-ink/30 bg-ticket-hi px-6 py-12 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-steel">
        Nothing on file
      </p>
      <p className="mt-2 font-display text-xl font-bold text-ink">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-steel">{description}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-5 inline-block rounded-sm border-2 border-ink bg-ink px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest text-bone transition-colors hover:bg-safety hover:text-ink"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
