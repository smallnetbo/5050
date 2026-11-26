import { Milestone, MediaItem, DocumentItem } from "@/lib/agenda-data";
import { BoardCommitmentItem } from "@/lib/board-commitments-data";

export interface TerritorialPin {
  id: string;
  city: string;
  departmentId: string;
  departmentName: string;
  lon: number;
  lat: number;
  date: string;
  title: string;
  actor: string;
  summary: string;
  keyFigures: string[];
  pdfUrl: string;
  pdfLabel: string;
  revistaHref: string;
  revistaLabel: string;
  accent: "emerald" | "gold" | "red";
}

export type ActorBlock = "all" | "nce" | "gad" | "gam" | "chaco" | "gaioc";

export interface SocialPlate {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  heroStat: string;
  heroStatLabel: string;
  bullets: string[];
  footerNote: string;
  accent: "emerald" | "gold" | "red";
  copyScript: string;
}

export const TERRITORIAL_PINS: TerritorialPin[] = [
  {
    id: "sucre",
    city: "Sucre",
    departmentId: "CH",
    departmentName: "Chuquisaca",
    lon: -65.2627,
    lat: -19.0196,
    date: "5 de agosto de 2026",
    title: "Acuerdo N° 001/2026 — Casa de la Libertad",
    actor: "Presidente del Estado + 9 Gobernaciones",
    summary:
      "Firma fundacional de la Agenda 50/50. Fija 13 temáticas prioritarias: ampliación del dominio tributario (Ley 154 en 90 días), eliminación de condicionalidades de gasto, alivio fiscal y Ley Especial de Coparticipación para 2027.",
    keyFigures: [
      "9/9 Gobernaciones adheridas",
      "13 temáticas estructurales",
      "Meta: Gestión Fiscal 2027",
    ],
    pdfUrl: "/Acuerdo-001-2026-Agenda-50-50.pdf",
    pdfLabel: "Acuerdo N° 001/2026 (PDF)",
    revistaHref: "/revista#prologo",
    revistaLabel: "Leer Prólogo en Revista",
    accent: "gold",
  },
  {
    id: "lapaz",
    city: "La Paz",
    departmentId: "LP",
    departmentName: "La Paz",
    lon: -68.1193,
    lat: -16.4897,
    date: "29/09/2026 y 16/11/2026",
    title: "Acuerdo N° 002/2026 (Capitales/El Alto) y Acta SAM",
    actor: "Gobierno Nacional + AMB + Sistema Asociativo Municipal",
    summary:
      "Pacto de 3 ejes con ciudades capitales y El Alto con enfoque diferenciado, seguido por el Acta del 16 de noviembre que compromete la devolución en 2026 del FPIEEH 2026 y 8 mesas técnicas hasta el 11 de diciembre.",
    keyFigures: [
      "10 ciudades principales (AMB)",
      "Devolución FPIEEH 2026",
      "8 mesas técnicas (23/11–11/12)",
    ],
    pdfUrl:
      "/uploads/documents/acuerdo-n-002-2026-agenda-50-50-1791410091154-1795209355642.pdf",
    pdfLabel: "Acuerdo N° 002/2026 (PDF)",
    revistaHref: "/revista#capitulo-2",
    revistaLabel: "Ir a Cap. 02: Municipios",
    accent: "emerald",
  },
  {
    id: "vinto",
    city: "Vinto",
    departmentId: "CB",
    departmentName: "Cochabamba",
    lon: -66.3167,
    lat: -17.3975,
    date: "12 de septiembre de 2026",
    title: "Encuentro CONAIOC / Autonomías Indígenas (GAIOC)",
    actor: "Viceministerio de Autonomías + SEA + CONAIOC",
    summary:
      "Siete GAIOC constituidas y dos en trámite conformaron el Consejo Asesor Permanente, plantearon 3 deudas históricas (justicia indígena, consulta previa y gestión propia) y un Fondo Compensatorio para GAIOC vulnerables.",
    keyFigures: [
      "7 GAIOC + 2 en trámite",
      "Consejo Asesor Permanente",
      "Reforma Ley N° 031",
    ],
    pdfUrl:
      "/uploads/documents/acta-de-reuni-n-entre-el-viceministerio-de-autonom-as-y-tierras-con-la-conaioc-1791837355925-1795209480938.pdf",
    pdfLabel: "Acta CONAIOC Vinto (PDF)",
    revistaHref: "/revista#capitulo-4",
    revistaLabel: "Ir a Cap. 04: GAIOC",
    accent: "emerald",
  },
  {
    id: "porongo",
    city: "Porongo",
    departmentId: "SC",
    departmentName: "Santa Cruz",
    lon: -63.3106,
    lat: -17.8506,
    date: "23 de septiembre de 2026",
    title: "Pacto FAM-Bolivia / AMDEs y Alivio Municipal",
    actor: "FAM-Bolivia + AMDEs + MEFP + Vocería Presidencial",
    summary:
      "Acuerdo en 4 puntos: aplicación preferente del PRFT (D.S. 5686), consulta por el no débito y devolución del 12% FPIEEH, y medidas de mitigación por el diésel (D.S. 5716) con fideicomiso y USD 100 millones en obras.",
    keyFigures: [
      "USD 100M inversión municipal",
      "12% FPIEEH (Ley 767)",
      "PRFT preferente (D.S. 5686)",
    ],
    pdfUrl:
      "/uploads/documents/acta---reunio-n-sam-gob-23-09-26-1791464202091-1795209428355.pdf",
    pdfLabel: "Acta FAM Porongo (PDF)",
    revistaHref: "/revista#capitulo-2",
    revistaLabel: "Ir a Cap. 02: Municipios",
    accent: "gold",
  },
  {
    id: "cobija",
    city: "Cobija",
    departmentId: "PD",
    departmentName: "Pando",
    lon: -68.7692,
    lat: -11.0267,
    date: "12 de octubre de 2026",
    title: "Conclusiones Departamentales desde la Amazonía",
    actor: "Gobernaciones (GAD) + Ministerios del NCE",
    summary:
      "Mandato conjunto para presentar el Proyecto de Ley Especial de Coparticipación, revisar el 12% del IDH (Ley 767), redactar la Ley Básica de Relacionamiento Internacional (reemplazo Ley 699) y concluir la reforma a la Ley 154.",
    keyFigures: [
      "Ley Especial Coparticipación",
      "Reemplazo Ley N° 699",
      "Reforma Ley N° 154",
    ],
    pdfUrl:
      "/uploads/documents/conclusiones---reuni-n-de-cobija--pando-1791839198715-2-1795209524955.pdf",
    pdfLabel: "Conclusiones Cobija (PDF)",
    revistaHref: "/revista#capitulo-1",
    revistaLabel: "Ir a Cap. 01: NCE y GAD",
    accent: "emerald",
  },
  {
    id: "yacuiba",
    city: "Yacuiba",
    departmentId: "TJ",
    departmentName: "Tarija (Gran Chaco)",
    lon: -63.6775,
    lat: -22.0164,
    date: "6 de noviembre de 2026",
    title: "Acta Técnica Regional del Gran Chaco (4 Ejes)",
    actor: "GARGCH + Viceministerio de Autonomías + SEA",
    summary:
      "Propuesta gradual de reducción del NCE (70%→65%→60%) y coparticipación subnacional (5%→10%→15%) en 5 impuestos; denuncia de la paradoja vial (17% Vías Bolivia / 83% ABC); piloto de salud y transferencia directa ref. D.S. 331.",
    keyFigures: [
      "Fórmula 70% / 65% / 60%",
      "Peajes: 17% Vías Bolivia / 83% ABC",
      "Transferencia directa ref. D.S. 331",
    ],
    pdfUrl: "/uploads/documents/acta-te-cnica-gar-gran-chaco-1795209586476.pdf",
    pdfLabel: "Acta Gran Chaco (PDF)",
    revistaHref: "/revista#capitulo-3",
    revistaLabel: "Ir a Cap. 03: Gran Chaco",
    accent: "red",
  },
];

