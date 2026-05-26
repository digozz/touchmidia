"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DemoShell } from "./DemoShell";

// ── Layout ────────────────────────────────────────────────────
const W            = 360;
const H            = 640;
const VOLT         = "#C6FF3D";
const RAIL_Y       = 60;
const RAIL_LEFT    = 6;
const RAIL_RIGHT   = 354;
const CLAW_REST_Y  = 98;
const CLAW_DROP_Y  = 545;
const CLAW_LEN     = 38;
const CLAW_OPEN    = 26;
const CLAW_CLOSED  = 5;
const BALL_R       = 15;
const DROP_SPEED   = 160;
const LIFT_SPEED   = 560;

// ── Physics ───────────────────────────────────────────────────
const GRAVITY     = 1500;  // px/s²
const RESTITUTION = 0.38;  // energy kept on floor bounce
const FLOOR_Y      = 622;  // physics floor
const VISUAL_FLOOR = 548;  // visual floor — hides chaotic bottom zone
const WALL_L      = RAIL_LEFT  + BALL_R + 2;  // min ball center x
const WALL_R      = RAIL_RIGHT - BALL_R - 2;  // max ball center x
const CENTER_X    = (RAIL_LEFT + RAIL_RIGHT) / 2;   // 180
const HOLE_TOP    = FLOOR_Y - 60;                   // y where side holes begin
const TUBE_VY     = -520;                            // upward eject velocity

// ── Tier config ───────────────────────────────────────────────
const TIERS = [
  { name: "Brinde",  color: "#9CA3AF", glow: "rgba(156,163,175,0.20)", jitter:  80, slip: 0.06 },
  { name: "Prêmio",  color: "#60A5FA", glow: "rgba(96,165,250,0.22)",  jitter: 200, slip: 0.32 },
  { name: "JACKPOT", color: "#F59E0B", glow: "rgba(245,158,11,0.28)",  jitter: 400, slip: 0.58 },
] as const;
type Tier = 0 | 1 | 2;

type Ball  = { id: number; x: number; y: number; vx: number; vy: number; tier: Tier };
type Phase = "ready" | "dropping" | "grabbing" | "lifting" | "result";

// 90 balls — tier distribution: 64 common, 22 rare, 4 jackpot
// Positions generated deterministically (Math.sin seeding) so they're fixed on every reload
const INIT: Ball[] = (() => {
  const raw: Tier[] = [
    ...Array(64).fill(0) as Tier[],
    ...Array(22).fill(1) as Tier[],
    ...Array(4).fill(2)  as Tier[],
  ];
  // Deterministic shuffle
  const tiers = raw.map((t, i) => ({ t, k: Math.sin(i * 3.7 + 1.2) }))
    .sort((a, b) => a.k - b.k)
    .map(x => x.t);

  const cols  = 8;
  const xStep = (WALL_R - WALL_L) / cols;
  const yStep = BALL_R * 2.1;

  return Array.from({ length: 90 }, (_, i) => ({
    id:   i,
    x:    WALL_L + xStep * (i % cols + 0.5) + Math.sin(i * 2.7) * 4,
    y:    130 + Math.floor(i / cols) * yStep + Math.sin(i * 1.9) * 5,
    vx:   Math.sin(i * 3.3) * 8,
    vy:   0,
    tier: tiers[i],
  }));
})();

