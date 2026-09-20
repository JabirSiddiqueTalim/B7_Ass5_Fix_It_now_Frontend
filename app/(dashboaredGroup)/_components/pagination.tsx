import Link from "next/link";

export function Pagination({
  currentPage,
  totalPages,
  makeHref,
}: {
  currentPage: number;
  totalPages: number;
  makeHref: (page: number) => string;
}) {
  const safeTotalPages = Math.max(totalPages, 1);
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < safeTotalPages;

  return (
    <nav
      className="mt-8 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-widest"
      aria-label="Pagination"
    >
      {canGoPrev ? (
        <Link
          href={makeHref(currentPage - 1)}
          className="rounded-none border-2 border-ink/70 bg-ticket px-3 py-2 text-ink transition-colors hover:bg-ticket"
        >
          ‹ Prev
        </Link>
      ) : (
        <span className="px-3 py-2 text-steel/50">‹ Prev</span>
      )}
        <span className="px-3 py-2 text-steel">
        Page {currentPage} of {safeTotalPages}
      </span>
      {canGoNext ? (
        <Link
          href={makeHref(currentPage + 1)}
          className="rounded-none border-2 border-ink/70 bg-ticket px-3 py-2 text-ink transition-colors hover:bg-ticket"
        >
          Next ›
        </Link>
      ) : (
        <span className="px-3 py-2 text-steel/50">Next ›</span>
      )}
    </nav>
  );
}
