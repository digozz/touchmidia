"use client";

import { useRef, useState } from "react";
import { m, animate, useMotionValue } from "framer-motion";
import { DemoShell } from "./DemoShell";

// ===== Tela 9:16 vertical =====
const VB_W = 360;
const VB_H = 640;

// ===== Configurações de jogo =====
const ROUNDS_PER_GAME = 5;
const POINTS_PER_DROP = 100;

// ===== Slots inferiores =====
type Slot = { mult: number; color: string; textColor: string; jackpot?: boolean };
const SLOTS: Slot[] = [
  { mult: 0.2, color: "#111111", textColor: "#3a3a3a" },
  { mult: 0.5, color: "#1c1c1c", textColor: "#666666" },
  { mult: 1,   color: "#1f3200", textColor: "#C6FF3D" },
  { mult: 2,   color: "#2a4400", textColor: "#C6FF3D" },
  { mult: 5,   color: "#C6FF3D", textColor: "#0A0A0A", jackpot: true },
  { mult: 2,   color: "#2a4400", textColor: "#C6FF3D" },
  { mult: 1,   color: "#1f3200", textColor: "#C6FF3D" },
  { mult: 0.5, color: "#1c1c1c", textColor: "#666666" },
  { mult: 0.2, color: "#111111", textColor: "#3a3a3a" },
];
const SLOT_COUNT = SLOTS.length; // 7

const BOARD_X_START = 4;
const BOARD_X_END = 356;
const BOARD_W = BOARD_X_END - BOARD_X_START;
const SLOT_WIDTH = BOARD_W / SLOT_COUNT;

// ===== Pinos preenchendo o tabuleiro =====
const PEG_ROW_Y_START = 135;
const PEG_ROW_Y_GAP = 42;
const PEG_ROW_COUNT = 8;

const PEG_ROWS = Array.from({ length: PEG_ROW_COUNT }, (_, i) => ({
  y: PEG_ROW_Y_START + i * PEG_ROW_Y_GAP,
  offset: i % 2 === 1,
}));

const PEG_RADIUS = 3.5;
const BALL_RADIUS = 9;

function getRowPegs(rowIndex: number): { x: number; y: number }[] {
  const row = PEG_ROWS[rowIndex];
  if (row.offset) {
    return Array.from({ length: SLOT_COUNT }, (_, i) => ({
      x: BOARD_X_START + SLOT_WIDTH / 2 + i * SLOT_WIDTH,
      y: row.y,
    }));
  }
  return Array.from({ length: SLOT_COUNT + 1 }, (_, i) => ({
    x: BOARD_X_START + i * SLOT_WIDTH,
    y: row.y,
  }));
}

const ALL_PEGS = PEG_ROWS.flatMap((_, i) => getRowPegs(i));

const TOP_BALL_Y = 80;
const SLOT_Y_TOP = 470;
const SLOT_Y_CENTER = 500;

// ===== Simulação física =====
type SimPoint = { x: number; y: number; t: number };

