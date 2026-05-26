import { cn } from "@/lib/utils";

type Props = {
  slug: string;
  className?: string;
};

export function GameMockup({ slug, className }: Props) {
  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-brand-black",
        "ring-1 ring-white/8 shadow-sm",
        className,
      )}
    >
      {RENDERERS[slug]?.() ?? <FallbackMockup />}
    </div>
  );
}

const RENDERERS: Record<string, () => React.ReactNode> = {
  "roleta-premiada": RoletaScreen,
  raspadinha: RaspadinhaScreen,
  "caca-niquel": CacaNiquelScreen,
  plinko: PlinkoScreen,
  "caixa-misteriosa": CaixaScreen,
  quiz: QuizScreen,
  flappy: FlappyScreen,
  "jogo-da-memoria": MemoriaScreen,
  "quebra-cabeca": QuebraCabecaScreen,
  "pegue-os-itens": PegueItensScreen,
  "cobranca-de-penalti": PenaltiScreen,
  "bate-toupeira": BateToupeiraScreen,
};

function FallbackMockup() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-volt/10">
      <div className="h-20 w-20 rounded-full bg-white/10" />
    </div>
  );
}

const FONT_DISPLAY = "var(--font-display)";
const FONT_SANS = "var(--font-sans)";
const VOLT = "#C6FF3D";
const DARK = "#0A0A0A";
const SURFACE2 = "#141414";
const SURFACE3 = "#1A1A1A";

