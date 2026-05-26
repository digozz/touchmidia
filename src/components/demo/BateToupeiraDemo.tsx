"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { buildWhatsappUrl } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { DemoShell } from "./DemoShell";

// ===== Configurações do jogo =====
const GAME_DURATION = 30; // segundos
const HOLE_COUNT = 9;
const SPAWN_INTERVAL_START_MS = 1100;
const SPAWN_INTERVAL_END_MS = 450;
const MOLE_LIFETIME_MS = 1300;
const HIT_POINTS = 10;
const ACCENT_HIT_POINTS = 25;
const ACCENT_PROBABILITY = 0.18;

const VOLT = "#C6FF3D";
const VOLT_DARK = "#7fa809";

// ===== Tipos =====
type Phase = "idle" | "playing" | "ended";
type HoleSlot = { state: "empty" | "active" | "hit"; accent: boolean };

// ===== Posições fixas dos buracos (3×3) no viewBox 360×640 =====
const HOLE_POSITIONS: { cx: number; cy: number }[] = [];
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    HOLE_POSITIONS.push({
      cx: 60 + col * 120,
      cy: 215 + row * 125,
    });
  }
}

const WHATSAPP_MESSAGE =
  "Olá! Joguei a demo de Bate-Toupeira da TOUCH MIDIA e quero uma assim para o meu evento.";

