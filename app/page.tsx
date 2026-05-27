import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import TrustedBy from "@/app/components/TrustedBy";
import Features from "@/app/components/Features";
import HowItWorks from "@/app/components/HowItWorks";
import SpendPreview from "@/app/components/SpendPreview";
import Testimonials from "@/app/components/Testimonials";
import CTA from "@/app/components/CTA";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0F1E] text-white overflow-hidden">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Features />
      <HowItWorks />
      <SpendPreview />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
