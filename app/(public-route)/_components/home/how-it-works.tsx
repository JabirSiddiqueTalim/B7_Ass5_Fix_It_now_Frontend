import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "./section-heading";

const steps = [
  {
    n: "01",
    title: "Book",
    tag: "Requested",
    tagClass: "border border-ink/30 bg-transparent text-ink",
    body: "Pick a service and a time that suits you. No phone calls, no haggling.",
  },
  {
    n: "02",
    title: "Pay",
    tag: "Paid",
    tagClass: "border border-ink/30 bg-transparent text-ink",
    body: "Secure checkout — the price on the ticket is the price you pay.",
  },
  {
    n: "03",
    title: "Done",
    tag: "Done",
    tagClass: "border border-safety bg-safety text-ink",
    body: "A vetted pro shows up on time and gets it fixed. Rate them after.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 border-t-2 border-dashed border-ink/20">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="// How it works"
          title="Booked, paid, done — in that order."
          sub="Every job runs through the same three tickets. You always know exactly where your fix stands."
        />
        <ol className="relative grid gap-4 md:grid-cols-3">
          <span
            aria-hidden
            className="absolute left-[16.67%] right-[16.67%] top-9 hidden border-t-2 border-dashed border-ink/25 md:block"
          />
          {steps.map((step) => (
            <li key={step.n} className="relative">
              <Card className="flex h-full flex-col rounded-sm border-ink/25 bg-ticket-hi p-6 shadow-none">
                <span className="flex size-9 items-center justify-center rounded-full border-2 border-ink/60 bg-ticket font-mono text-sm font-bold text-ink">
                  {step.n}
                </span>
                <h3 className="mt-4 font-display text-2xl font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel">
                  {step.body}
                </p>
                <Badge
                  className={`mt-5 inline-flex w-fit rounded-sm font-mono text-[10px] font-bold uppercase tracking-widest ${step.tagClass}`}
                >
                  {step.tag}
                </Badge>
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