export function BateToupeiraDemo() {
  const [phase, setPhase] = useState<Phase>("playing");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [holes, setHoles] = useState<HoleSlot[]>(() =>
    Array.from({ length: HOLE_COUNT }, () => ({
      state: "empty" as const,
      accent: false,
    })),
  );

  const spawnTimerRef = useRef<number | null>(null);
  const tickIntervalRef = useRef<number | null>(null);
  const moleHideTimersRef = useRef<Map<number, number>>(new Map());
  const elapsedSecRef = useRef(0);

  const cleanupTimers = useCallback(() => {
    if (spawnTimerRef.current) {
      window.clearTimeout(spawnTimerRef.current);
      spawnTimerRef.current = null;
    }
    if (tickIntervalRef.current) {
      window.clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
    moleHideTimersRef.current.forEach((t) => window.clearTimeout(t));
    moleHideTimersRef.current.clear();
  }, []);

  useEffect(() => {
    return cleanupTimers;
  }, [cleanupTimers]);

  const endGame = useCallback(() => {
    cleanupTimers();
    setHoles((prev) =>
      prev.map(() => ({ state: "empty" as const, accent: false })),
    );
    setPhase("ended");
  }, [cleanupTimers]);

  // ===== Loop de spawn =====
  useEffect(() => {
    if (phase !== "playing") return;

    const spawnMole = () => {
      setHoles((prev) => {
        const emptyIndices = prev
          .map((h, i) => (h.state === "empty" ? i : -1))
          .filter((i) => i >= 0);
        if (emptyIndices.length === 0) return prev;
        const targetIndex =
          emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        const isAccent = Math.random() < ACCENT_PROBABILITY;

        const next = [...prev];
        next[targetIndex] = { state: "active", accent: isAccent };

        const hideTimer = window.setTimeout(() => {
          setHoles((curr) => {
            const updated = [...curr];
            if (updated[targetIndex].state === "active") {
              updated[targetIndex] = { state: "empty", accent: false };
              setCombo(0);
            }
            return updated;
          });
          moleHideTimersRef.current.delete(targetIndex);
        }, MOLE_LIFETIME_MS);
        moleHideTimersRef.current.set(targetIndex, hideTimer);

        return next;
      });

      const progress = Math.min(elapsedSecRef.current / GAME_DURATION, 1);
      const nextInterval =
        SPAWN_INTERVAL_START_MS -
        (SPAWN_INTERVAL_START_MS - SPAWN_INTERVAL_END_MS) * progress;
      spawnTimerRef.current = window.setTimeout(spawnMole, nextInterval);
    };

    spawnTimerRef.current = window.setTimeout(spawnMole, 600);

    return () => {
      if (spawnTimerRef.current) {
        window.clearTimeout(spawnTimerRef.current);
        spawnTimerRef.current = null;
      }
    };
  }, [phase]);

  // ===== Tick do timer =====
  useEffect(() => {
    if (phase !== "playing") return;
    elapsedSecRef.current = 0;
    setTimeLeft(GAME_DURATION);

    tickIntervalRef.current = window.setInterval(() => {
      elapsedSecRef.current += 1;
      const remaining = GAME_DURATION - elapsedSecRef.current;
      setTimeLeft(remaining);
      if (remaining <= 0) {
        endGame();
      }
    }, 1000);

    return () => {
      if (tickIntervalRef.current) {
        window.clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
    };
  }, [phase, endGame]);

  const startGame = () => {
    setScore(0);
    setCombo(0);
    setBestCombo(0);
    setTimeLeft(GAME_DURATION);
    elapsedSecRef.current = 0;
    setHoles(
      Array.from({ length: HOLE_COUNT }, () => ({
        state: "empty" as const,
        accent: false,
      })),
    );
    setPhase("playing");
  };

  const hitHole = (index: number) => {
    if (phase !== "playing") return;
    const hole = holes[index];
    if (hole.state !== "active") return;

    const hideTimer = moleHideTimersRef.current.get(index);
    if (hideTimer) {
      window.clearTimeout(hideTimer);
      moleHideTimersRef.current.delete(index);
    }

    setHoles((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], state: "hit" };
      return next;
    });

    const points = hole.accent ? ACCENT_HIT_POINTS : HIT_POINTS;
    setScore((s) => s + points);
    setCombo((c) => {
      const newCombo = c + 1;
      setBestCombo((b) => Math.max(b, newCombo));
      return newCombo;
    });

    window.setTimeout(() => {
      setHoles((prev) => {
        const next = [...prev];
        next[index] = { state: "empty", accent: false };
        return next;
      });
    }, 280);
  };

  const timeProgress = useMemo(
    () => Math.max(0, Math.min(1, timeLeft / GAME_DURATION)),
    [timeLeft],
  );

  return (
    <DemoShell hint={phase === "playing" ? "TOQUE NAS TOUPEIRAS" : null}>
      <svg
        viewBox="0 0 360 640"
        className="h-full w-full"
      >
        <Background />

        <Hud
          score={score}
          timeLeft={timeLeft}
          timeProgress={timeProgress}
          combo={combo}
        />

        {HOLE_POSITIONS.map((pos, i) => (
          <HoleAndMole
            key={i}
            cx={pos.cx}
            cy={pos.cy}
            slot={holes[i]}
            onClick={() => hitHole(i)}
            interactive={phase === "playing"}
          />
        ))}

        {phase === "idle" && <IdleOverlay onStart={startGame} />}

        {phase === "ended" && (
          <EndOverlay
            score={score}
            bestCombo={bestCombo}
            onRestart={startGame}
          />
        )}
      </svg>
    </DemoShell>
  );
}

// ===== Subcomponentes =====

