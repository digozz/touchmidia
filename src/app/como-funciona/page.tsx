import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { WhatsappButton } from "@/components/ui/WhatsappButton";
import { WHATSAPP_MESSAGES } from "@/lib/contact";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Como Funciona",
  description:
    "Em 3 passos: escolha o jogo, personalize com sua marca, receba os leads em tempo real. Veja o que entra, o tempo de produção e como funciona offline.",
  alternates: { canonical: "/como-funciona" },
};

const steps = [
  {
    number: "01",
    title: "Você escolhe o jogo",
    description:
      "Conta pra gente sobre o evento — público, objetivo, tempo de jogada esperado. A gente recomenda o jogo do catálogo que casa melhor. Se preferir, escolhe direto.",
    bullets: [
      "12 jogos no catálogo (sorte, conhecimento, agilidade)",
      "Recomendação personalizada se preferir não escolher sozinho",
      "Sem custo para conversa de descoberta",
    ],
  },
  {
    number: "02",
    title: "A gente personaliza",
    description:
      "Você envia logo, paleta, prêmios. A gente devolve o jogo com a sua marca em 24-72h. Ajustes incluídos até bater com o que você imaginou.",
    bullets: [
      "Logo, cores, fontes da sua marca",
      "Prêmios físicos ou virtuais (vouchers, descontos)",
      "Probabilidades base configuradas com você",
      "Mensagens personalizadas (boas-vindas, vitória, agradecimento)",
    ],
  },
  {
    number: "03",
    title: "Roda no evento",
    description:
      "Você recebe a URL do totem e o acesso ao painel. No dia, basta abrir no navegador do equipamento em modo kiosk. A gente acompanha o uptime — se algo der ruim, falamos com você antes de virar problema.",
    bullets: [
      "Funciona em qualquer Windows/Android com navegador moderno",
      "Continua rodando se a internet do pavilhão cair",
      "Dashboard em tempo real do seu computador",
      "Exportação de leads em CSV ou XLSX no final",
    ],
  },
];

const faq = [
  {
    q: "Quanto tempo leva pra ficar pronto?",
    a: "Personalização visual fica em 24-72h. Eventos com requisitos mais específicos podem precisar de uma semana. Aceitamos prazos curtos sob ajuste comercial.",
  },
  {
    q: "Funciona em qualquer totem?",
    a: "Sim. Roda em qualquer hardware Windows ou Android com navegador moderno (Chrome ou Edge). Não fornecemos equipamento nesta etapa, mas podemos indicar fornecedores de aluguel.",
  },
  {
    q: "E se a internet do evento cair?",
    a: "O totem continua rodando. Os leads ficam salvos localmente e sincronizam com a nuvem quando a conexão volta. Você não perde nenhum dado.",
  },
  {
    q: "Posso usar em mais de um totem ao mesmo tempo?",
    a: "Sim. O mesmo evento pode rodar em N totens em paralelo. Os leads consolidam num único dashboard.",
  },
  {
    q: "Como funciona a captura de leads?",
    a: "Você decide os campos do formulário (nome, email, telefone, empresa, etc.) e se ele aparece antes ou depois do jogo. Antes maximiza captura. Depois maximiza throughput.",
  },
  {
    q: "Os prêmios físicos vocês fornecem?",
    a: "Não fornecemos brindes. Você compra os prêmios e nos passa as quantidades — a gente garante que o sistema só distribua o que tem em estoque.",
  },
];

export default function ComoFuncionaPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="border-b border-white/5 bg-surface-2 py-16 md:py-24">
          <Container>
            <p className="font-medium uppercase tracking-[0.2em] text-volt text-xs">
              Como funciona
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Três passos.
              <br />
              <span className="text-volt">Sem enrolação.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/65">
              Sem reuniões intermináveis, sem briefings de 40 páginas. Conta o
              que precisa, a gente devolve pronto.
            </p>
          </Container>
        </section>

        <section className="bg-surface-2 py-16 md:py-24">
          <Container>
            <div className="mx-auto flex max-w-4xl flex-col gap-16">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="grid gap-8 md:grid-cols-[auto_1fr] md:gap-12"
                >
                  <div>
                    <span className="font-display text-7xl font-bold leading-none text-volt/40">
                      {step.number}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                      {step.title}
                    </h2>
                    <p className="mt-4 text-lg leading-relaxed text-white/65">
                      {step.description}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {step.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-3">
                          <Check
                            className="mt-1 h-5 w-5 flex-none text-volt"
                            strokeWidth={2.5}
                          />
                          <span className="text-base leading-relaxed text-white/80">
                            {b}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-t border-white/5 bg-white/\[0\.03\] py-16 md:py-24">
          <Container>
            <div className="mx-auto max-w-3xl">
              <p className="font-medium uppercase tracking-[0.2em] text-volt text-xs">
                Perguntas frequentes
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                O que clientes costumam perguntar
              </h2>

              <div className="mt-10 divide-y divide-brand-black/8 rounded-2xl border border-white/8 bg-surface-2">
                {faq.map((item) => (
                  <details
                    key={item.q}
                    className="group p-6 [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-lg font-semibold text-white">
                      {item.q}
                      <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-volt/10 text-volt transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-base leading-relaxed text-white/65">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <section className="bg-brand-black py-20 text-brand-white">
          <Container className="text-center">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Tem um evento na agenda?
            </h2>
            <p className="mt-4 text-base text-brand-white/65">
              Conta pra gente. Em geral respondemos no mesmo dia.
            </p>
            <div className="mt-8">
              <WhatsappButton
                message={WHATSAPP_MESSAGES.comoFunciona}
                variant="primary"
                size="lg"
              >
                Falar no WhatsApp →
              </WhatsappButton>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
