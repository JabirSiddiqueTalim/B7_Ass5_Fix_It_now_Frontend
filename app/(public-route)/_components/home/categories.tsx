import Link from "next/link";
import { Card } from "@/components/ui/card";
import { tickerItems } from "./data";
import { SectionHeading } from "./section-heading";
import { getAllCategory } from "../../_actions/getAllCategory";
import { Category } from "@/lib/types";


function Ticker() {
  const items = [...tickerItems, ...tickerItems];
  return (
    <div className="overflow-hidden border-y-2 border-ink/60 bg-safety text-ink">
      <div className="marquee-mask">
        <div className="animate-marquee flex w-max items-center py-3">
          {items.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="flex items-center gap-8 pr-8 font-mono text-xs font-bold uppercase tracking-[0.25em]"
            >
              {item}
              <span className="size-2 rounded-full border-2 border-ink/40" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}



export async function Categories() {

  const categories = await getAllCategory()
  const allCategories = categories.data.data

  return (
    <section id="categories" className="scroll-mt-20">
      <Ticker />
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="// What needs fixing"
          title="Pick your problem."
          sub="Say what's wrong in plain words — we'll match you to a vetted pro who's done it a hundred times."
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {allCategories.map((category : Category) => (
            <Card
              key={category.id}
              className="group flex items-center gap-3 rounded-sm border-ink/25 bg-ticket-hi p-4 shadow-none transition-all hover:-translate-y-0.5 hover:border-ink"
            >
              <Link
                href="/services"
                className="flex items-center gap-3"
                aria-label={`${category.name} services`}
              >
                <span className="flex size-10 shrink-0 items-center justify-center border-2 border-ink/70 bg-ticket font-mono text-xs font-bold text-ink">
                  {category.name.charAt(0).toUpperCase()}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-display text-base font-bold">
                    {category.name}
                  </span>
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-steel">
                    {category.description}
                  </span>
                </span>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
