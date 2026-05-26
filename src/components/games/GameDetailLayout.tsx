import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { TotemMockup } from "@/components/demo/TotemMockup";
import { GameCard } from "@/components/games/GameCard";
import { WhatsappButton } from "@/components/ui/WhatsappButton";
import { buildWhatsappUrl, WHATSAPP_MESSAGES } from "@/lib/contact";
import type { Game } from "@/content/games";

type Props = {
  game: Game;
  demo: React.ReactNode;
  otherGames: Game[];
};

export function GameDetailLayout({ game, demo, otherGames }: Props) {
  return (
    <>
      <Header />
      <main className="flex-1">

        {/* Breadcrumb */}
        <div className="border-b border-brand-black/5 bg-brand-white">
          <Container className="flex items-center gap-2 py-4 text-sm">
            <Link href="/" className="text-brand-black/50 hover:text-brand-black">Início</Link>
            <span className="text-brand-black/30">›</span>
            <Link href="/jogos" className="text-brand-black/50 hover:text-brand-black">Jogos</Link>
            <span className="text-brand-black/30">›</span>
            <span className="text-brand-black/80">{game.name}</span>
          </Container>
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden bg-brand-white pt-16 md:pt-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.08),transparent_55%)]"
          />
          <Container className="relative grid gap-12 md:grid-cols-2 md:gap-16">
            <div className="flex flex-col justify-center pb-16 md:pb-24">
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.35em] text-brand-black/45">
                Jogos interativos para eventos · Touch Midia
              </p>
              <div className="flex items-center gap-5">
                <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-brand-black sm:text-5xl lg:text-6xl">
                  <span className="bg-volt px-2">{game.name}</span>
                </h1>
                <div className="relative flex-none -rotate-6" style={{ width: 98, height: 98 }}>
                  <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
                    <polygon
                      points="50,0 58.39,7.83 69.13,3.81 73.89,14.25 85.36,14.64 85.75,26.11 96.19,30.87 92.17,41.61 100,50 92.17,58.39 96.19,69.13 85.75,73.89 85.36,85.36 73.89,85.75 69.13,96.19 58.39,92.17 50,100 41.61,92.17 30.87,96.19 26.11,85.75 14.64,85.36 14.25,73.89 3.81,69.13 7.83,58.39 0,50 7.83,41.61 3.81,30.87 14.25,26.11 14.64,14.64 26.11,14.25 30.87,3.81 41.61,7.83"
                      fill="#0A0A0A"
                    />
                  </svg>
                  <div className="relative flex h-full flex-col items-center justify-center gap-1 text-center">
                    <span className="font-mono text-[8px] uppercase leading-none tracking-[0.15em] text-volt/70">a partir de</span>
                    <span className="font-display text-[12px] font-black leading-tight text-volt">R$ 1.290,00</span>
                    <span className="font-mono text-[8px] uppercase leading-none tracking-[0.15em] text-volt/70">/evento</span>
                  </div>
                </div>
              </div>
              <p className="mt-6 text-lg leading-relaxed text-brand-black/70">
                {game.longDescription}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <WhatsappButton message={game.whatsappMessage} variant="primary" size="lg">
                  Quero este jogo →
                </WhatsappButton>
                <a
                  href="#continue-explorando"
                  className="inline-flex h-14 items-center gap-2 rounded-full border-2 border-brand-black px-7 text-xl font-display font-bold text-brand-black transition-colors hover:border-brand-black"
                >
                  Ver outros jogos
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="flex items-start justify-center">
              <div className="w-full max-w-[380px]">
                <TotemMockup>{demo}</TotemMockup>
              </div>
            </div>
          </Container>
        </section>

        {/* Mecânica + Personalização */}
        <section className="border-t border-brand-black/5 bg-zinc-50 py-16 md:py-20">
          <Container>
            <div className="grid gap-12 md:grid-cols-2 md:gap-16">
              <div>
                <p className="inline-block bg-volt px-3 py-1 font-medium uppercase tracking-[0.2em] text-brand-black text-xs">
                  Mecânica
                </p>
                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-brand-black sm:text-4xl">
                  Como funciona na prática
                </h2>
                <ul className="mt-8 space-y-4">
                  {game.mechanics.map((m) => (
                    <li key={m} className="flex items-start gap-3">
                      <Check className="mt-1 h-5 w-5 flex-none text-brand-black" strokeWidth={2.5} />
                      <span className="text-base leading-relaxed text-brand-black/75">{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="inline-block bg-volt px-3 py-1 font-medium uppercase tracking-[0.2em] text-brand-black text-xs">
                  Personalização
                </p>
                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-brand-black sm:text-4xl">
                  O que pode ser customizado
                </h2>
                <ul className="mt-8 space-y-4">
                  {game.customizationOptions.map((c) => (
                    <li key={c} className="flex items-start gap-3">
                      <Check className="mt-1 h-5 w-5 flex-none text-brand-black" strokeWidth={2.5} />
                      <span className="text-base leading-relaxed text-brand-black/75">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>

        {/* Continue explorando */}
        {otherGames.length > 0 && (
          <section id="continue-explorando" className="scroll-mt-20 bg-brand-black py-20 md:py-28">
            <Container>
              <p className="font-medium uppercase tracking-[0.2em] text-volt text-xs">Continue explorando</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Outros jogos do catálogo
              </h2>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {otherGames.map((g) => (
                  <GameCard key={g.slug} game={g} />
                ))}
                <Link
                  href={buildWhatsappUrl(WHATSAPP_MESSAGES.customGame)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col overflow-hidden rounded-2xl bg-volt p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-volt/30"
                >
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand-black/50">Exclusivo</span>
                  <span className="mt-3 font-display text-xl font-bold leading-tight tracking-tight text-brand-black">
                    Jogo totalmente personalizado
                  </span>
                  <span className="mt-2 text-sm leading-relaxed text-brand-black/65">
                    Mecânica, visual e prêmios criados do zero para a sua marca.
                  </span>
                  <span className="mt-auto pt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-black">
                    Falar com a equipe
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </div>
            </Container>
          </section>
        )}

        {/* CTA final */}
        <section className="border-t border-brand-black/5 bg-zinc-50 py-16 md:py-20">
          <Container className="text-center">
            <h2 className="mx-auto max-w-2xl font-display text-4xl font-bold leading-[1.1] tracking-tight text-brand-black sm:text-5xl">
              O jogo começa aqui.
              <br />
              <span className="bg-volt px-2 text-3xl text-brand-black sm:text-4xl whitespace-nowrap">
                Sua primeira jogada é nos mandar um &ldquo;Oi&rdquo;!
              </span>
            </h2>
            <div className="mt-10">
              <WhatsappButton
                message={game.whatsappMessage}
                variant="primary"
                size="lg"
                className="bg-brand-black text-white hover:bg-brand-black/85"
              >
                Falar sobre {game.name} →
              </WhatsappButton>
            </div>
          </Container>
        </section>

      </main>
      <Footer />
    </>
  );
}