// ============ 1. ROLETA ============
function RoletaScreen() {
  const slices = [
    { color: SURFACE3, label: "🏆", dark: false },
    { color: "#222222", label: "★", dark: false },
    { color: SURFACE2, label: "🎁", dark: false },
    { color: VOLT, label: "5x", dark: true },
    { color: "#111111", label: "●", dark: false },
    { color: "#202020", label: "★", dark: false },
  ];
  return (
    <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="rl-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f0f0f" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
        <radialGradient id="rl-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={VOLT} stopOpacity="0.12" />
          <stop offset="100%" stopColor={VOLT} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="150" fill="url(#rl-bg)" />
      <ellipse cx="100" cy="78" rx="88" ry="72" fill="url(#rl-glow)" />

      {/* Roda — center (100, 80), outer r=64, segment r=60 */}
      <g transform="translate(100 80)">
        <circle r="66" fill="#1a1a1a" stroke="#ffffff18" strokeWidth="1.5" />
        {slices.map((s, i) => {
          const start = (i * 60 - 90) * (Math.PI / 180);
          const end = ((i + 1) * 60 - 90) * (Math.PI / 180);
          const r = 62;
          const x1 = r * Math.cos(start);
          const y1 = r * Math.sin(start);
          const x2 = r * Math.cos(end);
          const y2 = r * Math.sin(end);
          const mid = ((i * 60 + 30) - 90) * (Math.PI / 180);
          const lr = 40;
          const lx = lr * Math.cos(mid);
          const ly = lr * Math.sin(mid);
          return (
            <g key={i}>
              <path
                d={`M 0 0 L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                fill={s.color}
                stroke="#ffffff10"
                strokeWidth="0.8"
              />
              <text
                x={lx} y={ly + 4}
                fill={s.dark ? DARK : "#FFFFFF"}
                fontSize="13" fontWeight="900" fontFamily={FONT_DISPLAY} textAnchor="middle"
              >
                {s.label}
              </text>
            </g>
          );
        })}
        <circle r="62" fill="none" stroke="#ffffff30" strokeWidth="1.5" />
        <circle r="13" fill="#0a0a0a" stroke={VOLT} strokeWidth="2" />
        <circle r="6" fill={VOLT} />
      </g>

      {/* Ponteiro */}
      <path d="M 100 13 L 92 0 L 108 0 Z" fill={VOLT} stroke="#0A0A0A" strokeWidth="0.8" />
    </svg>
  );
}

// ============ 2. RASPADINHA ============
function RaspadinhaScreen() {
  return (
    <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="rs-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f0f0f" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
        <linearGradient id="rs-cover" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2a2a2a" />
          <stop offset="50%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#111111" />
        </linearGradient>
      </defs>
      <rect width="200" height="150" fill="url(#rs-bg)" />

      {/* Card */}
      <rect x="18" y="14" width="164" height="122" rx="8" fill={SURFACE2} />
      <rect x="18" y="14" width="164" height="122" rx="8" fill="none" stroke={VOLT} strokeOpacity="0.18" strokeWidth="1" />

      {/* Área revelada */}
      <text x="100" y="67" fill={VOLT} fontSize="7" fontWeight="700" fontFamily={FONT_SANS} textAnchor="middle" letterSpacing="2">
        VOCÊ GANHOU
      </text>
      <text x="100" y="98" fill="#FFFFFF" fontSize="30" fontWeight="900" fontFamily={FONT_DISPLAY} textAnchor="middle">
        R$ 50
      </text>

      {/* Camada parcialmente raspada */}
      <path
        d="M 18 14 L 18 136 L 50 136 Q 62 105 56 74 Q 72 46 92 40 Q 112 34 134 44 Q 156 38 162 64 Q 172 94 176 118 L 182 136 L 182 14 Z"
        fill="url(#rs-cover)"
        opacity="0.9"
      />
      {/* Textura de raspagem */}
      <g stroke={VOLT} strokeWidth="1.4" strokeLinecap="round" opacity="0.35">
        <line x1="38" y1="54" x2="58" y2="48" />
        <line x1="42" y1="68" x2="62" y2="62" />
        <line x1="44" y1="82" x2="60" y2="77" />
        <line x1="142" y1="50" x2="160" y2="46" />
        <line x1="146" y1="64" x2="162" y2="60" />
        <line x1="148" y1="78" x2="162" y2="74" />
      </g>
      {/* Cursor raspando */}
      <circle cx="60" cy="74" r="7" fill="#FFFFFF" fillOpacity="0.08" stroke={VOLT} strokeWidth="1" strokeOpacity="0.55" />
    </svg>
  );
}

// ============ 3. CAÇA-NÍQUEL ============
function CacaNiquelScreen() {
  return (
    <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="cn-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f0f0f" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
        <linearGradient id="cn-frame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>
      <rect width="200" height="150" fill="url(#cn-bg)" />

      {/* Frame */}
      <rect x="12" y="10" width="164" height="130" rx="10" fill="url(#cn-frame)" />
      <rect x="18" y="16" width="152" height="118" rx="7" fill="#0A0A0A" />

      {/* 3 reels */}
      {[0, 1, 2].map((i) => {
        const x = 26 + i * 50;
        const symbols = ["7", "★", "7"];
        const colors = ["#FCD34D", VOLT, "#FCD34D"];
        return (
          <g key={i}>
            <rect x={x} y="22" width="44" height="100" rx="4" fill={SURFACE2} />
            <rect x={x} y="22" width="44" height="100" rx="4" fill="none" stroke="#ffffff12" strokeWidth="0.8" />
            {/* Symbol above (faded) */}
            <text x={x + 22} y="56" fill={colors[i]} fillOpacity="0.28" fontSize="22" fontWeight="900" fontFamily={FONT_DISPLAY} textAnchor="middle">{symbols[i]}</text>
            {/* Main symbol */}
            <text x={x + 22} y="92" fill={colors[i]} fontSize="32" fontWeight="900" fontFamily={FONT_DISPLAY} textAnchor="middle">{symbols[i]}</text>
            {/* Symbol below (faded) */}
            <text x={x + 22} y="120" fill={colors[i]} fillOpacity="0.28" fontSize="22" fontWeight="900" fontFamily={FONT_DISPLAY} textAnchor="middle">{symbols[i]}</text>
          </g>
        );
      })}

      {/* Win line */}
      <line x1="18" y1="78" x2="182" y2="78" stroke={VOLT} strokeWidth="0.8" strokeDasharray="3 2" opacity="0.55" />

      {/* Alavanca */}
      <rect x="180" y="44" width="6" height="58" rx="3" fill="#B45309" />
      <circle cx="183" cy="42" r="8" fill="#FCD34D" stroke="#B45309" strokeWidth="1" />
    </svg>
  );
}

// ============ 4. PLINKO ============
function PlinkoScreen() {
  return (
    <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="pk-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f0f0f" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
        <radialGradient id="pk-ball" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="60%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#B45309" />
        </radialGradient>
        <radialGradient id="pk-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={VOLT} stopOpacity="0.09" />
          <stop offset="100%" stopColor={VOLT} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="150" fill="url(#pk-bg)" />
      <ellipse cx="100" cy="75" rx="90" ry="55" fill="url(#pk-glow)" />

      {/* Frame */}
      <rect x="20" y="6" width="160" height="128" rx="6" fill="#FFFFFF" fillOpacity="0.02" stroke={VOLT} strokeOpacity="0.18" strokeWidth="1" />

      {/* Pinos */}
      {(() => {
        const pegs: { cx: number; cy: number }[] = [];
        const baseY = 18;
        const rowSpacing = 13;
        const pegSpacing = 15;
        for (let row = 0; row < 7; row++) {
          const count = row + 3;
          const totalWidth = (count - 1) * pegSpacing;
          const startX = 100 - totalWidth / 2;
          for (let col = 0; col < count; col++) {
            pegs.push({ cx: startX + col * pegSpacing, cy: baseY + row * rowSpacing });
          }
        }
        return pegs.map((p, i) => (
          <g key={i}>
            <circle cx={p.cx} cy={p.cy + 0.6} r="2" fill="#000000" opacity="0.4" />
            <circle cx={p.cx} cy={p.cy} r="2" fill="#FFFFFF" />
            <circle cx={p.cx - 0.5} cy={p.cy - 0.6} r="0.8" fill={VOLT} opacity="0.7" />
          </g>
        ));
      })()}

      {/* Trajetória */}
      <path d="M 100 8 L 93 20 L 104 33 L 91 46 L 103 60 L 90 73 L 100 87 L 90 100" fill="none" stroke="#FCD34D" strokeOpacity="0.45" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="2 3" />

      {/* Bola */}
      <circle cx="90" cy="103" r="4.5" fill="#000000" opacity="0.4" />
      <circle cx="90" cy="101" r="5" fill="url(#pk-ball)" stroke="#0A0A0A" strokeWidth="0.8" />
      <circle cx="88.5" cy="99.5" r="1.3" fill="#FFFFFF" opacity="0.8" />

      {/* Slots */}
      {[
        { mult: "0.2x", color: "#1e1e1e" },
        { mult: "0.5x", color: "#252525" },
        { mult: "1x",   color: "#1a2a00" },
        { mult: "5x",   color: VOLT },
        { mult: "1x",   color: "#1a2a00" },
        { mult: "0.5x", color: "#252525" },
        { mult: "0.2x", color: "#1e1e1e" },
      ].map((s, i) => {
        const sw = 20;
        const x = 22 + i * sw;
        const isJ = s.mult === "5x";
        return (
          <g key={i}>
            <rect x={x} y="116" width={sw - 2} height="16" rx="2" fill={s.color} stroke={isJ ? VOLT : "none"} strokeWidth={isJ ? "1" : "0"} />
            <rect x={x} y="116" width={sw - 2} height="3.5" rx="2" fill="#FFFFFF" fillOpacity="0.12" />
            <text x={x + (sw - 2) / 2} y="127" fill={isJ ? DARK : "#ffffff80"} fontSize="6.5" fontWeight="900" fontFamily={FONT_DISPLAY} textAnchor="middle">{s.mult}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ============ 5. CAIXA MISTERIOSA ============
function CaixaScreen() {
  return (
    <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="cx-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f0f0f" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
      </defs>
      <rect width="200" height="150" fill="url(#cx-bg)" />

      {/* Sparkles */}
      <g fill={VOLT} opacity="0.5">
        <circle cx="22" cy="26" r="1.3" />
        <circle cx="178" cy="36" r="1.5" />
        <circle cx="30" cy="118" r="1" />
        <circle cx="170" cy="122" r="1.1" />
        <text x="14" y="68" fontSize="9">✦</text>
        <text x="172" y="92" fontSize="8">✦</text>
        <text x="174" y="50" fontSize="5">✦</text>
        <text x="16" y="98" fontSize="5">✦</text>
      </g>

      {/* 3 caixas */}
      {[0, 1, 2].map((i) => {
        const x = 22 + i * 56;
        const isCenter = i === 1;
        return (
          <g key={i} transform={`translate(${x} ${isCenter ? 26 : 35})`}>
            <ellipse cx="24" cy="76" rx="22" ry="4" fill="#000000" opacity="0.45" />
            {/* Base */}
            <rect width="48" height="62" rx="4" fill={isCenter ? SURFACE3 : SURFACE2} stroke={isCenter ? VOLT : "#ffffff14"} strokeWidth={isCenter ? "1.5" : "0.8"} />
            {/* Tampa */}
            <rect width="48" height="17" rx="4" fill={isCenter ? "#222222" : "#1a1a1a"} stroke={isCenter ? VOLT : "#ffffff14"} strokeWidth={isCenter ? "1.5" : "0.8"} />
            {/* Fita vertical */}
            <rect x="20" y="-4" width="8" height="68" fill={VOLT} />
            {/* Fita horizontal */}
            <rect x="-2" y="22" width="52" height="7" fill={VOLT} />
            {/* Laço */}
            <ellipse cx="16" cy="-4" rx="7" ry="4.5" fill={VOLT} />
            <ellipse cx="32" cy="-4" rx="7" ry="4.5" fill={VOLT} />
            <circle cx="24" cy="-4" r="4" fill={VOLT} />
            {/* ? */}
            <text x="24" y="56" fill={isCenter ? "#FFFFFF" : "#ffffff60"} fontSize="20" fontWeight="900" fontFamily={FONT_DISPLAY} textAnchor="middle">?</text>
            {isCenter && <ellipse cx="24" cy="38" rx="24" ry="40" fill={VOLT} opacity="0.05" />}
          </g>
        );
      })}
    </svg>
  );
}

// ============ 6. QUIZ ============
function QuizScreen() {
  return (
    <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full">
      <rect width="200" height="150" fill="#0a0a0a" />

      {/* Pergunta */}
      <rect x="14" y="8" width="172" height="42" rx="6" fill={SURFACE2} stroke="#ffffff12" strokeWidth="0.8" />
      <text x="100" y="25" fill={VOLT} fontSize="5.5" fontWeight="700" fontFamily={FONT_DISPLAY} textAnchor="middle" letterSpacing="2">
        PERGUNTA
      </text>
      <text x="100" y="40" fill="#FFFFFF" fontSize="7.5" fontWeight="700" fontFamily={FONT_SANS} textAnchor="middle">
        Em que ano nossa marca foi fundada?
      </text>

      {/* Alternativas */}
      {[
        { y: 58,  letter: "A", text: "1995", selected: false },
        { y: 77,  letter: "B", text: "2003", selected: true  },
        { y: 96,  letter: "C", text: "2010", selected: false },
        { y: 115, letter: "D", text: "2018", selected: false },
      ].map((opt) => (
        <g key={opt.letter}>
          <rect x="14" y={opt.y} width="172" height="16" rx="4" fill={opt.selected ? VOLT : SURFACE2} stroke={opt.selected ? VOLT : "#ffffff12"} strokeWidth="1" />
          <circle cx="24" cy={opt.y + 8} r="5" fill={opt.selected ? DARK : "#ffffff0e"} />
          <text x="24" y={opt.y + 10.5} fill={opt.selected ? VOLT : "#ffffff55"} fontSize="6" fontWeight="800" fontFamily={FONT_DISPLAY} textAnchor="middle">{opt.letter}</text>
          <text x="36" y={opt.y + 10.5} fill={opt.selected ? DARK : "#FFFFFF"} fontSize="7" fontWeight="600" fontFamily={FONT_SANS}>{opt.text}</text>
        </g>
      ))}
    </svg>
  );
}

// ============ 7. FLAPPY ============
function FlappyScreen() {
  return (
    <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full">
      <rect width="200" height="150" fill="#0A0A0A" />

      {/* Subtle grid */}
      <g stroke="#FFFFFF" strokeOpacity="0.025" strokeWidth="0.5">
        {[45, 90, 135].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="150" />)}
        {[38, 75, 112].map((y) => <line key={y} x1="0" y1={y} x2="200" y2={y} />)}
      </g>

      {/* Top / bottom borders */}
      <line x1="0" y1="5" x2="200" y2="5" stroke={VOLT} strokeOpacity="0.28" strokeWidth="1.5" />
      <line x1="0" y1="145" x2="200" y2="145" stroke={VOLT} strokeOpacity="0.28" strokeWidth="1.5" />

      {/* Pipe 1 — top */}
      <rect x="64" y="5" width="22" height="46" fill="#111" stroke={VOLT} strokeWidth="1" />
      <rect x="59" y="45" width="32" height="10" fill="#111" stroke={VOLT} strokeWidth="1" />
      {/* Pipe 1 — bottom */}
      <rect x="59" y="102" width="32" height="10" fill="#111" stroke={VOLT} strokeWidth="1" />
      <rect x="64" y="110" width="22" height="35" fill="#111" stroke={VOLT} strokeWidth="1" />
      {/* Gap glow */}
      <rect x="59" y="55" width="32" height="47" fill={VOLT} fillOpacity="0.04" />

      {/* Pipe 2 — top */}
      <rect x="140" y="5" width="22" height="64" fill="#111" stroke={VOLT} strokeWidth="1" />
      <rect x="135" y="63" width="32" height="10" fill="#111" stroke={VOLT} strokeWidth="1" />
      {/* Pipe 2 — bottom */}
      <rect x="135" y="116" width="32" height="10" fill="#111" stroke={VOLT} strokeWidth="1" />
      <rect x="140" y="124" width="22" height="21" fill="#111" stroke={VOLT} strokeWidth="1" />

      {/* Bird */}
      <g transform="translate(30 80) rotate(-12)">
        <circle r="15" fill={VOLT} fillOpacity="0.18" />
        <circle r="10" fill={VOLT} />
        <circle cx="4" cy="-3.5" r="3" fill="#0A0A0A" />
        <circle cx="5" cy="-4.5" r="1.2" fill="#FFFFFF" />
        <path d="M 10 -2.5 L 17 0 L 10 2.5 Z" fill="#0A0A0A" />
      </g>
    </svg>
  );
}

// ============ 8. JOGO DA MEMÓRIA ============
function MemoriaScreen() {
  const cards = [
    { row: 0, col: 0, state: "matched", icon: "★" },
    { row: 0, col: 1, state: "down",    icon: "" },
    { row: 0, col: 2, state: "up",      icon: "♦" },
    { row: 0, col: 3, state: "down",    icon: "" },
    { row: 1, col: 0, state: "down",    icon: "" },
    { row: 1, col: 1, state: "matched", icon: "★" },
    { row: 1, col: 2, state: "down",    icon: "" },
    { row: 1, col: 3, state: "up",      icon: "♦" },
    { row: 2, col: 0, state: "down",    icon: "" },
    { row: 2, col: 1, state: "down",    icon: "" },
    { row: 2, col: 2, state: "down",    icon: "" },
    { row: 2, col: 3, state: "down",    icon: "" },
  ];
  const cw = 42, ch = 38, gapX = 6, gapY = 8;
  const totalW = 4 * cw + 3 * gapX;
  const totalH = 3 * ch + 2 * gapY;
  const ox = (200 - totalW) / 2;
  const oy = (150 - totalH) / 2;

  return (
    <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full">
      <rect width="200" height="150" fill="#0a0a0a" />
      {cards.map((c) => {
        const x = ox + c.col * (cw + gapX);
        const y = oy + c.row * (ch + gapY);
        if (c.state === "down") {
          return (
            <g key={`${c.row}-${c.col}`}>
              <rect x={x} y={y} width={cw} height={ch} rx="4" fill={SURFACE3} stroke="#ffffff0e" strokeWidth="0.8" />
              <rect x={x + 3} y={y + 3} width={cw - 6} height={ch - 6} rx="2" fill="none" stroke="#ffffff0e" strokeWidth="0.8" />
              <text x={x + cw / 2} y={y + ch / 2 + 5} fill="#ffffff22" fontSize="15" fontWeight="900" fontFamily={FONT_DISPLAY} textAnchor="middle">?</text>
            </g>
          );
        }
        const isMatched = c.state === "matched";
        return (
          <g key={`${c.row}-${c.col}`}>
            <rect x={x} y={y} width={cw} height={ch} rx="4" fill={isMatched ? "#1a2a00" : SURFACE2} stroke={isMatched ? VOLT : "#ffffff22"} strokeWidth={isMatched ? "1.5" : "1"} />
            <text x={x + cw / 2} y={y + ch / 2 + 6} fill={isMatched ? VOLT : "#FFFFFF"} fontSize="17" fontWeight="900" fontFamily={FONT_DISPLAY} textAnchor="middle">{c.icon}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ============ 9. QUEBRA-CABEÇA DA MARCA ============
function QuebraCabecaScreen() {
  return (
    <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full">
      <rect width="200" height="150" fill="#0a0a0a" />

      {/* Tabuleiro 3×3 */}
      <rect x="38" y="8" width="124" height="118" rx="4" fill={SURFACE2} stroke={VOLT} strokeOpacity="0.22" strokeWidth="1" strokeDasharray="3 2" />

      {/* Linha 1 */}
      <rect x="38" y="8"  width="41" height="39" fill={VOLT}     stroke="#0a0a0a" strokeWidth="0.8" />
      <rect x="79" y="8"  width="42" height="39" fill="#a8db1f"  stroke="#0a0a0a" strokeWidth="0.8" />
      <rect x="121" y="8" width="41" height="39" fill={VOLT}     stroke="#0a0a0a" strokeWidth="0.8" />
      {/* Linha 2 */}
      <rect x="38" y="47"  width="41" height="40" fill="#a8db1f" stroke="#0a0a0a" strokeWidth="0.8" />
      <rect x="79" y="47"  width="42" height="40" fill="#8bba00" stroke="#0a0a0a" strokeWidth="0.8" />
      <rect x="121" y="47" width="41" height="40" fill="#a8db1f" stroke="#0a0a0a" strokeWidth="0.8" />
      {/* Linha 3 — 2 peças + 1 vazio */}
      <rect x="38" y="87"  width="41" height="39" fill={VOLT}    stroke="#0a0a0a" strokeWidth="0.8" />
      {/* Espaço vazio */}
      <rect x="79" y="87"  width="42" height="39" fill="none"    stroke="#ffffff28" strokeWidth="1" strokeDasharray="3 2" />
      <rect x="121" y="87" width="41" height="39" fill={VOLT}    stroke="#0a0a0a" strokeWidth="0.8" />

      {/* Letra sobreposta */}
      <text x="100" y="95" fill={DARK} fontSize="54" fontWeight="900" fontFamily={FONT_DISPLAY} textAnchor="middle" opacity="0.38">M</text>

      {/* Peça solta sendo arrastada */}
      <g transform="translate(158 110) rotate(-14)">
        <rect width="30" height="24" fill={VOLT} stroke="#0a0a0a" strokeWidth="0.8" />
      </g>
      {/* Linha indicando destino */}
      <line x1="171" y1="114" x2="100" y2="107" stroke={VOLT} strokeOpacity="0.4" strokeWidth="1.2" strokeDasharray="3 2" />
    </svg>
  );
}

// ============ 10. PEGUE OS ITENS ============
function PegueItensScreen() {
  return (
    <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="pi-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f0f0f" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
      </defs>
      <rect width="200" height="150" fill="url(#pi-bg)" />

      {/* Itens caindo — volt */}
      {([
        [36, 38], [118, 24], [74, 72], [50, 104],
      ] as [number, number][]).map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="11" fill={SURFACE3} stroke={VOLT} strokeWidth="2" />
          <circle cx={cx} cy={cy} r="4.5" fill={VOLT} />
        </g>
      ))}
      {/* Item neutro */}
      <circle cx="160" cy="58" r="11" fill={SURFACE3} stroke="#ffffff28" strokeWidth="2" />
      <circle cx="160" cy="58" r="4.5" fill="#FFFFFF" fillOpacity="0.55" />
      {/* Bomba */}
      <g transform="translate(138 104)">
        <circle r="11" fill="#0A0A0A" stroke="#DC2626" strokeWidth="2" />
        <line x1="-5.5" y1="-5.5" x2="5.5" y2="5.5" stroke="#DC2626" strokeWidth="2.4" />
        <line x1="-5.5" y1="5.5"  x2="5.5" y2="-5.5" stroke="#DC2626" strokeWidth="2.4" />
      </g>

      {/* Trail do gesto */}
      <path d="M 20 140 Q 64 110 108 132 T 182 115" fill="none" stroke={VOLT} strokeWidth="3.2" strokeLinecap="round" opacity="0.85" />
      <path d="M 23 142 Q 67 112 111 134 T 180 117" fill="none" stroke="#FFFFFF" strokeWidth="0.9" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

// ============ 11. FUTEBOL ============
function PenaltiScreen() {
  return (
    <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="pn-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1a0d" />
          <stop offset="100%" stopColor="#071209" />
        </linearGradient>
      </defs>
      <rect width="200" height="150" fill="url(#pn-grass)" />

      {/* Listras do gramado */}
      <g opacity="0.07">
        <rect x="0" y="36" width="200" height="28" fill="#FFFFFF" />
        <rect x="0" y="92" width="200" height="28" fill="#FFFFFF" />
      </g>

      {/* Trave */}
      <rect x="30" y="18" width="140" height="3" fill="#FFFFFF" />
      <rect x="30" y="18" width="3"   height="50" fill="#FFFFFF" />
      <rect x="167" y="18" width="3"  height="50" fill="#FFFFFF" />
      {/* Rede */}
      <g stroke="#FFFFFF" strokeWidth="0.45" opacity="0.3">
        {Array.from({ length: 15 }, (_, i) => (
          <line key={`v${i}`} x1={35 + i * 9} y1="21" x2={35 + i * 9} y2="66" />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={`h${i}`} x1="33" y1={24 + i * 8} x2="167" y2={24 + i * 8} />
        ))}
      </g>

      {/* Goleiro */}
      <g transform="translate(100 50)">
        <rect x="-7" y="4" width="14" height="18" rx="2" fill={VOLT} />
        <circle r="6" fill="#FCD34D" />
        <line x1="-9" y1="7" x2="-18" y2="-3" stroke={VOLT} strokeWidth="4" strokeLinecap="round" />
        <line x1="9"  y1="7" x2="18"  y2="-3" stroke={VOLT} strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* Marca do pênalti */}
      <ellipse cx="100" cy="126" rx="4" ry="2" fill="#FFFFFF" opacity="0.65" />

      {/* Bola */}
      <g transform="translate(100 122)">
        <ellipse cx="0" cy="4.5" rx="8" ry="2.2" fill="#000000" opacity="0.3" />
        <circle r="8" fill="#FFFFFF" stroke="#0A0A0A" strokeWidth="1" />
        <path d="M 0 -8 L 4.5 -3 L 3 4 L -3 4 L -4.5 -3 Z" fill="#0A0A0A" />
      </g>

      {/* Mira */}
      <line x1="100" y1="122" x2="72" y2="32" stroke={VOLT} strokeWidth="1.4" strokeDasharray="3 2" opacity="0.9" />
      <circle cx="72" cy="32" r="5.5" fill="none" stroke={VOLT} strokeWidth="1.8" />
      <circle cx="72" cy="32" r="1.6" fill="#DC2626" />
    </svg>
  );
}

// ============ 12. BATE-TOUPEIRA ============
function BateToupeiraScreen() {
  return (
    <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="bt-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#0a0f14" />
          <stop offset="30%" stopColor="#0d1a10" />
          <stop offset="30%" stopColor="#0a1a0d" />
          <stop offset="100%" stopColor="#071209" />
        </linearGradient>
      </defs>
      <rect width="200" height="150" fill="url(#bt-bg)" />

      {/* Tufos de grama */}
      <g stroke="#1a4a22" strokeWidth="1" strokeLinecap="round">
        <line x1="18" y1="60" x2="21" y2="55" />
        <line x1="23" y1="58" x2="26" y2="53" />
        <line x1="38" y1="74" x2="41" y2="69" />
        <line x1="168" y1="60" x2="171" y2="55" />
        <line x1="178" y1="78" x2="181" y2="73" />
        <line x1="62" y1="132" x2="65" y2="127" />
        <line x1="138" y1="132" x2="141" y2="127" />
      </g>

      {/* 3 buracos */}
      <MiniHole cx={50}  cy={118} />
      <MiniHole cx={100} cy={118} />
      <MiniHole cx={150} cy={118} />

      {/* Toupeira atingida (centro) */}
      <MiniMole cx={100} cy={118} dazed />
      <MiniHammer cx={100} cy={118} />
      <MiniRays cx={100} cy={118} />

      {/* Toupeira saindo (direita) */}
      <MiniMole cx={150} cy={118} accent />

      {/* Bordas dos buracos na frente */}
      <ellipse cx={50}  cy={117} rx="14" ry="2.2" fill="none" stroke="#0A0A0A" strokeOpacity="0.5" strokeWidth="0.8" />
      <ellipse cx={100} cy={117} rx="14" ry="2.2" fill="none" stroke="#0A0A0A" strokeOpacity="0.5" strokeWidth="0.8" />
      <ellipse cx={150} cy={117} rx="14" ry="2.2" fill="none" stroke="#0A0A0A" strokeOpacity="0.5" strokeWidth="0.8" />
    </svg>
  );
}

function MiniHole({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy + 2} rx="16" ry="4"   fill="#5B3A1F" />
      <ellipse cx={cx} cy={cy + 1} rx="14" ry="3.2" fill="#7A4F2A" />
      <ellipse cx={cx} cy={cy}     rx="13" ry="2.6" fill="#1C1917" />
      <ellipse cx={cx} cy={cy + 0.5} rx="11" ry="2" fill="#0A0A0A" />
    </g>
  );
}

function MiniMole({
  cx, cy, accent = false, dazed = false,
}: {
  cx: number; cy: number; accent?: boolean; dazed?: boolean;
}) {
  const fur      = accent ? "#FCD34D" : "#A07248";
  const earInner = accent ? "#B45309" : "#7C5535";
  const furShade = accent ? "#D97706" : "#7C5535";
  return (
    <g>
      <ellipse cx={cx - 6} cy={cy - 23} rx="3.2" ry="2.7" fill={fur} stroke="#0A0A0A" strokeWidth="0.7" />
      <ellipse cx={cx - 6} cy={cy - 22.5} rx="1.6" ry="1.3" fill={earInner} />
      <ellipse cx={cx + 6} cy={cy - 23} rx="3.2" ry="2.7" fill={fur} stroke="#0A0A0A" strokeWidth="0.7" />
      <ellipse cx={cx + 6} cy={cy - 22.5} rx="1.6" ry="1.3" fill={earInner} />
      <path
        d={`M ${cx - 11} ${cy + 2} L ${cx - 11} ${cy - 15} Q ${cx - 11} ${cy - 25} ${cx} ${cy - 25} Q ${cx + 11} ${cy - 25} ${cx + 11} ${cy - 15} L ${cx + 11} ${cy + 2} Z`}
        fill={fur} stroke="#0A0A0A" strokeWidth="0.9" strokeLinejoin="round"
      />
      <ellipse cx={cx} cy={cy - 6} rx="7.5" ry="4.5" fill={furShade} opacity="0.32" />
      <circle cx={cx - 4.5} cy={cy - 15} r="3.2" fill="#FFFFFF" stroke="#0A0A0A" strokeWidth="0.7" />
      <circle cx={cx + 4.5} cy={cy - 15} r="3.2" fill="#FFFFFF" stroke="#0A0A0A" strokeWidth="0.7" />
      {dazed ? (
        <g stroke="#0A0A0A" strokeWidth="0.9" strokeLinecap="round">
          <line x1={cx - 6.5} y1={cy - 17} x2={cx - 2.5} y2={cy - 13} />
          <line x1={cx - 6.5} y1={cy - 13} x2={cx - 2.5} y2={cy - 17} />
          <line x1={cx + 2.5} y1={cy - 17} x2={cx + 6.5} y2={cy - 13} />
          <line x1={cx + 2.5} y1={cy - 13} x2={cx + 6.5} y2={cy - 17} />
        </g>
      ) : (
        <g fill="#0A0A0A">
          <circle cx={cx - 3.5} cy={cy - 14} r="1.2" />
          <circle cx={cx + 5.5} cy={cy - 14} r="1.2" />
        </g>
      )}
      <path d={`M ${cx - 1.8} ${cy - 9.5} L ${cx + 1.8} ${cy - 9.5} L ${cx} ${cy - 6.8} Z`} fill="#1C1917" />
      <g fill="#1C1917">
        <circle cx={cx - 3.8} cy={cy - 7} r="0.35" />
        <circle cx={cx - 5}   cy={cy - 5.8} r="0.35" />
        <circle cx={cx + 3.8} cy={cy - 7} r="0.35" />
        <circle cx={cx + 5}   cy={cy - 5.8} r="0.35" />
      </g>
      {dazed ? (
        <ellipse cx={cx} cy={cy - 4} rx="1.3" ry="1.6" fill="#1C1917" />
      ) : (
        <g>
          <path d={`M ${cx - 2.5} ${cy - 5} Q ${cx} ${cy - 3} ${cx + 2.5} ${cy - 5}`} fill="none" stroke="#0A0A0A" strokeWidth="0.8" strokeLinecap="round" />
          <ellipse cx={cx} cy={cx - 4} rx="1.1" ry="0.6" fill="#FB7185" />
        </g>
      )}
      {accent && !dazed && (
        <text x={cx} y={cy - 30} fontSize="7" textAnchor="middle">⭐</text>
      )}
    </g>
  );
}

function MiniHammer({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g transform={`translate(${cx + 8} ${cy - 26}) rotate(-28)`}>
      <rect x="-1" y="0" width="2.5" height="14" fill="#92400E" stroke="#451A03" strokeWidth="0.4" />
      <rect x="-7" y="-7" width="16" height="6" rx="1" fill="#DC2626" stroke="#0A0A0A" strokeWidth="0.7" />
      <rect x="-7" y="-7" width="16" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.3" />
    </g>
  );
}

function MiniRays({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g fill={VOLT} stroke="#0A0A0A" strokeWidth="0.8" strokeLinejoin="round" opacity="0.95">
      <path
        d={`M ${cx} ${cy - 32} L ${cx + 4} ${cy - 22} L ${cx + 12} ${cy - 21} L ${cx + 6} ${cy - 14} L ${cx + 9} ${cy - 5} L ${cx} ${cy - 9} L ${cx - 9} ${cy - 5} L ${cx - 6} ${cy - 14} L ${cx - 12} ${cy - 21} L ${cx - 4} ${cy - 22} Z`}
      />
    </g>
  );
}