function simulatePhysics(dropX: number): {
  path: SimPoint[];
  slotIndex: number;
} {
  const dt = 0.022;
  const gravity = 720;
  const restitution = 0.55;
  const airDrag = 0.992;
  const maxTime = 6;
  const initialVy = 60;

  let x = dropX;
  let y = TOP_BALL_Y;
  let vx = 0;
  let vy = initialVy;
  let t = 0;

  const path: SimPoint[] = [{ x, y, t }];

  while (y < SLOT_Y_TOP - BALL_RADIUS && t < maxTime) {
    vy += gravity * dt;
    vx *= airDrag;
    x += vx * dt;
    y += vy * dt;

    for (const peg of ALL_PEGS) {
      const dx = x - peg.x;
      const dy = y - peg.y;
      const distSq = dx * dx + dy * dy;
      const minDist = BALL_RADIUS + PEG_RADIUS;

      if (distSq < minDist * minDist && distSq > 0.01) {
        const dist = Math.sqrt(distSq);
        const nx = dx / dist;
        const ny = dy / dist;
        x = peg.x + nx * minDist;
        y = peg.y + ny * minDist;
        const vDotN = vx * nx + vy * ny;
        if (vDotN < 0) {
          vx -= (1 + restitution) * vDotN * nx;
          vy -= (1 + restitution) * vDotN * ny;
          vx += (Math.random() - 0.5) * 40;
        }
      }
    }

    const minX = BOARD_X_START + BALL_RADIUS;
    const maxX = BOARD_X_END - BALL_RADIUS;
    if (x < minX) {
      x = minX;
      vx = Math.abs(vx) * restitution * 0.5;
    } else if (x > maxX) {
      x = maxX;
      vx = -Math.abs(vx) * restitution * 0.5;
    }

    t += dt;
    path.push({ x, y, t });
  }

  const slotIndex = Math.max(
    0,
    Math.min(SLOT_COUNT - 1, Math.floor((x - BOARD_X_START) / SLOT_WIDTH)),
  );
  const slotCenterX =
    BOARD_X_START + slotIndex * SLOT_WIDTH + SLOT_WIDTH / 2;

  path.push({ x: slotCenterX, y: SLOT_Y_TOP, t: t + 0.15 });
  path.push({ x: slotCenterX, y: SLOT_Y_CENTER, t: t + 0.45 });

  return { path, slotIndex };
}

type Phase = "idle" | "ready" | "dropping" | "ended";

