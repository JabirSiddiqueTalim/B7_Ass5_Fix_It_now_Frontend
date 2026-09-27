import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 p-8 text-center">
      <span className="flex size-14 items-center justify-center rounded-full border-2 border-dashed border-safety bg-ticket font-mono text-xl font-bold text-ink">
        {"404"}
      </span>
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
        Page not found
      </h1>
      <p className="max-w-md font-mono text-[11px] uppercase tracking-wider text-steel">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-sm border-2 border-ink bg-ink px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-bone transition-colors hover:bg-safety hover:text-ink"
      >
        Back to home
      </Link>
    </div>
  );
}