function Background() {
  const grassBlades = Array.from({ length: 80 }, (_, i) => {
    const seed = (i * 9301 + 49297) % 233280;
    const x = (seed % 360);
    const y = 175 + ((seed * 7) % 460);
    const lean = ((seed * 3) % 6) - 3;
    return { x, y, lean, key: i };
  });

  return (
    <g>
      <defs>
        <linearGradient id="bt-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0A0A0A" />
          <stop offset="28%"  stopColor="#0A0A0A" />
          <stop offset="28%"  stopColor="#0d150a" />
          <stop offset="100%" stopColor="#070f05" />
        </linearGradient>
        <radialGradient id="bt-glow" cx="50%" cy="22%" r="40%">
          <stop offset="0%"   stopColor={VOLT} stopOpacity="0.06" />
          <stop offset="100%" stopColor={VOLT} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="360" height="640" fill="url(#bt-bg)" />
      <rect width="360" height="640" fill="url(#bt-glow)" />

      {/* Grid sutil na área do céu */}
      <rect
        width="360" height="175" fill="none"
        style={{
          backgroundImage: `linear-gradient(rgba(198,255,61,.018) 1px, transparent 1px),linear-gradient(90deg, rgba(198,255,61,.018) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Tufos de grama (volt baixa opacidade) */}
      <g stroke={VOLT} strokeOpacity="0.18" strokeWidth="1.2" strokeLinecap="round">
        {grassBlades.map((b) => (
          <g key={b.key}>
            <line x1={b.x}     y1={b.y} x2={b.x + b.lean}     y2={b.y - 5} />
            <line x1={b.x + 2} y1={b.y} x2={b.x + 2 + b.lean} y2={b.y - 4} />
            <line x1={b.x - 2} y1={b.y} x2={b.x - 2 + b.lean} y2={b.y - 4} />
          </g>
        ))}
      </g>

      {/* Divisor de terra entre fileiras */}
      <g fill={VOLT} fillOpacity="0.04">
        <ellipse cx="180" cy="305" rx="180" ry="5" />
        <ellipse cx="180" cy="430" rx="180" ry="5" />
        <ellipse cx="180" cy="555" rx="180" ry="5" />
      </g>
    </g>
  );
}

function Hud({
  score,
  timeLeft,
  timeProgress,
  combo,
}: {
  score: number;
  timeLeft: number;
  timeProgress: number;
  combo: number;
}) {
  const formattedTime = timeLeft.toString().padStart(2, "0");
  const timeColor = timeLeft <= 5 ? "#DC2626" : VOLT;

  return (
    <g>
      {/* Top bar */}
      <rect width="360" height="150" fill="#000000" fillOpacity="0.35" />
      <line x1="0" y1="150" x2="360" y2="150" stroke={VOLT} strokeOpacity="0.15" strokeWidth="1" />

      {/* Score */}
      <text x="30" y="40" fill={VOLT} fontSize="11" fontWeight="700"
        fontFamily="var(--font-mono)" letterSpacing="4">
        SCORE
      </text>
      <text x="30" y="80" fill="#FFFFFF" fontSize="42" fontWeight="900"
        fontFamily="var(--font-display)">
        {score.toLocaleString("pt-BR")}
      </text>

      {/* Combo */}
      {combo >= 2 && (
        <g>
          <rect x="30" y="92" width="100" height="22" rx="11" fill={VOLT} />
          <text x="80" y="108" fill="#0A0A0A" fontSize="13" fontWeight="900"
            fontFamily="var(--font-display)" textAnchor="middle" letterSpacing="2">
            x{combo} COMBO
          </text>
        </g>
      )}

      {/* Timer */}
      <text x="330" y="40" fill={VOLT} fontSize="11" fontWeight="700"
        fontFamily="var(--font-mono)" textAnchor="end" letterSpacing="4">
        TEMPO
      </text>
      <text x="330" y="80" fill={timeColor} fontSize="42" fontWeight="900"
        fontFamily="var(--font-display)" textAnchor="end">
        00:{formattedTime}
      </text>

      {/* Time bar */}
      <rect x="30" y="130" width="300" height="4" rx="2" fill="#FFFFFF" fillOpacity="0.1" />
      <rect x="30" y="130" width={300 * timeProgress} height="4" rx="2" fill={timeColor} />
    </g>
  );
}

function HoleAndMole({
  cx,
  cy,
  slot,
  onClick,
  interactive,
}: {
  cx: number;
  cy: number;
  slot: HoleSlot;
  onClick: () => void;
  interactive: boolean;
}) {
  return (
    <g
      onClick={onClick}
      style={{
        cursor: interactive && slot.state === "active" ? "pointer" : "default",
      }}
    >
      <Hole cx={cx} cy={cy} />

      {interactive && slot.state === "active" && (
        <rect x={cx - 60} y={cy - 80} width="120" height="100" fill="transparent" />
      )}

      <defs>
        <clipPath id={`mole-clip-${cx}-${cy}`}>
          <rect x={cx - 60} y={cy - 110} width={120} height={111} />
        </clipPath>
      </defs>

      <g clipPath={`url(#mole-clip-${cx}-${cy})`}>
        <AnimatePresence>
          {slot.state === "active" && (
            <motion.g
              initial={{ y: 70, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <Mole cx={cx} cy={cy} accent={slot.accent} />
            </motion.g>
          )}
          {slot.state === "hit" && (
            <motion.g
              initial={{ y: 0 }}
              animate={{ y: 10 }}
              transition={{ duration: 0.25 }}
            >
              <Mole cx={cx} cy={cy} accent={slot.accent} dazed />
            </motion.g>
          )}
        </AnimatePresence>
      </g>

      <ellipse cx={cx} cy={cy - 2} rx="36" ry="6" fill="none"
        stroke="#0A0A0A" strokeOpacity="0.5" strokeWidth="2" />

      <AnimatePresence>
        {slot.state === "hit" && (
          <>
            <ImpactRays cx={cx} cy={cy} />
            <Hammer cx={cx} cy={cy} />
          </>
        )}
      </AnimatePresence>
    </g>
  );
}

function Hole({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy + 4} rx="44" ry="11" fill="#2a1a0a" />
      <ellipse cx={cx} cy={cy + 2} rx="40" ry="9"  fill="#1e1208" />
      <ellipse cx={cx} cy={cy}     rx="36" ry="7"  fill="#0f0a05" />
      <ellipse cx={cx} cy={cy + 1} rx="32" ry="5.5" fill="#0A0A0A" />
      <ellipse cx={cx} cy={cy - 1.5} rx="32" ry="2" fill="#000000" fillOpacity="0.65" />
    </g>
  );
}

function ImpactRays({ cx, cy }: { cx: number; cy: number }) {
  return (
    <motion.g
      initial={{ scale: 0.4, opacity: 1 }}
      animate={{ scale: 1.4, opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{ transformOrigin: `${cx}px ${cy - 35}px` }}
    >
      <g fill={VOLT} stroke="#0A0A0A" strokeWidth="2" strokeLinejoin="round">
        <path
          d={`M ${cx} ${cy - 80}
             L ${cx + 8} ${cy - 60}
             L ${cx + 28} ${cy - 58}
             L ${cx + 12} ${cy - 42}
             L ${cx + 18} ${cy - 22}
             L ${cx} ${cy - 32}
             L ${cx - 18} ${cy - 22}
             L ${cx - 12} ${cy - 42}
             L ${cx - 28} ${cy - 58}
             L ${cx - 8} ${cy - 60} Z`}
        />
      </g>
      <circle cx={cx} cy={cy - 38} r="14" fill={VOLT_DARK} opacity="0.7" />
    </motion.g>
  );
}

function Hammer({ cx, cy }: { cx: number; cy: number }) {
  return (
    <motion.g
      initial={{ y: -100, rotate: -55 }}
      animate={{
        y: [-100, -10, -10, -60],
        rotate: [-55, -25, -25, -45],
      }}
      transition={{
        duration: 0.45,
        times: [0, 0.35, 0.55, 1],
        ease: ["easeIn", "easeOut", "easeOut"],
      }}
      style={{ transformOrigin: `${cx + 30}px ${cy - 20}px` }}
    >
      <rect x={cx + 10} y={cy - 24} width="8" height="50" rx="2"
        fill="#92400E" stroke="#451A03" strokeWidth="1.5" />
      <rect x={cx + 11} y={cy - 24} width="3" height="50"
        fill="#FBBF24" opacity="0.4" />
      <rect x={cx - 10} y={cy - 50} width="48" height="22" rx="2"
        fill="#DC2626" stroke="#0A0A0A" strokeWidth="2" />
      <rect x={cx - 10} y={cy - 50} width="48" height="6" rx="2"
        fill="#FFFFFF" fillOpacity="0.3" />
      <rect x={cx + 32} y={cy - 50} width="6" height="22" fill="#991B1B" />
    </motion.g>
  );
}

function Mole({
  cx,
  cy,
  accent,
  dazed = false,
}: {
  cx: number;
  cy: number;
  accent: boolean;
  dazed?: boolean;
}) {
  const fur = accent ? "#FCD34D" : "#A07248";
  const furShade = accent ? "#D97706" : "#7C5535";
  const earInner = accent ? "#B45309" : "#7C5535";

  return (
    <g>
      <ellipse cx={cx - 14} cy={cy - 58} rx="7" ry="6" fill={fur} stroke="#0A0A0A" strokeWidth="1.5" />
      <ellipse cx={cx - 14} cy={cy - 57} rx="3.5" ry="3" fill={earInner} />
      <ellipse cx={cx + 14} cy={cy - 58} rx="7" ry="6" fill={fur} stroke="#0A0A0A" strokeWidth="1.5" />
      <ellipse cx={cx + 14} cy={cy - 57} rx="3.5" ry="3" fill={earInner} />

      <path
        d={`M ${cx - 26} ${cy + 5}
           L ${cx - 26} ${cy - 35}
           Q ${cx - 26} ${cy - 60} ${cx} ${cy - 60}
           Q ${cx + 26} ${cy - 60} ${cx + 26} ${cy - 35}
           L ${cx + 26} ${cy + 5}
           Z`}
        fill={fur} stroke="#0A0A0A" strokeWidth="2" strokeLinejoin="round"
      />

      <ellipse cx={cx} cy={cy - 14} rx="18" ry="11" fill={furShade} opacity="0.32" />

      <circle cx={cx - 11} cy={cy - 36} r="7.5" fill="#FFFFFF" stroke="#0A0A0A" strokeWidth="1.5" />
      <circle cx={cx + 11} cy={cy - 36} r="7.5" fill="#FFFFFF" stroke="#0A0A0A" strokeWidth="1.5" />

      {!dazed ? (
        <g fill="#0A0A0A">
          <circle cx={cx - 8}  cy={cy - 34} r="2.8" />
          <circle cx={cx + 14} cy={cy - 34} r="2.8" />
        </g>
      ) : (
        <g stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round">
          <line x1={cx - 15} y1={cy - 40} x2={cx - 7}  y2={cy - 32} />
          <line x1={cx - 15} y1={cy - 32} x2={cx - 7}  y2={cy - 40} />
          <line x1={cx + 7}  y1={cy - 40} x2={cx + 15} y2={cy - 32} />
          <line x1={cx + 7}  y1={cy - 32} x2={cx + 15} y2={cy - 40} />
        </g>
      )}

      <path
        d={`M ${cx - 4.5} ${cy - 23} L ${cx + 4.5} ${cy - 23} L ${cx} ${cy - 16} Z`}
        fill="#1C1917" stroke="#0A0A0A" strokeWidth="1" strokeLinejoin="round"
      />

      <g fill="#1C1917">
        <circle cx={cx - 9}  cy={cy - 18} r="0.8" />
        <circle cx={cx - 12} cy={cy - 15} r="0.8" />
        <circle cx={cx - 9}  cy={cy - 12} r="0.8" />
        <circle cx={cx + 9}  cy={cy - 18} r="0.8" />
        <circle cx={cx + 12} cy={cy - 15} r="0.8" />
        <circle cx={cx + 9}  cy={cy - 12} r="0.8" />
      </g>

      {dazed ? (
        <ellipse cx={cx} cy={cy - 12} rx="3.2" ry="4"
          fill="#1C1917" stroke="#0A0A0A" strokeWidth="1" />
      ) : (
        <g>
          <path
            d={`M ${cx - 6} ${cy - 13} Q ${cx} ${cy - 8} ${cx + 6} ${cy - 13}`}
            fill="none" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round"
          />
          <ellipse cx={cx} cy={cy - 10.5} rx="2.6" ry="1.4" fill="#FB7185" />
        </g>
      )}

      {accent && !dazed && (
        <text x={cx} y={cy - 76} fontSize="20" textAnchor="middle"
          style={{ filter: "drop-shadow(0 2px 0 #B45309)" }}>
          ⭐
        </text>
      )}
    </g>
  );
}

function IdleOverlay({ onStart }: { onStart: () => void }) {
  return (
    <g>
      <rect width="360" height="640" fill="#0A0A0A" fillOpacity="0.88" />

      <text x="180" y="220" fill={VOLT} fontSize="11" fontWeight="700"
        fontFamily="var(--font-mono)" textAnchor="middle" letterSpacing="4">
        DEMO INTERATIVA
      </text>
      <text x="180" y="270" fill="#FFFFFF" fontSize="36" fontWeight="900"
        fontFamily="var(--font-display)" textAnchor="middle">
        BATE-TOUPEIRA
      </text>

      <text x="180" y="320" fill="#FFFFFF" fillOpacity="0.6" fontSize="13"
        fontFamily="var(--font-sans)" textAnchor="middle">
        Acerte as toupeiras antes que voltem.
      </text>
      <text x="180" y="340" fill="#FFFFFF" fillOpacity="0.6" fontSize="13"
        fontFamily="var(--font-sans)" textAnchor="middle">
        Toupeiras douradas valem 25 pontos.
      </text>

      <g onClick={onStart} style={{ cursor: "pointer" }}>
        <rect x="60" y="400" width="240" height="56" rx="28" fill={VOLT} />
        <rect x="60" y="400" width="240" height="18" rx="28" fill="#FFFFFF" fillOpacity="0.2" />
        <text x="180" y="436" fill="#0A0A0A" fontSize="18" fontWeight="900"
          fontFamily="var(--font-display)" textAnchor="middle" letterSpacing="3">
          ▶ COMEÇAR
        </text>
      </g>

      <text x="180" y="500" fill="#FFFFFF" fillOpacity="0.35" fontSize="10"
        fontFamily="var(--font-mono)" textAnchor="middle" letterSpacing="3">
        30 SEGUNDOS · 9 BURACOS
      </text>
    </g>
  );
}

function EndOverlay({
  score,
  bestCombo,
  onRestart,
}: {
  score: number;
  bestCombo: number;
  onRestart: () => void;
}) {
  return (
    <g>
      <rect width="360" height="640" fill="#0A0A0A" fillOpacity="0.92" />

      <text x="180" y="170" fill={VOLT} fontSize="11" fontWeight="700"
        fontFamily="var(--font-mono)" textAnchor="middle" letterSpacing="4">
        TEMPO ENCERRADO
      </text>
      <text x="180" y="210" fill="#FFFFFF" fontSize="28" fontWeight="900"
        fontFamily="var(--font-display)" textAnchor="middle">
        SUA PONTUAÇÃO
      </text>

      <text x="180" y="290" fill={VOLT} fontSize="68" fontWeight="900"
        fontFamily="var(--font-display)" textAnchor="middle">
        {score.toLocaleString("pt-BR")}
      </text>

      {bestCombo > 1 && (
        <text x="180" y="322" fill={VOLT} fillOpacity="0.55" fontSize="12"
          fontWeight="700" fontFamily="var(--font-mono)" textAnchor="middle" letterSpacing="3">
          MAIOR COMBO: x{bestCombo}
        </text>
      )}

      <text x="180" y="380" fill="#FFFFFF" fillOpacity="0.6" fontSize="13"
        fontFamily="var(--font-sans)" textAnchor="middle">
        Quer essa demo personalizada com a sua marca
      </text>
      <text x="180" y="398" fill="#FFFFFF" fillOpacity="0.6" fontSize="13"
        fontFamily="var(--font-sans)" textAnchor="middle">
        no seu próximo evento?
      </text>

      <foreignObject x="40" y="428" width="280" height="52">
        <Link
          href={buildWhatsappUrl(WHATSAPP_MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex h-[52px] w-full items-center justify-center gap-2 rounded-full",
            "bg-volt font-display text-base font-bold text-brand-black",
            "transition-colors hover:bg-volt-600",
          )}
        >
          Falar no WhatsApp →
        </Link>
      </foreignObject>

      <g onClick={onRestart} style={{ cursor: "pointer" }}>
        <rect x="100" y="502" width="160" height="38" rx="19"
          fill="transparent" stroke="#FFFFFF" strokeOpacity="0.2" strokeWidth="1.5" />
        <text x="180" y="526" fill="#FFFFFF" fillOpacity="0.6" fontSize="12"
          fontWeight="700" fontFamily="var(--font-mono)" textAnchor="middle" letterSpacing="3">
          ↻ JOGAR DE NOVO
        </text>
      </g>
    </g>
  );
}