export function PlinkoDemo() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [lastResult, setLastResult] = useState<{
    slotIndex: number;
    mult: number;
    points: number;
  } | null>(null);
  const [bestMult, setBestMult] = useState(0);

  const ballX = useMotionValue(VB_W / 2);
  const ballY = useMotionValue(TOP_BALL_Y);
  const ballScale = useMotionValue(1);
  const ballOpacity = useMotionValue(1);

  const isAnimatingRef   = useRef(false);
  const isDraggingLine   = useRef(false);
  const lineMovedRef     = useRef(false);
  const hasPositioned    = useRef(false);
  const svgRef           = useRef<SVGSVGElement>(null);

  const getSvgX = (e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return ballX.get();
    const rect = svg.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (VB_W / rect.width);
    return Math.max(BOARD_X_START, Math.min(BOARD_X_END, x));
  };

  const startGame = () => {
    setRound(0);
    setScore(0);
    setLastResult(null);
    setBestMult(0);
    ballX.set(VB_W / 2);
    ballY.set(TOP_BALL_Y);
    ballScale.set(1);
    ballOpacity.set(1);
    hasPositioned.current = false;
    setPhase("ready");
  };

  const dropBall = async () => {
    if (phase !== "ready" || isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setPhase("dropping");
    setLastResult(null);

    const dropX = ballX.get();
    const { path, slotIndex } = simulatePhysics(dropX);

    const xKfs = path.map((p) => p.x);
    const yKfs = path.map((p) => p.y);
    const totalSimTime = path[path.length - 1].t;
    const times = path.map((p) => p.t / totalSimTime);

    const SLOWDOWN = 2.5;
    const animationDuration =
      Math.max(2.4, Math.min(totalSimTime, 4.0)) * SLOWDOWN;

    await Promise.all([
      animate(ballX, xKfs, { duration: animationDuration, times, ease: "linear" }),
      animate(ballY, yKfs, { duration: animationDuration, times, ease: "linear" }),
    ]);

    const slot = SLOTS[slotIndex];
    const points = Math.round(POINTS_PER_DROP * slot.mult);
    setScore((s) => s + points);
    setLastResult({ slotIndex, mult: slot.mult, points });
    if (slot.mult > bestMult) setBestMult(slot.mult);

    await animate(ballScale, [1, 1.25, 1], { duration: 0.45, times: [0, 0.5, 1] });
    await new Promise((r) => setTimeout(r, 700));

    const newRound = round + 1;
    if (newRound >= ROUNDS_PER_GAME) {
      setRound(newRound);
      setPhase("ended");
      isAnimatingRef.current = false;
      return;
    }

    await animate(ballOpacity, 0, { duration: 0.2 });
    ballX.set(VB_W / 2);
    ballY.set(TOP_BALL_Y);
    ballScale.set(1);
    await animate(ballOpacity, 1, { duration: 0.3 });

    setRound(newRound);
    setPhase("ready");
    isAnimatingRef.current = false;
  };

  const hint = phase === "ready" ? "POSICIONE · SOLTE PARA CAIR" : null;

  return (
    <DemoShell hint={hint}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="h-full w-full"
        onClick={() => { if (phase === "ready" && hasPositioned.current) dropBall(); }}
      >
        <Background />

        {/* Score */}
        <g>
          <rect width={VB_W} height={58} fill="#000000" fillOpacity="0.28" />
          <text x="20" y="20" fill="#C6FF3D" fontSize="9" fontWeight="700"
            fontFamily="var(--font-display)" letterSpacing="3">SCORE</text>
          <text x="20" y="44" fill="#FFFFFF" fontSize="28" fontWeight="900"
            fontFamily="var(--font-display)">{score.toLocaleString("pt-BR")}</text>
          <text x={VB_W - 20} y="20" fill="#C6FF3D" fontSize="9" fontWeight="700"
            fontFamily="var(--font-display)" textAnchor="end" letterSpacing="3">BOLA</text>
          <text x={VB_W - 20} y="44" fill="#FFFFFF" fontSize="28" fontWeight="900"
            fontFamily="var(--font-display)" textAnchor="end">
            {Math.min(round + 1, ROUNDS_PER_GAME)}/{ROUNDS_PER_GAME}
          </text>
        </g>

        {/* Linha tracejada com arrows e instrução */}
        <g opacity={phase === "ready" ? 0.55 : 0.25}>
          <line
            x1={BOARD_X_START + 14} y1="555"
            x2={BOARD_X_END - 14}   y2="555"
            stroke="#C6FF3D" strokeWidth="1.5" strokeDasharray="4 4"
          />
          <polygon
            points={`${BOARD_X_START},555 ${BOARD_X_START + 10},550 ${BOARD_X_START + 10},560`}
            fill="#C6FF3D"
          />
          <polygon
            points={`${BOARD_X_END},555 ${BOARD_X_END - 10},550 ${BOARD_X_END - 10},560`}
            fill="#C6FF3D"
          />
        </g>
        {/* Hit area invisível para arrastar pelo trilho */}
        {phase === "ready" && (
          <rect
            x={BOARD_X_START} y="542" width={BOARD_W} height="26"
            fill="transparent"
            style={{ cursor: "ew-resize", touchAction: "none" }}
            onPointerDown={(e) => {
              isDraggingLine.current = true;
              lineMovedRef.current = false;
              e.currentTarget.setPointerCapture(e.pointerId);
              ballX.set(getSvgX(e));
            }}
            onPointerMove={(e) => {
              if (!isDraggingLine.current) return;
              lineMovedRef.current = true;
              hasPositioned.current = true;
              ballX.set(getSvgX(e));
            }}
            onPointerUp={() => { isDraggingLine.current = false; }}
            onPointerCancel={() => { isDraggingLine.current = false; }}
            onClick={(e) => { if (lineMovedRef.current) e.stopPropagation(); }}
          />
        )}

        {/* Pinos */}
        {ALL_PEGS.map((p, i) => <Peg key={i} cx={p.x} cy={p.y} />)}

        {/* Bola */}
        <m.g
          style={{ x: ballX, y: ballY, scale: ballScale, opacity: ballOpacity }}
          drag={phase === "ready" ? "x" : false}
          dragConstraints={{ left: BOARD_X_START, right: BOARD_X_END }}
          dragElastic={0}
          dragMomentum={false}
          onDrag={() => { hasPositioned.current = true; }}
        >
          <Ball />
        </m.g>

        {/* Slots */}
        <Slots lastSlotIndex={lastResult?.slotIndex ?? null} />


        {/* Overlays */}
        {phase === "idle"  && <IdleOverlay onStart={startGame} />}
        {phase === "ended" && <EndOverlay score={score} bestMult={bestMult} onRestart={startGame} />}
      </svg>
    </DemoShell>
  );
}