export const ACTOR_FILTER_LABELS: { id: ActorBlock; label: string }[] = [
  { id: "all", label: "Todos los hitos" },
  { id: "nce", label: "Nivel Central / Leyes" },
  { id: "gad", label: "Gobernaciones (GAD)" },
  { id: "gam", label: "Municipios (GAM/FAM)" },
  { id: "chaco", label: "Gran Chaco" },
  { id: "gaioc", label: "GAIOC / CONAIOC" },
];

export function classifyMilestoneBlock(m: Milestone): ActorBlock[] {
  const text = `${m.title} ${m.detail} ${(m.participants || []).join(" ")}`.toLowerCase();
  const blocks: ActorBlock[] = [];
  if (text.includes("ley ") || text.includes("d.s.") || text.includes("censo") || text.includes("coparticipación")) {
    blocks.push("nce");
  }
  if (text.includes("gad") || text.includes("sucre") || text.includes("gobernador") || text.includes("154")) {
    blocks.push("gad");
  }
  if (text.includes("municipio") || text.includes("alcalde") || text.includes("fam") || text.includes("002/2026")) {
    blocks.push("gam");
  }
  if (text.includes("yacuiba") || text.includes("chaco")) {
    blocks.push("chaco");
  }
  if (text.includes("conaioc") || text.includes("gaioc")) {
    blocks.push("gaioc");
  }
  return blocks.length > 0 ? blocks : ["nce"];
}

