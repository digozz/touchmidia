import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { GameCard } from "@/components/games/GameCard";
import { CustomGameSection } from "@/components/sections/CustomGameSection";
import { games, CATEGORY_LABELS, type GameCategory } from "@/content/games";

export const metadata: Metadata = {
  title: "Catálogo de Jogos para Eventos",
  description:
    "12 jogos prontos para personalizar com sua marca: roleta, raspadinha, quiz, plinko, pênalti, jogo da memória e mais. Captura de leads em tempo real.",
  alternates: {
    canonical: "/jogos",
  },
};

const categoryOrder: GameCategory[] = ["sorte", "conhecimento", "marca"];

const categoryDescriptions: Record<GameCategory, string> = {
  sorte:
    "Mecânica de probabilidade com gestão inteligente de estoque. Vende em qualquer evento.",
  conhecimento:
    "Educa o lead sobre sua marca enquanto coleta dados. Ideal para feiras técnicas.",
  marca:
    "Skill, agilidade e branding. Para marcas que querem entregar visual de impacto.",
};

export default function GamesIndexPage() {
  const grouped = categoryOrder.map((category) => ({
    category,
    items: games.filter((g) => g.category === category),
  }));

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="border-b border-white/5 bg-surface-2 py-16 md:py-24">
          <Container>
            <p className="font-medium uppercase tracking-[0.2em] text-volt text-xs">
              Catálogo
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              12 jogos prontos.
              <br />
              <span className="text-volt">
                Personalizados com a sua marca.
              </span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/65">
              Cada jogo abaixo é totalmente customizável: cores, logo, prêmios,
              probabilidades, mecânica. Veja os detalhes na página de cada um e
              fale com a gente para o seu evento.
            </p>
            <p className="mt-4 max-w-2xl text-base text-white/55">
              Precisa de algo que não está no catálogo?{" "}
              <a
                href="#jogo-personalizado"
                className="font-medium text-volt underline-offset-4 hover:underline"
              >
                A gente também cria do zero.
              </a>
            </p>
          </Container>
        </section>

        {grouped.map((group) => (
          <section
            key={group.category}
            className="border-b border-white/5 bg-surface-2 py-16 md:py-20"
          >
            <Container>
              <div className="max-w-2xl">
                <p className="font-medium uppercase tracking-[0.2em] text-volt text-xs">
                  {CATEGORY_LABELS[group.category]}
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {categoryDescriptions[group.category]}
                </h2>
              </div>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {group.items.map((game) => (
                  <GameCard key={game.slug} game={game} />
                ))}
              </div>
            </Container>
          </section>
        ))}

        <div id="jogo-personalizado" className="scroll-mt-20">
          <CustomGameSection />
        </div>
      </main>
      <Footer />
    </>
  );
}
