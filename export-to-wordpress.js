// ============================================================
// export-to-wordpress.js
// Convierte el repositorio smallnetbo/5050 a WXR para WordPress
// Uso: node export-to-wordpress.js
// ============================================================

const fs = require('fs');
const https = require('https');

const BASE_URL = 'https://raw.githubusercontent.com/smallnetbo/5050/main';

// ── 1. DESCARGA DE ARCHIVOS FUENTE ─────────────────────────
async function fetchFile(path) {
  return new Promise((resolve, reject) => {
    https.get(`${BASE_URL}/${path}`, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} para ${path}`));
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// ── 2. EXTRACTOR DE ARRAYS TYPESCRIPT (regex simple) ───────
function extractArray(tsCode, varName) {
  const regex = new RegExp(`export\\s+(?:const|let|var)\\s+${varName}\\s*[:=]\\s*(\\[[\\s\\S]*?\\]);`, 'm');
  const match = tsCode.match(regex);
  if (!match) return [];
  
  // Convertir TS básico a JS evaluable
  let jsonLike = match[1]
    .replace(/:\s*\w+/g, '')           // quita anotaciones de tipo simples
    .replace(/\[\s*\]/g, '[]')         // arrays vacíos
    .replace(/,\s*\]/g, ']')           // trailing commas
    .replace(/,\s*}/g, '}');           // trailing commas en objetos
  
  try {
    return eval('(' + jsonLike + ')');
  } catch (e) {
    console.warn(`⚠️ No se pudo parsear ${varName}, usando fallback.`);
    return [];
  }
}

// ── 3. GENERADORES DE HTML PARA CADA SECCIÓN ───────────────
function escapeCdata(str) {
  return str.replace(/]]>/g, ']]]]><![CDATA[>');
}

function page(title, slug, html, order, cats = []) {
  const id = 100 + order;
  const catXml = cats.map(c => `      <category domain="category" nicename="${c}"><![CDATA[${c.charAt(0).toUpperCase() + c.slice(1)}]]></category>`).join('\n');
  
  return `    <item>
      <title><![CDATA[${title}]]></title>
      <link>https://agenda5050.gob.bo/${slug}/</link>
      <pubDate>Tue, 05 Aug 2026 00:00:00 +0000</pubDate>
      <dc:creator><![CDATA[admin]]></dc:creator>
      <guid isPermaLink="false">https://agenda5050.gob.bo/?page_id=${id}</guid>
      <description></description>
      <content:encoded><![CDATA[${escapeCdata(html)}]]></content:encoded>
      <excerpt:encoded><![CDATA[${escapeCdata(title)}]]></excerpt:encoded>
      <wp:post_id>${id}</wp:post_id>
      <wp:post_date>2026-08-05 00:00:00</wp:post_date>
      <wp:post_date_gmt>2026-08-05 00:00:00</wp:post_date_gmt>
      <wp:comment_status>closed</wp:comment_status>
      <wp:ping_status>closed</wp:ping_status>
      <wp:post_name><![CDATA[${slug}]]></wp:post_name>
      <wp:status>publish</wp:status>
      <wp:post_parent>0</wp:post_parent>
      <wp:menu_order>${order}</wp:menu_order>
      <wp:post_type>page</wp:post_type>
${catXml}
    </item>`;
}

function heroSection() {
  return `
<div style="background:#1B2533; color:#fff; padding:48px 32px; border-radius:24px; margin-bottom:32px;">
  <div style="display:inline-flex; align-items:center; gap:8px; background:rgba(197,155,39,0.15); border:1px solid rgba(197,155,39,0.4); padding:6px 16px; border-radius:20px; margin-bottom:24px;">
    <span style="width:10px; height:10px; background:#C59B27; border-radius:50%;"></span>
    <span style="font-size:11px; font-weight:900; text-transform:uppercase; letter-spacing:0.1em; color:#fcd34d;">Acuerdo N° 001/2026 · Sucre, 5 de Agosto de 2026</span>
  </div>
  <h1 style="font-size:42px; font-weight:900; color:#fff; line-height:1.15; margin:0 0 16px 0;">UNA NUEVA RELACIÓN<br><span style="color:#38A169;">CON MÁS AUTONOMÍA PARA MÁS DESARROLLO</span></h1>
  <div style="width:80px; height:4px; background:#C59B27; border-radius:2px; margin-bottom:16px;"></div>
  <p style="font-size:18px; color:#cbd5e1; font-weight:500; max-width:700px; margin:0 0 24px 0;"><strong style="color:#fcd34d;">Más autonomía, Más capacidad de decisión.</strong> Estrategia de Estado para la distribución equitativa de ingresos, la autonomía tributaria, la sostenibilidad fiscal y la desconcentración efectiva del gasto entre el Nivel Central y las Regiones.</p>
  <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:24px;">
    <a href="/?page_id=107" style="display:inline-flex; align-items:center; gap:8px; background:#2D8A4E; color:#fff; font-weight:800; padding:14px 20px; border-radius:16px; text-decoration:none;">📄 Leer Acuerdo 001/2026</a>
    <a href="/?page_id=104" style="display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,0.1); color:#fff; font-weight:800; padding:14px 20px; border-radius:16px; text-decoration:none; border:1px solid rgba(255,255,255,0.15);">🗺️ Explorar Datos Deptos</a>
    <a href="/?page_id=103" style="display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,0.1); color:#fff; font-weight:800; padding:14px 20px; border-radius:16px; text-decoration:none; border:1px solid rgba(255,255,255,0.15);">⏱️ Ver Cronograma</a>
  </div>
  <div style="display:flex; flex-wrap:wrap; gap:24px; font-size:13px; font-weight:700; color:#94a3b8; border-top:1px solid rgba(255,255,255,0.1); padding-top:16px;">
    <span>✅ 9 de 9 GAD Adheridos</span>
    <span>🛡️ Meta 2027: Ley Coparticipación</span>
    <span>🏛️ Municipios, AIOC &amp; Gran Chaco</span>
  </div>
</div>
<div style="background:#f8fafc; border:1px solid #e2e8f0; padding:24px; border-radius:20px; margin-bottom:32px;">
  <h3 style="font-size:14px; font-weight:900; text-transform:uppercase; letter-spacing:0.1em; color:#0f172a; margin-bottom:16px;">📹 Video Oficial 50/50</h3>
  <p style="font-size:14px; color:#475569; margin:0;"><strong>Fortalecimiento de las Autonomías</strong> — Construyendo un Estado más eficiente con la participación de municipios y autoridades de todo el país.</p>
  <div style="margin-top:12px; display:grid; grid-template-columns:1fr 1fr; gap:12px;">
    <div style="background:#fff; border:1px solid #e2e8f0; padding:12px; border-radius:12px;"><div style="font-size:10px; font-weight:700; color:#64748b; text-transform:uppercase;">Sede Histórica</div><div style="font-size:13px; font-weight:900; color:#d97706; margin-top:2px;">Casa de la Libertad</div></div>
    <div style="background:#fff; border:1px solid #e2e8f0; padding:12px; border-radius:12px;"><div style="font-size:10px; font-weight:700; color:#64748b; text-transform:uppercase;">Plazo Ley 154</div><div style="font-size:13px; font-weight:900; color:#059669; margin-top:2px;">90 Días Calendario</div></div>
  </div>
</div>`;
}

function monitorSection() {
  return `
<h2 style="font-size:36px; font-weight:900; color:#0f172a; margin-bottom:16px;">Monitor 50/50 &amp; Tablero en Vivo</h2>
<p style="font-size:16px; color:#475569; font-weight:500; max-width:700px; margin-bottom:32px;">Seguimiento transparente a los hitos del Acuerdo N° 001/2026 de Sucre y simulador pedagógico de recursos fiscales.</p>

<div style="background:linear-gradient(135deg, #0F2942, #1E3A8A); color:#fff; padding:32px; border-radius:24px; margin-bottom:32px;">
  <h3 style="color:#fbbf24; font-size:12px; font-weight:900; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:8px;">Hito Prioritario en Curso</h3>
  <h4 style="font-size:24px; font-weight:900; margin-bottom:8px;">Cuenta Regresiva: Anteproyecto de Ley N° 154</h4>
  <p style="color:#cbd5e1; font-size:14px; margin-bottom:16px;">La Mesa Técnica Jurídica-Fiscal tiene como mandato entregar la propuesta de reforma del dominio tributario autonómico.</p>
  <div style="display:flex; gap:12px; flex-wrap:wrap;">
    <div style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.15); padding:16px; border-radius:16px; text-align:center; min-width:70px;"><div style="font-size:28px; font-weight:900; color:#fbbf24;">76</div><div style="font-size:10px; font-weight:700; color:#94a3b8; text-transform:uppercase;">Días</div></div>
    <div style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.15); padding:16px; border-radius:16px; text-align:center; min-width:70px;"><div style="font-size:28px; font-weight:900;">14</div><div style="font-size:10px; font-weight:700; color:#94a3b8; text-transform:uppercase;">Horas</div></div>
    <div style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.15); padding:16px; border-radius:16px; text-align:center; min-width:70px;"><div style="font-size:28px; font-weight:900;">32</div><div style="font-size:10px; font-weight:700; color:#94a3b8; text-transform:uppercase;">Mins</div></div>
    <div style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.15); padding:16px; border-radius:16px; text-align:center; min-width:70px;"><div style="font-size:28px; font-weight:900; color:#34d399;">45</div><div style="font-size:10px; font-weight:700; color:#94a3b8; text-transform:uppercase;">Segs</div></div>
  </div>
