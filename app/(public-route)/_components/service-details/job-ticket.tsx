import type { ServiceDetails } from "@/lib/types";
import { formatBDT } from "@/lib/utils";
import { BookServiceButton } from "./book-service-button";

export function JobTicket({
  service,
  serial,
}: {
  service: ServiceDetails;
  serial: string;
}) {
  const category = service.category?.name ?? "Service";
  const area = service.technician?.location ?? "Dhaka";
  const jobs = service._count?.bookings ?? 0;

  return (
    <article className="animate-ticket grid overflow-hidden border-2 border-ink/80 bg-ticket-hi shadow-[10px_10px_0_rgba(33,30,25,0.35)] sm:grid-cols-[52px_1fr]">
      <aside className="relative hidden border-r-2 border-dashed border-ink/40 bg-ticket sm:block">
        <span className="absolute left-1/2 top-4 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.2em] text-steel [writing-mode:vertical-rl]">
          {serial}
        </span>
        <span className="absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-board ring-4 ring-ticket" />
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.2em] text-steel [writing-mode:vertical-rl]">
          fixed price
        </span>
      </aside>

      <div className="flex flex-col p-6 sm:p-8">
        <div className="flex items-center justify-between border-b-2 border-dashed border-ink/25 pb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-steel sm:hidden">
          <span>{serial}</span>
          <span className="text-ink">{formatBDT(service.price)}</span>
        </div>

        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-safety sm:mt-0">
          {"// "}
          {category}
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
          {service.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-steel">
          {service.description}
        </p>

        <dl className="mt-6 grid gap-6 border-t-2 border-dashed border-ink/20 pt-5 sm:grid-cols-3">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-widest text-steel">
              Duration
            </dt>
            <dd className="mt-1 font-display text-xl font-bold tabular-nums">
              {service.durationMins} min
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-widest text-steel">
              Service area
            </dt>
            <dd className="mt-1 font-display text-xl font-bold">{area}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-widest text-steel">
              Jobs completed
            </dt>
            <dd className="mt-1 font-display text-xl font-bold tabular-nums">
              {jobs}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-col gap-5 border-t-2 border-dashed border-ink/20 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-steel">
              Fixed price
            </p>
            <p className="mt-1 font-display text-4xl font-bold tabular-nums text-ink">
              {formatBDT(service.price)}
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-steel">
              set before the work starts
            </p>
          </div>
          <BookServiceButton
            serviceId={service.id}
            title={service.title}
            price={service.price}
            durationMins={service.durationMins}
            location={service.technician?.location ?? null}
            serial={serial}
          />
        </div>
      </div>
    </article>
  );
}
