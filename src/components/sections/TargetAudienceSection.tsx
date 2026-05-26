import { Container } from "@/components/layout/Container";

const audiences = [
  {
    title: "Agências de eventos",
    description:
      "Quer entregar mais do que stand montado. Quer entregar resultado mensurável.",
  },
  {
    title: "Departamentos de marketing",
    description:
      "Precisa provar ROI da ativação com dados, não com fotos da fila do stand.",
  },
  {
    title: "Trade marketing",
    description:
      "Eventos de patrocínio que precisam medir engajamento e qualificar lead na hora.",
  },
  {
    title: "Stands em feiras",
    description:
      "Quer atrair fluxo no meio de centenas de concorrentes sem gastar fortuna.",
  },
];

export function TargetAudienceSection() {
  return (
    <section className="bg-white/\[0\.03\] py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-medium uppercase tracking-[0.2em] text-volt text-xs">
            Para quem é
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Feito para quem precisa de resultado.
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {audiences.map((audience) => (
            <div
              key={audience.title}
              className="rounded-2xl border border-white/8 bg-surface-2 p-8"
            >
              <h3 className="font-display text-2xl font-bold tracking-tight text-white">
                {audience.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-white/65">
                {audience.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