// ===== Subcomponentes =====

function Background() {
  return (
    <g>
      <defs>
        <linearGradient id="pk-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#111113" />
          <stop offset="100%" stopColor="#0A0A0A" />
        </linearGradient>
        <radialGradient id="pk-glow" cx="50%" cy="40%" r="55%">
          <stop offset="0%"   stopColor="#C6FF3D" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#C6FF3D" stopOpacity="0" />
        </radialGradient>
        {/* Diagonal grid texture */}
        <pattern id="pk-grid" x="0" y="0" width="9" height="9" patternUnits="userSpaceOnUse">
          <line x1="0" y1="9" x2="9" y2="0" stroke="rgba(198,255,61,0.04)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width={VB_W} height={VB_H} fill="url(#pk-bg)" />
      <rect width={VB_W} height={VB_H} fill="url(#pk-grid)" />
      <ellipse cx={VB_W / 2} cy={300} rx={200} ry={260} fill="url(#pk-glow)" />
    </g>
  );
}

function Peg({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy + 1} r="3.5" fill="#000000" opacity="0.5" />
      <circle cx={cx} cy={cy} r="3.5" fill="#FFFFFF" />
      <circle cx={cx - 0.8} cy={cy - 1} r="1.2" fill="#FFFFFF" opacity="0.9" />
    </g>
  );
}

function Ball() {
  return (
    <g>
      <defs>
        <radialGradient id="pk-ball" cx="35%" cy="30%" r="65%">
          <stop offset="0%"   stopColor="#e8ffb0" />
          <stop offset="55%"  stopColor="#C6FF3D" />
          <stop offset="100%" stopColor="#7a9e1a" />
        </radialGradient>
      </defs>
      <ellipse cx="0" cy="9" rx="7" ry="2.2" fill="#000000" opacity="0.4" />
      <circle r="9" fill="url(#pk-ball)" stroke="#0A0A0A" strokeWidth="1.4" />
      <circle cx="-3" cy="-3" r="2.5" fill="#FFFFFF" opacity="0.65" />
    </g>
  );
}

function Slots({ lastSlotIndex }: { lastSlotIndex: number | null }) {
  return (
    <g>
      {SLOTS.map((slot, i) => {
        const x = BOARD_X_START + i * SLOT_WIDTH;
        const isHit = lastSlotIndex === i;
        const isJackpot = slot.jackpot;
        return (
          <g key={i}>
            <rect
              x={x + 2} y={SLOT_Y_TOP} width={SLOT_WIDTH - 4} height="50" rx="5"
              fill={slot.color}
              stroke={isJackpot ? "rgba(198,255,61,0.5)" : isHit ? "#FFFFFF" : "none"}
              strokeWidth={isJackpot ? 1.5 : isHit ? 2 : 0}
            />
            <rect
              x={x + 2} y={SLOT_Y_TOP} width={SLOT_WIDTH - 4} height="12" rx="5"
              fill="#FFFFFF" fillOpacity="0.1"
            />
            <text
              x={x + SLOT_WIDTH / 2} y={SLOT_Y_TOP + 32}
              fill={slot.textColor}
              fontSize={isJackpot ? 18 : 15} fontWeight="900"
              fontFamily="var(--font-display)" textAnchor="middle"
            >
              {slot.mult}x
            </text>
            {isHit && (
              <m.rect
                x={x + 2} y={SLOT_Y_TOP} width={SLOT_WIDTH - 4} height="50" rx="5"
                fill="none" stroke="#C6FF3D" strokeWidth="3"
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 0.6 }}
                style={{ transformOrigin: `${x + SLOT_WIDTH / 2}px ${SLOT_Y_TOP + 25}px` }}
              />
            )}
          </g>
        );
      })}
    </g>
  );
}


