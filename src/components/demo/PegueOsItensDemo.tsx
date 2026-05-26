"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DemoShell } from "./DemoShell";

const W    = 360;
const H    = 640;
const VOLT = "#C6FF3D";
const R    = 22;            // item radius
const GAME_DURATION = 30;  // seconds

type ItemKind = "good" | "bomb";
type Item = {
  id: number; x: number; y: number; vy: number;
  kind: ItemKind; caught: boolean; burst: number;
};
type Phase = "idle" | "playing" | "ended";

export function PegueOsItensDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number | null>(null);

  // All game state in refs — no re-render inside loop
  const phaseRef   = useRef<Phase>("idle");
  const items      = useRef<Item[]>([]);
  const scoreRef   = useRef(0);
  const timeRef    = useRef(GAME_DURATION);
  const spawnTimer = useRef(0);
  const nextId     = useRef(0);
  const bombFlash  = useRef(0);
  const lastTime   = useRef(0);

  // React state only for overlays
  const [phase,        setPhase]        = useState<Phase>("idle");
  const [displayScore, setDisplayScore] = useState(0);
  const [finalScore,   setFinalScore]   = useState(0);

  // ── Draw ────────────────────────────────────────────────────
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

    // Background
    ctx.fillStyle = "#0A0A0A";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.022)";
    ctx.lineWidth   = 0.5;
    for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Bomb flash overlay
    if (bombFlash.current > 0) {
      ctx.fillStyle = `rgba(239,68,68,${bombFlash.current * 0.38})`;
      ctx.fillRect(0, 0, W, H);
    }

    // Items
    for (const item of items.current) {
      if (item.caught && item.burst <= 0) continue;

      const { x, y, kind, caught, burst } = item;
      const alpha = caught ? burst / 14 : 1;

      ctx.save();
      ctx.globalAlpha = alpha;

      if (kind === "good") {
        // Glow
        const glow = ctx.createRadialGradient(x, y, R * 0.1, x, y, R * 2.0);
        glow.addColorStop(0, "rgba(198,255,61,0.32)");
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(x, y, R * 2.0, 0, Math.PI * 2); ctx.fill();

        // Diamond body
        ctx.beginPath();
        ctx.moveTo(x,           y - R);         // top
        ctx.lineTo(x + R * 0.72, y - R * 0.08); // right shoulder
        ctx.lineTo(x + R * 0.68, y);            // right
        ctx.lineTo(x,           y + R);          // bottom
        ctx.lineTo(x - R * 0.68, y);            // left
        ctx.lineTo(x - R * 0.72, y - R * 0.08); // left shoulder
        ctx.closePath();
        ctx.fillStyle = VOLT;
        ctx.fill();

        // Upper-right facet (highlight)
        ctx.beginPath();
        ctx.moveTo(x, y - R);
        ctx.lineTo(x + R * 0.72, y - R * 0.08);
        ctx.lineTo(x + R * 0.68, y);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.fillStyle = "rgba(255,255,255,0.22)";
        ctx.fill();

        // Upper-left facet (mid-tone)
        ctx.beginPath();
        ctx.moveTo(x, y - R);
        ctx.lineTo(x, y);
        ctx.lineTo(x - R * 0.68, y);
        ctx.lineTo(x - R * 0.72, y - R * 0.08);
        ctx.closePath();
        ctx.fillStyle = "rgba(255,255,255,0.08)";
        ctx.fill();

        // Horizontal cut line
        ctx.strokeStyle = "rgba(0,80,0,0.35)";
        ctx.lineWidth   = 0.8;
        ctx.beginPath();
        ctx.moveTo(x - R * 0.68, y); ctx.lineTo(x + R * 0.68, y);
        ctx.stroke();

        // Shine spot
        ctx.fillStyle = "rgba(255,255,255,0.58)";
        ctx.beginPath();
        ctx.arc(x - R * 0.2, y - R * 0.44, R * 0.13, 0, Math.PI * 2);
        ctx.fill();

        // Burst rings on catch
        if (caught && burst > 0) {
          const p = 1 - burst / 14;
          ctx.strokeStyle = VOLT;
          ctx.lineWidth   = 2;
          ctx.globalAlpha = alpha * 0.65;
          ctx.beginPath(); ctx.arc(x, y, R + p * 30, 0, Math.PI * 2); ctx.stroke();
          ctx.lineWidth   = 1;
          ctx.globalAlpha = alpha * 0.3;
          ctx.beginPath(); ctx.arc(x, y, R + p * 52, 0, Math.PI * 2); ctx.stroke();
        }
      } else {
        // Bomb ambient glow
        const bombGlow = ctx.createRadialGradient(x, y, 0, x, y, R * 1.7);
        bombGlow.addColorStop(0, "rgba(255,80,0,0.14)");
        bombGlow.addColorStop(1, "transparent");
        ctx.fillStyle = bombGlow;
        ctx.beginPath(); ctx.arc(x, y, R * 1.7, 0, Math.PI * 2); ctx.fill();

        // Glossy sphere body
        const bodyGrad = ctx.createRadialGradient(x - R * 0.28, y - R * 0.28, 1, x, y, R);
        bodyGrad.addColorStop(0,    "#3d3d3d");
        bodyGrad.addColorStop(0.45, "#1c1c1c");
        bodyGrad.addColorStop(1,    "#080808");
        ctx.fillStyle = bodyGrad;
        ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2); ctx.fill();

        // Specular shine
        ctx.fillStyle = "rgba(255,255,255,0.11)";
        ctx.beginPath();
        ctx.arc(x - R * 0.28, y - R * 0.28, R * 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Fuse (curved brown line from top-right of sphere)
        const fbx = x + R * 0.30;
        const fby = y - R * 0.80;
        const ftx = x + R * 0.52;
        const fty = y - R * 1.46;
        ctx.strokeStyle = "#92400e";
        ctx.lineWidth   = 2;
        ctx.lineCap     = "round";
        ctx.beginPath();
        ctx.moveTo(fbx, fby);
        ctx.quadraticCurveTo(fbx + 5, fby - 10, ftx, fty);
        ctx.stroke();

        // Spark glow
        ctx.fillStyle = "rgba(252,211,77,0.40)";
        ctx.beginPath(); ctx.arc(ftx, fty, 5.5, 0, Math.PI * 2); ctx.fill();
        // Spark core
        ctx.fillStyle = "#FCD34D";
        ctx.beginPath(); ctx.arc(ftx, fty, 2.5, 0, Math.PI * 2); ctx.fill();
      }

      ctx.restore();
    }

    // Timer bar (only when playing)
    if (phaseRef.current === "playing") {
      const progress  = Math.max(0, timeRef.current / GAME_DURATION);
      const barColor  = progress > 0.3 ? VOLT : "#ef4444";
      const barY      = H - 18;
      const barW      = W - 40;

      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fillRect(20, barY, barW, 6);
      ctx.fillStyle = barColor;
      ctx.fillRect(20, barY, barW * progress, 6);
    }

    ctx.restore();
  }, []);

  // ── Game loop ────────────────────────────────────────────────
  const gameLoop = useCallback((timestamp: number) => {
    const dt = Math.min((timestamp - (lastTime.current || timestamp)) / 1000, 0.05);
    lastTime.current = timestamp;

    if (phaseRef.current === "idle") {
      // Decorative items float slowly and loop
      for (const item of items.current) {
        item.y += item.vy * dt;
        if (item.y > H + R) {
          item.y = -R;
          item.x = R + 15 + Math.random() * (W - (R + 15) * 2);
        }
      }
    } else if (phaseRef.current === "playing") {
      // Countdown
      timeRef.current = Math.max(0, timeRef.current - dt);
      if (timeRef.current <= 0) {
        phaseRef.current = "ended";
        setFinalScore(scoreRef.current);
        setPhase("ended");
      }

      // Spawn
      const elapsed        = GAME_DURATION - timeRef.current;
      const spawnInterval  = Math.max(0.48, 1.3 - elapsed * 0.027);
      spawnTimer.current  += dt;
      if (spawnTimer.current >= spawnInterval) {
        spawnTimer.current = 0;
        const minVy = 85  + elapsed * 2.2;
        const maxVy = 230 + elapsed * 4.5;
        const randVy = () => minVy + Math.random() * (maxVy - minVy);
        items.current.push({
          id:     nextId.current++,
          x:      R + 15 + Math.random() * (W - (R + 15) * 2),
          y:      -R - 4,
          vy:     randVy(),
          kind:   Math.random() < 0.25 ? "bomb" : "good",
          caught: false,
          burst:  0,
        });
        // Double-spawn in last 10 seconds
        if (elapsed > 20 && Math.random() < 0.45) {
          items.current.push({
            id:     nextId.current++,
            x:      R + 15 + Math.random() * (W - (R + 15) * 2),
            y:      -R - 4,
            vy:     randVy(),
            kind:   Math.random() < 0.25 ? "bomb" : "good",
            caught: false,
            burst:  0,
          });
        }
      }

      // Move
      for (const item of items.current) {
        if (!item.caught) item.y += item.vy * dt;
        if (item.caught)  item.burst = Math.max(0, item.burst - 1);
      }

      // Bomb flash decay
      bombFlash.current = Math.max(0, bombFlash.current - dt * 3.5);

      // Cull
      items.current = items.current.filter(
        i => i.y < H + R + 10 && (!i.caught || i.burst > 0),
      );
    }

    draw();
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [draw]);

  useEffect(() => {
    // Decorative items for idle screen
    items.current = [
      { id: 0, x: 80,  y: 220, vy: 38, kind: "good", caught: false, burst: 0 },
      { id: 1, x: 200, y: 420, vy: 34, kind: "good", caught: false, burst: 0 },
      { id: 2, x: 280, y: 130, vy: 40, kind: "bomb", caught: false, burst: 0 },
      { id: 3, x: 140, y: 560, vy: 36, kind: "good", caught: false, burst: 0 },
    ];
    nextId.current   = 4;
    lastTime.current = 0;
    rafRef.current   = requestAnimationFrame(gameLoop);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [gameLoop]);

  // ── Tap handler ──────────────────────────────────────────────
  function handleTap(e: React.PointerEvent<HTMLCanvasElement>) {
    e.preventDefault();
    if (phaseRef.current !== "playing") return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const tapX = (e.clientX - rect.left) * (W / rect.width);
    const tapY = (e.clientY - rect.top)  * (H / rect.height);

    for (const item of items.current) {
      if (item.caught) continue;
      if (Math.hypot(tapX - item.x, tapY - item.y) < R + 10) {
        item.caught = true;
        item.burst  = 14;
        if (item.kind === "good") {
          scoreRef.current++;
          setDisplayScore(scoreRef.current);
        } else {
          scoreRef.current = Math.max(0, scoreRef.current - 2);
          setDisplayScore(scoreRef.current);
          bombFlash.current = 1;
        }
        break;
      }
    }
  }

  // ── Controls ─────────────────────────────────────────────────
  function startGame() {
    items.current      = [];
    scoreRef.current   = 0;
    timeRef.current    = GAME_DURATION;
    spawnTimer.current = -0.8; // grace period before first spawn
    nextId.current     = 0;
    bombFlash.current  = 0;
    phaseRef.current   = "playing";
    setDisplayScore(0);
    setPhase("playing");
  }

  function restartGame() {
    items.current = [
      { id: 0, x: 80,  y: 220, vy: 38, kind: "good", caught: false, burst: 0 },
      { id: 1, x: 200, y: 420, vy: 34, kind: "good", caught: false, burst: 0 },
      { id: 2, x: 280, y: 130, vy: 40, kind: "bomb", caught: false, burst: 0 },
      { id: 3, x: 140, y: 560, vy: 36, kind: "good", caught: false, burst: 0 },
    ];
    nextId.current     = 4;
    scoreRef.current   = 0;
    timeRef.current    = GAME_DURATION;
    spawnTimer.current = 0;
    bombFlash.current  = 0;
    phaseRef.current   = "idle";
    setFinalScore(0);
    setDisplayScore(0);
    setPhase("idle");
  }

  const resultLabel =
    finalScore >= 20 ? "Incrível!" :
    finalScore >= 14 ? "Muito bom!" :
    finalScore >= 9  ? "Bom trabalho!" :
    finalScore >= 5  ? "Pode melhorar!" :
                       "Tente de novo!";

  return (
    <DemoShell hint={phase === "idle" ? "TOQUE PARA COMEÇAR" : null}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full touch-none"
        onPointerDown={handleTap}
      />

      {/* Score during play */}
      {phase === "playing" && (
        <div className="pointer-events-none absolute inset-x-0 top-8 flex justify-center">
          <span
            className="font-display text-5xl font-bold drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
            style={{ color: "rgba(255,255,255,0.92)" }}
          >
            {displayScore}
          </span>
        </div>
      )}

      {/* Idle overlay */}
      {phase === "idle" && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-brand-black/55 touch-none"
          onPointerDown={(e) => { e.preventDefault(); startGame(); }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-volt">Demo Interativa</p>
          <h2 className="mt-3 font-display text-6xl font-black text-white leading-none">PEGUE</h2>
          <h2 className="font-display text-6xl font-black leading-none" style={{ color: VOLT }}>
            OS ITENS
          </h2>
          <p className="mt-4 font-sans text-sm text-white/45">Toque nos itens antes de caírem</p>
          <p className="mt-1 font-sans text-xs text-white/30">Evite as bombas</p>
        </div>
      )}

      {/* Game over overlay */}
      <AnimatePresence>
        {phase === "ended" && (
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
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/40">
                Fim de jogo
              </p>
              <div className="mt-4">
                <span className="font-display text-8xl font-bold text-white">{finalScore}</span>
              </div>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/40">
                {finalScore === 1 ? "item capturado" : "itens capturados"}
              </p>
              <p className="mt-3 font-display text-xl font-bold" style={{ color: VOLT }}>
                {resultLabel}
              </p>
              <button
                onClick={restartGame}
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
