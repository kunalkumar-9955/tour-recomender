import { HeroSlider } from "@/components/landing/hero-slider";
import { PopularDestinations } from "@/components/landing/popular-destinations";
import { WhyUs } from "@/components/landing/why-us";
import { AboutSection } from "@/components/landing/about-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Testimonials } from "@/components/landing/testimonials";
import { CtaSection } from "@/components/landing/cta-section";
import { SiteFooter } from "@/components/landing/site-footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <HeroSlider />
      <PopularDestinations />
      <WhyUs />
      <AboutSection />
      <HowItWorks />
      <Testimonials />
      <CtaSection />
      <SiteFooter />
    </div>
  );
}
