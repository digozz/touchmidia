import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { ClientsSection } from "@/components/sections/ClientsSection";
import { GamesCatalogSection } from "@/components/sections/GamesCatalogSection";
import { DashboardSection } from "@/components/sections/DashboardSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ClientsSection />
        <GamesCatalogSection />
        <DashboardSection />
        <PricingSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </>
  );
}
