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
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
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
