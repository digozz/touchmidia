"use client";

import { useEffect, useState, type ComponentType } from "react";
import dynamic from "next/dynamic";
import { m, AnimatePresence } from "framer-motion";
import { TotemMockup } from "@/components/demo/TotemMockup";

// Cada demo vira chunk próprio. Carregamento sob demanda.
const lazy = (loader: () => Promise<{ [k: string]: ComponentType }>, exportName: string) =>
  dynamic(() => loader().then((m) => ({ default: m[exportName] })), { ssr: false });

const SLIDES: { name: string; Demo: ComponentType }[] = [
  { name: "Roleta",              Demo: lazy(() => import("@/components/demo/RoletaDemo"), "RoletaDemo") },
  { name: "Plinko",              Demo: lazy(() => import("@/components/demo/PlinkoDemo"), "PlinkoDemo") },
  { name: "Raspadinha",          Demo: lazy(() => import("@/components/demo/RaspadinhaDemo"), "RaspadinhaDemo") },
  { name: "Bate-Toupeira",       Demo: lazy(() => import("@/components/demo/BateToupeiraDemo"), "BateToupeiraDemo") },
  { name: "Cobrança de Pênalti", Demo: lazy(() => import("@/components/demo/PenaltiDemo"), "PenaltiDemo") },
  { name: "Caça-Níquel",         Demo: lazy(() => import("@/components/demo/CacaNiquelDemo"), "CacaNiquelDemo") },
  { name: "Pegue os Itens",      Demo: lazy(() => import("@/components/demo/PegueOsItensDemo"), "PegueOsItensDemo") },
  { name: "Quiz",                Demo: lazy(() => import("@/components/demo/QuizDemo"), "QuizDemo") },
  { name: "Jogo da Memória",     Demo: lazy(() => import("@/components/demo/JogoDaMemoriaDemo"), "JogoDaMemoriaDemo") },
  { name: "Quebra-Cabeça",       Demo: lazy(() => import("@/components/demo/QuebracabecaDemo"), "QuebracabecaDemo") },
  { name: "Flappy",              Demo: lazy(() => import("@/components/demo/VerdadeiroFalsoDemo"), "VerdadeiroFalsoDemo") },
  { name: "Pega Urso",           Demo: lazy(() => import("@/components/demo/CaixaMisteriosaDemo"), "CaixaMisteriosaDemo") },
];

const ROTATE_MS = 3500;

export function HeroTotem() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % SLIDES.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const current = SLIDES[idx];
  const Demo = current.Demo;

  return (
    <div className="flex w-full max-w-[380px] flex-col items-center">
      <div className="mb-5 flex items-center gap-2">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-volt animate-pulse" />
        <AnimatePresence mode="wait">
          <m.span
            key={idx}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-white/70"
          >
            {current.name}
          </m.span>
        </AnimatePresence>
      </div>

      <TotemMockup>
        <AnimatePresence mode="wait">
          <m.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Demo />
          </m.div>
        </AnimatePresence>
      </TotemMockup>
    </div>
  );
}
