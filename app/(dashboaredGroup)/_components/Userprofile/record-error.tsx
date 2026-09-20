import Link from "next/link";

export function RecordError({ retryHref = "/dashboard/profile" }: { retryHref?: string }) {
  return (
    <div className="mx-auto max-w-3xl rounded-md border-2 border-dashed border-ink/30 bg-bone px-6 py-16 text-center">
      <p className="font-display text-xl font-bold text-ink">
        Couldn&apos;t read your record.
      </p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-steel">
        The dispatch desk couldn&apos;t load your file. Check your connection and
        try again.
      </p>
      <Link
        href={retryHref}
        className="mt-6 inline-block rounded-sm border-2 border-ink bg-safety px-5 py-2.5 font-display text-sm font-bold text-ink shadow-[3px_3px_0_rgba(33,30,25,0.25)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
      >
        Try again
      </Link>
    </div>
  );
}
