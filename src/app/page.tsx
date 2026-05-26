import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { ClientsSection } from "@/components/sections/ClientsSection";
import { GamesCatalogSection } from "@/components/sections/GamesCatalogSection";
import { DashboardSection } from "@/components/sections/DashboardSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";

export const metadata: Metadata = {
  title: "Totens Interativos com Jogos para Eventos",
  description:
    "Jogos interativos no totem que atraem público pra sua marca e geram leads qualificados em eventos. 12 jogos prontos para personalizar com a sua marca.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "TOUCH MIDIA | Totens Interativos com Jogos para Eventos",
    description:
      "Jogos personalizados, captura de leads em tempo real e funcionamento offline. Mais filas no stand, mais leads no CRM.",
    url: "/",
    type: "website",
  },
};

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
