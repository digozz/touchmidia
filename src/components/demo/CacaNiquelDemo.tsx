"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { DemoShell } from "./DemoShell";

// ── Constants ─────────────────────────────────────────────────────────────────
const W = 1080;
const CELL_H = 240;
const STRIP_LEN = 30;
const VOLT = "#C6FF3D";
const VOLT_DEEP = "#9FD61A";

type SymKey = "T" | "7" | "$" | "♦" | "♠";
const SYMBOLS: SymKey[] = ["T", "7", "$", "♦", "♠"];

const PRIZES: Record<SymKey, { name: string; label: string }> = {
  "7": { name: "JACKPOT — Powerbank 5000mAh", label: "JACKPOT" },
  "T": { name: "Camiseta TOUCH M",            label: "3 IGUAIS" },
  "$": { name: "Voucher 20% OFF",              label: "3 IGUAIS" },
  "♦": { name: "Caneca térmica",              label: "3 IGUAIS" },
  "♠": { name: "Sticker pack",               label: "3 IGUAIS" },
};

const SPIN_DURS = [6500, 8200, 10000] as const;

// ── Pure helpers ──────────────────────────────────────────────────────────────
function getStripKey(cellIdx: number, reelIdx: number): SymKey {
  return SYMBOLS[(cellIdx + reelIdx * 2) % SYMBOLS.length];
}

function pickOutcome(): [SymKey, SymKey, SymKey] {
  const r = Math.random();
  if (r < 0.18) return ["7", "7", "7"];
  if (r < 0.50) {
    const winners: SymKey[] = ["T", "$", "♦", "♠"];
    const k = winners[Math.floor(Math.random() * winners.length)];
    return [k, k, k];
  }
  const a = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  let b = a, c = a;
  while (b === a) b = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  while (c === b || c === a) c = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  return [a, b, c];
}

function findTargetInStrip(reelIdx: number, key: SymKey): number {
  for (let i = STRIP_LEN - 4; i > 4; i--) {
    if (getStripKey(i, reelIdx) === key) return i;
  }
  return STRIP_LEN - 6;
}

// ── Sub-components ────────────────────────────────────────────────────────────
function SymCell({ k }: { k: SymKey }) {
  if (k === "T") {
    // eslint-disable-next-line @next/next/no-img-element
    return <Image src="/logo-mark-white.png" alt="" width={194} height={150} priority style={{ display: "block" }} />;
  }
  if (k === "7") {
    return (
      <span style={{
        fontSize: 230, color: VOLT, fontWeight: 700,
        letterSpacing: "-0.08em", lineHeight: "0.85",
        fontFamily: "var(--font-display)",
      }}>7</span>
    );
  }
  return (
    <span style={{
      fontSize: 140, lineHeight: 1, fontWeight: 700,
      color: k === "♦" ? VOLT : "#fff",
      fontFamily: "var(--font-display)",
    }}>{k}</span>
  );
}