// ── Physics step (module-scope — no stale closures) ───────────
function stepPhysics(balls: Ball[], dt: number, grabbedId: number | null) {
  for (const b of balls) {
    if (b.id === grabbedId) continue;

    // Random jitter (vibrating platform) — higher tier = more chaotic
    const j = TIERS[b.tier].jitter;
    b.vx += (Math.random() - 0.5) * 2 * j * dt;

    // Horizontal drag (keeps speed bounded; time constant ~0.5s)
    b.vx *= 1 - 2.0 * dt;

    // Gravity + integrate
    b.vy += GRAVITY * dt;
    b.x  += b.vx * dt;
    b.y  += b.vy * dt;

    // Floor bounce
    if (b.y + BALL_R >= FLOOR_Y) {
      b.y   = FLOOR_Y - BALL_R;
      b.vy  = -Math.abs(b.vy) * RESTITUTION;
      b.vx *= 0.80;
      if (Math.abs(b.vy) < 18) b.vy = 0;
    }

    // Side walls — with drain holes at the bottom that teleport to center nozzle
    if (b.x <= WALL_L) {
      if (b.y >= HOLE_TOP) {
        b.x  = CENTER_X + Math.sin(b.id * 5.3) * 22;
        b.y  = FLOOR_Y - BALL_R - 1;
        b.vx = Math.sin(b.id * 2.9) * 30;
        b.vy = TUBE_VY;
      } else {
        b.x  = WALL_L; b.vx = Math.abs(b.vx) * 0.55;
      }
    }
    if (b.x >= WALL_R) {
      if (b.y >= HOLE_TOP) {
        b.x  = CENTER_X + Math.sin(b.id * 4.1) * 22;
        b.y  = FLOOR_Y - BALL_R - 1;
        b.vx = Math.sin(b.id * 1.7) * 30;
        b.vy = TUBE_VY;
      } else {
        b.x  = WALL_R; b.vx = -Math.abs(b.vx) * 0.55;
      }
    }
  }

  // Ball-ball collision — 4 passes to resolve overlaps with 30 tightly-packed balls
  for (let pass = 0; pass < 4; pass++) {
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        const a = balls[i], b = balls[j];
        if (a.id === grabbedId || b.id === grabbedId) continue;
        const dx = b.x - a.x, dy = b.y - a.y;
        const d  = Math.hypot(dx, dy);
        const mn = BALL_R * 2;
        if (d < mn && d > 0.01) {
          const nx = dx / d, ny = dy / d;
          const ov = (mn - d) * 0.5;
          a.x -= nx * ov; a.y -= ny * ov;
          b.x += nx * ov; b.y += ny * ov;
          // Exchange velocity only on first pass (avoids energy duplication)
          if (pass === 0) {
            const dvx = a.vx - b.vx, dvy = a.vy - b.vy;
            const dot = dvx * nx + dvy * ny;
            if (dot > 0) {
              const imp = dot * 0.55;
              a.vx -= imp * nx; a.vy -= imp * ny;
              b.vx += imp * nx; b.vy += imp * ny;
            }
          }
          // Re-clamp to walls after correction
          a.x = Math.max(WALL_L, Math.min(WALL_R, a.x));
          b.x = Math.max(WALL_L, Math.min(WALL_R, b.x));
          a.y = Math.min(FLOOR_Y - BALL_R, a.y);
          b.y = Math.min(FLOOR_Y - BALL_R, b.y);
        }
      }
    }
  }
}

// ── Draw helpers ──────────────────────────────────────────────
function lighten(hex: string, amt = 55): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, ((n >> 16) & 0xff) + amt);
  const g = Math.min(255, ((n >>  8) & 0xff) + amt);
  const b = Math.min(255, ( n        & 0xff) + amt);
  return `rgb(${r},${g},${b})`;
}
function darken(hex: string, amt = 45): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((n >> 16) & 0xff) - amt);
  const g = Math.max(0, ((n >>  8) & 0xff) - amt);
  const b = Math.max(0, ( n        & 0xff) - amt);
  return `rgb(${r},${g},${b})`;
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, outerR: number, innerR: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    if (i === 0) ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
    else          ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
  }
  ctx.closePath();
}

