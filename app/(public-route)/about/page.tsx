import type { Metadata } from "next";
import { AboutHero } from "../_components/about/about-hero";
import { Why } from "../_components/about/why";
import { Contrast } from "../_components/about/contrast";
import { TrustStrip } from "../_components/home/trust-strip";
import { Cta } from "../_components/home/cta";

export const metadata: Metadata = {
  title: "About — FixItNow",
  description:
    "What FixItNow is, why it exists, and what it's not. Home services across Dhaka — vetted pros, fixed prices in taka, booked in minutes.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-ticket text-ink">
      <main className="flex-1">
        <AboutHero />
        <Why />
        <Contrast />
        <TrustStrip />
        <Cta />
      </main>
    </div>
  );
}