</div>

<h3 style="font-size:20px; font-weight:900; color:#0f172a; margin-bottom:20px;">Indicadores Clave</h3>
<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:16px; margin-bottom:32px;">
  <div style="background:#fff; border:1px solid #e2e8f0; padding:24px; border-radius:24px;"><div style="font-size:28px; font-weight:900; color:#0f172a;">9/9 GAD</div><div style="font-size:14px; font-weight:800; color:#1e293b; margin-top:4px;">Gobernaciones Adheridas</div><p style="font-size:12px; color:#64748b; margin-top:8px;">100% de los Gobiernos Autónomos Departamentales firmaron el Acuerdo de Sucre.</p></div>
  <div style="background:#fff; border:1px solid #e2e8f0; padding:24px; border-radius:24px;"><div style="font-size:28px; font-weight:900; color:#0f172a;">90 Días</div><div style="font-size:14px; font-weight:800; color:#1e293b; margin-top:4px;">Plazo Máximo Ley 154</div><p style="font-size:12px; color:#64748b; margin-top:8px;">Plazo límite para la entrega del anteproyecto de modificación del dominio tributario.</p></div>
  <div style="background:#fff; border:1px solid #e2e8f0; padding:24px; border-radius:24px;"><div style="font-size:28px; font-weight:900; color:#0f172a;">Gestión 2027</div><div style="font-size:14px; font-weight:800; color:#1e293b; margin-top:4px;">Ley de Coparticipación</div><p style="font-size:12px; color:#64748b; margin-top:8px;">Entrada en vigencia de la nueva distribución fiscal y fórmula equitativa.</p></div>
  <div style="background:#fff; border:1px solid #e2e8f0; padding:24px; border-radius:24px;"><div style="font-size:28px; font-weight:900; color:#0f172a;">5 Comisiones</div><div style="font-size:14px; font-weight:800; color:#1e293b; margin-top:4px;">Mesas Técnicas Activas</div><p style="font-size:12px; color:#64748b; margin-top:8px;">Equipos de hacienda, jurídica, tributaria, alivio de deuda y competencias sesionando.</p></div>
  <div style="background:#fff; border:1px solid #e2e8f0; padding:24px; border-radius:24px;"><div style="font-size:28px; font-weight:900; color:#0f172a;">1 Reporte</div><div style="font-size:14px; font-weight:800; color:#1e293b; margin-top:4px;">Principio Reporte Único</div><p style="font-size:12px; color:#64748b; margin-top:8px;">Desburocratización y canal único de información fiscal ante el MEFP.</p></div>
  <div style="background:#fff; border:1px solid #e2e8f0; padding:24px; border-radius:24px;"><div style="font-size:28px; font-weight:900; color:#0f172a;">7 Instrumentos</div><div style="font-size:14px; font-weight:800; color:#1e293b; margin-top:4px;">Vías de Implementación</div><p style="font-size:12px; color:#64748b; margin-top:8px;">Proyectos de ley, decretos, convenios intergubernativos y reglamentos.</p></div>