function drawBall(ctx: CanvasRenderingContext2D, x: number, y: number, tier: Tier) {
  const cfg = TIERS[tier];

  // Floor blob shadow — fades as ball rises
  const distToFloor = FLOOR_Y - (y + BALL_R);
  const shadowA = Math.max(0, 1 - distToFloor / 90) * 0.50;
  if (shadowA > 0.01) {
    const sh = ctx.createRadialGradient(x, FLOOR_Y, 0, x, FLOOR_Y, BALL_R);
    sh.addColorStop(0, `rgba(0,0,0,${shadowA.toFixed(2)})`);
    sh.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = sh;
    ctx.beginPath();
    ctx.ellipse(x, FLOOR_Y, BALL_R, BALL_R * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Outer glow
  const glow = ctx.createRadialGradient(x, y, 0, x, y, BALL_R * 1.9);
  glow.addColorStop(0, cfg.glow);
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(x, y, BALL_R * 1.9, 0, Math.PI * 2); ctx.fill();

  // Body — radial gradient gives 3D sphere feel
  const body = ctx.createRadialGradient(x - BALL_R * 0.32, y - BALL_R * 0.32, 1, x, y, BALL_R);
  body.addColorStop(0,    lighten(cfg.color));
  body.addColorStop(0.55, cfg.color);
  body.addColorStop(1,    darken(cfg.color));
  ctx.fillStyle = body;
  ctx.beginPath(); ctx.arc(x, y, BALL_R, 0, Math.PI * 2); ctx.fill();

  // Shine
  ctx.fillStyle = "rgba(255,255,255,0.30)";
  ctx.beginPath(); ctx.arc(x - BALL_R * 0.3, y - BALL_R * 0.3, BALL_R * 0.27, 0, Math.PI * 2); ctx.fill();

  // Symbol by tier
  if (tier === 0) {
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.beginPath(); ctx.arc(x, y + 1, BALL_R * 0.27, 0, Math.PI * 2); ctx.fill();
  } else if (tier === 1) {
    drawStar(ctx, x, y + 2, BALL_R * 0.42, BALL_R * 0.18);
    ctx.fillStyle = "rgba(255,255,255,0.38)";
    ctx.fill();
  } else {
    drawStar(ctx, x, y + 2, BALL_R * 0.54, BALL_R * 0.22);
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.beginPath(); ctx.arc(x, y + 2, 2.5, 0, Math.PI * 2); ctx.fill();
  }
}

// ── Component ─────────────────────────────────────────────────
export function CaixaMisteriosaDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number | null>(null);

  const phaseRef      = useRef<Phase>("ready");
  const clawX         = useRef((RAIL_LEFT + RAIL_RIGHT) / 2);
  const clawY         = useRef(CLAW_REST_Y);
  const spread        = useRef(CLAW_OPEN);
  const lastTimeRef   = useRef(0);
  const balls         = useRef<Ball[]>(INIT.map(b => ({ ...b })));
  const grabbed       = useRef<Ball | null>(null);
  const grabbedTier   = useRef<Tier | null>(null);
  const slipped       = useRef(false);

  const [phase,      setPhase]      = useState<Phase>("ready");
  const [resTier,    setResTier]    = useState<Tier | null>(null);
  const [resSlipped, setResSlipped] = useState(false);

  // ── Draw ───────────────────────────────────────────────────
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
    ctx.fillStyle = "#080808";
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "rgba(255,255,255,0.011)";
    for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 1.5);

    // Glass area
    const glassTop = RAIL_Y + 8;
    const glassBot = VISUAL_FLOOR;
    ctx.fillStyle = "rgba(70,110,200,0.035)";
    ctx.fillRect(RAIL_LEFT, glassTop, RAIL_RIGHT - RAIL_LEFT, glassBot - glassTop);
    ctx.strokeStyle = "rgba(100,140,230,0.16)";
    ctx.lineWidth = 1;
    ctx.strokeRect(RAIL_LEFT + 0.5, glassTop + 0.5, RAIL_RIGHT - RAIL_LEFT - 1, glassBot - glassTop - 1);


    // Rail
    const rg = ctx.createLinearGradient(0, RAIL_Y - 6, 0, RAIL_Y + 7);
    rg.addColorStop(0,   "#8B949E");
    rg.addColorStop(0.4, "#C0C8D0");
    rg.addColorStop(1,   "#3D4450");
    ctx.fillStyle = rg;
    ctx.fillRect(RAIL_LEFT - 6, RAIL_Y - 6, RAIL_RIGHT - RAIL_LEFT + 12, 12);

    ctx.fillStyle = "#1F2937";
    ctx.fillRect(RAIL_LEFT - 14, RAIL_Y - 9, 10, 18);
    ctx.fillRect(RAIL_RIGHT + 4,  RAIL_Y - 9, 10, 18);

    const cx = clawX.current;
    const cy = clawY.current;
    const sp = spread.current;

    // Trolley
    const tg = ctx.createLinearGradient(cx - 18, 0, cx + 18, 0);
    tg.addColorStop(0,   "#2D3748");
    tg.addColorStop(0.5, "#4A5568");
    tg.addColorStop(1,   "#2D3748");
    ctx.fillStyle = tg;
    ctx.fillRect(cx - 18, RAIL_Y - 4, 36, 14);
    ctx.fillStyle = "rgba(255,255,255,0.07)";
    ctx.fillRect(cx - 16, RAIL_Y - 4, 32, 4);
    ctx.fillStyle = "#6B7280";
    ctx.beginPath(); ctx.arc(cx - 10, RAIL_Y - 4, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 10, RAIL_Y - 4, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#9CA3AF";
    ctx.beginPath(); ctx.arc(cx - 10, RAIL_Y - 4, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 10, RAIL_Y - 4, 1.5, 0, Math.PI * 2); ctx.fill();

    // Cable
    ctx.strokeStyle = "#9CA3AF";
    ctx.lineWidth   = 1.8;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(cx, RAIL_Y + 10);
    ctx.lineTo(cx, cy);
    ctx.stroke();

    // Claw body
    const bg = ctx.createLinearGradient(cx - 14, cy, cx + 14, cy);
    bg.addColorStop(0,   "#2D3748");
    bg.addColorStop(0.5, "#4A5568");
    bg.addColorStop(1,   "#2D3748");
    ctx.fillStyle = bg;
    ctx.fillRect(cx - 14, cy, 28, 16);
    ctx.fillStyle = "rgba(255,255,255,0.09)";
    ctx.fillRect(cx - 14, cy, 28, 5);
    ctx.fillStyle = "#1F2937";
    ctx.beginPath(); ctx.arc(cx - 9, cy + 12, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 9, cy + 12, 2, 0, Math.PI * 2); ctx.fill();

    // Claw prongs
    const tipY = cy + 16 + CLAW_LEN;

    ctx.strokeStyle = "rgba(0,0,0,0.4)";
    ctx.lineWidth   = 4.5;
    ctx.lineCap     = "round";
    ctx.beginPath();
    ctx.moveTo(cx - 7, cy + 17);
    ctx.bezierCurveTo(cx - 7, cy + 25, cx - sp * 0.9, tipY - 12, cx - sp, tipY + 1);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 7, cy + 17);
    ctx.bezierCurveTo(cx + 7, cy + 25, cx + sp * 0.9, tipY - 12, cx + sp, tipY + 1);
    ctx.stroke();

    const pg = ctx.createLinearGradient(cx - sp, tipY, cx, cy + 16);
    pg.addColorStop(0, "#8B949E");
    pg.addColorStop(1, "#C0C8D0");
    ctx.strokeStyle = pg;
    ctx.lineWidth   = 3.5;
    ctx.beginPath();
    ctx.moveTo(cx - 7, cy + 16);
    ctx.bezierCurveTo(cx - 7, cy + 24, cx - sp * 0.9, tipY - 12, cx - sp, tipY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 7, cy + 16);
    ctx.bezierCurveTo(cx + 7, cy + 24, cx + sp * 0.9, tipY - 12, cx + sp, tipY);
    ctx.stroke();

    ctx.fillStyle = "#8B949E";
    ctx.beginPath(); ctx.arc(cx - sp, tipY, 4.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + sp, tipY, 4.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#C0C8D0";
    ctx.beginPath(); ctx.arc(cx - sp, tipY - 1, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + sp, tipY - 1, 2.5, 0, Math.PI * 2); ctx.fill();

    // Grab flash
    if (phaseRef.current === "grabbing") {
      ctx.fillStyle = "rgba(198,255,61,0.14)";
      ctx.beginPath(); ctx.arc(cx, tipY, 28, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "rgba(198,255,61,0.35)";
      ctx.lineWidth   = 1;
      ctx.beginPath(); ctx.arc(cx, tipY, 28, 0, Math.PI * 2); ctx.stroke();
    }

    // Balls (physics positions)
    const grb = grabbed.current;
    for (const ball of balls.current) {
      if (grb && grb.id === ball.id) continue;
      drawBall(ctx, ball.x, ball.y, ball.tier);
    }

    // Grabbed ball follows claw tip
    if (grb && (phaseRef.current === "lifting" || phaseRef.current === "result")) {
      drawBall(ctx, cx, tipY - BALL_R * 0.55, grb.tier);
    }

    // Visual floor drawn AFTER balls — hides chaotic bottom zone
    ctx.fillStyle = "#111";
    ctx.fillRect(0, VISUAL_FLOOR, W, H - VISUAL_FLOOR);

    // Neon border around the glass container
    const neonTop = RAIL_Y + 8;
    const neonBot = VISUAL_FLOOR;
    ctx.save();
    ctx.strokeStyle = VOLT;
    ctx.lineWidth = 1.5;
    // Outer glow pass
    ctx.shadowColor = VOLT;
    ctx.shadowBlur  = 18;
    ctx.strokeRect(RAIL_LEFT + 0.5, neonTop + 0.5, RAIL_RIGHT - RAIL_LEFT - 1, neonBot - neonTop - 1);
    // Second pass — brighter core
    ctx.shadowBlur  = 6;
    ctx.strokeRect(RAIL_LEFT + 0.5, neonTop + 0.5, RAIL_RIGHT - RAIL_LEFT - 1, neonBot - neonTop - 1);
    ctx.restore();

    ctx.restore();
  }, []);

  // ── Game loop ─────────────────────────────────────────────
  const gameLoop = useCallback((timestamp: number) => {
    const dt = Math.min((timestamp - (lastTimeRef.current || timestamp)) / 1000, 0.05);
    lastTimeRef.current = timestamp;

    const ph = phaseRef.current;
    const cy = clawY.current;
    const sp = spread.current;

    // Physics always runs (grabbed ball is excluded inside stepPhysics)
    stepPhysics(balls.current, dt, grabbed.current?.id ?? null);

    if (ph === "dropping") {
      clawY.current  = Math.min(CLAW_DROP_Y, cy + DROP_SPEED * dt);
      spread.current = CLAW_OPEN;

      // Grab on first contact with a ball — check each prong tip against all balls
      const tipY   = clawY.current + 16 + CLAW_LEN;
      const cx     = clawX.current;
      const reach  = BALL_R + 5; // prong tip radius + tolerance
      let touched: Ball | null = null;
      for (const b of balls.current) {
        if (
          Math.hypot(b.x - (cx - CLAW_OPEN), b.y - tipY) <= reach ||
          Math.hypot(b.x - (cx + CLAW_OPEN), b.y - tipY) <= reach
        ) { touched = b; break; }
      }

      if (touched || clawY.current >= CLAW_DROP_Y) {
        grabbed.current     = touched;
        grabbedTier.current = touched ? touched.tier : null;
        slipped.current     = touched ? Math.random() < TIERS[touched.tier].slip : true;
        if (slipped.current) grabbed.current = null;
        phaseRef.current = "grabbing";
      }
    } else if (ph === "grabbing") {
      const target = grabbed.current ? CLAW_CLOSED : CLAW_OPEN;
      spread.current = sp + (target - sp) * Math.min(1, 10 * dt);
      if (Math.abs(spread.current - target) < 1.2) {
        spread.current   = target;
        phaseRef.current = "lifting";
      }
    } else if (ph === "lifting") {
      clawY.current = Math.max(CLAW_REST_Y, cy - LIFT_SPEED * dt);
      // Keep grabbed ball pinned to claw tip
      if (grabbed.current) {
        const tipY = clawY.current + 16 + CLAW_LEN;
        grabbed.current.x  = clawX.current;
        grabbed.current.y  = tipY - BALL_R * 0.55;
        grabbed.current.vx = 0;
        grabbed.current.vy = 0;
      }
      if (clawY.current <= CLAW_REST_Y) {
        clawY.current    = CLAW_REST_Y;
        phaseRef.current = "result";
        setResTier(grabbedTier.current);
        setResSlipped(slipped.current || grabbedTier.current === null);
        setPhase("result");
      }
    }

    draw();
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [draw]);

  useEffect(() => {
    lastTimeRef.current = 0;
    rafRef.current      = requestAnimationFrame(gameLoop);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [gameLoop]);

  // ── Pointer ───────────────────────────────────────────────
  const pointerDownX = useRef(0);
  const pointerDownY = useRef(0);

  function updateClawX(e: React.PointerEvent<HTMLCanvasElement>) {
    if (phaseRef.current !== "ready") return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) * (W / rect.width);
    clawX.current = Math.max(RAIL_LEFT + 22, Math.min(RAIL_RIGHT - 22, x));
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (phaseRef.current !== "ready") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointerDownX.current = e.clientX;
    pointerDownY.current = e.clientY;
    updateClawX(e);
  }

  function handlePointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    if (phaseRef.current !== "ready") return;
    const moved = Math.hypot(e.clientX - pointerDownX.current, e.clientY - pointerDownY.current);
    if (moved < 8) dropClaw();
  }

  // ── Actions ───────────────────────────────────────────────
  function dropClaw() {
    if (phaseRef.current !== "ready") return;
    phaseRef.current = "dropping";
    setPhase("dropping");
  }

  function restart() {
    balls.current       = INIT.map(b => ({ ...b }));
    grabbed.current     = null;
    grabbedTier.current = null;
    slipped.current     = false;
    clawY.current       = CLAW_REST_Y;
    spread.current      = CLAW_OPEN;
    clawX.current       = (RAIL_LEFT + RAIL_RIGHT) / 2;
    phaseRef.current    = "ready";
    setResTier(null);
    setResSlipped(false);
    setPhase("ready");
  }

  const isReady  = phase === "ready";
  const isResult = phase === "result";
  const tierColor = resTier !== null ? TIERS[resTier].color : "#fff";
  const prizeText =
    resTier === 2 ? "JACKPOT!" :
    resTier === 1 ? "Prêmio!"  :
    resTier === 0 ? "Brinde!"  : "";

  return (
    <DemoShell hint={isReady ? <><span>ARRASTE PARA MOVER</span><br /><span>TOQUE PARA SOLTAR</span></> : null}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={updateClawX}
        onPointerUp={handlePointerUp}
      />

      <AnimatePresence>
        {isResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-brand-black/92"
          >
            <motion.div
              initial={{ scale: 0.82, opacity: 0 }}
              animate={{ scale: 1,    opacity: 1 }}
              transition={{ delay: 0.05, type: "spring", stiffness: 290, damping: 22 }}
              className="flex flex-col items-center text-center"
            >
              {resSlipped ? (
                <>
                  <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/38">Quase!</p>
                  <p className="mt-5 font-display text-4xl font-black text-white">A bolinha</p>
                  <p className="font-display text-4xl font-black text-white">escapou...</p>
                  <p className="mt-3 font-sans text-sm text-white/40">Tente de novo — mire melhor!</p>
                </>
              ) : (
                <>
                  <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/38">Você pegou!</p>
                  <div className="mt-5">
                    <span className="font-display text-6xl font-black" style={{ color: tierColor }}>
                      {prizeText}
                    </span>
                  </div>
                  {resTier === 2 && <p className="mt-2 font-sans text-base text-white/60">O prêmio máximo da máquina!</p>}
                  {resTier === 1 && <p className="mt-2 font-sans text-base text-white/60">Um prêmio especial! 🎁</p>}
                  {resTier === 0 && <p className="mt-2 font-sans text-base text-white/60">Todo mundo ganha!</p>}
                </>
              )}
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
