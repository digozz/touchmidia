import { Container } from "@/components/layout/Container";
import { Wifi, Boxes, BarChart3 } from "lucide-react";

const items = [
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

export function DifferentiatorsSection() {
  return (
    <section className="bg-surface-2 py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-medium uppercase tracking-[0.2em] text-volt text-xs">
            Como entregamos
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Coisas que parecem detalhe,
            <br />
            mas no evento são tudo.
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex flex-col rounded-2xl border border-white/8 bg-surface-2 p-8 transition-colors hover:border-volt/40"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-volt/10 text-volt">
                <item.icon className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="mt-6 font-display text-2xl font-bold tracking-tight text-white">
                {item.title}
              </h3>
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
