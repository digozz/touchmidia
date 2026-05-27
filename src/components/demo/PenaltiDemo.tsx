"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { DemoShell } from "./DemoShell";

const W = 360;
const H = 640;

const FL = 14;
const FR = 346;
const FT = 46;
const FB = 594;
const CX = 180;

const GOAL_W     = 122;
const GOAL_L     = CX - GOAL_W / 2;
const GOAL_R     = CX + GOAL_W / 2;
const GOAL_DEPTH = 34;

const BALL_R    = 11;
const BALL_SY   = FB - 50;

// ── Plinko-style physics (same tuning philosophy) ───────────────────
const DRAG_MAX    = 90;       // slingshot max pull in logical px
const MAX_V       = 900;      // px/sec at full power
const AIR_DRAG    = 0.30;     // fraction remaining per second (≈ Plinko's airDrag^(1/dt))
const RES_WALL    = 0.50;     // wall restitution
const RES_PLAYER  = 0.55;     // player restitution (same as Plinko peg)
const RAND_SPREAD = 80;       // px/s random spread on collision (Plinko: 40 px/s at dt=0.022)
const STOP_SPD    = 10;       // px/s stop threshold

const PR           = 15;
const TOTAL_KICKS  = 5;
const VOLT         = "#C6FF3D";
const FLASH_DUR    = 1.6;

type FlashKind = "goal" | "miss";
type Phase     = "idle" | "aiming" | "moving" | "waiting" | "ended";

type RowDef = {
  y: number;
  baseXs: number[];
  amp: number;
  freq: number;
  phOff: number;
  isGK?: boolean;
};

const ROWS: RowDef[] = [
  { y: FT + 45,  baseXs: [CX],                    amp: 68, freq: 1.10, phOff: 0,   isGK: true }, // 2× freq
  { y: FT + 125, baseXs: [CX - 96, CX, CX + 96],  amp: 54, freq: 0.92, phOff: 1.1 },
  { y: FT + 205, baseXs: [CX - 96, CX, CX + 96],  amp: 54, freq: 0.76, phOff: 2.3 },
  { y: FT + 285, baseXs: [CX - 96, CX, CX + 96],  amp: 54, freq: 1.08, phOff: 0.7 },
];

function rowOff(row: RowDef, t: number): number {
  return Math.sin(t * row.freq + row.phOff) * row.amp;
}

