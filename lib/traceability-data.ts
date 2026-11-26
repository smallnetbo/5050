import { DocumentItem } from "@/lib/agenda-data";
import { BoardCommitmentItem } from "@/lib/board-commitments-data";

export interface NormativeTraceLink {
  id: string;
  normTitle: string;
  normDate: string;
  normSubtitle: string;
  summaryPill: string;
  detailSynthesis: string;
  status: "CUMPLIDO" | "EN PROCESO";
  commitmentId: number;
  commitmentTitle: string;
  commitmentResponsible: string;
  searchHint: string;
  fallbackPdfUrl?: string;
  docMatchKeyword?: string;
}

export const NORMATIVE_TRACE_LINKS: NormativeTraceLink[] = [
  {
    id: "ds-5686-prft",
    normTitle: "D.S. N° 5686",
    normDate: "31/08/2026",
    normSubtitle: "Programa de Readecuación Financiera Territorial (PRFT)",
    summaryPill: "Decreto promulgado · Saneamiento fiscal",
    detailSynthesis:
      "Crea el Programa de Readecuación Financiera Territorial (PRFT) para permitir a gobernaciones y municipios reprogramar obligaciones financieras y ordenar sus balances fiscales sin paralizar servicios públicos.",
    status: "CUMPLIDO",
    commitmentId: 16,
    commitmentTitle: "Alivio Fiscal / Reprogramación de Deuda GAD y GAM",
    commitmentResponsible: "MEFP",
    searchHint: "PRFT",
    fallbackPdfUrl: "/uploads/timeline/ds56862091ncpp-1791820824168.pdf",
  },
  {
    id: "ley-154",
    normTitle: "Ley N° 154 (Proyecto de Ley)",
    normDate: "Plazo 90 días · Sucre",
    normSubtitle: "Dominio Tributario Subnacional",
    summaryPill: "Anteproyecto elaborado · Ampliación tributaria",
    detailSynthesis:
      "Modifica la Ley N° 154 de Clasificación y Definición de Impuestos para ampliar la potestad tributaria de los gobiernos subnacionales, habilitar el impuesto ambiental departamental y fortalecer los ingresos propios.",
    status: "CUMPLIDO",
    commitmentId: 6,
    commitmentTitle: "Creación y modificación de impuestos propios para GAD y GAM",
    commitmentResponsible: "MEFP + SEA + GAD + GAM",
    searchHint: "Ley N° 154",
  },
  {
    id: "ley-699",
    normTitle: "Ley N° 699 (Proyecto de Ley)",
    normDate: "Mandato Sucre / Cobija",
    normSubtitle: "Nuevo marco de Relacionamiento Internacional",
    summaryPill: "Proyecto consensuado · Cooperación directa",
    detailSynthesis:
      "Sustituye la Ley N° 699 de Relacionamiento Internacional para agilizar el acceso de las Entidades Territoriales Autónomas a cooperación internacional, tecnología, inversiones y financiamiento externo.",
    status: "CUMPLIDO",
    commitmentId: 11,
    commitmentTitle: "Acceso ágil de ETAs a cooperación internacional y financiamiento externo",
    commitmentResponsible: "Min. RREE + SEA + GAD + GAM",
    searchHint: "Ley N° 699",
  },
  {
    id: "leyes-1755-1763-1771",
    normTitle: "Leyes N° 1755, 1763 y 1771",
    normDate: "Jul – Sep 2026",
    normSubtitle: "Modificaciones PGE 2026, Ley 492 y Financiamiento de Obligaciones",
    summaryPill: "3 Leyes promulgadas · Alivio y concurrencia",
    detailSynthesis:
      "Paquete legislativo ya promulgado: Ley 1755 (flexibilidad financiera PGE 2026), Ley 1763 (reforma a la Ley 492 de acuerdos intergubernativos) y Ley 1771 (adecuación de obligaciones públicas y liberación de prediarios a gobernaciones).",
    status: "CUMPLIDO",
    commitmentId: 21,
    commitmentTitle: "Equilibrio de responsabilidades, inversión concurrente y sostenibilidad fiscal",
    commitmentResponsible: "NCE + ALP + GAD + GAM",
    searchHint: "Incremento techo presupuestario",
    fallbackPdfUrl:
      "/uploads/timeline/l17712108ncpp-1791818186397-1795463201854.pdf",
  },
  {
    id: "ley-767-fpieeh",
    normTitle: "Ley N° 767 (FPIEEH)",
    normDate: "Actas Porongo / SAM 16/11",
    normSubtitle: "Fondo de Promoción a la Inversión en Exploración y Explotación Hidrocarburífera",
    summaryPill: "En mesa técnica · Devolución 12% FPIEEH",
    detailSynthesis:
      "Evaluación técnica y normativa para suspender la retención del 12% del FPIEEH a los GAM en 2027, iniciar la devolución de saldos retenidos y viabilizar la devolución inmediata de recursos de la gestión 2026.",
    status: "EN PROCESO",
    commitmentId: 1,
    commitmentTitle: "Viabilidad de suspensión/devolución del 12% y devolución de recursos 2026",
    commitmentResponsible: "Min. Hidrocarburos + MEFP",
    searchHint: "FPIEEH",
    docMatchKeyword: "SISTEMA ASOCIATIVO",
  },
  {
    id: "ley-app",
    normTitle: "Ley de Alianzas Público Privadas (APP)",
    normDate: "En construcción técnica",
    normSubtitle: "Proyecto de Ley de Inversión Conjunta",
    summaryPill: "En proceso · Infraestructura público-privada",
    detailSynthesis:
      "Elaboración del marco normativo nacional que habilita a los GAD y GAM a estructurar Alianzas Público-Privadas (APP) para obras de desarrollo territorial manteniendo reglas de sostenibilidad fiscal.",
    status: "EN PROCESO",
    commitmentId: 10,
    commitmentTitle: "Asociación de GAD y GAM con el sector privado para obras públicas",
    commitmentResponsible: "MEFP + Min. Planificación + GAD + GAM",
    searchHint: "Alianzas Público Privadas",
    docMatchKeyword: "Acuerdo N° 001/2026",
  },
];

export function resolveTracePdfUrl(
  link: NormativeTraceLink,
  documents: DocumentItem[]
): string | null {
  if (link.fallbackPdfUrl) return link.fallbackPdfUrl;
  if (link.docMatchKeyword) {
    const found = documents.find((d) =>
      d.title.toUpperCase().includes(link.docMatchKeyword!.toUpperCase())
    );
    if (found?.fileUrl) return found.fileUrl;
  }
  return null;
}

export function resolveMatchedBoardItem(
  link: NormativeTraceLink,
  commitments: BoardCommitmentItem[]
): BoardCommitmentItem | undefined {
  return (
    commitments.find((c) => c.id === link.commitmentId) ||
    commitments.find((c) =>
      `${c.tematica} ${c.entregable}`.toLowerCase().includes(link.searchHint.toLowerCase())
    )
  );
}
