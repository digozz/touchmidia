"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DemoShell } from "./DemoShell";

type Phase = "selecting" | "scratching" | "ended";
type Prize = { label: string; isWin: boolean };

const PRIZES: Prize[] = [
  { label: "Camiseta Touch", isWin: true },
  { label: "Voucher 20% OFF", isWin: true },
  { label: "Ecobag", isWin: true },
  { label: "Powerbank", isWin: true },
  { label: "Não foi\ndessa vez", isWin: false },
];

function pickPrize(): Prize {
  return Math.random() < 0.72
    ? PRIZES[Math.floor(Math.random() * 4)]
    : PRIZES[4];
}

const FALLING_CARDS = [
  { x: 10,  duration: 8.0, delay: 0.0 },
  { x: 90,  duration: 9.2, delay: 3.0 },
  { x: 170, duration: 7.6, delay: 5.8 },
];

const CARD_W = 300;
const CARD_H = 200;
const SCRATCH_TOP = 52;   // y offset where scratch area starts inside card
const SCRATCH_H   = 118;  // height of scratch area

export function RaspadinhaDemo() {
  const [phase,    setPhase]    = useState<Phase>("selecting");
  const [prize,    setPrize]    = useState<Prize | null>(null);
  const [revealed, setRevealed] = useState(false);

  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const isDrawing  = useRef(false);
  const autoShown  = useRef(false);

  // ── Init canvas when scratching phase mounts ──────────────────────────
  useEffect(() => {
    if (phase !== "scratching") return;
    autoShown.current = false;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "source-over";

    // Silver base
    const grad = ctx.createLinearGradient(0, 0, CARD_W, SCRATCH_H);
    grad.addColorStop(0,   "#8a8a8a");
    grad.addColorStop(0.5, "#b0b0b0");
    grad.addColorStop(1,   "#787878");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CARD_W, SCRATCH_H);

    // Diagonal stripe texture
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#ffffff";
    for (let i = -SCRATCH_H; i < CARD_W + SCRATCH_H; i += 10) {
      ctx.fillRect(i, 0, 5, SCRATCH_H);
    }
    ctx.globalAlpha = 1;

    // "RASPE AQUI" hint
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "center";
    ctx.letterSpacing = "0.2em";
    ctx.fillText("RASPE AQUI", CARD_W / 2, SCRATCH_H / 2);
  }, [phase]);

  // ── Scratch handler ───────────────────────────────────────────────────
  const doScratch = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || autoShown.current) return;
    const canvas = canvasRef.current;
    const ctx    = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (CARD_W  / rect.width);
    const y = (e.clientY - rect.top)  * (SCRATCH_H / rect.height);

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();

    // Auto-reveal above 55%
    const data = ctx.getImageData(0, 0, CARD_W, SCRATCH_H).data;
    let cleared = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 128) cleared++;
    }
    if (cleared / (CARD_W * SCRATCH_H) > 0.55) {
      autoShown.current = true;
      setRevealed(true);
      setTimeout(() => setPhase("ended"), 900);
    }
  }, []);

  const selectCard = useCallback(() => {
    setPrize(pickPrize());
    setRevealed(false);
    setPhase("scratching");
  }, []);

  const restart = useCallback(() => {
    setPrize(null);
    setRevealed(false);
    setPhase("selecting");
  }, []);

  const hint =
    phase === "selecting" ? "TOQUE PARA ESCOLHER" :
    phase === "scratching" ? "RASPE PARA REVELAR" :
    null;

  return (
    <DemoShell hint={hint}>

      {/* ── SELECTING ── */}
      <AnimatePresence>
        {phase === "selecting" && (
          <motion.div
            key="selecting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="absolute inset-0"
          >
            {/* Header */}
            <div className="px-6 pt-10 text-center">
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/35">Raspadinha Virtual</p>
              <p className="mt-2 font-display text-xl font-bold text-white">Escolha uma raspadinha</p>
            </div>

            {/* Falling cards */}
            {FALLING_CARDS.map((col, i) => (
              <motion.button
                key={i}
                onClick={selectCard}
                style={{ position: "absolute", left: col.x, top: 0, padding: 0, background: "none", border: "none" }}
                animate={{
                  y:      [-140, 820],
                  x:      [0, 10, -8, 12, -6, 8, 0],
                  rotate: [0, 4, -5, 3, -4, 5, 0],
                }}
                transition={{
                  duration:   col.duration,
                  delay:      col.delay,
                  repeat:     Infinity,
                  repeatType: "loop",
                  ease:       "linear",
                  x:      { duration: col.duration, ease: "easeInOut", times: [0, 0.15, 0.35, 0.55, 0.7, 0.85, 1], repeat: Infinity },
                  rotate: { duration: col.duration, ease: "easeInOut", times: [0, 0.15, 0.35, 0.55, 0.7, 0.85, 1], repeat: Infinity },
                }}
              >
                <MiniCard />
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SCRATCHING / ENDED ── */}
      <AnimatePresence>
        {phase !== "selecting" && prize && (
          <motion.div
            key="scratch"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-5"
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">
              {revealed
                ? (prize.isWin ? "Você ganhou! 🎉" : "Não foi dessa vez")
                : "Raspe para revelar"}
            </p>

            {/* Card */}
            <div style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.7))" }}>
            <div
              style={{ width: CARD_W, height: CARD_H, position: "relative", clipPath: `path('${ticketD(CARD_W, CARD_H)}')`, overflow: "hidden" }}
            >
              {/* Card background */}
              <div style={{ position: "absolute", inset: 0, backgroundColor: "#111113", backgroundImage: `repeating-linear-gradient(45deg, rgba(198,255,61,0.05) 0, rgba(198,255,61,0.05) 1px, transparent 0, transparent 50%), repeating-linear-gradient(-45deg, rgba(198,255,61,0.05) 0, rgba(198,255,61,0.05) 1px, transparent 0, transparent 50%)`, backgroundSize: "9px 9px" }} />

              {/* Header strip */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: SCRATCH_TOP, backgroundColor: "#C6FF3D", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-mark-black.png" alt="Touch Mídia" style={{ height: 22, width: "auto" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <span style={{ fontFamily: "var(--font-display)", fontSize: 9, fontWeight: 800, color: "#0A0A0A", letterSpacing: "0.2em", textTransform: "uppercase" }}>Raspadinha</span>
              </div>

              {/* Prize area (below scratch) */}
              <div style={{ position: "absolute", top: SCRATCH_TOP, left: 0, right: 0, height: SCRATCH_H, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: prize.isWin ? "#C6FF3D" : "#ffffff", textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line", padding: "0 20px" }}>
                  {prize.label}
                </span>
                {prize.isWin && (
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em", textTransform: "uppercase" }}>Prêmio confirmado</span>
                )}
              </div>

              {/* Canvas scratch layer */}
              {!revealed && (
                <canvas
                  ref={canvasRef}
                  width={CARD_W}
                  height={SCRATCH_H}
                  style={{
                    position: "absolute",
                    top: SCRATCH_TOP,
                    left: 0,
                    width: CARD_W,
                    height: SCRATCH_H,
                    touchAction: "none",
                    cursor: "crosshair",
                    borderRadius: 0,
                  }}
                  onPointerDown={(e) => {
                    isDrawing.current = true;
                    e.currentTarget.setPointerCapture(e.pointerId);
                    doScratch(e);
                  }}
                  onPointerMove={doScratch}
                  onPointerUp={() => { isDrawing.current = false; }}
                  onPointerLeave={() => { isDrawing.current = false; }}
                />
              )}

              {/* Footer */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: CARD_H - SCRATCH_TOP - SCRATCH_H, display: "flex", alignItems: "center", justifyContent: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "rgba(255,255,255,0.2)", letterSpacing: "0.2em", textTransform: "uppercase" }}>Touch Mídia · Demo</span>
              </div>
            </div>
            </div>

            {/* Jogar de novo */}
            <AnimatePresence>
              {phase === "ended" && (
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={restart}
                  className="inline-flex h-14 items-center justify-center rounded-full bg-volt px-12 font-display text-base font-bold text-brand-black"
                >
                  Jogar de novo
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </DemoShell>
  );
}

function ticketD(W: number, H: number): string {
  const r = 6, nr = 6;
  const n1 = H * 0.35, n2 = H * 0.65;
  return [
    `M ${r} 0 H ${W - r} Q ${W} 0 ${W} ${r}`,
    `V ${n1 - nr} A ${nr} ${nr} 0 0 0 ${W} ${n1 + nr}`,
    `V ${n2 - nr} A ${nr} ${nr} 0 0 0 ${W} ${n2 + nr}`,
    `V ${H - r} Q ${W} ${H} ${W - r} ${H}`,
    `H ${r} Q 0 ${H} 0 ${H - r}`,
    `V ${n2 + nr} A ${nr} ${nr} 0 0 0 0 ${n2 - nr}`,
    `V ${n1 + nr} A ${nr} ${nr} 0 0 0 0 ${n1 - nr}`,
    `V ${r} Q 0 0 ${r} 0 Z`,
  ].join(" ");
}

function TicketPath({ W, H }: { W: number; H: number }) {
  return <path d={ticketD(W, H)} />;
}

function MiniCard() {
  const W = 120, H = 80;
  const d = ticketD(W, H);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.55))" }}>
      <defs>
        <clipPath id="mini-ticket-clip"><path d={d} /></clipPath>
        <pattern id="mini-diag" x="0" y="0" width="9" height="9" patternUnits="userSpaceOnUse">
          <line x1="0" y1="9" x2="9" y2="0" stroke="rgba(198,255,61,0.09)" strokeWidth="1" />
          <line x1="-1" y1="1" x2="1" y2="-1" stroke="rgba(198,255,61,0.09)" strokeWidth="1" />
          <line x1="8" y1="10" x2="10" y2="8" stroke="rgba(198,255,61,0.09)" strokeWidth="1" />
        </pattern>
        <linearGradient id="mini-silver" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#8a8a8a" />
          <stop offset="50%"  stopColor="#c0c0c0" />
          <stop offset="100%" stopColor="#787878" />
        </linearGradient>
      </defs>

      <g clipPath="url(#mini-ticket-clip)">
        <rect width={W} height={H} fill="#0f0f10" />
        <rect width={W} height={H} fill="url(#mini-diag)" />
        <rect width={W} height={24} fill="#C6FF3D" />
        <text x={W/2} y={15} textAnchor="middle" fontFamily="var(--font-display)" fontSize={6} fontWeight={800} fill="#0A0A0A" letterSpacing="0.15em">RASPADINHA</text>
        <rect x={8} y={30} width={W - 16} height={H - 38} rx={3} fill="url(#mini-silver)" />
      </g>

      <path d={d} fill="none" stroke="rgba(198,255,61,0.25)" strokeWidth="1" />
    </svg>
  );
}