</div>

<div style="background:#fff; border:1px solid #e2e8f0; padding:32px; border-radius:32px;">
  <h3 style="font-size:22px; font-weight:900; color:#0f172a; margin-bottom:8px;">Simulador de Distribución de Recursos Fiscales</h3>
  <p style="font-size:14px; color:#475569; margin-bottom:20px;">Desliza la barra para simular el impacto en la distribución presupuestaria anual entre el Estado Central y las autonomías subnacionales.</p>
  <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:20px; border-radius:20px; margin-bottom:20px;">
    <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:800; color:#475569; margin-bottom:8px;"><span>Actual (~15% Subnacional)</span><span style="color:#10b981;">Objetivo 50%</span><span>70% Subnacional</span></div>
    <div style="background:#e2e8f0; height:12px; border-radius:6px; overflow:hidden;"><div style="background:#10b981; width:50%; height:100%;"></div></div>
  </div>
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px;">
    <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:16px; border-radius:16px;"><div style="font-size:12px; font-weight:700; color:#64748b; text-transform:uppercase;">Nivel Central</div><div style="font-size:24px; font-weight:900; color:#0F2942; margin-top:4px;">Bs. 30,000 M</div><div style="font-size:12px; color:#94a3b8; margin-top:4px;">50% del total</div></div>
    <div style="background:#ecfdf5; border:1px solid #a7f3d0; padding:16px; border-radius:16px;"><div style="font-size:12px; font-weight:700; color:#065f46; text-transform:uppercase;">Subnacional (GAD/GAM/AIOC)</div><div style="font-size:24px; font-weight:900; color:#065f46; margin-top:4px;">Bs. 30,000 M</div><div style="font-size:12px; color:#059669; margin-top:4px;">50% del total</div></div>
  </div>
  <div style="background:#fffbeb; border:1px solid #fcd34d; padding:16px; border-radius:16px; font-size:13px; color:#92400e;">
    💡 <strong>Nota explicativa:</strong> En el pacto fiscal 50/50, por cada 100 Bolivianos recaudados en impuestos nacionales y recursos coparticipables, 50 Bolivianos financian directamente las competencias departamentales, municipales y comunitarias.
  </div>
</div>`;
}

function pillarsSection(pillars) {
  let cards = pillars.map((p, i) => `
<div style="background:#f8fafc; border:1px solid #e2e8f0; padding:28px; border-radius:24px;">
  <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
    <div style="background:#0F2942; color:#34d399; width:48px; height:48px; border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:20px;">${['⚖️','🔓','💼','🏛️','📊','📈','🏗️','🌐','🛡️','🪙'][i] || '●'}</div>
    <span style="background:#e2e8f0; padding:4px 12px; border-radius:12px; font-size:11px; font-weight:900; text-transform:uppercase; color:#475569;">${p.category}</span>
  </div>
  <h3 style="font-size:18px; font-weight:900; color:#0f172a; margin-bottom:8px;">${p.id}. ${p.title}</h3>
  <p style="font-size:13px; color:#475569; margin-bottom:12px;">${p.summary}</p>
  <ul style="font-size:13px; color:#334155; padding-left:20px; margin:0;">
    ${p.actions.map(a => `<li>${a}</li>`).join('')}
  </ul>
</div>`).join('');

  return `
<h2 style="font-size:36px; font-weight:900; color:#0f172a; margin-bottom:16px;">Los Pilares Temáticos del Acuerdo</h2>
<p style="font-size:16px; color:#475569; font-weight:500; max-width:700px; margin-bottom:32px;">El Acuerdo N° 001/2026 prioriza estas materias para fortalecer las autonomías y garantizar la equidad fiscal.</p>
<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:20px;">
  ${cards}
</div>`;
}

function timelineSection(milestones) {
  const statusColor = {
    'Cumplido': ['#10b981', '#dcfce7', '#166534'],
    'En proceso': ['#f59e0b', '#fef3c7', '#92400e'],
    'Programado': ['#64748b', '#f1f5f9', '#475569'],
    'Meta': ['#3b82f6', '#dbeafe', '#1e40af']
  };
  
  let cards = milestones.map(m => {
    const [border, bg, text] = statusColor[m.status] || statusColor['Programado'];
    return `
<div style="background:#fff; border:1px solid #e2e8f0; padding:24px; border-radius:24px; border-left:4px solid ${border};">
  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
    <span style="background:${bg}; color:${text}; padding:4px 12px; border-radius:12px; font-size:11px; font-weight:900; text-transform:uppercase;">${m.status}</span>
    <span style="font-size:12px; font-weight:700; color:#64748b;">${m.date}</span>
  </div>
  <div style="font-size:48px; font-weight:900; color:#e2e8f0; line-height:1;">0${m.id}</div>
  <h3 style="font-size:20px; font-weight:900; color:#0f172a; margin-top:4px;">${m.title}</h3>
  <p style="font-size:14px; color:#475569; margin-top:8px;">${m.detail}</p>
  ${m.participants ? `<div style="margin-top:12px; display:flex; flex-wrap:wrap; gap:8px;">${m.participants.map(p => `<span style="background:#f1f5f9; padding:4px 10px; border-radius:8px; font-size:11px; font-weight:700; color:#475569;">${p}</span>`).join('')}</div>` : ''}
</div>`;
  }).join('');

  return `
<h2 style="font-size:36px; font-weight:900; color:#0f172a; margin-bottom:16px;">De la Firma en Sucre a la Ejecución 2027</h2>
<p style="font-size:16px; color:#475569; font-weight:500; max-width:700px; margin-bottom:32px;">Sigue el cronograma evolutivo paso a paso hacia la entrada en vigencia del nuevo régimen autonómico.</p>
<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:20px;">
  ${cards}
</div>`;
}

function territorialSection(deps) {
  let cards = deps.map(d => `
