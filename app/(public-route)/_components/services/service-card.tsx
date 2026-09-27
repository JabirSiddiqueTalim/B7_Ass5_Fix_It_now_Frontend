import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ServiceListItem } from "@/lib/types";
import { bdt } from "../home/data";
import { TicketStub } from "../home/ticket-stub";

export interface ServiceCardData {
  serial: string;
  id: string;
  category: string;
  title: string;
  description: string;
  durationMins: number;
  price: number;
  technician: string;
  rating: number;
  reviews: number;
  area: string;
}

export function toServiceCard(
  s: ServiceListItem
): ServiceCardData {
  return {
    serial: `FIN-${s.id.replace(/-/g, "").slice(0, 6).toUpperCase()}`,
    id: s.id,
    category: s.category?.name ?? "Service",
    title: s.title,
    description: s.description,
    durationMins: s.durationMins,
    price: Number(s.price) || 0,
    technician: s.technician?.user.name ?? "Technician",
    rating: s.technician?.avgRating ?? 0,
    reviews: s.technician?.totalReviews ?? 0,
    area: s.technician?.location ?? "Dhaka",
  };
}

export function ServiceCard({ service }: { service: ServiceCardData }) {
  return (
    <article className="group flex overflow-hidden rounded-sm border-2 border-ink/80 bg-ticket-hi transition-transform duration-200 hover:-translate-y-1">
      <TicketStub top={service.serial} bottom={bdt(service.price)} />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-safety">
            {service.category}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-steel">
            {service.durationMins} min
          </span>
        </div>
        <h3 className="mt-2 font-display text-lg font-bold leading-snug">
          {service.title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-steel line-clamp-2">
          {service.description}
        </p>
        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between gap-3 border-t-2 border-dashed border-ink/20 pt-3">
            <div className="min-w-0">
              <p className="truncate font-mono text-[10px] uppercase tracking-wider text-steel">
                {service.technician}
              </p>
              <p className="font-mono text-[10px] text-steel">
                {"\u2605"} {service.rating} ({service.reviews})
                {"\u00a0\u00b7\u00a0"}
                {service.area}
              </p>
            </div>
            <span className="shrink-0 font-display text-xl font-bold tabular-nums">
              {bdt(service.price)}
            </span>
          </div>
          <Button
            asChild
            className="mt-3 block w-full bg-ink px-3 py-2 text-center font-display text-sm font-bold text-bone group-hover:bg-safety group-hover:text-ink hover:bg-safety hover:text-ink"
          >
            <Link href={`/services/${service.id}`}>Details</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
