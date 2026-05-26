"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DemoShell } from "./DemoShell";

// ── Coordenadas lógicas ────────────────────────────────────────
const W = 360;
const H = 640;

// ── Física e gameplay ──────────────────────────────────────────
const BIRD_X    = 80;
const BIRD_R    = 14;
const HITBOX_R  = 7;    // menor que o visual para ser generoso
const GRAVITY   = 0.28;
const FLAP_VY   = -8.5;
const MAX_VY    = 10;
const PIPE_W    = 40;
const PIPE_GAP  = 225;
const PIPE_EVERY = 130; // frames entre spawns
const VOLT      = "#C6FF3D";

type Pipe  = { x: number; gapY: number; scored: boolean };
type Phase = "idle" | "playing" | "dead";

export function VerdadeiroFalsoDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number | null>(null);

  // Estado do jogo em refs (sem re-render no loop)
  const phaseRef   = useRef<Phase>("idle");
  const birdY      = useRef(H / 2);
  const birdVY     = useRef(0);
  const pipes      = useRef<Pipe[]>([]);
  const frame      = useRef(0);
  const scoreRef   = useRef(0);
  const bobT       = useRef(0);

  // Estado React só para overlays
  const [phase,        setPhase]        = useState<Phase>("idle");
  const [displayScore, setDisplayScore] = useState(0);
  const [finalScore,   setFinalScore]   = useState(0);

  // ── Draw ───────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const cw  = canvas.offsetWidth;
    const ch  = canvas.offsetHeight;

    if (canvas.width  !== Math.round(cw * dpr) ||
        canvas.height !== Math.round(ch * dpr)) {
      canvas.width  = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
    }

    ctx.save();
    ctx.scale(dpr * cw / W, dpr * ch / H);

    // Fundo
    ctx.fillStyle = "#0A0A0A";
    ctx.fillRect(0, 0, W, H);

    // Grid sutil
    ctx.strokeStyle = "rgba(255,255,255,0.025)";
    ctx.lineWidth   = 0.5;
    for (let x = 0; x <= W; x += 45) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += 45) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Teto e chão
    ctx.strokeStyle = "rgba(198,255,61,0.25)";
    ctx.lineWidth   = 1.5;
    ctx.beginPath(); ctx.moveTo(0, 2);   ctx.lineTo(W, 2);   ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, H-2); ctx.lineTo(W, H-2); ctx.stroke();

    // Canos
    pipes.current.forEach(pipe => {
      const topH = pipe.gapY - PIPE_GAP / 2;
      const botY = pipe.gapY + PIPE_GAP / 2;

      ctx.fillStyle = "#111";

      // Cano superior
      ctx.fillRect(pipe.x,     0,        PIPE_W,    topH - 16);
      ctx.fillRect(pipe.x - 5, topH - 16, PIPE_W + 10, 16);
      // Cano inferior
      ctx.fillRect(pipe.x - 5, botY,      PIPE_W + 10, 16);
      ctx.fillRect(pipe.x,     botY + 16, PIPE_W,    H - botY - 16);

      ctx.strokeStyle = VOLT;
      ctx.lineWidth   = 1.5;
      ctx.strokeRect(pipe.x,     0,        PIPE_W,    topH - 16);
      ctx.strokeRect(pipe.x - 5, topH - 16, PIPE_W + 10, 16);
      ctx.strokeRect(pipe.x - 5, botY,      PIPE_W + 10, 16);
      ctx.strokeRect(pipe.x,     botY + 16, PIPE_W,    H - botY - 16);

      // Brilho no gap
      const g = ctx.createLinearGradient(0, topH, 0, botY);
      g.addColorStop(0,   "rgba(198,255,61,0.09)");
      g.addColorStop(0.5, "rgba(198,255,61,0.02)");
      g.addColorStop(1,   "rgba(198,255,61,0.09)");
      ctx.fillStyle = g;
      ctx.fillRect(pipe.x - 5, topH, PIPE_W + 10, PIPE_GAP);
    });

    // Pássaro
    const by   = birdY.current;
    const vy   = birdVY.current;
    const tilt = Math.max(-28, Math.min(48, vy * 4));

    ctx.save();
    ctx.translate(BIRD_X, by);
    ctx.rotate((tilt * Math.PI) / 180);

    // Glow
    const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, BIRD_R + 10);
    glow.addColorStop(0, "rgba(198,255,61,0.35)");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(0, 0, BIRD_R + 10, 0, Math.PI * 2); ctx.fill();

    // Corpo
    ctx.fillStyle = VOLT;
    ctx.beginPath(); ctx.arc(0, 0, BIRD_R, 0, Math.PI * 2); ctx.fill();

    // Olho
    ctx.fillStyle = "#0A0A0A";
    ctx.beginPath(); ctx.arc(5, -4, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(6.5, -5.5, 1.8, 0, Math.PI * 2); ctx.fill();

    // Bico
    ctx.fillStyle = "#0A0A0A";
    ctx.beginPath();
    ctx.moveTo(BIRD_R, -3);
    ctx.lineTo(BIRD_R + 9, 0);
    ctx.lineTo(BIRD_R, 3);
    ctx.closePath();
    ctx.fill();

    ctx.restore(); // bird transform
    ctx.restore(); // scale
  }, []);

  // ── Game loop ──────────────────────────────────────────────────
  const gameLoop = useCallback(() => {
    const p = phaseRef.current;

    if (p === "idle") {
      bobT.current  += 0.055;
      birdY.current  = H / 2 + Math.sin(bobT.current) * 14;
      birdVY.current = Math.cos(bobT.current) * 0.7;
    } else if (p === "playing") {
      frame.current++;

      birdVY.current = Math.min(birdVY.current + GRAVITY, MAX_VY);
      birdY.current += birdVY.current;

      const speed = 1.7 + Math.min(scoreRef.current * 0.05, 1.2);

      // Spawn de cano
      if (frame.current > 55 && frame.current % PIPE_EVERY === 0) {
        const gapY = 165 + Math.random() * (H - 330);
        pipes.current.push({ x: W + 20, gapY, scored: false });
      }

      // Mover e pontuar
      pipes.current.forEach(pipe => {
        pipe.x -= speed;
        if (!pipe.scored && pipe.x + PIPE_W + 5 < BIRD_X) {
          pipe.scored = true;
          scoreRef.current++;
          setDisplayScore(scoreRef.current);
        }
      });
      pipes.current = pipes.current.filter(p => p.x > -PIPE_W - 10);

      // Colisão
      const by = birdY.current;
      let dead = by - HITBOX_R <= 2 || by + HITBOX_R >= H - 2;

      if (!dead) {
        for (const pipe of pipes.current) {
          const topH = pipe.gapY - PIPE_GAP / 2;
          const botY = pipe.gapY + PIPE_GAP / 2;
          const inX  = BIRD_X + HITBOX_R > pipe.x - 5 &&
                       BIRD_X - HITBOX_R < pipe.x + PIPE_W + 5;
          if (inX && (by - HITBOX_R < topH || by + HITBOX_R > botY)) {
            dead = true;
            break;
          }
        }
      }

      if (dead) {
        phaseRef.current = "dead";
        setFinalScore(scoreRef.current);
        setPhase("dead");
      }
    }

    draw();
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [draw]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(gameLoop);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [gameLoop]);

  // ── Controles ──────────────────────────────────────────────────
  function flap() {
    if (phaseRef.current === "idle") {
      birdY.current  = H / 2;
      birdVY.current = FLAP_VY;
      pipes.current  = [];
      frame.current  = 0;
      scoreRef.current = 0;
      phaseRef.current = "playing";
      setDisplayScore(0);
      setPhase("playing");
    } else if (phaseRef.current === "playing") {
      birdVY.current = FLAP_VY;
    }
  }

  function restart() {
    birdY.current  = H / 2;
    birdVY.current = 0;
    pipes.current  = [];
    frame.current  = 0;
    scoreRef.current = 0;
    bobT.current   = 0;
    phaseRef.current = "idle";
    setDisplayScore(0);
    setFinalScore(0);
    setPhase("idle");
  }

  const hint =
    phase === "idle"    ? "TOQUE PARA COMEÇAR" :
    phase === "playing" ? "TOQUE PARA VOAR"    :
    null;

  return (
    <DemoShell hint={hint}>
      {/* Canvas do jogo */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full touch-none"
        onPointerDown={(e) => { e.preventDefault(); flap(); }}
      />

      {/* Placar durante o jogo */}
      {phase === "playing" && (
        <div className="pointer-events-none absolute inset-x-0 top-10 flex justify-center">
          <span className="font-display text-5xl font-bold drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
            style={{ color: "rgba(255,255,255,0.92)" }}>
            {displayScore}
          </span>
        </div>
      )}

      {/* Overlay: idle */}
      {phase === "idle" && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-brand-black/55 touch-none"
          onPointerDown={(e) => { e.preventDefault(); flap(); }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-volt">Demo Interativa</p>
          <h2 className="mt-3 font-display text-6xl font-black text-white">FLAPPY</h2>
          <p className="mt-3 font-sans text-sm text-white/45">Desvie dos obstáculos</p>
        </div>
      )}

      {/* Overlay: game over */}
      <AnimatePresence>
        {phase === "dead" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-brand-black/90"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1,    opacity: 1 }}
              transition={{ delay: 0.08, type: "spring", stiffness: 280, damping: 22 }}
              className="flex flex-col items-center text-center"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/40">Game Over</p>
              <div className="mt-4">
                <span className="font-display text-8xl font-bold text-white">{finalScore}</span>
              </div>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/40">
                {finalScore === 1 ? "obstáculo" : "obstáculos"}
              </p>
              <button
                onClick={restart}
                className="mt-10 inline-flex h-14 items-center justify-center rounded-full bg-volt px-12 font-display text-base font-bold text-brand-black"
              >
                Jogar de novo
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DemoShell>
  );
}
