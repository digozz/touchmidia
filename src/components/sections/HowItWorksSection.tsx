import { Container } from "@/components/layout/Container";
import { Wifi, Boxes, BarChart3 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Escolha o jogo",
    description:
      "Você escolhe um dos 12 jogos do catálogo. A gente recomenda o ideal para o seu evento e público.",
  },
  {
    number: "02",
    title: "Personalize com sua marca",
    description:
      "Logo, cores, prêmios, mensagens — tudo no seu visual. Pronto em horas, não em semanas.",
  },
  {
    number: "03",
    title: "Receba os leads em tempo real",
    description:
      "Acompanhe pelo painel durante o evento. Exporte CSV ou XLSX no final com tudo limpo e organizado.",
  },
];

const guarantees = [
  {
    icon: Wifi,
    title: "Funciona offline",
    description:
      "Wi-Fi do pavilhão caiu? O totem não. Os leads ficam salvos localmente e sincronizam quando a rede volta.",
  },
  {
    icon: Boxes,
    title: "Estoque inteligente",
    description:
      "Brinde acabou? O sistema deixa de distribuir aquele item automaticamente. Sem promessa que não pode cumprir.",
  },
  {
    icon: BarChart3,
    title: "Dashboard ao vivo",
    description:
      "Acompanhe leads, jogadas e prêmios em tempo real durante o evento. Exporte CSV ou XLSX no final.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-surface-2 py-20 md:py-28">
      <Container>
        {/* Parte 1 — Os 3 passos */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-medium uppercase tracking-[0.2em] text-volt text-xs">
            Como funciona
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Três passos.
            <br />
            Sem enrolação.
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3 md:gap-6">
          {steps.map((step, idx) => (
            <div key={step.number} className="relative">
              <div className="flex items-center gap-4">
                <span className="font-display text-5xl font-bold text-volt/40">
                  {step.number}
                </span>
                {idx < steps.length - 1 && (
                  <div className="hidden h-px flex-1 bg-brand-black/10 md:block" />
                )}
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-white/65">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Parte 2 — Garantias técnicas (antes era "Como entregamos") */}
        <div className="mx-auto mt-24 max-w-2xl text-center">
          <p className="font-medium uppercase tracking-[0.2em] text-volt text-xs">
            Os detalhes que importam
          </p>
          <h3 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Coisas que parecem detalhe,
            <br />
            mas no evento são tudo.
          </h3>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {guarantees.map((item) => (
            <div
              key={item.title}
              className="flex flex-col rounded-2xl border border-white/8 bg-surface-2 p-8 transition-colors hover:border-volt/40"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-volt/10 text-volt">
                <item.icon className="h-6 w-6" strokeWidth={2} />
              </div>
              <h4 className="mt-6 font-display text-xl font-bold tracking-tight text-white">
                {item.title}
              </h4>
              <p className="mt-3 text-base leading-relaxed text-white/65">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