<div style="background:#fff; border:1px solid #e2e8f0; padding:24px; border-radius:24px;">
  <h3 style="font-size:22px; font-weight:900; color:#0f172a;">${d.name}</h3>
  <p style="font-size:12px; color:#64748b; font-weight:600; margin-bottom:12px;">Capital: ${d.capital} · Gobernador: ${d.governor}</p>
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
    <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:12px; border-radius:12px;"><div style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase;">Régimen Fiscal Actual</div><div style="font-size:16px; font-weight:900; color:#0f172a;">${d.currentFiscalRatio}</div></div>
    <div style="background:#10b981; color:#fff; padding:12px; border-radius:12px;"><div style="font-size:11px; font-weight:700; text-transform:uppercase;">Impacto Estimado 50/50</div><div style="font-size:18px; font-weight:900;">${d.target5050Impact}</div></div>
  </div>
  <p style="font-size:13px; color:#475569; margin-bottom:12px;"><strong>Prioridades:</strong> ${d.regionalNotes}</p>
  <div style="display:flex; flex-direction:column; gap:6px;">
    ${d.keyProjects.map(p => `<span style="background:#f1f5f9; padding:6px 10px; border-radius:8px; font-size:12px; font-weight:700; color:#334155;">• ${p}</span>`).join('')}
  </div>
</div>`).join('');

  return `
<h2 style="font-size:36px; font-weight:900; color:#0f172a; margin-bottom:16px;">La Agenda se construye desde los 9 Departamentos</h2>
<p style="font-size:16px; color:#475569; font-weight:500; max-width:700px; margin-bottom:32px;">El Acuerdo contempla articulación con los 9 Gobiernos Autónomos Departamentales, los Gobiernos Municipales, las Autonomías Indígena Originario Campesinas (AIOC) y el Gran Chaco.</p>
<div style="background:#ecfdf5; border:1px solid #a7f3d0; padding:16px; border-radius:16px; display:flex; align-items:center; gap:12px; margin-bottom:32px;">
  <span style="font-size:24px;">🛡️</span>
  <p style="font-size:13px; font-weight:600; color:#065f46; margin:0;"><strong>100% de Adhesión Territorial:</strong> Las 9 Gobernaciones de Bolivia ratificaron el pliego en Sucre el 5 de agosto de 2026.</p>
</div>
<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:20px;">
  ${cards}
</div>`;
}

function documentsSection(docs) {
  const featured = docs.find(d => d.id === 'DOC-001');
  const others = docs.filter(d => d.id !== 'DOC-001');
  
  let othersHtml = others.map(d => `
<div style="background:#fff; border:1px solid #e2e8f0; padding:24px; border-radius:24px;">
  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
    <span style="background:#f1f5f9; padding:4px 12px; border-radius:12px; font-size:10px; font-weight:900; text-transform:uppercase; color:#475569;">${d.category}</span>
    <span style="font-size:12px; font-weight:700; color:#64748b;">${d.date}</span>
  </div>
  <h4 style="font-size:16px; font-weight:900; color:#0f172a; margin-bottom:8px;">${d.title}</h4>
  <p style="font-size:13px; color:#475569; margin-bottom:12px;">${d.description}</p>
  <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; font-weight:700; color:#64748b;">
    <span>${d.fileSize}</span>
    <span style="color:#10b981;">⬇️ ${d.downloadsCount.toLocaleString()} descargas</span>
  </div>
</div>`).join('');

  return `
<h2 style="font-size:36px; font-weight:900; color:#0f172a; margin-bottom:16px;">Centro de Descargas &amp; Normativa</h2>
<p style="font-size:16px; color:#475569; font-weight:500; max-width:700px; margin-bottom:32px;">Acceso libre y transparente a los acuerdos firmados, borradores de proyectos de ley, actas de la comisión y decretos reglamentarios.</p>

<div style="background:linear-gradient(135deg, #0F2942, #1E3A8A); color:#fff; padding:32px; border-radius:32px; margin-bottom:32px; border:2px solid rgba(16,185,129,0.4);">
  <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:12px;">
    <span style="background:#34d399; color:#0F2942; padding:4px 12px; border-radius:6px; font-size:11px; font-weight:900; text-transform:uppercase;">Documento Insignia Oficial</span>
    <span style="font-size:12px; color:#cbd5e1; font-weight:700;">PDF · ${featured.fileSize} · ${featured.downloadsCount.toLocaleString()} Descargas</span>
  </div>
  <h3 style="font-size:24px; font-weight:900; color:#fff; margin-bottom:8px;">${featured.title}</h3>
  <p style="font-size:14px; color:#cbd5e1; margin-bottom:16px;">${featured.description}</p>
  <a href="#" style="display:inline-flex; align-items:center; gap:8px; background:#10b981; color:#fff; font-weight:800; padding:12px 20px; border-radius:16px; text-decoration:none;">📥 Descargar PDF Oficial</a>
</div>

<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:16px;">
  ${othersHtml}
</div>`;
}

function pressSection(news) {
  let cards = news.map(n => `
<div style="background:#fff; border:1px solid #e2e8f0; border-radius:24px; overflow:hidden;">
  <div style="background:#f1f5f9; height:180px; display:flex; align-items:center; justify-content:center; color:#94a3b8; font-size:14px; font-weight:700;">📰 ${n.category}</div>
  <div style="padding:24px;">
    <div style="display:flex; align-items:center; gap:8px; font-size:12px; font-weight:700; color:#64748b; margin-bottom:8px;">
      <span>📅 ${n.date}</span>
      <span>·</span>
      <span>⏱️ ${n.readTime}</span>
    </div>
    <h3 style="font-size:18px; font-weight:900; color:#0f172a; margin-bottom:8px;">${n.title}</h3>
    <p style="font-size:13px; color:#475569; margin-bottom:12px;">${n.summary}</p>
    <span style="font-size:12px; font-weight:800; color:#10b981;">🏷️ ${n.department}</span>
  </div>
</div>`).join('');

  return `
<h2 style="font-size:36px; font-weight:900; color:#0f172a; margin-bottom:16px;">Noticias y Cobertura en Medios</h2>
<p style="font-size:16px; color:#475569; font-weight:500; max-width:700px; margin-bottom:32px;">Información oficial de las sesiones, conferencias de prensa y comunicados emitidos por la Secretaría Técnica del Consejo.</p>
<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:20px;">
  ${cards}
</div>

