import { Container } from "@/components/layout/Container";
import { WhatsappButton } from "@/components/ui/WhatsappButton";
import { WHATSAPP_MESSAGES } from "@/lib/contact";
import { Sparkles, Wand2, Cog } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Mecânica única",
    description:
      "Você descreve a ideia, a gente desenha a mecânica do zero — não adaptamos um jogo existente.",
  },
  {
    icon: Wand2,
    title: "Visual sob medida",
    description:
      "Arte, animações e tipografia totalmente alinhadas com a sua identidade. Sem template.",
  },
  {
    icon: Cog,
    title: "Integrações específicas",
    description:
      "API do seu CRM, regras de negócio próprias, telas customizadas pré ou pós-jogo.",
  },
];

export function CustomGameSection() {
  return (
    <section className="bg-brand-black py-20 text-brand-white md:py-28">
      <Container>
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16 md:items-center">
          <div>
            <p className="font-medium uppercase tracking-[0.2em] text-volt/60 text-xs">
              Jogo personalizado
            </p>
            <h2 className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
              Não achou o que
              <br />
              queria?
              <br />
              <span className="text-volt/60">A gente conversa.</span>
            </h2>
            <p className="mt-8 text-lg leading-relaxed text-brand-white/70">
              Os jogos do catálogo cobrem a maioria dos casos. Mas se você
              precisa de algo diferente, a gente cria do zero.
            </p>
            <div className="mt-10">
              <WhatsappButton
                message={WHATSAPP_MESSAGES.customGame}
                variant="primary"
                size="lg"
              >
                Falar sobre jogo personalizado →
              </WhatsappButton>
            </div>
          </div>

          <div className="grid gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex gap-4 rounded-2xl border border-brand-white/10 bg-white/\[0\.03\] p-6 transition-colors hover:border-volt/30"
              >
                <div className="grid h-10 w-10 flex-none place-items-center rounded-lg bg-volt/15 text-volt/60">
                  <feature.icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold tracking-tight text-brand-white">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-brand-white/60">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