export function matchMilestoneVideo(m: Milestone, videos: MediaItem[]): MediaItem | null {
  const t = m.title.toLowerCase();
  if (t.includes("sucre") || t.includes("001/2026")) {
    return videos.find((v) => v.id === "v-4" || v.title.toLowerCase().includes("firma")) || null;
  }
  if (t.includes("1771")) {
    return (
      videos.find((v) => v.title.includes("1771")) ||
      videos.find((v) => v.title.toLowerCase().includes("prediarios")) ||
      null
    );
  }
  if (t.includes("5686") || t.includes("prft")) {
    return videos.find((v) => v.title.includes("5686")) || null;
  }
  if (t.includes("5738") || t.includes("bachiller")) {
    return videos.find((v) => v.title.includes("5738")) || null;
  }
  if (t.includes("municipio") || t.includes("alcalde") || t.includes("002/2026")) {
    return videos.find((v) => v.id === "v-3") || null;
  }
  return videos.find((v) => v.title.toLowerCase().includes("portales")) || videos[0] || null;
}

export function findMilestonePdf(m: Milestone, documents: DocumentItem[]): { name: string; url: string } | null {
  if (m.documents && m.documents.length > 0 && m.documents[0].url) {
    return { name: m.documents[0].name, url: m.documents[0].url };
  }
  const t = m.title.toLowerCase();
  if (t.includes("001/2026") || t.includes("sucre")) {
    return { name: "Acuerdo N° 001/2026 (PDF)", url: "/Acuerdo-001-2026-Agenda-50-50.pdf" };
  }
  if (t.includes("002/2026")) {
    const doc = documents.find((d) => d.title.includes("002/2026"));
    if (doc?.fileUrl) return { name: doc.title, url: doc.fileUrl };
  }
  if (t.includes("conaioc")) {
    const doc = documents.find((d) => d.title.toUpperCase().includes("CONAIOC"));
    if (doc?.fileUrl) return { name: doc.title, url: doc.fileUrl };
  }
  if (t.includes("yacuiba")) {
    const doc = documents.find((d) => d.title.toUpperCase().includes("GRAN CHACO"));
    if (doc?.fileUrl) return { name: doc.title, url: doc.fileUrl };
  }
  if (t.includes("16/11/2026") || t.includes("cuatro pilares")) {
    const doc = documents.find((d) => d.title.toUpperCase().includes("SISTEMA ASOCIATIVO"));
    if (doc?.fileUrl) return { name: doc.title, url: doc.fileUrl };
  }
  return null;
}

