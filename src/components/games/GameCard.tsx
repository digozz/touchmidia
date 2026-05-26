import Link from "next/link";
import { type Game } from "@/content/games";
import { GameMockup } from "./GameMockup";
import { cn } from "@/lib/utils";

type Props = {
  game: Game;
  className?: string;
};

export function GameCard({ game, className }: Props) {
  return (
    <Link
      href={`/jogos/${game.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-surface-2 transition-all duration-300",
        "hover:-translate-y-1 hover:border-volt/40 hover:shadow-xl hover:shadow-volt/10",
        className,
      )}
    >
      <GameMockup
        slug={game.slug}
        className="transition-transform duration-500 group-hover:scale-[1.04]"
      />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-xl font-bold tracking-tight text-white">
          {game.name}
        </h3>
        <p className="text-sm leading-relaxed text-white/60">
          {game.shortDescription}
        </p>
      </div>
    </Link>
  );
}
