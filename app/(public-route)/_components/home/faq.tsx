"use client";

import { Accordion } from "radix-ui";
import { SectionHeading } from "./section-heading";

const faqs = [
  {
    value: "prices",
    q: "How are prices set?",
    a: "Every service lists a fixed price in taka before you book. What the ticket says is what you pay \u2014 no hourly surprises when the job is done.",
  },
  {
    value: "pro",
    q: "Who shows up to fix it?",
    a: "A background-checked technician with a rating and reviews from the people who hired them. You see their name, rating and past jobs before you book.",
  },
  {
    value: "time",
    q: "When will someone come?",
    a: "Pick a slot that suits you at checkout. Most same-day jobs are confirmed within the hour, and you get the pro\u2019s ETA before they set out.",
  },
  {
    value: "areas",
    q: "Do you cover my area?",
    a: "We\u2019re live across Dhaka and Chattogram, with more neighbourhoods on the way. Open a service ticket \u2014 if it lists your area, we cover it.",
  },
  {
    value: "pay",
    q: "How do I pay?",
    a: "Secure checkout in taka when you book. The price on the ticket is the price you pay \u2014 nothing changes hands at your door.",
  },
  {
    value: "done-right",
    q: "What if the job isn\u2019t done right?",
    a: "Rate the technician when the job closes. Low ratings flag a profile for review, and you can rebook the same ticket with a different pro.",
  },
];

export function Faq() {
  return (
    <section
      id="faq"
      className="scroll-mt-20 border-t-2 border-dashed border-ink/20 bg-ticket"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="// Quick answers"
          title="Questions, answered."
          sub="Straight answers before you book \u2014 prices, people, payment, and what happens if a fix isn\u2019t right."
        />

        <Accordion.Root
          type="single"
          collapsible
          defaultValue="prices"
          className="border-2 border-ink/80 bg-ticket-hi"
        >
          {faqs.map((faq) => (
            <Accordion.Item
              key={faq.value}
              value={faq.value}
              className="not-first:border-t-2 not-first:border-t-dashed not-first:border-t-ink/25"
            >
              <Accordion.Header asChild>
                <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6">
                  <span className="font-display text-lg font-bold leading-snug text-ink">
                    {faq.q}
                  </span>
                  <span
                    aria-hidden
                    className="size-4 shrink-0 rounded-full border-2 border-ink/60 bg-transparent transition-colors group-data-[state=open]:border-safety group-data-[state=open]:bg-safety group-data-[state=open]:ring-4 group-data-[state=open]:ring-safety/25"
                  />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="faq-answer overflow-hidden data-[state=closed]:hidden data-[state=open]:animate-accordion-down">
                <div className="border-t-2 border-dashed border-ink/20 px-5 pb-6 pt-4 sm:px-6">
                  <p className="max-w-2xl text-sm leading-relaxed text-steel">
                    {faq.a}
                  </p>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
