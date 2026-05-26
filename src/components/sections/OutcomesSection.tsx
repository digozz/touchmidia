import { Container } from "@/components/layout/Container";
import { Users, Database, Sparkles } from "lucide-react";

const outcomes = [
  {
    icon: Users,
    label: "Atenção pra marca",
    title: "Seu stand vira ponto de parada.",
    description:
      "Totem com jogo gera movimento espontâneo. Visitante para, joga, e enquanto isso a sua marca fica na frente dele — não no panfleto que ele descarta na saída.",
  },
  {
    icon: Database,
    label: "Leads qualificados",
    title: "Cadastros que servem pra ligar segunda.",
    description:
      "Captura digital nativa com email e telefone validados. Sem caligrafia ilegível, sem digitação manual, sem planilha do estagiário. Exporte em CSV ou XLSX no final do evento.",
  },
  {
    icon: Sparkles,
    label: "Memória de marca",
    title: "O visitante leva sua marca na cabeça.",
    description:
      "Engajamento ativo cria memória ativa. Quem joga, ganha, perde, vibra — lembra. Marca tocada, jogada e disputada vira história contada pros colegas no dia seguinte.",
  },
];

export function OutcomesSection() {
  return (
    <section className="bg-surface-2 py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-medium uppercase tracking-[0.2em] text-volt text-xs">
            Resultados
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Três coisas que o stand tradicional
            <br />
            <span className="text-volt">não te entrega.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/65">
            Não é jogo pelo jogo. É atenção pra sua marca, lead na sua planilha
            e lembrança que dura depois do evento acabar.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {outcomes.map((outcome) => (
            <div
              key={outcome.label}
              className="flex flex-col rounded-2xl bg-white/[0.04] p-8 ring-1 ring-white/8 transition-all hover:ring-volt/40"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-volt text-brand-black">
                <outcome.icon className="h-6 w-6" strokeWidth={2} />
              </div>
              <p className="mt-6 text-xs font-medium uppercase tracking-[0.15em] text-volt">
                {outcome.label}
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold leading-tight tracking-tight text-white">
                {outcome.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-white/65">
                {outcome.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