function IdleOverlay({ onStart }: { onStart: () => void }) {
  return (
    <g>
      <rect width={VB_W} height={VB_H} fill="#0A0A0A" fillOpacity="0.9" />
      <text x={VB_W / 2} y="200" fill="#C6FF3D" fontSize="13" fontWeight="700"
        fontFamily="var(--font-display)" textAnchor="middle" letterSpacing="4">
        DEMO INTERATIVA
      </text>
      <text x={VB_W / 2} y="250" fill="#FFFFFF" fontSize="50" fontWeight="900"
        fontFamily="var(--font-display)" textAnchor="middle" letterSpacing="3">
        PLINKO
      </text>
      <text x={VB_W / 2} y="310" fill="#FFFFFF" fillOpacity="0.6" fontSize="14"
        fontWeight="500" fontFamily="var(--font-sans)" textAnchor="middle">
        Arraste a bola para escolher
      </text>
      <text x={VB_W / 2} y="330" fill="#FFFFFF" fillOpacity="0.6" fontSize="14"
        fontWeight="500" fontFamily="var(--font-sans)" textAnchor="middle">
        de onde ela vai cair.
      </text>
      <text x={VB_W / 2} y="360" fill="#C6FF3D" fontSize="12" fontWeight="700"
        fontFamily="var(--font-display)" textAnchor="middle" letterSpacing="2">
        CENTRO PAGA 5x
      </text>
      <g onClick={onStart} style={{ cursor: "pointer" }}>
        <rect x="60" y="410" width="240" height="60" rx="30" fill="#C6FF3D" />
        <rect x="60" y="410" width="240" height="20" rx="30" fill="#FFFFFF" fillOpacity="0.2" />
        <text x={VB_W / 2} y="448" fill="#0A0A0A" fontSize="20" fontWeight="900"
          fontFamily="var(--font-display)" textAnchor="middle" letterSpacing="3">
          ▶ COMEÇAR
        </text>
      </g>
      <text x={VB_W / 2} y="510" fill="#FFFFFF" fillOpacity="0.3" fontSize="11"
        fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
        {ROUNDS_PER_GAME} bolas · pontos acumulam
      </text>
    </g>
  );
}

function EndOverlay({
  score, bestMult, onRestart,
}: {
  score: number;
  bestMult: number;
  onRestart: () => void;
}) {
  return (
    <g>
      <rect width={VB_W} height={VB_H} fill="#0A0A0A" fillOpacity="0.92" />

      <text x={VB_W / 2} y="170" fill="#C6FF3D" fontSize="12" fontWeight="700"
        fontFamily="var(--font-display)" textAnchor="middle" letterSpacing="4">
        FIM DE JOGO
      </text>
      <text x={VB_W / 2} y="210" fill="#FFFFFF" fontSize="26" fontWeight="900"
        fontFamily="var(--font-display)" textAnchor="middle">
        SUA PONTUAÇÃO
      </text>

      <text x={VB_W / 2} y="290" fill="#C6FF3D" fontSize="68" fontWeight="900"
        fontFamily="var(--font-display)" textAnchor="middle">
        {score.toLocaleString("pt-BR")}
      </text>

      {bestMult > 0 && (
        <text x={VB_W / 2} y="320" fill="rgba(198,255,61,0.55)" fontSize="13"
          fontWeight="700" fontFamily="var(--font-display)" textAnchor="middle" letterSpacing="2">
          MELHOR: {bestMult}x
        </text>
      )}

      <g onClick={onRestart} style={{ cursor: "pointer" }}>
        <rect x="40" y="390" width="280" height="56" rx="28" fill="#C6FF3D" />
        <rect x="40" y="390" width="280" height="20" rx="28" fill="#FFFFFF" fillOpacity="0.25" />
        <text x={VB_W / 2} y="426" fill="#0A0A0A" fontSize="18" fontWeight="900"
          fontFamily="var(--font-display)" textAnchor="middle" letterSpacing="3">
          ↻ JOGAR DE NOVO
        </text>
      </g>
    </g>
  );
}