function CornerBulb({ style }: { style: React.CSSProperties }) {
  return (
    <div style={{
      position: "absolute", width: 36, height: 36, borderRadius: "50%",
      background: `radial-gradient(circle at 35% 30%, #fff, ${VOLT} 35%, ${VOLT_DEEP} 65%, #3a4d10)`,
      boxShadow: `0 0 22px rgba(198,255,61,1), inset 0 -4px 6px rgba(0,0,0,.4)`,
      border: "2px solid #0a0a0a",
      zIndex: 7,
      ...style,
    }} />
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function CacaNiquelDemo() {
  // Refs
  const containerRef  = useRef<HTMLDivElement>(null);
  const stripRefs     = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const pivotRef      = useRef<HTMLDivElement>(null);
  const busyRef       = useRef(false);
  const leverAngleRef = useRef(0);
  const pivotPosRef   = useRef({ x: 0, y: 0 });
  const draggingRef   = useRef(false);
  const returningRef  = useRef(false);
  const rafRef        = useRef<number | null>(null);

  // State
  type SpinResult = { isWin: true; label: string; name: string } | { isWin: false };

  const [scale,      setScale]      = useState(0.35);
  const [reelStates, setReelStates] = useState<Array<"idle" | "spinning" | "locked">>(["idle", "idle", "idle"]);
  const [result,     setResult]     = useState<SpinResult | null>(null);
  const [leverAngle, setLeverAngle] = useState(0);

  // Scale to container width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / W);
    update();
    const obs = new ResizeObserver(update);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Init strip positions
  useEffect(() => {
    const initY = -(5 * CELL_H - CELL_H);
    stripRefs.current.forEach((el) => {
      if (!el) return;
      el.style.transition = "none";
      el.style.transform  = `translateY(${initY}px)`;
    });
  }, []);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, []);

  // ── Spin ───────────────────────────────────────────────────────────────────
  const handleSpin = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    setResult(null);
    setReelStates(["spinning", "spinning", "spinning"]);

    const outcome = pickOutcome();

    for (let i = 0; i < 3; i++) {
      const el = stripRefs.current[i];
      if (!el) continue;

      el.style.filter = "blur(2px) contrast(1.05)";

      const targetIdx = findTargetInStrip(i, outcome[i]);
      const finalY    = -(targetIdx * CELL_H - CELL_H);

      el.style.transition = "none";
      el.style.transform  = `translateY(${CELL_H * 6}px)`;
      void el.offsetHeight; // force reflow
      el.style.transition = `transform ${SPIN_DURS[i]}ms cubic-bezier(.18,.7,.2,1)`;
      el.style.transform  = `translateY(${finalY}px)`;
    }

    SPIN_DURS.forEach((dur, i) => {
      setTimeout(() => {
        const el = stripRefs.current[i];
        if (el) el.style.filter = "none";
        setReelStates((prev) => {
          const next = prev.slice() as ("idle" | "spinning" | "locked")[];
          next[i] = "locked";
          return next;
        });
      }, dur);
    });

    setTimeout(() => {
      const allEqual = outcome[0] === outcome[1] && outcome[1] === outcome[2];
      setResult(allEqual ? { isWin: true, ...PRIZES[outcome[0]] } : { isWin: false });
      busyRef.current = false;
    }, SPIN_DURS[2] + 300);
  }, []);

  // ── Lever helpers ──────────────────────────────────────────────────────────
  function getPivotCenter() {
    const el = pivotRef.current;
    if (!el) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function calcAngle(clientX: number, clientY: number) {
    const { x, y } = pivotPosRef.current;
    const dx = clientX - x;
    const dy = clientY - y;
    let raw = (Math.atan2(-dy, -dx) * 180) / Math.PI;
    if (raw < 0) raw = dx > 0 ? 180 : 0;
    return raw;
  }

  function animateReturn(from: number, dur: number) {
    returningRef.current = true;
    const start = performance.now();
    function step(t: number) {
      const k      = Math.min(1, (t - start) / dur);
      const eased  = 1 - Math.pow(1 - k, 3);
      const angle  = from * (1 - eased);
      leverAngleRef.current = angle;
      setLeverAngle(angle);
      if (k < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        leverAngleRef.current = 0;
        setLeverAngle(0);
        returningRef.current  = false;
      }
    }
    rafRef.current = requestAnimationFrame(step);
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (busyRef.current || returningRef.current) return;
    pivotPosRef.current = getPivotCenter();
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    const target = calcAngle(e.clientX, e.clientY);
    if (target > leverAngleRef.current) {
      const clamped = Math.min(180, target);
      leverAngleRef.current = clamped;
      setLeverAngle(clamped);
    }
    e.preventDefault();
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* ok */ }
    const a         = leverAngleRef.current;
    const triggered = a >= 90;
    if (triggered) handleSpin();
    animateReturn(a, triggered ? 1100 : 600);
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <DemoShell hint={result ? null : "ARRASTE A ALAVANCA ATÉ 180°"}>
      <div ref={containerRef} className="absolute inset-0">
      {/* 1080 × 1920 totem scaled to container */}
      <div style={{
        position: "absolute", top: 0, left: 0,
        width: W, height: 1920,
        transformOrigin: "top left",
        transform: `scale(${scale})`,
        background: "#0A0A0A",
        color: "#fff",
        fontFamily: "var(--font-display)",
        backgroundImage:
          "linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px)," +
          "linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        overflow: "hidden",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}>

        {/* ── HEADER ────────────────────────────────────────────────────── */}
        <header style={{
          position: "absolute", top: 0, left: 0, right: 0,
          display: "flex", justifyContent: "center", alignItems: "center",
          padding: "60px 60px 36px",
          borderBottom: "1px solid #1A1A1A",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Image src="/logo-mark-white.png" alt="" width={70} height={54} />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1, gap: 4 }}>
              <span style={{ fontWeight: 600, fontSize: 26, letterSpacing: "0.04em" }}>TOUCH</span>
              <span style={{ fontWeight: 400, fontSize: 13, letterSpacing: "0.42em", color: "#9CA3AF" }}>MÍDIA</span>
            </div>
          </div>
        </header>

        {/* ── CABINET ───────────────────────────────────────────────────── */}
        <section style={{
          position: "absolute", left: 90, right: 90, top: 280,
          background: "linear-gradient(180deg, #101010, #070707)",
          border: `2px solid ${VOLT}`,
          padding: "80px 70px 90px",
          boxShadow: `0 0 32px rgba(198,255,61,.35), 0 0 80px rgba(198,255,61,.18)`,
        }}>
          {/* Bulb strips */}
          <div style={{
            position: "absolute", top: 18, left: 18, right: 18, height: 14,
            backgroundImage: `radial-gradient(circle, ${VOLT} 0 4px, transparent 5px)`,
            backgroundSize: "36px 14px", backgroundRepeat: "repeat-x",
            filter: "drop-shadow(0 0 8px rgba(198,255,61,.85))",
            animation: "slot-blink 1.6s steps(2) infinite",
            pointerEvents: "none", zIndex: 6,
          }} />
          <div style={{
            position: "absolute", bottom: 18, left: 18, right: 18, height: 14,
            backgroundImage: `radial-gradient(circle, ${VOLT} 0 4px, transparent 5px)`,
            backgroundSize: "36px 14px", backgroundRepeat: "repeat-x",
            filter: "drop-shadow(0 0 8px rgba(198,255,61,.85))",
            animation: "slot-blink 1.6s steps(2) infinite reverse",
            pointerEvents: "none", zIndex: 6,
          }} />
          <div style={{
            position: "absolute", left: 18, top: 18, bottom: 18, width: 14,
            backgroundImage: `radial-gradient(circle, ${VOLT} 0 4px, transparent 5px)`,
            backgroundSize: "14px 36px", backgroundRepeat: "repeat-y",
            filter: "drop-shadow(0 0 8px rgba(198,255,61,.85))",
            animation: "slot-blink 1.6s steps(2) infinite reverse",
            pointerEvents: "none", zIndex: 6,
          }} />
          <div style={{
            position: "absolute", right: 18, top: 18, bottom: 18, width: 14,
            backgroundImage: `radial-gradient(circle, ${VOLT} 0 4px, transparent 5px)`,
            backgroundSize: "14px 36px", backgroundRepeat: "repeat-y",
            filter: "drop-shadow(0 0 8px rgba(198,255,61,.85))",
            animation: "slot-blink 1.6s steps(2) infinite",
            pointerEvents: "none", zIndex: 6,
          }} />
          <CornerBulb style={{ top: -4, left: -4 }} />
          <CornerBulb style={{ top: -4, right: -4 }} />
          <CornerBulb style={{ bottom: -4, left: -4 }} />
          <CornerBulb style={{ bottom: -4, right: -4 }} />

          {/* Reels grid */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24,
            background: "#000", border: "1px solid #2a2a2a",
            padding: "30px 30px", position: "relative",
          }}>
            {/* Payline */}
            <div style={{
              position: "absolute", left: 18, right: 18, top: "50%",
              transform: "translateY(-50%)",
              height: 240, pointerEvents: "none", zIndex: 5,
              borderTop: "1.5px solid rgba(198,255,61,.7)",
              borderBottom: "1.5px solid rgba(198,255,61,.7)",
              boxShadow: "0 0 24px rgba(198,255,61,.15) inset",
            }}>
              <div style={{
                position: "absolute", left: -2, top: "50%", transform: "translateY(-50%)",
                width: 0, height: 0,
                borderTop: "14px solid transparent",
                borderBottom: "14px solid transparent",
                borderLeft: `18px solid ${VOLT}`,
                filter: "drop-shadow(0 0 6px rgba(198,255,61,.6))",
              }} />
              <div style={{
                position: "absolute", right: -2, top: "50%", transform: "translateY(-50%)",
                width: 0, height: 0,
                borderTop: "14px solid transparent",
                borderBottom: "14px solid transparent",
                borderRight: `18px solid ${VOLT}`,
                filter: "drop-shadow(0 0 6px rgba(198,255,61,.6))",
              }} />
            </div>

            {/* Three reels */}
            {[0, 1, 2].map((ri) => (
              <div
                key={ri}
                style={{
                  position: "relative", height: 720, overflow: "hidden",
                  background: "radial-gradient(ellipse at center, #1a1a1a 0%, #0a0a0a 60%, #000 100%)",
                  border: "1px solid #1f1f1f",
                  boxShadow: reelStates[ri] === "locked"
                    ? `inset 0 0 0 1.5px ${VOLT}, 0 0 32px rgba(198,255,61,.18), inset 0 0 40px rgba(0,0,0,.9)`
                    : "inset 0 0 40px rgba(0,0,0,.9)",
                  transition: "box-shadow 0.3s ease",
                }}
              >
                {/* Strip — styled imperatively during spin to avoid React override */}
                <div
                  ref={(el) => { stripRefs.current[ri] = el; }}
                  style={{
                    position: "absolute", left: 0, right: 0, top: 0,
                    display: "flex", flexDirection: "column",
                    willChange: "transform",
                  }}
                >
                  {Array.from({ length: STRIP_LEN }, (_, ci) => (
                    <div
                      key={ci}
                      style={{
                        flex: "0 0 240px", display: "grid",
                        placeItems: "center",
                        borderBottom: "1px solid rgba(255,255,255,.025)",
                      }}
                    >
                      <SymCell k={getStripKey(ci, ri)} />
                    </div>
                  ))}
                </div>

                {/* Cylinder top/bottom shade */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 200,
                  background: "linear-gradient(180deg, rgba(0,0,0,.95) 0%, rgba(0,0,0,.5) 50%, transparent 100%)",
                  zIndex: 3, pointerEvents: "none",
                }} />
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: 200,
                  background: "linear-gradient(0deg, rgba(0,0,0,.95) 0%, rgba(0,0,0,.5) 50%, transparent 100%)",
                  zIndex: 3, pointerEvents: "none",
                }} />
              </div>
            ))}
          </div>
        </section>

        {/* ── LEVER ─────────────────────────────────────────────────────── */}
        <section style={{
          position: "absolute", left: 60, right: 60, top: 1500, height: 280,
          display: "flex", alignItems: "center", justifyContent: "center",
          touchAction: "none",
        }}>
          {/* Arc track */}
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            transform: "translate(-50%, -100%)",
            width: 680, height: 360, pointerEvents: "none",
          }}>
            <svg
              viewBox="-340 -200 680 200"
              preserveAspectRatio="xMidYMax meet"
              style={{ display: "block", width: "100%", height: "100%", overflow: "visible" }}
            >
              <path
                d="M 300,0 A 300,300 0 0 0 -300,0"
                fill="none"
                stroke={VOLT}
                strokeWidth={1.5}
                strokeLinecap="round"
                style={{
                  opacity: 0.55,
                  filter: "drop-shadow(0 0 4px rgba(198,255,61,.45))",
                  animation: "slot-arc-pulse 2.4s ease-in-out infinite",
                }}
              />
            </svg>
          </div>

          {/* Pivot */}
          <div
            ref={pivotRef}
            style={{
              position: "absolute", left: "50%", top: "50%",
              transform: "translate(-50%, -50%)",
              width: 90, height: 90, borderRadius: "50%",
              background: "radial-gradient(circle at 35% 30%, #3a3a3a, #0a0a0a 70%)",
              border: "2px solid #2A2A2A",
              zIndex: 3,
              boxShadow: "0 0 24px rgba(0,0,0,.8), inset 0 -6px 12px rgba(0,0,0,.6)",
            }}
          >
            <div style={{
              position: "absolute", inset: "32%", borderRadius: "50%",
              background: "#000", border: "1px solid #2a2a2a",
            }} />
          </div>

          {/* Rod wrap */}
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            transform: "translate(-50%, -50%)",
            width: 600, height: 90, zIndex: 4, pointerEvents: "none",
          }}>
            {/* Rod — pointer events re-enabled here */}
            <div
              style={{
                position: "absolute", left: "50%", top: "50%",
                width: 300, height: 18,
                transformOrigin: "100% 50%",
                transform: `translate(-100%, -50%) rotate(${leverAngle}deg)`,
                background: "linear-gradient(180deg, #1a1a1a, #5a5a5a 30%, #cfcfcf 50%, #5a5a5a 70%, #1a1a1a)",
                borderRadius: 9,
                boxShadow: "0 4px 8px rgba(0,0,0,.6)",
                pointerEvents: "auto",
                cursor: "grab",
                touchAction: "none",
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              {/* Knob at left end */}
              <div style={{
                position: "absolute", left: -44, top: "50%", transform: "translateY(-50%)",
                width: 88, height: 88, borderRadius: "50%",
                background: `radial-gradient(circle at 35% 30%, ${VOLT}, ${VOLT_DEEP} 60%, #5b7a10)`,
                boxShadow: `0 0 28px rgba(198,255,61,.55), inset 0 -10px 14px rgba(0,0,0,.35)`,
                border: "3px solid #0a0a0a",
              }} />
            </div>
          </div>
        </section>

        {/* ── RESULT OVERLAY ────────────────────────────────────────────── */}
        {result && (
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,.82)",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(4px)",
            zIndex: 10,
            animation: "fade-in 0.35s ease",
          }}>
            <div style={{
              width: 760,
              background: "#0A0A0A",
              border: `1px solid ${result.isWin ? VOLT : "#2a2a2a"}`,
              padding: "60px 64px",
              textAlign: "center",
              position: "relative",
            }}>
              {result.isWin && (
                <>
                  <div style={{ position: "absolute", top: -9, left: -9,   width: 18, height: 18, background: VOLT }} />
                  <div style={{ position: "absolute", bottom: -9, right: -9, width: 18, height: 18, background: VOLT }} />
                </>
              )}

              <div style={{
                fontFamily: "var(--font-mono)", fontSize: 18,
                letterSpacing: "0.4em", color: result.isWin ? VOLT : "#9CA3AF", marginBottom: 24,
              }}>
                {result.isWin ? "★ VOCÊ GANHOU" : "✕ QUASE LÁ"}
              </div>

              {result.isWin ? (
                <>
                  <div style={{ fontSize: 90, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>
                    {result.label}
                  </div>
                  <div style={{
                    marginTop: 28, padding: "22px 0",
                    borderTop: "1px solid #1A1A1A", borderBottom: "1px solid #1A1A1A",
                    fontFamily: "var(--font-mono)", fontSize: 22,
                    letterSpacing: "0.28em", color: "#9CA3AF",
                  }}>
                    PRÊMIO
                    <div style={{
                      color: "#fff", fontFamily: "var(--font-display)",
                      fontSize: 46, letterSpacing: "-0.01em",
                      marginTop: 8, fontWeight: 600,
                    }}>
                      {result.name}
                    </div>
                  </div>
                </>
              ) : (
                <div style={{
                  fontSize: 52, fontWeight: 700, color: "#fff",
                  fontFamily: "var(--font-display)", lineHeight: 1.1,
                  marginBottom: 28, padding: "22px 0",
                  borderTop: "1px solid #1A1A1A", borderBottom: "1px solid #1A1A1A",
                }}>
                  Mais sorte<br />na próxima!
                </div>
              )}

              <button
                onClick={() => setResult(null)}
                style={{
                  marginTop: 32, background: VOLT, color: "#0A0A0A",
                  border: "none", padding: "22px 40px",
                  fontFamily: "var(--font-display)", fontWeight: 700,
                  fontSize: 20, letterSpacing: "0.18em",
                  textTransform: "uppercase", cursor: "pointer",
                }}
              >
                Jogar de novo
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
    </DemoShell>
  );
}
