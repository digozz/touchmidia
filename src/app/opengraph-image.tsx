import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TOUCH MIDIA — Totens Interativos com Jogos para Eventos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(800px 500px at 80% -10%, rgba(198,255,61,0.18), transparent 60%), #0A0A0A",
          color: "#fff",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#C6FF3D",
            fontSize: 22,
            letterSpacing: 6,
            fontWeight: 800,
          }}
        >
          <span>TOUCH MIDIA</span>
          <span style={{ color: "rgba(255,255,255,0.35)" }}>·</span>
          <span style={{ color: "rgba(255,255,255,0.55)", letterSpacing: 4 }}>
            JOGOS PARA TOTENS
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: -40 }}>
          <span
            style={{
              fontSize: 96,
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
            }}
          >
            Stand cheio.
          </span>
          <span
            style={{
              fontSize: 96,
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              marginTop: 8,
            }}
          >
            Leads no CRM.
          </span>
          <span
            style={{
              fontSize: 96,
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              marginTop: 8,
              color: "#C6FF3D",
            }}
          >
            Marca na cabeça.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "rgba(255,255,255,0.6)",
            fontSize: 24,
          }}
        >
          <span style={{ maxWidth: 760, lineHeight: 1.35 }}>
            12 jogos prontos para personalizar com a sua marca. Captura de leads em tempo real.
          </span>
          <span
            style={{
              padding: "10px 22px",
              borderRadius: 999,
              background: "#C6FF3D",
              color: "#0A0A0A",
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: "-0.01em",
            }}
          >
            touchmidia.com
          </span>
        </div>
      </div>
    ),
    size,
  );
}
