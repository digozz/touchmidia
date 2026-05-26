import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GameDetailLayout } from "@/components/games/GameDetailLayout";
import { BateToupeiraDemo } from "@/components/demo/BateToupeiraDemo";
import { CacaNiquelDemo } from "@/components/demo/CacaNiquelDemo";
import { PlinkoDemo } from "@/components/demo/PlinkoDemo";
import { PenaltiDemo } from "@/components/demo/PenaltiDemo";
import { RoletaDemo } from "@/components/demo/RoletaDemo";
import { JogoDaMemoriaDemo } from "@/components/demo/JogoDaMemoriaDemo";
import { RaspadinhaDemo } from "@/components/demo/RaspadinhaDemo";
import { QuebracabecaDemo } from "@/components/demo/QuebracabecaDemo";
import { QuizDemo } from "@/components/demo/QuizDemo";
import { VerdadeiroFalsoDemo } from "@/components/demo/VerdadeiroFalsoDemo";
import { PegueOsItensDemo } from "@/components/demo/PegueOsItensDemo";
import { CaixaMisteriosaDemo } from "@/components/demo/CaixaMisteriosaDemo";
import { games, getGameBySlug } from "@/content/games";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return games.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) return {};
  const title = `${game.name} para Eventos`;
  return {
    title,
    description: game.shortDescription,
    keywords: game.seoKeywords,
    alternates: { canonical: `/jogos/${game.slug}` },
    openGraph: {
      title: `${title} | TOUCH MIDIA`,
      description: game.shortDescription,
      url: `/jogos/${game.slug}`,
      type: "website",
    },
  };
}

const DEMOS: Record<string, React.ReactNode> = {
  "roleta-premiada":     <RoletaDemo />,
  "caca-niquel":         <CacaNiquelDemo />,
  "plinko":              <PlinkoDemo />,
  "cobranca-de-penalti": <PenaltiDemo />,
  "bate-toupeira":       <BateToupeiraDemo />,
  "jogo-da-memoria":     <JogoDaMemoriaDemo />,
  "raspadinha":          <RaspadinhaDemo />,
  "quebra-cabeca":       <QuebracabecaDemo />,
  "quiz":                <QuizDemo />,
  "flappy":              <VerdadeiroFalsoDemo />,
  "pegue-os-itens":     <PegueOsItensDemo />,
  "caixa-misteriosa":   <CaixaMisteriosaDemo />,
};

function placeholder(name: string) {
  return (
    <div className="flex aspect-[9/16] w-full flex-col items-center justify-center gap-4 bg-brand-black">
      <span className="font-display text-lg font-bold text-volt">{name}</span>
      <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">Em breve</span>
    </div>
  );
}

export default async function GameDetailPage({ params }: Props) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) notFound();

  const demo = DEMOS[game.slug] ?? placeholder(game.name);
  const otherGames = games.filter((g) => g.slug !== game.slug);

  return <GameDetailLayout game={game} demo={demo} otherGames={otherGames} />;
}