<div style="background:linear-gradient(135deg, #0F2942, #1E3A8A); color:#fff; padding:32px; border-radius:32px; margin-top:32px; display:flex; flex-wrap:wrap; gap:24px; justify-content:space-between; align-items:center;">
  <div>
    <span style="background:#34d399; color:#0F2942; padding:4px 12px; border-radius:6px; font-size:11px; font-weight:900; text-transform:uppercase;">Recursos para Periodistas</span>
    <h3 style="font-size:22px; font-weight:900; color:#fff; margin-top:8px;">Kit de Prensa Oficial (Press Kit 2026)</h3>
    <p style="font-size:14px; color:#cbd5e1;">Descarga logotipos oficiales vectoriales, fotografías en alta resolución y comunicados editables.</p>
  </div>
  <a href="#" style="display:inline-flex; align-items:center; gap:8px; background:#10b981; color:#fff; font-weight:800; padding:14px 24px; border-radius:16px; text-decoration:none;">📦 Descargar Kit (ZIP 45 MB)</a>
</div>`;
}

function faqSection(faqs) {
  let items = faqs.map((f, i) => `
<div style="background:#f8fafc; border:1px solid #e2e8f0; padding:20px; border-radius:16px; margin-bottom:12px;">
  <h4 style="font-size:16px; font-weight:900; color:#0f172a; margin-bottom:8px;">❓ ${f.question}</h4>
  <p style="font-size:14px; color:#475569; margin:0;">${f.answer}</p>
  <span style="display:inline-block; margin-top:8px; background:#e2e8f0; padding:2px 8px; border-radius:6px; font-size:11px; font-weight:700; color:#475569;">${f.category}</span>
</div>`).join('');

  return `
<h2 style="font-size:36px; font-weight:900; color:#0f172a; margin-bottom:16px;">Preguntas Frecuentes sobre la Agenda 50/50</h2>
<p style="font-size:16px; color:#475569; font-weight:500; max-width:700px; margin-bottom:32px;">Resolvemos las principales dudas sobre el pacto fiscal, el presupuesto y los derechos de las regiones.</p>
<div style="max-width:800px;">
  ${items}
</div>

<div style="background:#f8fafc; border:1px solid #e2e8f0; padding:32px; border-radius:24px; margin-top:32px;">
  <h3 style="font-size:22px; font-weight:900; color:#0f172a; margin-bottom:8px;">📬 Buzón de Propuestas y Aportes</h3>
  <p style="font-size:14px; color:#475569; margin-bottom:20px;">Envía tus sugerencias o propuestas institucionales para ser evaluadas por las Mesas Técnicas.</p>
  <form onsubmit="event.preventDefault(); alert('Propuesta enviada (simulación)');">
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
      <input type="text" placeholder="Nombre Completo" required style="padding:12px; border:1px solid #e2e8f0; border-radius:12px; font-size:14px;">
      <input type="email" placeholder="Correo electrónico" required style="padding:12px; border:1px solid #e2e8f0; border-radius:12px; font-size:14px;">
    </div>
    <select style="padding:12px; border:1px solid #e2e8f0; border-radius:12px; font-size:14px; width:100%; margin-bottom:12px;">
      <option>La Paz</option><option>Santa Cruz</option><option>Cochabamba</option><option>Chuquisaca</option>
      <option>Tarija</option><option>Potosí</option><option>Oruro</option><option>Beni</option><option>Pando</option>
    </select>
    <textarea placeholder="Tu propuesta o consulta" rows="4" required style="padding:12px; border:1px solid #e2e8f0; border-radius:12px; font-size:14px; width:100%; margin-bottom:12px;"></textarea>
    <button type="submit" style="background:#0F2942; color:#fff; font-weight:800; padding:12px 24px; border-radius:12px; border:none; cursor:pointer;">📨 Enviar Propuesta a la Mesa Técnica</button>
  </form>
</div>`;
}

function methodologySection(principles, instruments) {
  return `
<h2 style="font-size:36px; font-weight:900; color:#fff; margin-bottom:16px;">¿Cómo llegar al 50/50?</h2>
<p style="font-size:16px; color:#cbd5e1; font-weight:500; max-width:700px; margin-bottom:32px;">Una metodología común para medir avances. Indicadores objetivos, verificables y comparables para medir progresivamente competencias, sostenibilidad fiscal, gestión institucional y calidad de servicios públicos.</p>

<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px; margin-bottom:32px;">
  <div style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding:24px; border-radius:20px;"><div style="font-size:24px; margin-bottom:12px;">👥</div><div style="font-size:12px; font-weight:900; color:rgba(255,255,255,0.4); margin-bottom:4px;">01</div><div style="font-size:16px; font-weight:900; color:#fff;">Información compartida</div></div>
  <div style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding:24px; border-radius:20px;"><div style="font-size:24px; margin-bottom:12px;">🔀</div><div style="font-size:12px; font-weight:900; color:rgba(255,255,255,0.4); margin-bottom:4px;">02</div><div style="font-size:16px; font-weight:900; color:#fff;">Diagnóstico común</div></div>
  <div style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding:24px; border-radius:20px;"><div style="font-size:24px; margin-bottom:12px;">📈</div><div style="font-size:12px; font-weight:900; color:rgba(255,255,255,0.4); margin-bottom:4px;">03</div><div style="font-size:16px; font-weight:900; color:#fff;">Indicadores comparables</div></div>
  <div style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding:24px; border-radius:20px;"><div style="font-size:24px; margin-bottom:12px;">✅</div><div style="font-size:12px; font-weight:900; color:rgba(255,255,255,0.4); margin-bottom:4px;">04</div><div style="font-size:16px; font-weight:900; color:#fff;">Seguimiento progresivo</div></div>
</div>

<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:32px;">
  <div>
    <h3 style="font-size:20px; font-weight:900; color:#fff; margin-bottom:16px;">Principios</h3>
    <div style="display:flex; flex-wrap:wrap; gap:8px;">
      ${principles.map(p => `<span style="background:rgba(255,255,255,0.1); padding:8px 16px; border-radius:20px; font-size:14px; font-weight:700; color:#fff;">${p}</span>`).join('')}
    </div>
  </div>
  <div>
    <h3 style="font-size:20px; font-weight:900; color:#fff; margin-bottom:16px;">Instrumentos de implementación</h3>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
      ${instruments.map((inst, i) => `<div style="background:rgba(255,255,255,0.1); padding:12px; border-radius:12px; font-size:13px; color:rgba(255,255,255,0.8); font-weight:600;">${i+1}. ${inst}</div>`).join('')}
    </div>
  </div>
