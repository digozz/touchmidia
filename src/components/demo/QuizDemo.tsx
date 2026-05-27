"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { DemoShell } from "./DemoShell";

type Question = {
  text: string;
  options: string[];
  correct: number;
};

const QUESTIONS: Question[] = [
  {
    text: "Qual é o jogo mais vendido da história, com mais de 200 milhões de cópias?",
    options: ["GTA V", "Tetris", "Minecraft", "FIFA 23"],
    correct: 2,
  },
  {
    text: "Qual personagem é a mascote oficial da Nintendo?",
    options: ["Link", "Kirby", "Donkey Kong", "Mario"],
    correct: 3,
  },
  {
    text: "Em qual ano foi lançado o primeiro console PlayStation?",
    options: ["1992", "1994", "1996", "1998"],
    correct: 1,
  },
  {
    text: "O herói Link protagoniza qual série de jogos?",
    options: ["Metroid", "Final Fantasy", "The Legend of Zelda", "Dark Souls"],
    correct: 2,
  },
  {
    text: "Qual jogo popularizou o gênero Battle Royale em 2017?",
    options: ["Fortnite", "Apex Legends", "H1Z1", "PUBG"],
    correct: 3,
  },
];

type Phase = "question" | "feedback" | "ended";

export function QuizDemo() {
  const [current,  setCurrent]  = useState(0);
  const [phase,    setPhase]    = useState<Phase>("question");
  const [selected, setSelected] = useState<number | null>(null);
  const [score,    setScore]    = useState(0);

  const question = QUESTIONS[current];
  const total    = QUESTIONS.length;

  function pick(index: number) {
    if (phase !== "question") return;
    if (index === question.correct) setScore(s => s + 1);
    setSelected(index);
    setPhase("feedback");
    setTimeout(() => {
      if (current + 1 >= total) {
        setPhase("ended");
      } else {
        setCurrent(c => c + 1);
        setSelected(null);
        setPhase("question");
      }
    }, 1500);
  }

  function restart() {
    setCurrent(0);
    setPhase("question");
    setSelected(null);
    setScore(0);
  }

  const progress =
    phase === "ended"    ? 100 :
    phase === "feedback" ? ((current + 1) / total) * 100 :
    (current / total) * 100;

  const resultLabel =
    score === 5 ? "Perfeito!" :
    score >= 4  ? "Muito bom!" :
    score >= 3  ? "Passou da metade!" :
    score >= 2  ? "Pode melhorar!" :
                  "Tente de novo!";

  return (
    <DemoShell hint={phase === "question" ? "TOQUE NA RESPOSTA" : null}>
      <div className="flex h-full flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-3">
          <div className="text-center">
            <p className="font-mono text-[8px] uppercase tracking-widest text-white/35">Acertos</p>
            <p className="font-display text-2xl font-bold text-volt">{score}</p>
          </div>
          <p className="font-mono text-[9px] uppercase tracking-widest text-volt">Quiz</p>
          <div className="text-center">
            <p className="font-mono text-[8px] uppercase tracking-widest text-white/35">Pergunta</p>
            <p className="font-display text-2xl font-bold text-white">
              {phase === "ended" ? total : current + 1}/{total}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mx-6 h-0.5 overflow-hidden rounded-full bg-white/5">
          <m.div
            className="h-full bg-volt"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col px-5 pt-6 pb-8">
          <AnimatePresence mode="wait">
            {phase !== "ended" ? (
              <m.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-1 flex-col gap-5"
              >
                <p className="font-display text-lg font-bold leading-snug text-white">
                  {question.text}
                </p>

                <div className="flex flex-col gap-2.5">
                  {question.options.map((opt, i) => {
                    const isSelected = selected === i;
                    const isCorrect  = i === question.correct;
                    const dim        = phase === "feedback" && !isCorrect && !isSelected;

                    return (
                      <m.button
                        key={i}
                        onClick={() => pick(i)}
                        disabled={phase !== "question"}
                        whileTap={phase === "question" ? { scale: 0.97 } : undefined}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          borderRadius: 12,
                          padding: "14px 16px",
                          border: `1.5px solid ${
                            phase === "feedback" && isCorrect  ? "#C6FF3D" :
                            phase === "feedback" && isSelected ? "#ef4444" :
                            "rgba(255,255,255,0.08)"
                          }`,
                          background:
                            phase === "feedback" && isCorrect  ? "rgba(198,255,61,0.08)" :
                            phase === "feedback" && isSelected ? "rgba(239,68,68,0.08)" :
                            "#0f0f0f",
                          color:
                            dim                               ? "rgba(255,255,255,0.2)" :
                            phase === "feedback" && isCorrect  ? "#C6FF3D" :
                            phase === "feedback" && isSelected ? "#f87171" :
                            "#ffffff",
                          cursor: phase === "question" ? "pointer" : "default",
                          transition: "border-color 0.2s, background 0.2s, color 0.2s",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          fontFamily: "var(--font-display)",
                          fontWeight: 600,
                          fontSize: 14,
                        }}
                      >
                        <span style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          opacity: dim ? 0.25 : 0.4,
                          minWidth: 14,
                        }}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </m.button>
                    );
                  })}
                </div>
              </m.div>
            ) : (
              <m.div
                key="ended"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                className="flex flex-1 flex-col items-center justify-center text-center"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-volt">Resultado</p>
                <div className="mt-4">
                  <span className="font-display text-8xl font-bold text-white">{score}</span>
                  <span className="font-display text-4xl font-bold text-white/25">/{total}</span>
                </div>
                <p className="mt-3 font-display text-xl font-bold text-volt">{resultLabel}</p>
                <button
                  onClick={restart}
                  className="mt-10 inline-flex h-14 items-center justify-center rounded-full bg-volt px-12 font-display text-base font-bold text-brand-black"
                >
                  Jogar de novo
                </button>
              </m.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </DemoShell>
  );
}
