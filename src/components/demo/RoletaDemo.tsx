"use client";

import { useRef, useState } from "react";
import { m, AnimatePresence, useMotionValue, animate } from "framer-motion";
import { RotateCw } from "lucide-react";
import { DemoShell } from "./DemoShell";

type Prize = {
  label: string;
  color: string;
  textColor: string;
  isWin: boolean;
};

const PRIZES: Prize[] = [
  { label: "Camiseta",     color: "#C6FF3D", textColor: "#0A0A0A", isWin: true },
  { label: "Voucher R$50", color: "#1a1a1a", textColor: "#C6FF3D", isWin: true },
  { label: "Ecobag",       color: "#C6FF3D", textColor: "#0A0A0A", isWin: true },
  { label: "Mais Sorte!",  color: "#0f0f0f", textColor: "#FFFFFF", isWin: false },
  { label: "Surpresa",     color: "#C6FF3D", textColor: "#0A0A0A", isWin: true },
  { label: "Chocolate",    color: "#1a1a1a", textColor: "#C6FF3D", isWin: true },
];

const SLICE_ANGLE = 360 / PRIZES.length; // 60°
const SPIN_DURATION_MS = 7000;

/**
 * Para que o slice i pare sob o ponteiro (topo), a roda precisa estar em:
 *   R ≡ -(i*60 + 30 + offset)  (mod 360)
 * Adicionamos 5 voltas completas para o efeito visual.
 */
function calculateTargetRotation(currentRotation: number, winnerIndex: number): number {
  const fullRotations = 5 * 360;
  const sliceCenterFromTop = winnerIndex * SLICE_ANGLE + SLICE_ANGLE / 2;
  const offset = (Math.random() - 0.5) * SLICE_ANGLE * 0.8;
  const landingDelta = -(sliceCenterFromTop + offset);
  const currentMod = ((currentRotation % 360) + 360) % 360;
  const normalizedLanding = ((landingDelta % 360) + 360) % 360;
  const deltaToTarget = (normalizedLanding - currentMod + 360) % 360;
  return currentRotation + fullRotations + deltaToTarget;
}

function buildSlicePath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const toSvg = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toSvg(startDeg));
  const y1 = cy + r * Math.sin(toSvg(startDeg));
  const x2 = cx + r * Math.cos(toSvg(endDeg));
  const y2 = cy + r * Math.sin(toSvg(endDeg));
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

function getLabelPosition(cx: number, cy: number, r: number, centerDeg: number) {
  const rad = ((centerDeg - 90) * Math.PI) / 180;
  const labelR = r * 0.62;
  return { x: cx + labelR * Math.cos(rad), y: cy + labelR * Math.sin(rad), rotate: centerDeg };
}

