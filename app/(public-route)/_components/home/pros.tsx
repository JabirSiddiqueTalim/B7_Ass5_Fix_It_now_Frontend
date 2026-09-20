import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { TechnicianListItem } from "@/lib/types";
import type { HomePro } from "./data";
import { bdt} from "./data";
import { SectionHeading } from "./section-heading";
import { getAllTechnician } from "../../_actions/getAllTechnician";

function toHomePro(t: TechnicianListItem): HomePro {
  const name = t.user.name;
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return {
    name,
    initials,
    skill: t.skills[0] ?? "Technician",
    area: t.location ?? "Dhaka",
    bio: t.bio ?? "Background-checked and rated by the people who hired them.",
    rating: t.avgRating ?? 0,
    reviews: t.totalReviews ?? 0,
    experienceYrs: t.experienceYrs ?? 0,
    hourlyRate: Number(t.hourlyRate) || 0,
    verified: t.isVerified,
  };
}

export async function Pros() {
  const technicians = await getAllTechnician();
  const list = (technicians.data?.data ?? []).map(toHomePro);

  return (
    <section id="pros" className="scroll-mt-20 border-t-2 border-dashed border-ink/20">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="// Pros worth knowing"
          title="Vetted, rated, ready."
          sub="Every technician on the board is background-checked and rated by the people who actually hired them."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {list.map((pro: HomePro) => (
            <Card
              key={pro.name}
              className="flex flex-col rounded-sm border-ink/25 bg-ticket-hi p-6 shadow-none transition-all hover:-translate-y-0.5 hover:border-ink"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-full border-2 border-ink/60 bg-ticket font-display text-base font-bold">
                  {pro.initials}
                </span>
                <Badge className="rounded-sm border border-safety bg-transparent font-mono text-[10px] font-bold uppercase tracking-widest text-safety">
                  {"\u2713"} verified
                </Badge>
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">{pro.name}</h3>
              <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-steel">
                {`${pro.skill} \u00b7 ${pro.area}`}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-steel">{pro.bio}</p>
              <div className="mt-auto flex items-center justify-between border-t-2 border-dashed border-ink/20 pt-3 font-mono text-[11px] text-steel">
                <span>
                  {"\u2605"} {pro.rating} ({pro.reviews})
                </span>
                <span>{pro.experienceYrs} yrs</span>
                <span className="font-bold text-ink">
                  {bdt(pro.hourlyRate)}/hr
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
