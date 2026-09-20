import { Hero } from "./_components/home/hero";
import { Categories } from "./_components/home/categories";
import { HowItWorks } from "./_components/home/how-it-works";
import { Pros } from "./_components/home/pros";
import { TrustStrip } from "./_components/home/trust-strip";
import { Faq } from "./_components/home/faq";
import { Cta } from "./_components/home/cta";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-ticket text-ink">
      <main className="flex-1">
        <Hero />
        <Categories />
        <HowItWorks />
        <Pros />
        <TrustStrip />
        <Faq />
        <Cta />
      </main>
    </div>
  );
}
