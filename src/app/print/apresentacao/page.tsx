import { games, CATEGORY_LABELS } from "@/content/games";
import { GameMockup } from "@/components/games/GameMockup";

export const dynamic = "force-static";

export default function ApresentacaoPrintPage() {
  return (
    <>
      <style
        // print-only stylesheet
        dangerouslySetInnerHTML={{
          __html: `
            @page {
              size: A4 portrait;
              margin: 0;
            }
            html, body {
              background: #0A0A0A !important;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .page {
              width: 210mm;
              height: 297mm;
              padding: 18mm 16mm 16mm;
              box-sizing: border-box;
              page-break-after: always;
              break-after: page;
              display: flex;
              flex-direction: column;
              background: #0A0A0A;
              color: #fff;
              position: relative;
              overflow: hidden;
            }
            .page:last-child { page-break-after: auto; break-after: auto; }
            .page-bg {
              position: absolute;
              inset: 0;
              background:
                radial-gradient(60% 50% at 50% 0%, rgba(198,255,61,0.06), transparent 70%),
                #0A0A0A;
              pointer-events: none;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              position: relative;
              z-index: 1;
            }
            .brand {
              font-family: var(--font-space-grotesk), sans-serif;
              font-weight: 900;
              letter-spacing: 0.18em;
              font-size: 11px;
              color: #C6FF3D;
            }
            .page-num {
              font-family: var(--font-jetbrains), monospace;
              font-size: 10px;
              color: rgba(255,255,255,0.45);
              letter-spacing: 0.1em;
            }
            .category-chip {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 5px 10px;
              border: 1px solid rgba(198,255,61,0.3);
              border-radius: 999px;
              font-family: var(--font-space-grotesk), sans-serif;
              font-size: 9px;
              font-weight: 700;
              letter-spacing: 0.15em;
              color: #C6FF3D;
              text-transform: uppercase;
              margin-top: 18mm;
              align-self: flex-start;
              position: relative;
              z-index: 1;
            }
            .game-name {
              font-family: var(--font-space-grotesk), sans-serif;
              font-weight: 900;
              font-size: 56px;
              line-height: 1.0;
              letter-spacing: -0.02em;
              margin: 8px 0 0;
              color: #fff;
              position: relative;
              z-index: 1;
            }
            .short {
              font-family: var(--font-inter), sans-serif;
              font-size: 15px;
              line-height: 1.45;
              color: rgba(255,255,255,0.7);
              margin: 12px 0 0;
              max-width: 165mm;
              position: relative;
              z-index: 1;
            }
            .mockup-wrap {
              margin: 14mm 0 0;
              position: relative;
              z-index: 1;
              border-radius: 16px;
              overflow: hidden;
              box-shadow:
                0 30px 60px -20px rgba(0,0,0,0.6),
                0 0 0 1px rgba(255,255,255,0.06);
              background: #0A0A0A;
            }
            .mockup-wrap > div {
              aspect-ratio: 4 / 3 !important;
              width: 100% !important;
              border-radius: 16px !important;
            }
            .desc-title {
              font-family: var(--font-space-grotesk), sans-serif;
              font-size: 9px;
              font-weight: 700;
              letter-spacing: 0.2em;
              color: #C6FF3D;
              text-transform: uppercase;
              margin-top: 10mm;
              position: relative;
              z-index: 1;
            }
            .desc {
              font-family: var(--font-inter), sans-serif;
              font-size: 11.5px;
              line-height: 1.55;
              color: rgba(255,255,255,0.78);
              margin: 6px 0 0;
              max-width: 178mm;
              position: relative;
              z-index: 1;
            }
            .footer {
              margin-top: auto;
              padding-top: 8mm;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              border-top: 1px solid rgba(255,255,255,0.07);
              font-family: var(--font-inter), sans-serif;
              font-size: 10px;
              color: rgba(255,255,255,0.5);
              position: relative;
              z-index: 1;
            }
            .footer-label {
              font-family: var(--font-space-grotesk), sans-serif;
              font-size: 8px;
              font-weight: 700;
              letter-spacing: 0.18em;
              color: rgba(255,255,255,0.35);
              text-transform: uppercase;
              display: block;
              margin-bottom: 3px;
            }
            .footer-value {
              font-family: var(--font-space-grotesk), sans-serif;
              font-size: 13px;
              font-weight: 700;
              color: #fff;
              letter-spacing: -0.005em;
            }
            .footer-value.phone {
              color: #C6FF3D;
              font-family: var(--font-jetbrains), monospace;
              font-size: 12px;
              letter-spacing: 0.02em;
            }

            /* Cover page */
            .cover {
              padding: 0;
              justify-content: center;
              align-items: center;
              text-align: center;
            }
            .cover .cover-inner {
              position: relative;
              z-index: 1;
              padding: 0 24mm;
            }
            .cover-eyebrow {
              font-family: var(--font-space-grotesk), sans-serif;
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 0.3em;
              color: #C6FF3D;
              margin-bottom: 18px;
            }
            .cover-title {
              font-family: var(--font-space-grotesk), sans-serif;
              font-weight: 900;
              font-size: 88px;
              line-height: 0.95;
              letter-spacing: -0.03em;
              color: #fff;
              margin: 0;
            }
            .cover-title em {
              font-style: normal;
              color: #C6FF3D;
            }
            .cover-subtitle {
              font-family: var(--font-inter), sans-serif;
              font-size: 18px;
              line-height: 1.5;
              color: rgba(255,255,255,0.7);
              margin-top: 24px;
              max-width: 130mm;
              margin-left: auto;
              margin-right: auto;
            }
            .cover-meta {
              margin-top: 56px;
              display: flex;
              justify-content: center;
              gap: 32px;
              font-family: var(--font-jetbrains), monospace;
              font-size: 10px;
              letter-spacing: 0.15em;
              color: rgba(255,255,255,0.45);
              text-transform: uppercase;
            }
            .cover-meta strong {
              color: #C6FF3D;
              font-weight: 700;
            }
          `,
        }}
      />

      {/* Cover */}
      <section className="page cover">
        <div className="page-bg" />
        <div className="cover-inner">
          <div className="cover-eyebrow">TOUCH MIDIA · CATÁLOGO</div>
          <h1 className="cover-title">
            Jogos para <em>totens interativos</em>
          </h1>
          <p className="cover-subtitle">
            12 jogos prontos para personalizar com a sua marca.
            Mais filas no stand, mais leads no CRM.
          </p>
          <div className="cover-meta">
            <span>
              <strong>{games.length}</strong> jogos
            </span>
            <span>3 categorias</span>
            <span>2026</span>
          </div>
        </div>
      </section>

      {games.map((game, idx) => (
        <section className="page" key={game.slug}>
          <div className="page-bg" />

          <div className="header">
            <div className="brand">TOUCH MIDIA</div>
            <div className="page-num">
              {String(idx + 1).padStart(2, "0")} / {String(games.length).padStart(2, "0")}
            </div>
          </div>

          <div className="category-chip">{CATEGORY_LABELS[game.category]}</div>

          <h2 className="game-name">{game.name}</h2>
          <p className="short">{game.shortDescription}</p>

          <div className="mockup-wrap">
            <GameMockup slug={game.slug} />
          </div>

          <div className="desc-title">Sobre o jogo</div>
          <p className="desc">{game.longDescription}</p>

          <div className="footer">
            <div>
              <span className="footer-label">Contato</span>
              <span className="footer-value">Rodrigo Zaranza</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <span className="footer-label">WhatsApp</span>
              <span className="footer-value phone">85 9 8976 1076</span>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
