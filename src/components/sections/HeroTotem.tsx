"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TotemMockup } from "@/components/demo/TotemMockup";
import { BateToupeiraDemo } from "@/components/demo/BateToupeiraDemo";
import { CacaNiquelDemo } from "@/components/demo/CacaNiquelDemo";
import { CaixaMisteriosaDemo } from "@/components/demo/CaixaMisteriosaDemo";
import { JogoDaMemoriaDemo } from "@/components/demo/JogoDaMemoriaDemo";
import { PegueOsItensDemo } from "@/components/demo/PegueOsItensDemo";
import { PenaltiDemo } from "@/components/demo/PenaltiDemo";
import { PlinkoDemo } from "@/components/demo/PlinkoDemo";
import { QuebracabecaDemo } from "@/components/demo/QuebracabecaDemo";
import { QuizDemo } from "@/components/demo/QuizDemo";
import { RaspadinhaDemo } from "@/components/demo/RaspadinhaDemo";
import { RoletaDemo } from "@/components/demo/RoletaDemo";
import { VerdadeiroFalsoDemo } from "@/components/demo/VerdadeiroFalsoDemo";

const SLIDES: { name: string; render: () => React.ReactNode }[] = [
  { name: "Roleta",            render: () => <RoletaDemo /> },
  { name: "Plinko",            render: () => <PlinkoDemo /> },
  { name: "Raspadinha",        render: () => <RaspadinhaDemo /> },
  { name: "Bate-Toupeira",     render: () => <BateToupeiraDemo /> },
  { name: "Cobrança de Pênalti", render: () => <PenaltiDemo /> },
  { name: "Caça-Níquel",       render: () => <CacaNiquelDemo /> },
  { name: "Pegue os Itens",    render: () => <PegueOsItensDemo /> },
  { name: "Quiz",              render: () => <QuizDemo /> },
  { name: "Jogo da Memória",   render: () => <JogoDaMemoriaDemo /> },
  { name: "Quebra-Cabeça",     render: () => <QuebracabecaDemo /> },
  { name: "Flappy",            render: () => <VerdadeiroFalsoDemo /> },
  { name: "Pega Urso",         render: () => <CaixaMisteriosaDemo /> },
];

const ROTATE_MS = 6500;

export function HeroTotem() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % SLIDES.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const current = SLIDES[idx];

  return (
    <div className="w-full max-w-[380px]">
      <TotemMockup>
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {current.render()}
          </motion.div>
        </AnimatePresence>
      </TotemMockup>

      <div className="mt-5 flex items-center justify-center gap-2">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-volt animate-pulse" />
        <AnimatePresence mode="wait">
          <motion.span
            key={idx}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-white/70"
          >
            {current.name}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
