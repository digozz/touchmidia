import { Container } from "@/components/layout/Container";
import { WhatsappButton } from "@/components/ui/WhatsappButton";
import { HeroTotem } from "@/components/sections/HeroTotem";
import { WHATSAPP_MESSAGES } from "@/lib/contact";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-brand-black">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(198,255,61,0.07),transparent_60%),radial-gradient(ellipse_at_bottom_left,rgba(198,255,61,0.04),transparent_55%)]"
      />
      <Container className="relative grid gap-16 py-20 md:grid-cols-[1.1fr_1fr] md:gap-12 md:py-28 lg:py-32">
        <div className="flex flex-col justify-center">
          <p className="font-medium uppercase tracking-[0.2em] text-volt text-xs">
            Jogos interativos para eventos
          </p>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Stand cheio.
            <br />
            Leads no CRM.
            <br />
            <span className="text-volt">Marca na cabeça.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/70">
            Jogos interativos no totem que atraem público pra sua marca e geram
            leads qualificados em eventos. Personalização total, funcionamento
            offline, dashboard em tempo real.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <WhatsappButton
              message={WHATSAPP_MESSAGES.ctaFinal}
              variant="primary"
              size="lg"
            >
              Falar no WhatsApp →
            </WhatsappButton>
            <Link
              href="/jogos"
              className="inline-flex h-14 items-center gap-2 rounded-full px-7 text-xl font-display font-bold text-white transition-colors hover:text-volt"
            >
              Ver catálogo de jogos
            </Link>
          </div>
        </div>

        <div className="relative flex min-h-[400px] items-center justify-center md:min-h-[480px]">
          <HeroTotem />
        </div>
      </Container>
    </section>
  );
}
