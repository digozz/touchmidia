"use client";

import { motion } from "framer-motion";

export function EventHallIllustration() {
  return (
    <div className="relative aspect-square w-full max-w-[520px]">
      <svg
        viewBox="-260 -260 520 520"
        className="h-full w-full"
        role="img"
        aria-label="Vista aérea de um pavilhão de eventos com stand TOUCH MIDIA central recebendo visitantes."
      >
        <defs>
          <radialGradient id="floor-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C6FF3D" stopOpacity="0.18" />
            <stop offset="55%" stopColor="#C6FF3D" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#C6FF3D" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="totem-screen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C6FF3D" />
            <stop offset="100%" stopColor="#9FD61A" />
          </linearGradient>
        </defs>

        <circle cx="0" cy="0" r="160" fill="url(#floor-glow)" />

        <FloatingBooth wx={-160} wy={180} scale={0.7} floatDelay={0.0} />
        <FloatingBooth wx={20}   wy={210} scale={0.7} floatDelay={0.6} />
        <FloatingBooth wx={180}  wy={170} scale={0.7} floatDelay={1.2} />
        <FloatingBooth wx={-220} wy={20}  scale={0.8} floatDelay={1.8} />
        <FloatingBooth wx={180}  wy={10}  scale={0.8} floatDelay={0.4} />

        <FloatingCentralStand floatDelay={0.3} />

        <FloatingBooth wx={-200} wy={-160} scale={0.75} floatDelay={1.5} />
        <FloatingBooth wx={170}  wy={-160} scale={0.75} floatDelay={2.1} />

        {personLayout.map((c, i) => (
          <ArrivingPerson
            key={i}
            wx={c.wx} wy={c.wy}
            fromWx={c.fromWx} fromWy={c.fromWy}
            delay={c.delay} accent={c.accent}
          />
        ))}
      </svg>
    </div>
  );
}

// =====================
// Layout de pessoas
// =====================

const personLayout: Array<{
  wx: number; wy: number; fromWx: number; fromWy: number;
  delay: number; accent?: boolean;
}> = [
  { wx: -62, wy: -55, fromWx: -300, fromWy: -120, delay: 0.0,  accent: true },
  { wx:  62, wy: -55, fromWx:  300, fromWy: -120, delay: 2.8               },
  { wx: -62, wy:  60, fromWx: -300, fromWy:  120, delay: 5.6,  accent: true },
  { wx:  62, wy:  60, fromWx:  300, fromWy:  120, delay: 8.4               },
  { wx: -65, wy:   0, fromWx: -300, fromWy:    0, delay: 11.2, accent: true },
  { wx:  65, wy:   0, fromWx:  300, fromWy:    0, delay: 14.0              },
  { wx:   0, wy: -60, fromWx:    0, fromWy: -300, delay: 16.8              },
  { wx:   0, wy:  62, fromWx:    0, fromWy:  300, delay: 19.6, accent: true },
];

// =====================
// Projeção oblíqua
// =====================

const DEPTH_ANGLE_RAD = (65 * Math.PI) / 180;
const DEPTH_SCALE = 0.55;
const DX = Math.cos(DEPTH_ANGLE_RAD) * DEPTH_SCALE;
const DY = Math.sin(DEPTH_ANGLE_RAD) * DEPTH_SCALE;

function project(x: number, y: number, z: number) {
  return { x: x - y * DX, y: -y * DY - z };
}

function pathOf(pts: { x: number; y: number }[]) {
  return "M " + pts.map((p) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" L ") + " Z";
}

// =====================
// Paralelepípedo com 3 lados: chão + parede traseira + parede direita
// =====================

