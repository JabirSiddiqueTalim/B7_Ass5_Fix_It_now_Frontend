import { Clock, Mail, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "../home/section-heading";

export const contactChannelValues = {
  email: "support@fixitnow.com",
  phone: "+880 1234-567890",
  hours: "8:00 AM \u2013 9:00 PM",
};

const channels = [
  {
    icon: Mail,
    label: "Email",
    value: contactChannelValues.email,
    href: "mailto:support@fixitnow.com",
    note: "We reply within one working day",
  },
  {
    icon: Phone,
    label: "Phone",
    value: contactChannelValues.phone,
    href: "tel:+8801709341256",
    note: "Call for anything booking-related",
  },
  {
    icon: Clock,
    label: "Hours",
    value: contactChannelValues.hours,
    note: "Open today \u00b7 Dhaka & Chattogram",
  },
];

export function Channels() {
  return (
    <section className="border-t-2 border-dashed border-ink/20">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow={"// Reach the team"}
          title="Pick the channel."
          sub="Bookings, payments and complaints all share the same mailbox — no runaround."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {channels.map((channel) => {
            const inner = (
              <>
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-full border-2 border-ink/60 bg-ticket text-ink">
                    <channel.icon className="size-4" aria-hidden />
                  </span>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-safety">
                    {"\u2713"} live
                  </span>
                </div>
                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-steel">
                  {channel.label}
                </p>
                <p className="mt-1 font-display text-lg font-bold tracking-tight">
                  {channel.value}
                </p>
                <p className="mt-1 text-sm text-steel">{channel.note}</p>
              </>
            );
            return (
              <Card
                key={channel.label}
                className="group flex flex-col rounded-sm border-ink/25 bg-ticket-hi p-6 shadow-none transition-all hover:-translate-y-0.5 hover:border-safety"
              >
                {channel.href ? (
                  <a
                    href={channel.href}
                    className="flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety"
                  >
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}