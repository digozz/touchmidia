import { Container } from "@/components/layout/Container";

export function DashboardSection() {
  return (
    <section className="bg-brand-black py-20 md:py-28 overflow-hidden">
      <Container>
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-14">
          <p className="text-xs font-mono font-medium uppercase tracking-[0.25em] text-volt">
            Dashboard tempo real
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-[1.3] tracking-tight text-white sm:text-5xl">
            Você no controle.
          </h2>
          <p className="mt-5 text-base text-white/50">
            Leads capturados, controle de estoque de brindes, participação do público — tudo em tempo real, numa tela só.
          </p>
        </div>

        {/* Dashboard mockup */}
        <div className="relative mx-auto max-w-5xl">
          {/* Glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-10 -top-10 h-40 bg-volt/10 blur-3xl"
          />

          {/* Browser chrome */}
          <div className="relative rounded-xl border border-white/10 bg-[#070707] shadow-2xl shadow-black/60 overflow-hidden">
            {/* Browser top bar */}
            <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#3a3a3a]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#3a3a3a]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#3a3a3a]" />
              <div className="mx-auto flex h-6 w-56 items-center justify-center rounded bg-white/5 font-mono text-[10px] tracking-widest text-white/25">
                app.touchmidia.com
              </div>
            </div>

            {/* Dashboard content */}
            <div className="flex" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {/* Sidebar */}
              <aside className="hidden w-[160px] shrink-0 border-r border-white/5 bg-[#080808] p-4 md:block">
                <div className="mb-3 font-mono text-[8px] tracking-[0.25em] text-white/25">// EVENTO ATIVO</div>
                {[
                  { label: "VISÃO GERAL", active: true },
                  { label: "LEADS", badge: "198" },
                  { label: "JOGADAS", badge: "247" },
                  { label: "TOTENS", badge: "3/4" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`mb-0.5 flex items-center justify-between border-l-2 px-2 py-2 font-mono text-[9px] tracking-[0.18em] ${
                      item.active
                        ? "border-volt bg-[#0d0d0d] text-white"
                        : "border-transparent text-white/35"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-volt" style={{ fontSize: 8 }}>{item.badge}</span>
                    )}
                  </div>
                ))}
                <div className="mb-3 mt-5 font-mono text-[8px] tracking-[0.25em] text-white/25">// CONFIG</div>
                {["PERSONALIZAÇÃO", "PRÊMIOS", "FORMULÁRIO"].map((l) => (
                  <div key={l} className="mb-0.5 border-l-2 border-transparent px-2 py-2 font-mono text-[9px] tracking-[0.18em] text-white/25">
                    {l}
                  </div>
                ))}
              </aside>

              {/* Main */}
              <div className="min-w-0 flex-1 p-5">
                {/* Top bar status */}
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="font-mono text-[8px] tracking-[0.25em] text-white/35 uppercase">EVENTO · 042</div>
                    <div className="mt-1 font-display text-sm font-bold leading-tight text-white">
                      Congresso Brasileiro de Automóveis
                      <span className="ml-2 font-normal text-white/40">Estande BYD · São Paulo</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 border border-volt/40 px-2 py-0.5 font-mono text-[8px] tracking-[0.18em] text-volt">
                        <span className="h-1.5 w-1.5 rounded-full bg-volt" />
                        EVENTO AO VIVO
                      </span>
                      <span className="border border-white/10 px-2 py-0.5 font-mono text-[8px] tracking-[0.18em] text-white/35">SP · SÃO PAULO EXPO</span>
                      <span className="border border-white/10 px-2 py-0.5 font-mono text-[8px] tracking-[0.18em] text-white/35">ROLETA PREMIADA</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.2em] text-[#22c55e]">
                      <span className="h-2 w-2 rounded-full bg-[#22c55e]" style={{ boxShadow: "0 0 6px #22c55e" }} />
                      SYNC · LIVE
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.18em] text-white/25">14:32:08 BRT</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="h-1.5 w-full overflow-hidden bg-white/5">
                    <div className="h-full w-[62%] bg-gradient-to-r from-volt to-[#9FD61A]" />
                  </div>
                  <div className="mt-1 flex justify-between font-mono text-[8px] tracking-[0.18em] text-white/25">
                    <span>04 MAI</span>
                    <span>62% CONCLUÍDO</span>
                    <span>07 MAI</span>
                  </div>
                </div>

                {/* KPIs */}
                <div className="mb-1 grid grid-cols-4 gap-px bg-white/5">
                  {[
                    { label: "JOGADAS", value: "247", delta: "+18/H", foot: "HOJE · 247", accent: false },
                    { label: "LEADS", value: "198", delta: "+14/H", foot: "TAXA · 80%", accent: true },
                    { label: "PRÊMIOS", value: "61", delta: null, foot: "RESTAM · 139", accent: false },
                    { label: "TOTENS", value: "3/4", delta: null, foot: "1 OFFLINE", accent: false },
                  ].map((kpi) => (
                    <div key={kpi.label} className="bg-[#0c0c0c] p-4">
                      <div className="flex items-start justify-between font-mono text-[8px] tracking-[0.22em] text-white/35 uppercase">
                        <span>{kpi.label}</span>
                        {kpi.delta && <span className="text-volt">{kpi.delta}</span>}
                      </div>
                      <div
                        className={`mt-2 font-display text-3xl font-bold leading-none tracking-tight ${kpi.accent ? "text-volt" : "text-white"}`}
                      >
                        {kpi.value}
                      </div>
                      <div className="mt-2 font-mono text-[8px] tracking-[0.14em] text-white/25">{kpi.foot}</div>
                    </div>
                  ))}
                </div>

                {/* Chart + Leads */}
                <div className="grid grid-cols-[1.6fr_1fr] gap-px bg-white/5">
                  {/* Chart */}
                  <div className="bg-[#0c0c0c] p-4">
                    <div className="mb-3 font-mono text-[9px] tracking-[0.22em] text-white/50 uppercase">Atividade · últimas 12h</div>
                    <svg viewBox="0 0 300 80" className="w-full" preserveAspectRatio="none">
                      {/* Grid lines */}
                      {[20, 40, 60].map((y) => (
                        <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                      ))}
                      {/* Area fill */}
                      <defs>
                        <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#C6FF3D" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#C6FF3D" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,72 L25,65 L50,68 L75,58 L100,48 L125,42 L150,38 L175,30 L200,22 L225,18 L250,25 L275,20 L300,15 L300,80 L0,80 Z"
                        fill="url(#chart-fill)"
                      />
                      {/* Line */}
                      <path
                        d="M0,72 L25,65 L50,68 L75,58 L100,48 L125,42 L150,38 L175,30 L200,22 L225,18 L250,25 L275,20 L300,15"
                        fill="none"
                        stroke="#C6FF3D"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="mt-1 flex justify-between font-mono text-[7px] tracking-[0.15em] text-white/20">
                      {["02H", "04H", "06H", "08H", "10H", "12H", "14H"].map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </div>

                  {/* Leads table */}
                  <div className="bg-[#0c0c0c] p-4">
                    <div className="mb-3 font-mono text-[9px] tracking-[0.22em] text-white/50 uppercase">Leads recentes</div>
                    <div className="flex flex-col gap-0">
                      {[
                        { name: "Ana Paula M.", game: "ROLETA", result: "GANHOU", ago: "2m" },
                        { name: "Carlos R.", game: "ROLETA", result: "MISS", ago: "4m" },
                        { name: "Fernanda S.", game: "ROLETA", result: "GANHOU", ago: "7m" },
                        { name: "Lucas T.", game: "ROLETA", result: "GANHOU", ago: "9m" },
                        { name: "Mariana O.", game: "ROLETA", result: "MISS", ago: "12m" },
                      ].map((lead) => (
                        <div key={lead.name} className="flex items-center justify-between border-b border-white/[0.04] py-2">
                          <div>
                            <div className="text-[11px] font-medium text-white">{lead.name}</div>
                            <div className="font-mono text-[8px] tracking-[0.12em] text-white/30">{lead.game}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`border px-1.5 py-0.5 font-mono text-[8px] tracking-[0.18em] ${
                                lead.result === "GANHOU"
                                  ? "border-volt/35 bg-volt/[0.06] text-volt"
                                  : "border-white/10 text-white/30"
                              }`}
                            >
                              {lead.result}
                            </span>
                            <span className="font-mono text-[8px] text-white/25">{lead.ago}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom fade */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-brand-black to-transparent"
          />
        </div>
      </Container>
    </section>
  );
}
