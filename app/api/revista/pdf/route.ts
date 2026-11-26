import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { getLandingData } from "@/lib/data-service";
import { BOARD_LEVELS, BOARD_LEVEL_ORDER } from "@/lib/board-commitments-data";
import {
  REVISTA_EDITION_META,
  NORMATIVE_MILESTONES,
  TERRITORIAL_AGREEMENTS,
  CHACO_PROJECTION_DATA,
} from "@/lib/revista-data";

export const dynamic = "force-dynamic";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  let browser;
  try {
    const landingData = await getLandingData();
    const commitments = landingData.boardCommitments || [];
    const milestones = landingData.milestones || [];
    const documents = landingData.documents || [];

    const completedMilestones = milestones.filter((m) =>
      m.status.toLowerCase().includes("cumplido")
    ).length;

    const levelRows = BOARD_LEVEL_ORDER.map((code) => {
      const items = commitments.filter((c) => c.nivel === code);
      const meta = BOARD_LEVELS[code];
      const cumplido = items.filter((c) => c.cat === "cumplido").length;
      const proceso = items.filter((c) => c.cat === "proceso").length;
      return {
        title: meta.title,
        total: items.length,
        cumplido,
        proceso,
        note: meta.note,
      };
    });

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Revista Agenda 50/50 - ${escapeHtml(REVISTA_EDITION_META.number)}</title>
  <style>
    @page { size: A4; margin: 16mm 15mm 16mm 15mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1B2533;
      font-size: 10pt;
      line-height: 1.45;
      background: #ffffff;
    }
    .tricolor { display: flex; height: 5px; width: 100%; margin-bottom: 14px; }
    .tricolor div { flex: 1; }
    .header {
      border-bottom: 2px solid #1B2533;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .badge {
      display: inline-block;
      background: #FAF7EE;
      border: 1px solid #c79d47;
      color: #825F21;
      font-weight: 800;
      font-size: 8pt;
      padding: 3px 8px;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    h1 { font-size: 20pt; font-weight: 900; color: #1B2533; line-height: 1.15; }
    .subtitle { margin-top: 6px; font-size: 10pt; color: #475569; }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin: 16px 0;
    }
    .kpi-box {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px;
      background: #FAF8F3;
    }
    .kpi-val { font-size: 16pt; font-weight: 900; color: #1B2533; }
    .kpi-lbl { font-size: 7.5pt; font-weight: 700; color: #64748b; text-transform: uppercase; margin-top: 2px; }
    h2 {
      font-size: 12.5pt;
      font-weight: 900;
      color: #1B2533;
      margin: 18px 0 8px 0;
      padding-bottom: 4px;
      border-bottom: 1px solid #e2e8f0;
    }
    table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 8.8pt; }
    th {
      background: #1B2533;
      color: #ffffff;
      text-align: left;
      padding: 6px 8px;
      font-weight: 800;
    }
    td { padding: 6px 8px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
    tr:nth-child(even) td { background: #f8fafc; }
    .card {
      border: 1px solid #e2e8f0;
      border-left: 4px solid #3ac167;
      border-radius: 8px;
      padding: 10px 12px;
      margin-bottom: 8px;
      page-break-inside: avoid;
    }
    .card-title { font-weight: 800; font-size: 9.8pt; color: #1B2533; }
    .card-meta { font-size: 8pt; font-weight: 700; color: #c79d47; margin-bottom: 4px; }
    ul { margin-left: 16px; margin-top: 4px; }
    li { margin-bottom: 3px; font-size: 8.8pt; color: #334155; }
    .footer {
      margin-top: 18px;
      padding-top: 8px;
      border-top: 1px solid #cbd5e1;
      font-size: 8pt;
      color: #64748b;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="tricolor">
    <div style="background:#dd3146"></div>
    <div style="background:#fcc74f"></div>
    <div style="background:#3ac167"></div>
  </div>

  <div class="header">
    <div class="badge">${escapeHtml(REVISTA_EDITION_META.number)} · ${escapeHtml(REVISTA_EDITION_META.period)}</div>
    <h1>50/50 en Movimiento: ${escapeHtml(REVISTA_EDITION_META.title)}</h1>
    <p class="subtitle">${escapeHtml(REVISTA_EDITION_META.subtitle)}</p>
  </div>

  <div class="kpi-grid">
    <div class="kpi-box">
      <div class="kpi-val" style="color:#3ac167">${completedMilestones}/${milestones.length}</div>
      <div class="kpi-lbl">Hitos Cumplidos</div>
    </div>
    <div class="kpi-box">
      <div class="kpi-val" style="color:#c79d47">${commitments.length}</div>
      <div class="kpi-lbl">Compromisos Totales</div>
    </div>
    <div class="kpi-box">
      <div class="kpi-val">${documents.length}</div>
      <div class="kpi-lbl">Documentos Oficiales</div>
    </div>
    <div class="kpi-box">
      <div class="kpi-val" style="color:#dd3146">9/9</div>
      <div class="kpi-lbl">Gobernaciones Adheridas</div>
    </div>
  </div>

  <h2>1. Distribución de los ${commitments.length} Compromisos por Nivel (Tablero 50/50)</h2>
  <table>
    <thead>
      <tr>
        <th>Nivel de Gobierno / Instancia</th>
        <th>Total</th>
        <th>Cumplidos</th>
        <th>En proceso</th>
        <th>Alcance</th>
      </tr>
    </thead>
    <tbody>
      ${levelRows
        .map(
          (r) => `<tr>
            <td><strong>${escapeHtml(r.title)}</strong></td>
            <td><strong>${r.total}</strong></td>
            <td>${r.cumplido}</td>
            <td>${r.proceso}</td>
            <td>${escapeHtml(r.note)}</td>
          </tr>`
        )
        .join("")}
    </tbody>
  </table>

  <h2>2. Normativa y Acuerdos Promulgados (Julio – Octubre 2026)</h2>
  <table>
    <thead>
      <tr>
        <th>Instrumento</th>
        <th>Fecha</th>
        <th>Alcance e Impacto</th>
      </tr>
    </thead>
    <tbody>
      ${NORMATIVE_MILESTONES.map(
          (n) => `<tr>
          <td><strong>${escapeHtml(n.code)}</strong></td>
          <td>${escapeHtml(n.date)}</td>
          <td><strong>${escapeHtml(n.title)}:</strong> ${escapeHtml(n.impact)}</td>
        </tr>`
        ).join("")}
    </tbody>
  </table>

  <h2>3. Síntesis Territorial y Sectorial (Actas Oficiales)</h2>
  ${TERRITORIAL_AGREEMENTS.map(
          (t) => `<div class="card">
      <div class="card-meta">${escapeHtml(t.city)} · ${escapeHtml(t.date)} · ${escapeHtml(t.actor)}</div>
      <div class="card-title">${escapeHtml(t.headline)}</div>
      <ul>
        ${t.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join("")}
      </ul>
    </div>`
        ).join("")}

  <h2>4. Propuesta Gradual del Gran Chaco (Yacuiba, 06/11/2026)</h2>
  <table>
    <thead>
      <tr><th>Gestión</th><th>Nivel Central (NCE)</th><th>Coparticipación GAD / GAR</th><th>Observación</th></tr>
    </thead>
    <tbody>
      ${CHACO_PROJECTION_DATA.map(
          (p) => `<tr>
          <td><strong>${escapeHtml(p.year)}</strong></td>
          <td>${p.nce}%</td>
          <td>${p.subnacional}%</td>
          <td>${escapeHtml(p.note)}</td>
        </tr>`
        ).join("")}
    </tbody>
  </table>

  <div class="footer">
    <span>Servicio Estatal de Autonomías (SEA) · Portal Agenda 50/50</span>
    <span>Generado el ${escapeHtml(REVISTA_EDITION_META.publishedDate)}</span>
  </div>
</body>
</html>`;

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="Revista-Agenda-5050-Edicion-01.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error generating Revista PDF:", error);
    return NextResponse.json(
      { ok: false, error: "No se pudo generar el PDF ejecutivo." },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close().catch(() => { });
    }
  }
}
