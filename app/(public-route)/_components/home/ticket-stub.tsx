export function TicketStub({
  top,
  bottom,
  hole = "size-5",
  width = "w-10",
}: {
  top: string;
  bottom: string;
  hole?: string;
  width?: string;
}) {
  return (
    <div
      className={`relative shrink-0 border-r-2 border-dashed border-ink/40 bg-ticket ${width}`}
    >
      <span className="absolute left-1/2 top-3 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.2em] text-steel [writing-mode:vertical-rl]">
        {top}
      </span>
      <span
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-board ring-4 ring-ticket ${hole}`}
      />
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.2em] text-steel [writing-mode:vertical-rl]">
        {bottom}
      </span>
    </div>
  );
}