export function buildSocialPlates(
  commitments: BoardCommitmentItem[],
  milestones: Milestone[],
  documents: DocumentItem[]
): SocialPlate[] {
  const totalCommitments = commitments.length;
  const completedMilestones = milestones.filter((m) =>
    m.status.toLowerCase().includes("cumplido")
  ).length;
  const inProgressCommitments = commitments.filter(
    (c) => c.cat === "cumplido" || c.cat === "proceso"
  ).length;

  return [
    {
      id: "balance-general",
      category: "Placa 01 · Balance General",
      title: "La Agenda 50/50 avanza con hechos hacia 2027",
      subtitle: "Seguimiento oficial del pacto fiscal y autonómico de Bolivia",
      heroStat: `${totalCommitments}`,
      heroStatLabel: "Compromisos oficiales en 6 niveles de gobierno",
      bullets: [
        `${completedMilestones} de ${milestones.length} hitos de la Ruta Crítica ya cumplidos.`,
        `${inProgressCommitments} compromisos cumplidos o en ejecución activa.`,
        `${documents.length} acuerdos y actas oficiales publicados con transparencia.`,
        "Meta nacional: Aplicación de la Gestión Fiscal 50/50 el 01/01/2027.",
      ],
      footerNote: "Fuente: Tablero Oficial Agenda 50/50 · SEA Bolivia",
      accent: "emerald",
      copyScript: `📊 BALANCE AGENDA 50/50 RUMBO AL 2027\n\nYa son ${totalCommitments} compromisos monitoreados en 6 niveles de gobierno (NCE, Gobernaciones, Municipios, CONAIOC y Gran Chaco) y ${completedMilestones} de ${milestones.length} hitos cumplidos desde la Firma de Sucre.\n\nConoce el avance en vivo en agenda50-50.sea.gob.bo/ruta-viva`,
    },
    {
      id: "leyes-decretos",
      category: "Placa 02 · Resultados Normativos",
      title: "De los acuerdos a la Gaceta Oficial",
      subtitle: "Leyes y Decretos Supremos promulgados entre julio y octubre de 2026",
      heroStat: "5",
      heroStatLabel: "Normas nacionales promulgadas en tiempo récord",
      bullets: [
        "Ley N° 1755 (30/07): Flexibilidad financiera PGE 2026 para las ETA.",
        "D.S. N° 5686 (31/08): Programa de Readecuación Financiera Territorial (PRFT).",
        "Ley N° 1763 (17/09) y Ley N° 1771 (30/09): Alivio de obligaciones y prediarios.",
        "D.S. N° 5738 (05/10): Diploma de Bachiller gratuito y digital.",
      ],
      footerNote: "Fuente: Repositorio Normativo Agenda 50/50 · SEA",
      accent: "gold",
      copyScript: `⚖️ LO QUE YA ES LEY EN LA AGENDA 50/50\n\nLa Agenda 50/50 ya se traduce en normas concretas:\n✅ Ley 1755 (PGE 2026 flexible)\n✅ D.S. 5686 (Saneamiento financiero PRFT)\n✅ Ley 1763 y Ley 1771 (Alivio de obligaciones y prediarios)\n✅ D.S. 5738 (Diploma de Bachiller digital)\n\nDescarga los textos oficiales en agenda50-50.sea.gob.bo/ruta-viva`,
    },
    {
      id: "fpieeh-municipal",
      category: "Placa 03 · Alivio Municipal",
      title: "Liquidez y obras para los municipios del país",
      subtitle: "Acuerdos de Porongo (FAM/AMDEs) y Sistema Asociativo Municipal (16/11)",
      heroStat: "USD 100M",
      heroStatLabel: "En obras de inversión municipal + devolución del 12% FPIEEH",
      bullets: [
        "Propuesta del Min. Hidrocarburos para devolver el FPIEEH 2026 de ejecución inmediata.",
        "Consulta técnica para suspender el débito del 12% del FPIEEH en 2027.",
        "Aplicación preferente del PRFT (D.S. 5686) para reprogramación de deudas.",
        "8 mesas técnicas municipales en curso del 23/11 al 11/12.",
      ],
      footerNote: "Fuente: Actas FAM Porongo (23/09) y SAM La Paz (16/11)",
      accent: "emerald",
      copyScript: `🏛️ MÁS RECURSOS Y ALIVIO PARA LOS MUNICIPIOS\n\nTras los acuerdos con FAM-Bolivia, AMB y el Sistema Asociativo Municipal:\n💧 Devolución de recursos del FPIEEH 2026\n🏗️ USD 100 millones para inversión municipal\n📉 Reprogramación de deudas vía PRFT (D.S. 5686)\n\nDetalles en agenda50-50.sea.gob.bo/ruta-viva`,
    },
    {
      id: "territorios-movimiento",
      category: "Placa 04 · Territorios en Movimiento",
      title: "Gran Chaco y GAIOC trazan la ruta territorial",
      subtitle: "Propuestas concretas desde Yacuiba (06/11) y Vinto (12/09)",
      heroStat: "70→60%",
      heroStatLabel: "Reducción gradual del NCE propuesta en Yacuiba (2027–2029)",
      bullets: [
        "Gran Chaco: Coparticipación gradual 5%→10%→15% sobre 5 impuestos nacionales.",
        "Paradoja vial: revisión del esquema 17% Vías Bolivia / 83% ABC.",
        "CONAIOC (Vinto): 7 GAIOC constituidas + 2 en trámite en Consejo Asesor.",
        "Fondo Compensatorio propuesto para GAIOC vulnerables y reforma Ley 031.",
      ],
      footerNote: "Fuente: Actas Oficiales de Vinto (12/09) y Yacuiba (06/11)",
      accent: "red",
      copyScript: `🗺️ BOLIVIA CONSTRUYE EL 50/50 DESDE SUS REGIONES\n\n📍 Yacuiba (Gran Chaco): Propuesta gradual 70/65/60 al 2029 y transferencia directa.\n📍 Vinto (CONAIOC): 7+2 GAIOC activan Consejo Asesor Permanente y Fondo Compensatorio.\n\nExplora el mapa interactivo en agenda50-50.sea.gob.bo/ruta-viva`,
    },
  ];
}