function BoothShape({
  ox, oy, w, d, h,
  floorColor, floorStroke,
  backColor, sideColor, leftColor,
}: {
  ox: number; oy: number; w: number; d: number; h: number;
  floorColor: string; floorStroke: string;
  backColor: string; sideColor: string; leftColor?: string;
}) {
  const flA = project(ox,     oy,     0);
  const flB = project(ox + w, oy,     0);
  const flC = project(ox + w, oy + d, 0);
  const flD = project(ox,     oy + d, 0);
  const tA  = project(ox,     oy,     h);
  const tC  = project(ox + w, oy + d, h);
  const tD  = project(ox,     oy + d, h);
  const tB  = project(ox + w, oy,     h);

  return (
    <>
      <path d={pathOf([flA, flB, flC, flD])} fill={floorColor} stroke={floorStroke} strokeWidth="0.5" strokeOpacity="0.7" />
      {leftColor && <path d={pathOf([flA, flD, tD, tA])} fill={leftColor} />}
      <path d={pathOf([flD, flC, tC, tD])} fill={backColor} />
      <path d={pathOf([flB, flC, tC, tB])} fill={sideColor} />
    </>
  );
}

// =====================
// Box para o totem (3 faces com topo opcional)
// =====================

function Box({
  ox, oy, oz, w, d, h,
  topColor, frontColor, rightColor, leftColor, noTop,
}: {
  ox: number; oy: number; oz: number;
  w: number; d: number; h: number;
  topColor: string; frontColor: string; rightColor: string;
  leftColor?: string; noTop?: boolean;
}) {
  const A = project(ox,     oy,     oz);
  const B = project(ox + w, oy,     oz);
  const C = project(ox + w, oy + d, oz);
  const D = project(ox,     oy + d, oz);
  const E = project(ox,     oy,     oz + h);
  const F = project(ox + w, oy,     oz + h);
  const G = project(ox + w, oy + d, oz + h);
  const H = project(ox,     oy + d, oz + h);
  return (
    <>
      {leftColor && <path d={pathOf([A, D, H, E])} fill={leftColor} />}
      <path d={pathOf([A, B, F, E])} fill={frontColor} />
      <path d={pathOf([B, C, G, F])} fill={rightColor} />
      {!noTop && <path d={pathOf([E, F, G, H])} fill={topColor} />}
    </>
  );
}

// =====================
// Flutuação
// =====================

