"use client";

import { useState, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";
import { DemoShell } from "./DemoShell";

const SYMBOLS = ["★", "♦", "▲", "●", "♠", "♥", "■", "♣"];

type Card = { id: number; pairId: number; flipped: boolean; matched: boolean };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createDeck(): Card[] {
  return shuffle(
    SYMBOLS.flatMap((_, pairId) => [
      { id: pairId * 2,     pairId, flipped: false, matched: false },
      { id: pairId * 2 + 1, pairId, flipped: false, matched: false },
    ])
  );
}

export function JogoDaMemoriaDemo() {
  const [cards, setCards]     = useState<Card[]>(createDeck);
  const [firstId, setFirstId] = useState<number | null>(null);
  const [locked, setLocked]   = useState(false);
  const [moves, setMoves]     = useState(0);
  const [ended, setEnded]     = useState(false);

  const matchedPairs = cards.filter(c => c.matched).length / 2;

  const restart = useCallback(() => {
    setCards(createDeck());
    setFirstId(null);
    setLocked(false);
    setMoves(0);
    setEnded(false);
  }, []);

  const flip = useCallback((id: number) => {
    if (locked || ended) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;

    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));

    if (firstId === null) {
      setFirstId(id);
      return;
    }

    const first = cards.find(c => c.id === firstId)!;
    setFirstId(null);
    setMoves(m => m + 1);

    if (first.pairId === card.pairId) {
      setCards(prev => {
        const updated = prev.map(c =>
          c.id === firstId || c.id === id ? { ...c, flipped: true, matched: true } : c
        );
        if (updated.every(c => c.matched)) setEnded(true);
        return updated;
      });
    } else {
      setLocked(true);
      setTimeout(() => {
        setCards(prev => prev.map(c =>
          c.id === firstId || c.id === id ? { ...c, flipped: false } : c
        ));
        setLocked(false);
      }, 900);
    }
  }, [cards, firstId, locked, ended]);

  return (
    <DemoShell hint={ended ? null : "ENCONTRE OS PARES"}>
      <div className="flex h-full flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div className="text-center">
          <p className="font-mono text-[8px] uppercase tracking-widest text-white/35">Jogadas</p>
          <p className="font-display text-2xl font-bold text-white">{moves}</p>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-widest text-volt">Memória</p>
        <div className="text-center">
          <p className="font-mono text-[8px] uppercase tracking-widest text-white/35">Pares</p>
          <p className="font-display text-2xl font-bold text-volt">{matchedPairs}/8</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mx-6 h-0.5 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full bg-volt transition-all duration-500"
          style={{ width: `${(matchedPairs / 8) * 100}%` }}
        />
      </div>

      {/* Grid */}
      <div className="flex flex-1 items-center px-5">
        <div className="grid w-full grid-cols-4 gap-2">
          {cards.map(card => (
            <div
              key={card.id}
              onClick={() => flip(card.id)}
              className="aspect-[4/5] cursor-pointer"
              style={{ perspective: "600px" }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  transformStyle: "preserve-3d",
                  transition: "transform 0.35s ease",
                  transform: card.flipped || card.matched ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* Back */}
                <div
                  style={{
                    position: "absolute", inset: 0,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    borderRadius: "10px",
                    backgroundColor: "#0f0f10",
                    backgroundImage: `
                      repeating-linear-gradient(45deg,  rgba(198,255,61,0.09) 0, rgba(198,255,61,0.09) 1px, transparent 0, transparent 50%),
                      repeating-linear-gradient(-45deg, rgba(198,255,61,0.09) 0, rgba(198,255,61,0.09) 1px, transparent 0, transparent 50%)
                    `,
                    backgroundSize: "9px 9px",
                    border: "1px solid rgba(198,255,61,0.18)",
                    boxSizing: "border-box",
                    overflow: "hidden",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {/* inner border */}
                  <div style={{
                    position: "absolute", inset: "5px",
                    border: "1px solid rgba(198,255,61,0.12)",
                    borderRadius: "6px",
                    pointerEvents: "none",
                  }} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo-mark-white.png" alt="" style={{ width: "38%", opacity: 0.55, position: "relative", zIndex: 1 }} />
                </div>
                {/* Front */}
                <div
                  style={{
                    position: "absolute", inset: 0,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    borderRadius: "10px",
                    backgroundColor: card.matched ? "#9FD61A" : "#C6FF3D",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: "46px", color: "#0A0A0A", fontWeight: 700 }}>
                    {SYMBOLS[card.pairId]}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* End overlay */}
      <AnimatePresence>
        {ended && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-brand-black/95 px-10"
          >
            <m.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-volt">Parabéns!</p>
              <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-white">
                Você completou<br />o jogo!
              </h2>
              <p className="mt-4 font-display text-base text-white/50">
                {moves} jogada{moves !== 1 ? "s" : ""}
              </p>
              <button
                onClick={restart}
                className="mt-10 inline-flex h-14 items-center justify-center rounded-full bg-volt px-12 font-display text-base font-bold text-brand-black"
              >
                Jogar de novo
              </button>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      </div>
    </DemoShell>
  );
}