export function RoletaDemo() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Prize | null>(null);

  const rotationMV = useMotionValue(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const prevAngle = useRef(0);

  function getAngleFromCenter(clientX: number, clientY: number): number {
    const el = wheelRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return Math.atan2(clientY - (rect.top + rect.height / 2), clientX - (rect.left + rect.width / 2)) * (180 / Math.PI);
  }

  function launchSpin() {
    const winnerIndex = Math.floor(Math.random() * PRIZES.length);
    const target = calculateTargetRotation(rotationMV.get(), winnerIndex);
    setIsSpinning(true);
    setResult(null);
    animate(rotationMV, target, {
      duration: SPIN_DURATION_MS / 1000,
      ease: [0.17, 0.67, 0.22, 0.99],
      onComplete: () => {
        setIsSpinning(false);
        setResult(PRIZES[winnerIndex]);
      },
    });
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (isSpinning) return;
    isDragging.current = true;
    prevAngle.current = getAngleFromCenter(e.clientX, e.clientY);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging.current) return;
    const current = getAngleFromCenter(e.clientX, e.clientY);
    let delta = current - prevAngle.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    rotationMV.set(rotationMV.get() + delta);
    prevAngle.current = current;
  }

  function onPointerUp() {
    if (!isDragging.current) return;
    isDragging.current = false;
    launchSpin();
  }

  const cx = 100;
  const cy = 100;
  const radius = 95;

  const hint = result ? null : isSpinning ? "GIRANDO..." : "SEGURE E GIRE";

  return (
    <DemoShell hint={hint}>
      <div className="flex h-full flex-col items-center justify-center px-6">
      <div className="relative aspect-square w-full">
        {/* Glow */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-full bg-gradient-to-br from-volt via-volt-700 to-brand-black opacity-20 blur-3xl"
        />

        {/* Ponteiro */}
        <div
          aria-hidden
          className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1"
        >
          <svg width="32" height="36" viewBox="0 0 32 36">
            <path d="M16 36 L4 8 Q4 0 16 0 Q28 0 28 8 Z" fill="#C6FF3D" stroke="#0A0A0A" strokeWidth="2" />
          </svg>
        </div>

        {/* Roda — interação de giro */}
        <m.div
          ref={wheelRef}
          className="relative h-full w-full touch-none select-none cursor-grab active:cursor-grabbing"
          style={{ rotate: rotationMV }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <svg
            viewBox="0 0 200 200"
            className="h-full w-full drop-shadow-[0_15px_40px_rgba(198,255,61,0.25)]"
            role="img"
            aria-label="Roleta de prêmios"
          >
            {PRIZES.map((prize, i) => {
              const start = i * SLICE_ANGLE;
              const end = (i + 1) * SLICE_ANGLE;
              const center = start + SLICE_ANGLE / 2;
              const path = buildSlicePath(cx, cy, radius, start, end);
              const label = getLabelPosition(cx, cy, radius, center);
              return (
                <g key={prize.label}>
                  <path d={path} fill={prize.color} />
                  <text
                    x={label.x} y={label.y}
                    fill={prize.textColor}
                    fontSize="9" fontWeight="700"
                    fontFamily="var(--font-display)"
                    textAnchor="middle" dominantBaseline="middle"
                    transform={`rotate(${label.rotate} ${label.x} ${label.y})`}
                  >
                    {prize.label}
                  </text>
                </g>
              );
            })}

            <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#C6FF3D" strokeWidth="2" opacity="0.4" />

            <circle cx={cx} cy={cy} r="18" fill="#C6FF3D" />
            <circle cx={cx} cy={cy} r="18" fill="none" stroke="#0A0A0A" strokeWidth="1.5" />
            <text x={cx} y={cy} fill="#0A0A0A" fontSize="6" fontWeight="800" fontFamily="var(--font-display)" textAnchor="middle" dominantBaseline="middle" letterSpacing="0.5">TOUCH</text>
            <text x={cx} y={cy + 6} fill="#0A0A0A" fontSize="5" fontWeight="700" fontFamily="var(--font-display)" textAnchor="middle" dominantBaseline="middle" letterSpacing="0.5">MIDIA</text>
          </svg>
        </m.div>

        {/* Resultado overlay */}
        <AnimatePresence>
          {result && (
            <m.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 z-30 flex items-center justify-center"
            >
              <div className="mx-4 w-full max-w-[280px] rounded-2xl bg-surface-2 p-5 text-center shadow-2xl ring-1 ring-white/5">
                {result.isWin ? (
                  <>
                    <p className="font-display text-xs font-bold uppercase tracking-widest text-volt">Parabéns!</p>
                    <p className="mt-2 font-display text-xl font-bold leading-tight text-white">
                      Você ganharia<br />
                      <span className="text-volt">{result.label}</span>
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-display text-xs font-bold uppercase tracking-widest text-white/50">Quase</p>
                    <p className="mt-2 font-display text-xl font-bold leading-tight text-white">
                      Mais sorte<br />
                      <span className="text-volt">na próxima!</span>
                    </p>
                  </>
                )}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setResult(null)}
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full text-sm font-medium text-white/70 transition-colors hover:text-white"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                    Jogar de novo
                  </button>
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
      </div>
    </DemoShell>
  );
}