// ── Player sprite (no arms, bigger head) ─────────────────────────────
function drawPlayer(ctx: CanvasRenderingContext2D, px: number, py: number, isGK: boolean) {
  ctx.save();

  const jerseyColor = isGK ? "#f59e0b" : "#2563eb";
  const shortsColor = isGK ? "#92400e" : "#1e3a8a";
  const skin = "#C8956C";
  const hair = "#2D1B0E";

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.28)";
  ctx.beginPath();
  ctx.ellipse(px + 1, py + PR + 2, PR * 0.72, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Jersey body
  ctx.fillStyle   = jerseyColor;
  ctx.strokeStyle = "#0A0A0A";
  ctx.lineWidth   = 1.3;
  ctx.beginPath(); ctx.arc(px, py, PR, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  // Shorts (bottom arc — toward user)
  ctx.fillStyle   = shortsColor;
  ctx.strokeStyle = "#0A0A0A";
  ctx.lineWidth   = 0.7;
  ctx.beginPath();
  ctx.arc(px, py, PR, 0.18 * Math.PI, 0.82 * Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Jersey stripe
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.beginPath();
  ctx.moveTo(px - 4, py - PR + 3);
  ctx.lineTo(px - 3, py + PR * 0.15);
  ctx.lineTo(px + 3, py + PR * 0.15);
  ctx.lineTo(px + 4, py - PR + 3);
  ctx.closePath();
  ctx.fill();

  // Head (bigger, facing toward ball = lower part of sprite)
  ctx.fillStyle   = skin;
  ctx.strokeStyle = "#0A0A0A";
  ctx.lineWidth   = 0.8;
  ctx.beginPath(); ctx.arc(px, py + 3, 9, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  // Hair (top half of head)
  ctx.fillStyle = hair;
  ctx.beginPath();
  ctx.arc(px, py + 3, 8.8, Math.PI, 2 * Math.PI);
  ctx.fill();

  // Eyes
  ctx.fillStyle = "#111";
  ctx.beginPath(); ctx.arc(px - 2.8, py + 5.5, 1.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(px + 2.8, py + 5.5, 1.2, 0, Math.PI * 2); ctx.fill();

  // Collar
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth   = 1.5;
  ctx.beginPath();
  ctx.arc(px, py - 5, 3.5, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();

  ctx.restore();
}

// ── Component ─────────────────────────────────────────────────────────
export function PenaltiDemo() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const rafRef      = useRef<number | null>(null);

  const phaseRef     = useRef<Phase>("idle");
  const timeRef      = useRef(0);
  const lastTimeRef  = useRef<number | null>(null);
  const flashTimer   = useRef(0);
  const flashKindRef = useRef<FlashKind | null>(null);

  // Ball state: position px, velocity px/sec
  const bx  = useRef(CX);
  const by  = useRef(BALL_SY);
  const bvx = useRef(0);
  const bvy = useRef(0);

  // Slingshot drag
  const dragging   = useRef(false);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const dragCurX   = useRef(0);
  const dragCurY   = useRef(0);

  const kicksRef   = useRef(0);
  const goalsRef   = useRef(0);
  const resultsRef = useRef<FlashKind[]>([]);

  const [phase,     setPhase]     = useState<Phase>("idle");
  const [flashKind, setFlashKind] = useState<FlashKind | null>(null);
  const [goals,     setGoals]     = useState(0);
  const [results,   setResults]   = useState<FlashKind[]>([]);

  function restartGame() {
    kicksRef.current   = 0;
    goalsRef.current   = 0;
    resultsRef.current = [];
    bx.current  = CX;
    by.current  = BALL_SY;
    bvx.current = 0;
    bvy.current = 0;
    setGoals(0);
    setResults([]);
    setFlashKind(null);
    flashKindRef.current = null;
    phaseRef.current     = "idle";
    setPhase("idle");
  }

  // ── Draw ──────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const cw  = canvas.offsetWidth;
    const ch  = canvas.offsetHeight;
    if (canvas.width !== Math.round(cw * dpr) || canvas.height !== Math.round(ch * dpr)) {
      canvas.width  = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
    }
    ctx.save();
    ctx.scale(dpr * cw / W, dpr * ch / H);

    // Background
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, W, H);

    // Grass stripes
    const fieldW  = FR - FL;
    const fieldH  = FB - FT;
    const stripeH = fieldH / 10;
    for (let i = 0; i < 10; i++) {
      ctx.fillStyle = i % 2 === 0 ? "#1a5c2a" : "#176025";
      ctx.fillRect(FL, FT + i * stripeH, fieldW, stripeH);
    }

    // Field lines
    ctx.strokeStyle = "rgba(255,255,255,0.75)";
    ctx.lineWidth   = 1.5;
    ctx.strokeRect(FL, FT, fieldW, fieldH);

    const midY = (FT + FB) / 2;
    ctx.beginPath(); ctx.moveTo(FL, midY); ctx.lineTo(FR, midY); ctx.stroke();
    ctx.beginPath(); ctx.arc(CX, midY, 40, 0, Math.PI * 2); ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.beginPath(); ctx.arc(CX, midY,    2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(CX, FT + 50, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(CX, FB - 50, 2, 0, Math.PI * 2); ctx.fill();

    const penW = 160, penH = 70, saW = 80, saH = 30;
    ctx.strokeStyle = "rgba(255,255,255,0.75)";
    ctx.lineWidth   = 1.5;
    ctx.strokeRect(CX - penW / 2, FT,       penW, penH);
    ctx.strokeRect(CX - penW / 2, FB - penH, penW, penH);
    ctx.strokeRect(CX - saW / 2,  FT,       saW,  saH);
    ctx.strokeRect(CX - saW / 2,  FB - saH, saW,  saH);

    // ── Goal net ────────────────────────────────────────────────────
    ctx.fillStyle = "#0d1b12";
    ctx.fillRect(GOAL_L, FT - GOAL_DEPTH, GOAL_W, GOAL_DEPTH);

    const ballInNet = phaseRef.current === "waiting" && flashKindRef.current === "goal";

    ctx.strokeStyle = "rgba(80,180,100,0.4)";
    ctx.lineWidth   = 0.6;

    // Vertical threads — bow toward ball X when in net
    for (let gx = GOAL_L; gx <= GOAL_R; gx += 8) {
      const xDist   = Math.abs(gx - bx.current);
      const xBulge  = ballInNet && xDist < 22 ? (22 - xDist) * 0.5 : 0;
      const bulgeDir = bx.current > gx ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(gx, FT - GOAL_DEPTH);
      if (xBulge > 0) {
        const mid = (FT - GOAL_DEPTH + by.current) / 2;
        ctx.quadraticCurveTo(gx + xBulge * bulgeDir, mid, gx, by.current);
        ctx.lineTo(gx, FT);
      } else {
        ctx.lineTo(gx, FT);
      }
      ctx.stroke();
    }

    // Horizontal threads — dip toward back of goal near ball Y when in net
    for (let gy = FT - GOAL_DEPTH; gy <= FT; gy += 8) {
      const yDist  = Math.abs(gy - by.current);
      const yDip   = ballInNet && yDist < 16 ? -(16 - yDist) * 0.55 : 0;
      ctx.beginPath();
      ctx.moveTo(GOAL_L, gy);
      if (yDip !== 0) {
        ctx.quadraticCurveTo(bx.current, gy + yDip, GOAL_R, gy);
      } else {
        ctx.lineTo(GOAL_R, gy);
      }
      ctx.stroke();
    }

    // Posts
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth   = 3;
    ctx.strokeRect(GOAL_L, FT - GOAL_DEPTH, GOAL_W, GOAL_DEPTH);

    // Goal line
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth   = 2;
    ctx.beginPath(); ctx.moveTo(GOAL_L, FT); ctx.lineTo(GOAL_R, FT); ctx.stroke();

    // Players
    const t = timeRef.current;
    for (const row of ROWS) {
      const off = rowOff(row, t);
      for (const baseX of row.baseXs) {
        drawPlayer(ctx, baseX + off, row.y, row.isGK ?? false);
      }
    }

    // Ball
    const ballPx = bx.current;
    const ballPy = by.current;

    // Idle pulse ring
    if (phaseRef.current === "idle") {
      const pulse = (Math.sin(t * 3.5) + 1) / 2;
      ctx.strokeStyle = `rgba(198,255,61,${0.2 + pulse * 0.32})`;
      ctx.lineWidth   = 1.5;
      ctx.beginPath();
      ctx.arc(ballPx, ballPy, BALL_R + 7 + pulse * 5, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Net ripple — ball bouncing the net
    if (ballInNet) {
      const elapsed = FLASH_DUR - flashTimer.current;
      for (let ring = 0; ring < 4; ring++) {
        const rp     = ((elapsed * 1.1) + ring * 0.25) % 1;
        const radius = BALL_R + 3 + rp * 24;
        const alpha  = (1 - rp) * 0.6;
        ctx.strokeStyle = `rgba(100,220,120,${alpha})`;
        ctx.lineWidth   = 1;
        ctx.beginPath();
        ctx.arc(ballPx, ballPy, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Ball shadow
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.ellipse(ballPx + 2, ballPy + BALL_R, BALL_R * 0.72, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ball body
    const bg = ctx.createRadialGradient(ballPx - 3, ballPy - 4, 1, ballPx, ballPy, BALL_R);
    bg.addColorStop(0,    "#FFFFFF");
    bg.addColorStop(0.55, "#EFEFEF");
    bg.addColorStop(1,    "#9CA3AF");
    ctx.fillStyle   = bg;
    ctx.strokeStyle = "#1A1A1A";
    ctx.lineWidth   = 1;
    ctx.beginPath(); ctx.arc(ballPx, ballPy, BALL_R, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    ctx.fillStyle = "#111";
    ctx.beginPath(); ctx.arc(ballPx,     ballPy - 4.5, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ballPx - 5, ballPy + 2.5, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ballPx + 5, ballPy + 2.5, 2.5, 0, Math.PI * 2); ctx.fill();

    // Slingshot aiming visual
    if (phaseRef.current === "aiming" && dragging.current) {
      const ddx = dragCurX.current - dragStartX.current;
      const ddy = dragCurY.current - dragStartY.current;
      const len = Math.hypot(ddx, ddy);
      if (len > 5) {
        const power  = Math.min(len / DRAG_MAX, 1);
        const kickNx = -ddx / len;
        const kickNy = -ddy / len;
        const aLen   = 30 + power * 40;
        const arrowX = ballPx + kickNx * aLen;
        const arrowY = ballPy + kickNy * aLen;
        const alpha  = 0.45 + power * 0.45;

        // Elastic band to touch point
        ctx.strokeStyle = "rgba(198,255,61,0.3)";
        ctx.lineWidth   = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.moveTo(ballPx, ballPy); ctx.lineTo(dragCurX.current, dragCurY.current); ctx.stroke();
        ctx.setLineDash([]);

        // Kick direction arrow
        ctx.strokeStyle = `rgba(198,255,61,${alpha})`;
        ctx.lineWidth   = 2.5;
        ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.moveTo(ballPx, ballPy); ctx.lineTo(arrowX, arrowY); ctx.stroke();
        ctx.setLineDash([]);

        const angle = Math.atan2(kickNy, kickNx);
        ctx.fillStyle = `rgba(198,255,61,${alpha})`;
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX - 11 * Math.cos(angle - 0.4), arrowY - 11 * Math.sin(angle - 0.4));
        ctx.lineTo(arrowX - 11 * Math.cos(angle + 0.4), arrowY - 11 * Math.sin(angle + 0.4));
        ctx.closePath();
        ctx.fill();

        // Power arc around ball
        ctx.strokeStyle = `rgba(198,255,61,${power * 0.45})`;
        ctx.lineWidth   = 1.5;
        ctx.beginPath();
        ctx.arc(ballPx, ballPy, BALL_R + 5, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * power);
        ctx.stroke();
      }
    }

    ctx.restore();
  }, []);

  // ── Game loop — Plinko-style physics ─────────────────────────────
  const gameLoop = useCallback((timestamp: number) => {
    const dt = lastTimeRef.current !== null
      ? Math.min((timestamp - lastTimeRef.current) / 1000, 0.05)
      : 0.016;
    lastTimeRef.current = timestamp;
    timeRef.current += dt;

    const p = phaseRef.current;

    if (p === "moving") {
      // dt-based air drag (frame-rate independent, Plinko approach)
      const drag = Math.pow(AIR_DRAG, dt);
      bvx.current *= drag;
      bvy.current *= drag;
      bx.current  += bvx.current * dt;
      by.current  += bvy.current * dt;

      // Wall bounces — Plinko-style: restitution + random spread
      if (bx.current - BALL_R < FL) {
        bx.current  = FL + BALL_R;
        bvx.current = Math.abs(bvx.current) * RES_WALL;
        bvy.current += (Math.random() - 0.5) * RAND_SPREAD;
      }
      if (bx.current + BALL_R > FR) {
        bx.current  = FR - BALL_R;
        bvx.current = -Math.abs(bvx.current) * RES_WALL;
        bvy.current += (Math.random() - 0.5) * RAND_SPREAD;
      }
      if (by.current + BALL_R > FB) {
        by.current  = FB - BALL_R;
        bvy.current = -Math.abs(bvy.current) * RES_WALL;
        bvx.current += (Math.random() - 0.5) * RAND_SPREAD;
      }

      // Goal detection: ball center past goal line in goal X range
      if (by.current - BALL_R * 0.3 <= FT &&
          bx.current >= GOAL_L && bx.current <= GOAL_R) {
        bvx.current *= 0.22;
        bvy.current *= 0.22;
        goalsRef.current++;
        kicksRef.current++;
        resultsRef.current   = [...resultsRef.current, "goal"];
        phaseRef.current     = "waiting";
        flashKindRef.current = "goal";
        flashTimer.current   = FLASH_DUR;
        setGoals(goalsRef.current);
        setResults([...resultsRef.current]);
        setFlashKind("goal");
      }

      // Top wall bounce outside goal zone
      if (phaseRef.current === "moving" &&
          by.current - BALL_R < FT &&
          (bx.current < GOAL_L || bx.current > GOAL_R)) {
        by.current  = FT + BALL_R;
        bvy.current = Math.abs(bvy.current) * RES_WALL;
        bvx.current += (Math.random() - 0.5) * RAND_SPREAD;
      }

      // Player collisions — Plinko peg formula, 2 passes
      if (phaseRef.current === "moving") {
        for (let pass = 0; pass < 2; pass++) {
          for (const row of ROWS) {
            const off = rowOff(row, timeRef.current);
            for (const baseX of row.baseXs) {
              const px   = baseX + off;
              const py   = row.y;
              const ddx  = bx.current - px;
              const ddy  = by.current - py;
              const dist = Math.hypot(ddx, ddy);
              const minD = BALL_R + PR;
              if (dist < minD && dist > 0.01) {
                const nx    = ddx / dist;
                const ny    = ddy / dist;
                const vDotN = bvx.current * nx + bvy.current * ny;
                if (vDotN < 0) {
                  // Plinko peg bounce formula
                  bvx.current -= (1 + RES_PLAYER) * vDotN * nx;
                  bvy.current -= (1 + RES_PLAYER) * vDotN * ny;
                  bvx.current += (Math.random() - 0.5) * RAND_SPREAD;
                }
                // Separate overlapping bodies
                bx.current += nx * (minD - dist);
                by.current += ny * (minD - dist);
              }
            }
          }
        }

        // Stop detection
        if (Math.hypot(bvx.current, bvy.current) < STOP_SPD) {
          kicksRef.current++;
          resultsRef.current   = [...resultsRef.current, "miss"];
          phaseRef.current     = "waiting";
          flashKindRef.current = "miss";
          flashTimer.current   = 1.3;
          setResults([...resultsRef.current]);
          setFlashKind("miss");
        }
      }
    } else if (p === "waiting") {
      // Ball coasts gently into net
      if (flashKindRef.current === "goal") {
        const heavyDrag = Math.pow(0.018, dt);
        bvx.current *= heavyDrag;
        bvy.current *= heavyDrag;
        bx.current  += bvx.current * dt;
        by.current  += bvy.current * dt;
        if (bx.current < GOAL_L + BALL_R)          { bx.current = GOAL_L + BALL_R;          bvx.current = 0; }
        if (bx.current > GOAL_R - BALL_R)          { bx.current = GOAL_R - BALL_R;          bvx.current = 0; }
        if (by.current < FT - GOAL_DEPTH + BALL_R) { by.current = FT - GOAL_DEPTH + BALL_R; bvy.current = 0; }
        if (by.current > FT - 1)                   { by.current = FT - 1;                   bvy.current = 0; }
      }

      flashTimer.current -= dt;
      if (flashTimer.current <= 0) {
        setFlashKind(null);
        flashKindRef.current = null;
        if (kicksRef.current >= TOTAL_KICKS) {
          phaseRef.current = "ended";
          setPhase("ended");
        } else {
          bx.current  = CX;
          by.current  = BALL_SY;
          bvx.current = 0;
          bvy.current = 0;
          phaseRef.current = "idle";
          setPhase("idle");
        }
      }
    }

    draw();
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [draw]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(gameLoop);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [gameLoop]);

  // ── Pointer handlers ──────────────────────────────────────────────
  function getCanvasPoint(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (W / rect.width),
      y: (e.clientY - rect.top)  * (H / rect.height),
    };
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (phaseRef.current !== "idle") return;
    const { x, y } = getCanvasPoint(e);
    if (Math.hypot(x - bx.current, y - by.current) > 55) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragging.current   = true;
    dragStartX.current = x;
    dragStartY.current = y;
    dragCurX.current   = x;
    dragCurY.current   = y;
    phaseRef.current   = "aiming";
    setPhase("aiming");
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!dragging.current) return;
    const { x, y } = getCanvasPoint(e);
    dragCurX.current = x;
    dragCurY.current = y;
  }

  function onPointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!dragging.current) return;
    dragging.current = false;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
    const ddx = dragCurX.current - dragStartX.current;
    const ddy = dragCurY.current - dragStartY.current;
    const len = Math.hypot(ddx, ddy);
    if (len < 8) { phaseRef.current = "idle"; setPhase("idle"); return; }
    const power = Math.min(len / DRAG_MAX, 1);
    // Slingshot: velocity opposite of drag direction
    bvx.current = (-ddx / len) * power * MAX_V;
    bvy.current = (-ddy / len) * power * MAX_V;
    phaseRef.current = "moving";
    setPhase("moving");
  }

  const hint =
    phase === "idle"   ? "PUXE A BOLA PARA CHUTAR" :
    phase === "aiming" ? "SOLTE PARA CHUTAR" :
    null;

  const perfLabel =
    goals === TOTAL_KICKS ? "Craque!" :
    goals >= 4            ? "Muito bom!" :
    goals >= 3            ? "Passou da metade!" :
    goals >= 2            ? "Pode melhorar!" :
                            "O goleiro agradece!";

  return (
    <DemoShell hint={hint}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />

      {/* HUD */}
      {phase !== "ended" && (
        <div className="pointer-events-none absolute left-3 right-3 top-2 flex items-center justify-between">
          <div className="flex gap-2">
            {Array.from({ length: TOTAL_KICKS }, (_, i) => {
              const r = results[i];
              if (r === "goal") {
                return (
                  <div key={i} className="h-4 w-4 rounded-full bg-volt shadow-[0_0_6px_rgba(198,255,61,0.8)]" />
                );
              } else if (r === "miss") {
                return (
                  <div key={i} className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-red-500">
                    <span className="text-[8px] font-black leading-none text-red-500">✕</span>
                  </div>
                );
              }
              return <div key={i} className="h-4 w-4 rounded-full border border-white/20" />;
            })}
          </div>
          <span className="font-display text-2xl font-bold text-white">{goals}</span>
        </div>
      )}

      {/* Flash overlay */}
      <AnimatePresence>
        {flashKind && (
          <m.div
            key={`${flashKind}-${results.length}`}
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, type: "spring", stiffness: 380, damping: 26 }}
            className="pointer-events-none absolute inset-x-8 bottom-24 flex items-center justify-center rounded-2xl py-4"
            style={{
              background: "rgba(10,10,10,0.92)",
              border: `2px solid ${flashKind === "goal" ? VOLT : "#DC2626"}`,
            }}
          >
            <span
              className="font-display text-4xl font-black tracking-widest"
              style={{ color: flashKind === "goal" ? VOLT : "#DC2626" }}
            >
              {flashKind === "goal" ? "GOL!" : "FORA!"}
            </span>
          </m.div>
        )}
      </AnimatePresence>

      {/* End overlay */}
      <AnimatePresence>
        {phase === "ended" && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-brand-black/90"
          >
            <m.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1,    opacity: 1 }}
              transition={{ delay: 0.08, type: "spring", stiffness: 280, damping: 22 }}
              className="flex flex-col items-center text-center"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/40">Fim de Jogo</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-8xl font-bold text-white">{goals}</span>
                <span className="font-display text-3xl font-bold text-white/25">/{TOTAL_KICKS}</span>
              </div>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/40">Gols</p>
              <p className="mt-4 font-display text-xl font-bold" style={{ color: VOLT }}>{perfLabel}</p>
              <button
                onClick={restartGame}
                className="mt-8 inline-flex h-14 items-center justify-center rounded-full bg-volt px-12 font-display text-base font-bold text-brand-black"
              >
                Jogar de novo
              </button>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </DemoShell>
  );
}
