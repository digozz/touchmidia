import { Container } from "@/components/layout/Container";
import { GameCard } from "@/components/games/GameCard";
import { games } from "@/content/games";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function GamesCatalogSection() {
  return (
    <section className="bg-brand-black py-20 md:py-28">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-medium uppercase tracking-[0.2em] text-volt text-xs">
              Catálogo
            </p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white leading-[1.3] sm:text-5xl">
              Escolha seu jogo.
              <br />
              <span className="bg-volt text-brand-black px-2">A gente personaliza.</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-white/65">
              Jogos prontos para receber sua marca, suas cores, seus prêmios.
              Configurados em horas, não em semanas.
            </p>
          </div>
          <Link
            href="/jogos"
            className="hidden md:inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-volt hover:text-volt"
          >
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {games.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>

        <div className="mt-10 flex justify-center md:hidden">
          <Link
            href="/jogos"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white"
          >
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
