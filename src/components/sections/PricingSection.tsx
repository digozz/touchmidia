import { Container } from "@/components/layout/Container";
import { WhatsappButton } from "@/components/ui/WhatsappButton";
import { WHATSAPP_MESSAGES } from "@/lib/contact";
import { Check } from "lucide-react";

const includes = [
  "Jogo personalizado com sua marca",
  "Captura de leads integrada",
  "Dashboard de resultados",
  "Suporte durante o evento",
  "Funciona 100% offline",
];

export function PricingSection() {
  return (
    <section className="bg-surface-2 py-20 md:py-28">
      <Container>
        <div className="mb-12 text-center">
          <p className="text-xs font-mono font-medium uppercase tracking-[0.25em] text-volt">
            Investimento
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-[1.3] tracking-tight text-white sm:text-5xl">
            Preço escondido?
            <br />
            <span className="text-white/40">Game over!</span>
          </h2>
        </div>

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">

          {/* Card catálogo — fundo verde */}
          <div className="flex flex-col bg-volt p-8 md:p-10">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-brand-black/60">
              Jogos do catálogo
            </p>
            <div className="mt-6">
              <span className="font-display text-5xl font-bold tracking-tight text-brand-black">
                R$ 1.290
              </span>
              <p className="mt-2 font-display text-sm font-medium text-brand-black/70">
                + R$ 300 por dia extra de evento
              </p>
            </div>

            <ul className="mt-8 flex flex-col gap-3">
              {includes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-black" strokeWidth={2.5} />
                  <span className="font-display text-sm font-medium text-brand-black/80">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <WhatsappButton
                message={WHATSAPP_MESSAGES.ctaFinal}
                variant="outline"
                size="lg"
                className="w-full border-brand-black/30 text-brand-black hover:border-brand-black hover:text-brand-black"
              >
                Quero esse →
              </WhatsappButton>
            </div>
          </div>

          {/* Card fora do catálogo — fundo preto */}
          <div className="flex flex-col border border-white/10 bg-brand-black p-8 md:p-10">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-volt">
              Novo jogo
            </p>
            <div className="mt-6">
              <span className="font-display text-5xl font-bold tracking-tight text-white">
                Sob consulta
              </span>
              <p className="mt-2 font-display text-sm font-medium text-white/40">
                Precisa de algo diferente?
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <p className="font-display text-sm leading-relaxed text-white/60">
                Fala pra gente qual sua ideia ou vamos conversar juntos para encontrarmos a melhor solução para o seu evento.
              </p>
            </div>

            <div className="mt-auto pt-10">
              <WhatsappButton
                message="Olá! Tenho um projeto fora do catálogo e quero passar o briefing."
                variant="primary"
                size="lg"
                className="w-full"
              >
                Mandar o briefing →
              </WhatsappButton>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
