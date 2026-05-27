"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { m, AnimatePresence, useMotionValue, animate } from "framer-motion";
import { DemoShell } from "./DemoShell";

const COLS = 4;
const ROWS = 5;
const N    = COLS * ROWS;
const SNAP_RATIO = 0.42;

const PUZZLE_IMG = "/logo-mark-white.png";
const PIECE_BG   = "#000000";
const PATTERN_URL = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"><line x1="0" y1="12" x2="12" y2="0" stroke="#C6FF3D" stroke-width="0.7" opacity="0.5"/></svg>`
)}`;

function scatter(cw: number, ch: number, ps: number): { x: number; y: number }[] {
  const headerH = 62;
  const pad = 6;
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < N; i++) {
    let pos = { x: 0, y: 0 }, tries = 0;
    do {
      pos = {
        x: pad + Math.random() * Math.max(0, cw - ps - pad * 2),
        y: headerH + pad + Math.random() * Math.max(0, ch - headerH - ps - pad * 2),
      };
      tries++;
    } while (
      tries < 50 &&
      out.some(p => Math.abs(p.x - pos.x) < ps * 0.65 && Math.abs(p.y - pos.y) < ps * 0.65)
    );
    out.push(pos);
  }
  return out;
}

function fmtTime(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function QuebracabecaDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims]       = useState({ w: 330, h: 587 });
  const [positions, setPos]   = useState<{ x: number; y: number }[]>([]);
  const [placed, setPlaced]   = useState<boolean[]>(() => Array(N).fill(false));
  const [time, setTime]       = useState(0);
  const [ended, setEnded]     = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [imgAR, setImgAR]     = useState(1); // natural width/height ratio
  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setImgAR(img.naturalWidth / img.naturalHeight);
    img.src = PUZZLE_IMG;
  }, []);

  const ps = Math.min(
    Math.floor((dims.w * 0.84) / COLS),
    Math.floor((dims.h - 72) / ROWS),
  );
  const gridW = COLS * ps;
  const gridH = ROWS * ps;
  const gridX = Math.round((dims.w - gridW) / 2);
  const gridY = 62 + Math.round((dims.h - 62 - gridH) / 2);

  // Image displayed at natural aspect ratio, centered inside the grid
  const gridAR = COLS / ROWS;
  const imgDisplayW = imgAR >= gridAR ? gridW : Math.round(gridH * imgAR);
  const imgDisplayH = imgAR >= gridAR ? Math.round(gridW / imgAR) : gridH;
  const imgOffsetX  = Math.round((gridW - imgDisplayW) / 2);
  const imgOffsetY  = Math.round((gridH - imgDisplayH) / 2);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setDims({ w: r.width, h: r.height });
    });
    ro.observe(el);
    setDims({ w: el.getBoundingClientRect().width, h: el.getBoundingClientRect().height });
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (dims.w > 0 && ps > 0) setPos(scatter(dims.w, dims.h, ps));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameKey, dims.w > 0 ? 1 : 0]);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);
  useEffect(() => { if (ended && timerRef.current) clearInterval(timerRef.current); }, [ended]);

  const ensureTimer = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
  }, []);

  const handleDrop = useCallback((id: number, ex: number, ey: number) => {
    ensureTimer();
    const col = id % COLS, row = Math.floor(id / COLS);
    const tx = gridX + col * ps;
    const ty = gridY + row * ps;
    const snapDist = ps * SNAP_RATIO;
    if (Math.sqrt((ex - tx) ** 2 + (ey - ty) ** 2) < snapDist) {
      setPos(prev => { const n = [...prev]; n[id] = { x: tx, y: ty }; return n; });
      setPlaced(prev => {
        const n = [...prev]; n[id] = true;
        if (n.every(Boolean)) setTimeout(() => setEnded(true), 3000);
        return n;
      });
    } else {
      setPos(prev => { const n = [...prev]; n[id] = { x: ex, y: ey }; return n; });
    }
  }, [gridX, gridY, ps, ensureTimer]);

  const restart = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    startedRef.current = false;
    setPlaced(Array(N).fill(false));
    setTime(0);
    setEnded(false);
    setGameKey(k => k + 1);
  }, []);

  const placedCount = placed.filter(Boolean).length;

  return (
    <DemoShell hint={ended ? null : "ARRASTE AS PEÇAS"}>
      <div ref={containerRef} className="relative flex h-full flex-col">

      {/* Header */}
      <div className="relative z-50 flex items-center justify-between px-6 pt-4 pb-2">
        <div className="text-center">
          <p className="font-mono text-[8px] uppercase tracking-widest text-white/35">Tempo</p>
          <p className="font-display text-xl font-bold text-white">{fmtTime(time)}</p>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-widest text-volt">Quebra-Cabeça</p>
        <div className="text-center">
          <p className="font-mono text-[8px] uppercase tracking-widest text-white/35">Peças</p>
          <p className="font-display text-xl font-bold text-volt">{placedCount}/{N}</p>
        </div>
      </div>

      {/* Ghost grid */}
      {ps > 0 && Array.from({ length: N }, (_, i) => {
        const col = i % COLS, row = Math.floor(i / COLS);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: gridX + col * ps,
              top:  gridY + row * ps,
              width: ps,
              height: ps,
              border: `1px solid ${placed[i] ? "rgba(198,255,61,0.4)" : "rgba(255,255,255,0.07)"}`,
              backgroundColor: "transparent",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        );
      })}

      {/* Pieces */}
      {positions.length === N && ps > 0 && Array.from({ length: N }, (_, id) => (
        <Piece
          key={`${gameKey}-${id}`}
          id={id}
          col={id % COLS}
          row={Math.floor(id / COLS)}
          initX={positions[id].x}
          initY={positions[id].y}
          snapX={gridX + (id % COLS) * ps}
          snapY={gridY + Math.floor(id / COLS) * ps}
          pieceSize={ps}
          imgDisplayW={imgDisplayW}
          imgDisplayH={imgDisplayH}
          imgOffsetX={imgOffsetX}
          imgOffsetY={imgOffsetY}
          isPlaced={placed[id]}
          onDrop={handleDrop}
        />
      ))}

      {/* End overlay */}
      <AnimatePresence>
        {ended && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-brand-black/95 px-10"
          >
            <m.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-volt">Parabéns!</p>
              <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-white">
                Quebra-cabeça<br />montado!
              </h2>
              <p className="mt-4 font-display text-base text-white/50">{fmtTime(time)}</p>
              <button
                onClick={restart}
                className="mt-10 inline-flex h-14 items-center justify-center rounded-full bg-volt px-12 font-display text-base font-bold text-brand-black"
              >
                Jogar de novo
              </button>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      </div>
    </DemoShell>
  );
}

function Piece({
  id, col, row, initX, initY, snapX, snapY, pieceSize,
  imgDisplayW, imgDisplayH, imgOffsetX, imgOffsetY,
  isPlaced, onDrop,
}: {
  id: number; col: number; row: number;
  initX: number; initY: number;
  snapX: number; snapY: number;
  pieceSize: number;
  imgDisplayW: number; imgDisplayH: number;
  imgOffsetX: number;  imgOffsetY: number;
  isPlaced: boolean;
  onDrop: (id: number, x: number, y: number) => void;
}) {
  const mx = useMotionValue(initX);
  const my = useMotionValue(initY);
  const snapped = useRef(false);

  useEffect(() => {
    if (isPlaced && !snapped.current) {
      snapped.current = true;
      animate(mx, snapX, { type: "spring", stiffness: 550, damping: 36 });
      animate(my, snapY, { type: "spring", stiffness: 550, damping: 36 });
    }
  }, [isPlaced, snapX, snapY, mx, my]);

  return (
    <m.div
      drag={!isPlaced}
      dragMomentum={false}
      style={{
        position: "absolute",
        x: mx,
        y: my,
        width: pieceSize,
        height: pieceSize,
        backgroundColor: PIECE_BG,
        backgroundImage: `url("${PUZZLE_IMG}"), url("${PATTERN_URL}")`,
        backgroundSize: `${imgDisplayW}px ${imgDisplayH}px, 12px 12px`,
        backgroundPosition: `${imgOffsetX - col * pieceSize}px ${imgOffsetY - row * pieceSize}px, 0 0`,
        backgroundRepeat: "no-repeat, repeat",
        outline: `1.5px solid ${isPlaced ? "rgba(198,255,61,0.55)" : "rgba(0,0,0,0.35)"}`,
        cursor: isPlaced ? "default" : "grab",
        zIndex: isPlaced ? 2 : 10,
        boxShadow: isPlaced ? "none" : "0 4px 18px rgba(0,0,0,0.75)",
        touchAction: "none",
      }}
      whileDrag={{ scale: 1.07, zIndex: 30 }}
      onDragEnd={() => onDrop(id, mx.get(), my.get())}
    />
  );
}