function Floating({
  delay = 0, amplitude = 3, duration = 4, children,
}: {
  delay?: number; amplitude?: number; duration?: number; children: React.ReactNode;
}) {
  return (
    <motion.g
      animate={{ y: [0, -amplitude, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.g>
  );
}

// =====================
// Stand central
// =====================

function FloatingCentralStand({ floatDelay = 0 }: { floatDelay?: number }) {
  return (
    <Floating delay={floatDelay} amplitude={3.5} duration={4.2}>
      <CentralStandBody />
    </Floating>
  );
}

function CentralStandBody() {
  return (
    <g>
      <BoothShape
        ox={-80} oy={-72} w={160} d={144} h={70}
        floorColor="#1e2d06" floorStroke="#C6FF3D"
        backColor="#4a6010" sideColor="#5c7a14"
      />
      <Totem />
    </g>
  );
}

function Totem() {
  const TX = -22, TY = -16, TW = 44, TD = 14, TH = 96;
  return (
    <g>
      <Box ox={TX} oy={TY} oz={0} w={TW} d={TD} h={TH}
        topColor="#111113" frontColor="#050505" rightColor="#0A0A0A" leftColor="#080808" />
      {(() => { const sw = TW - 10; const sh = sw * 16 / 9; return <TotemScreen ox={TX + 5} oy={TY} oz={TH - sh - 4} w={sw} h={sh} />; })()}
    </g>
  );
}

function TotemScreen({ ox, oy, oz, w, h }: { ox: number; oy: number; oz: number; w: number; h: number }) {
  const A = project(ox,     oy, oz);
  const B = project(ox + w, oy, oz);
  const C = project(ox + w, oy, oz + h);
  const D = project(ox,     oy, oz + h);
  const cx = (A.x + C.x) / 2;
  const cy = (A.y + C.y) / 2;
  return (
    <g>
      <path d={pathOf([A, B, C, D])} fill="url(#totem-screen)" />
      <g transform={`translate(${cx.toFixed(2)} ${cy.toFixed(2)})`}>
        <circle r="10" fill="#0A0A0A" />
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <path d="M 0 0 L 0 -10 A 10 10 0 0 1 8.7 5 Z" fill="#C6FF3D" />
          <path d="M 0 0 L 8.7 5 A 10 10 0 0 1 -8.7 5 Z" fill="#9FD61A" />
        </motion.g>
        <circle r="2" fill="#0A0A0A" />
      </g>
    </g>
  );
}

// =====================
// Stands vazios
// =====================

function FloatingBooth({ wx, wy, scale = 1, floatDelay = 0 }: {
  wx: number; wy: number; scale?: number; floatDelay?: number;
}) {
  const s = project(wx, wy, 0);
  return (
    <g
      transform={`translate(${s.x.toFixed(2)} ${s.y.toFixed(2)}) scale(${scale})`}
      opacity="0.5"
    >
      <Floating delay={floatDelay} amplitude={3} duration={4}>
        <BoothShape
          ox={0} oy={0} w={90} d={80} h={50}
          floorColor="#161618" floorStroke="#3f3f46"
          backColor="#1a1a1c" sideColor="#1e1e20"
        />
      </Floating>
    </g>
  );
}

// =====================
// Figura humana
// =====================

function PersonFigure({
  bodyFront, bodySide, headColor,
}: {
  bodyFront: string; bodySide: string; bodyTop: string; headColor: string;
}) {
  const legH = 20, torsoH = 18, headR = 5.5;
  const hipsY   = -legH;
  const shouldY = -legH - torsoH;
  const headY   = shouldY - headR - 1.5;

  return (
    <>
      {/* sombra no chão */}
      <ellipse cx="0.5" cy="1" rx="8" ry="3.5" fill="#000" opacity="0.2" />
      {/* pernas */}
      <line x1="-3"  y1={hipsY} x2="-4.5" y2="0" stroke={bodyFront} strokeWidth="5" strokeLinecap="round" />
      <line x1="3"   y1={hipsY} x2="4.5"  y2="0" stroke={bodySide}  strokeWidth="5" strokeLinecap="round" />
      {/* tronco */}
      <path
        d={`M -5 ${hipsY} L 5 ${hipsY} L 7 ${shouldY} L -7 ${shouldY} Z`}
        fill={bodyFront}
      />
      {/* braços */}
      <polyline points={`-7,${shouldY} -9,${shouldY + 6} -8,${shouldY + 10}`} fill="none" stroke={bodyFront} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`7,${shouldY} 9,${shouldY + 6} 8,${shouldY + 10}`}    fill="none" stroke={bodySide}  strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* sombra da cabeça */}
      <circle cx="0.5" cy={headY + 1.5} r={headR} fill="#000" opacity="0.2" />
      {/* cabeça */}
      <circle cx="0" cy={headY} r={headR} fill={headColor} />
    </>
  );
}

function ArrivingPerson({
  wx, wy, fromWx, fromWy, delay = 0, accent = false,
}: {
  wx: number; wy: number; fromWx: number; fromWy: number;
  delay?: number; accent?: boolean;
}) {
  const colors = accent
    ? { bodyFront: "#9FD61A", bodySide: "#6BA315", bodyTop: "#C6FF3D", headColor: "#C6FF3D" }
    : { bodyFront: "#2a2a2c", bodySide: "#18181b", bodyTop: "#3f3f46", headColor: "#52525b" };

  const target = project(wx, wy, 0);
  const from   = project(fromWx, fromWy, 0);
  const dx = from.x - target.x;
  const dy = from.y - target.y;

  return (
    <motion.g
      transform={`translate(${target.x.toFixed(2)} ${target.y.toFixed(2)})`}
      initial={{ x: dx, y: dy, opacity: 0 }}
      animate={{
        x: [dx, 0, 0, dx * 0.4],
        y: [dy, 0, 0, dy * 0.4],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 22,
        times: [0, 0.7, 0.88, 1],
        delay,
        repeat: Infinity,
        repeatDelay: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <PersonFigure {...colors} />
    </motion.g>
  );
}
