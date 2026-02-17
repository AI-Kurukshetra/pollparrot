import { Navbar, Footer } from "@/components/layout";
import {
  Hero,
  Features,
  HowItWorks,
  Pricing,
  Testimonials,
  CTA,
} from "@/components/landing";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-white">
      <Navbar />
      <main className="w-full">
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
