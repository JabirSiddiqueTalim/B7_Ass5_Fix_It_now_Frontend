import type { Metadata } from "next";
import { ContactHero } from "../_components/contact/contact-hero";
import { Channels } from "../_components/contact/channels";
import { Developer } from "../_components/contact/developer";
import { TrustStrip } from "../_components/home/trust-strip";

export const metadata: Metadata = {
  title: "Contact — FixItNow",
  description:
    "Reach the FixItNow team — bookings, payments and help. Plus the developer behind the board.",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-ticket text-ink">
      <main className="flex-1">
        <ContactHero />
        <Channels />
        <Developer />
        <TrustStrip />
      </main>
    </div>
  );
}