</div>`;
}

// ── 4. GENERADOR WXR PRINCIPAL ─────────────────────────────
async function main() {
  console.log('🔍 Descargando datos fuente desde GitHub...');
  
  let agendaData = '';
  try {
    agendaData = await fetchFile('lib/agenda-data.ts');
    console.log('✅ lib/agenda-data.ts descargado');
  } catch (e) {
    console.error('❌ Error descargando agenda-data.ts:', e.message);
    console.log('⚠️ Usando datos embebidos como fallback...');
  }

  // Extraer arrays (con fallback a datos conocidos si el parseo falla)
  let pillars = extractArray(agendaData, 'pillars');
  let milestones = extractArray(agendaData, 'milestones');
  let departmentsData = extractArray(agendaData, 'departmentsData');
  let documentsList = extractArray(agendaData, 'documentsList');
  let newsArticles = extractArray(agendaData, 'newsArticles');
  let faqList = extractArray(agendaData, 'faqList');
  let instruments = extractArray(agendaData, 'instruments');
  let principles = extractArray(agendaData, 'principles');

  // Fallbacks robustos si el regex no funcionó
  if (!pillars.length) pillars = [{"id":1,"title":"Autonomía tributaria y esfuerzo fiscal","category":"Fiscal","summary":"Fortalecer la capacidad de los GAD para generar y administrar ingresos propios.","actions":["Incentivar el esfuerzo fiscal.","Evaluar reclasificación de base imponible.","Revisar sobretasas.","Proyecto de modificación Ley N° 154 en 90 días."]},{"id":2,"title":"Eliminación de condicionalidad de gasto","category":"Fiscal","summary":"Revisión integral y eliminación progresiva de condicionalidades.","actions":["Revisar normas que obligan financiar ítems centrales.","Derogar condicionalidades de estructuras extinguidas."]},{"id":3,"title":"Autonomía de gestión presupuestaria","category":"Institucional","summary":"Reservar al central control de agregados fiscales.","actions":["Sustituir autorizaciones por información transparente.","Implementar Principio de Reporte Único.","Coordinar endeudamiento."]},{"id":4,"title":"Ley Especial de Coparticipación y Distribución 2027","category":"Normativo","summary":"Conformar mesa técnica para redacción de Ley Especial.","actions":["Adecuar transferencias.","Revisar legislación recentralizadora.","Presentar proyecto en gestión 2026."]},{"id":5,"title":"Criterios de distribución de ingresos","category":"Fiscal","summary":"Superar asimetrías históricas.","actions":["Evaluar criterios de compensación.","Coordinar ecualización fiscal."]},{"id":6,"title":"Alivio financiero y readecuación de deudas","category":"Fiscal","summary":"Atender sostenibilidad financiera.","actions":["Reprogramar obligaciones FNDR.","Impulsar Programa de Readecuación Financiera."]},{"id":7,"title":"Alianzas Público-Privadas (APP)","category":"Institucional","summary":"Marco normativo para inversión privada.","actions":["Desarrollar normativa modelo APP.","Establecer salvaguardas fiscales."]},{"id":8,"title":"Relacionamiento internacional y cooperación","category":"Normativo","summary":"Ajustar Ley N° 699.","actions":["Modificar régimen de aprobación previa.","Crear ventanilla única."]},{"id":9,"title":"Protección del régimen autonómico y LMAD","category":"Normativo","summary":"Evitar recentralización.","actions":["Revisar y derogar artículos invasivos.","Crear mecanismo de alerta temprana."]},{"id":10,"title":"Fondos de compensación e incentivos","category":"Fiscal","summary":"Creación de fondos especiales.","actions":["Diseñar Fondo de Compensación Autonómica (FCA).","Vincular incentivos a transparencia."]}];
  
  if (!milestones.length) milestones = [{"id":1,"title":"Diagnóstico técnico Censo 2024","date":"Enero - Julio 2026","status":"Cumplido","detail":"Consolidación de base de datos demográficos y financieros.","participants":["Ministerio de Economía","Viceministerio de Autonomías","Técnicos de 9 GAD"]},{"id":2,"title":"Firma del Acuerdo N° 001/2026 en Sucre","date":"5 de Agosto de 2026","status":"Cumplido","detail":"Firma histórica en la Casa de la Libertad.","participants":["Presidente del Estado","9 Gobernadores","Representantes Municipalistas"]},{"id":3,"title":"Modificación de la Ley N° 154","date":"En curso (Plazo 90 días)","status":"En proceso","detail":"Mesa técnica redactora para ampliación del dominio tributario.","participants":["Comisión Jurídica - Fiscal del Consejo"]},{"id":4,"title":"Redacción de Ley Especial de Coparticipación","date":"Gestión Legislativa 2026","status":"En proceso","detail":"Diseño de fórmulas de reparto 50/50.","participants":["Comisión de Hacienda ALP","Representantes GAD"]},{"id":5,"title":"Encuentros con Municipios, AIOC y Gran Chaco","date":"Septiembre - Octubre 2026","status":"Programado","detail":"Mesas de diálogo territorial.","participants":["FAM-Bolivia","CONAIOC","Gobierno Regional del Gran Chaco"]},{"id":6,"title":"Plenario del Consejo Nacional de Autonomías","date":"Noviembre 2026","status":"Programado","detail":"Aprobación del paquete normativo.","participants":["Consejo Nacional de Autonomías"]},{"id":7,"title":"Aplicación de la Gestión Fiscal 50/50","date":"1 de Enero de 2027","status":"Meta","detail":"Entrada en vigencia del nuevo régimen.","participants":["Estado Plurinacional de Bolivia"]}];
  
  if (!departmentsData.length) departmentsData = [{"id":"LP","name":"La Paz","capital":"Nuestra Señora de La Paz","governor":"Santos Quispe","currentFiscalRatio":"18% Depto / 82% Central","target5050Impact":"+ Bs 1.850 M / año","regionalNotes":"Enfoque en electrificación rural, conectividad industrial del norte e infraestructura de salud.","keyProjects":["Carretera Apolo-Ixiamas","Complejo Agroindustrial Norte","Saneamiento Cuenca Katari"]},{"id":"SC","name":"Santa Cruz","capital":"Santa Cruz de la Sierra","governor":"Mario Aguilera (Interino)","currentFiscalRatio":"14% Depto / 86% Central","target5050Impact":"+ Bs 2.900 M / año","regionalNotes":"Prioridad en autonomía tributaria ambiental, APP y alivio financiero.","keyProjects":["Hub Logístico Viru Viru","Electrificación Provincia Velasco","Mantenimiento Red Vial"]},{"id":"CB","name":"Cochabamba","capital":"Cochabamba","governor":"Humberto Sánchez","currentFiscalRatio":"16% Depto / 84% Central","target5050Impact":"+ Bs 1.400 M / año","regionalNotes":"Énfasis en desarrollo tecnológico, agroindustria del Valle Alto y salud.","keyProjects":["Ciudadela Científica","Riego Trópico y Valles","Hospital Materno Infantil"]},{"id":"CH","name":"Chuquisaca","capital":"Sucre","governor":"Damián Condori","currentFiscalRatio":"15% Depto / 85% Central","target5050Impact":"+ Bs 980 M / año","regionalNotes":"Diversificación económica, agua potable e incentivos turísticos.","keyProjects":["Diagonal Jaime Mendoza","Parque Industrial Sucre","Desarrollo Turístico Patrimonio"]},{"id":"TJ","name":"Tarija","capital":"Tarija","governor":"Oscar Montes","currentFiscalRatio":"21% Depto / 79% Central","target5050Impact":"+ Bs 1.150 M / año","regionalNotes":"Alivio fiscal, reprogramación de fideicomisos e integración Gran Chaco.","keyProjects":["Presea de Alivio Deuda FNDR","Conexión Energética Gran Chaco","Presa San Jacinto"]},{"id":"PT","name":"Potosí","capital":"Potosí","governor":"Marco Antonio Copa","currentFiscalRatio":"19% Depto / 81% Central","target5050Impact":"+ Bs 1.600 M / año","regionalNotes":"Revisión de regalías mineras y proyectos de valor agregado.","keyProjects":["Industrialización de Litio","Aeropuerto Internacional Potosí","Hospital de Tercer Nivel"]},{"id":"OR","name":"Oruro","capital":"Oruro","governor":"Edson Oczachoque","currentFiscalRatio":"17% Depto / 83% Central","target5050Impact":"+ Bs 890 M / año","regionalNotes":"Logística biocéanica, captación tributaria aduanera y energía limpia.","keyProjects":["Puerto Seco Oruro","Planta Fotovoltaica Fase II","Carretera Ancaravi-Turco"]},{"id":"BN","name":"Beni","capital":"Trinidad","governor":"Alejandro Unzueta","currentFiscalRatio":"12% Depto / 88% Central","target5050Impact":"+ Bs 1.250 M / año","regionalNotes":"Infraestructura de integración vial, protección climática y desarrollo ganadero.","keyProjects":["Carretera Trinidad-Guayaramerín","Defensivos de Inundaciones","Complejo Cárnico de Exportación"]},{"id":"PD","name":"Pando","capital":"Cobija","governor":"Regis Richter","currentFiscalRatio":"11% Depto / 89% Central","target5050Impact":"+ Bs 620 M / año","regionalNotes":"Atención prioritaria por rezago histórico, economía amazónica sostenible.","keyProjects":["Puente Binacional Cobija","Electrificación Solar Amazonía","Industrialización de la Castaña"]}];
  
  if (!documentsList.length) documentsList = [{"id":"DOC-001","title":"Acuerdo N° 001/2026 - Firma Sucre 5 de Agosto","category":"Acuerdo","date":"05/08/2026","fileSize":"5.8 MB","description":"Documento oficial completo suscrito por el Presidente y los 9 Gobernadores.","downloadsCount":14250,"featured":true},{"id":"DOC-002","title":"Anteproyecto de Modificación de la Ley N° 154","category":"Proyecto de Ley","date":"12/08/2026","fileSize":"2.4 MB","description":"Borrador de ley para ampliar el dominio tributario departamental.","downloadsCount":8910,"featured":true},{"id":"DOC-003","title":"Matriz del Diagnóstico Fiscal y Financiero Censo 2024","category":"Presentación","date":"01/08/2026","fileSize":"8.1 MB","description":"Presentación técnica sobre distribución actual de recursos.","downloadsCount":6540},{"id":"DOC-004","title":"Reglamento del Principio de Reporte Único Presupuestario","category":"Decreto","date":"14/08/2026","fileSize":"1.8 MB","description":"Lineamientos para simplificación de trámites.","downloadsCount":4200},{"id":"DOC-005","title":"Acta de la I Sesión Extraordinaria de la Comisión de Hacienda Sucre","category":"Acta","date":"06/08/2026","fileSize":"1.1 MB","description":"Acta oficial con acuerdos metodológicos.","downloadsCount":3100},{"id":"DOC-006","title":"Guía Didáctica para el Ciudadano: ¿Qué es la Agenda 50/50?","category":"Presentación","date":"10/08/2026","fileSize":"4.5 MB","description":"Folleto explicativo infográfico.","downloadsCount":11200,"featured":true}];
  
  if (!newsArticles.length) newsArticles = [{"id":"NEWS-101","title":"Sucre marca el inicio de una nueva era autonómica con la firma del Acuerdo 001/2026","date":"5 de Agosto de 2026","category":"Evento","department":"Chuquisaca","summary":"En la histórica Casa de la Libertad, el Gobierno Nacional y las 9 gobernaciones sellaron el compromiso fiscal 50/50.","readTime":"4 min lectura"},{"id":"NEWS-102","title":"Instalan la Mesa Técnica para la reforma prioritaria de la Ley N° 154 en La Paz","date":"12 de Agosto de 2026","category":"Mesa Técnica","department":"La Paz","summary":"Equipos de juristas y economistas revisan los tributos subnacionales.","readTime":"3 min lectura"},{"id":"NEWS-103","title":"Gobernadores evalúan mecanismos de alivio de deuda con el FNDR y banca pública","date":"15 de Agosto de 2026","category":"Comunicado","department":"Tarija","summary":"Se acuerda la reprogramación de fideicomisos para liberar liquidez.","readTime":"5 min lectura"}];
  
  if (!faqList.length) faqList = [{"category":"General","question":"¿Qué es la Agenda 50/50 y cuál es su objetivo principal?","answer":"Estrategia de Estado acordada el 5 de agosto de 2026 en Sucre para reestructurar la relación fiscal y competencial entre el Nivel Central y las autonomías. Su objetivo es alcanzar un equilibrio transparente (50/50) en el esfuerzo, los recursos y las competencias."},{"category":"Pacto Fiscal","question":"¿Cómo afectará la Agenda 50/50 al presupuesto de mi departamento?","answer":"Permitirá a cada GAD captar más ingresos propios, eliminar gastos obligados del Central y recibir mayor coparticipación desde la gestión 2027."},{"category":"Normativa","question":"¿Por qué es crucial modificar la Ley N° 154?","answer":"La Ley N° 154 limita la capacidad de las gobernaciones para crear impuestos propios. Su reforma otorgará verdadero dominio tributario a las regiones."},{"category":"Transparencia","question":"¿Qué es el Principio de Reporte Único?","answer":"Es la simplificación administrativa para reportar datos financieros una sola vez, por un único canal digital y en un solo formato."}];
  
  if (!principles.length) principles = ["Corresponsabilidad Fiscal","Equidad Territorial","Autonomía de Gestión","Transparencia Activa","Reporte Único Abierto","Resultados Verificables"];
  if (!instruments.length) instruments = ["Proyectos de Ley de la ALP","Decretos Supremos de Aplicación","Convenios Intergubernativos","Acuerdos Fiscales Departamentales","Reformas Reglamentarias Locales","Reglamentos de la Ley N° 154","Modelos de Contrato para APP"];

  console.log(`📊 Datos cargados: ${pillars.length} pilares, ${milestones.length} hitos, ${departmentsData.length} deptos, ${documentsList.length} docs, ${newsArticles.length} noticias, ${faqList.length} FAQs`);

  // Construir XML
  const pages = [
    page('Inicio - Agenda 50/50', 'inicio', heroSection(), 0, ['acuerdo']),
    page('Monitor 50/50', 'monitor-5050', monitorSection(), 1, ['monitor']),
    page('Pilares Temáticos', 'pilares', pillarsSection(pillars), 2, ['pilares']),
    page('Ruta de Implementación', 'ruta', timelineSection(milestones), 3, ['ruta']),
    page('Dimensión Territorial', 'territorio', territorialSection(departmentsData), 4, ['territorio']),
    page('Sala de Prensa', 'prensa', pressSection(newsArticles), 5, ['prensa']),
    page('Centro Documental', 'documentos', documentsSection(documentsList), 6, ['documentos']),
    page('FAQ y Buzón Ciudadano', 'faq', faqSection(faqList), 7, ['faq']),
  ];

  const methodologyHtml = methodologySection(principles, instruments);
  pages.push(page('Metodología 50/50', 'metodologia', 
    `<div style="background:#0F2942; color:#fff; padding:48px 32px; border-radius:24px;">${methodologyHtml}</div>`, 
    8, ['acuerdo']));

  const catXml = [
    ['acuerdo','Acuerdo'], ['pilares','Pilares'], ['monitor','Monitor'],
    ['ruta','Ruta'], ['territorio','Territorio'], ['multimedia','Multimedia'],
    ['prensa','Prensa'], ['documentos','Documentos'], ['faq','FAQ'],
    ['fiscal','Fiscal'], ['normativo','Normativo'], ['institucional','Institucional']
  ].map(([slug, name], i) => 
    `    <wp:category><wp:term_id>${i+1}</wp:term_id><wp:category_nicename>${slug}</wp:category_nicename><wp:category_parent></wp:category_parent><wp:cat_name><![CDATA[${name}]]></wp:cat_name></wp:category>`
  ).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
    xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:wfw="http://wellformedweb.org/CommentAPI/"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:wp="http://wordpress.org/export/1.2/">
  <channel>
    <title>Agenda 50/50 - Pacto Fiscal y Autonómico</title>
    <link>https://agenda5050.gob.bo</link>
    <description>Plataforma oficial de transparencia activa, pedagogía ciudadana y monitoreo de la Agenda 50/50</description>
    <pubDate>Tue, 05 Aug 2026 00:00:00 +0000</pubDate>
    <language>es-BO</language>
    <wp:wxr_version>1.2</wp:wxr_version>
    <wp:base_site_url>https://agenda5050.gob.bo</wp:base_site_url>
    <wp:base_blog_url>https://agenda5050.gob.bo</wp:base_blog_url>

    <wp:author>
      <wp:author_id>1</wp:author_id>
      <wp:author_login>admin</wp:author_login>
      <wp:author_email>contacto@economia.gob.bo</wp:author_email>
      <wp:author_display_name><![CDATA[Ministerio de Economía]]></wp:author_display_name>
      <wp:author_first_name><![CDATA[Ministerio]]></wp:author_first_name>
      <wp:author_last_name><![CDATA[de Economía]]></wp:author_last_name>
    </wp:author>

${catXml}

${pages.join('\n\n')}

  </channel>
</rss>`;

  fs.writeFileSync('agenda-5050-wordpress-export.xml', xml, 'utf8');
  console.log('');
  console.log('✅ ¡Exportación completada!');
  console.log('📁 Archivo generado: agenda-5050-wordpress-export.xml');
  console.log('');
  console.log('👉 Pasos para importar en WordPress:');
  console.log('   1. Ve a tu panel de WordPress');
  console.log('   2. Herramientas → Importar → WordPress');
  console.log('   3. Instala el plugin "WordPress Importer" si es necesario');
  console.log('   4. Sube el archivo agenda-5050-wordpress-export.xml');
  console.log('   5. Asigna el autor y marca "Descargar e importar archivos adjuntos"');
  console.log('');
  console.log('📄 Páginas generadas:');
  pages.forEach((p, i) => {
    const title = p.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || `Página ${i+1}`;
    console.log(`   ${i+1}. ${title}`);
  });
}

main().catch(console.error);