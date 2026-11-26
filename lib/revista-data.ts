export interface NormativeCardItem {
  code: string;
  date: string;
  title: string;
  impact: string;
  pdfUrl?: string;
  tag: "Ley" | "Decreto" | "Acuerdo";
}

export interface TerritorialBlock {
  id: string;
  city: string;
  date: string;
  actor: string;
  headline: string;
  highlights: string[];
  pdfUrl?: string;
}

export interface LevelComparisonItem {
  id: string;
  name: string;
  badge: string;
  color: "blue" | "emerald" | "amber" | "purple" | "rose";
  delivers: string[];
  receives: string[];
  keyFigure: string;
}

export interface ChacoProjectionPoint {
  year: string;
  nce: number;
  subnacional: number;
  note: string;
}

export const REVISTA_EDITION_META = {
  number: "Edición N° 01",
  period: "Agosto – Noviembre 2026",
  title: "De Sucre al 2027",
  subtitle:
    "Crónica interactiva de cómo 17 años de autonomía inconclusa comenzaron a ordenarse en leyes, decretos y pactos territoriales rumbo a la Gestión Fiscal 50/50.",
  publishedDate: "26 de noviembre de 2026",
};

export const REVISTA_CHAPTERS = [
  { id: "prologo", num: "00", title: "Prólogo: El Pacto de Sucre" },
  { id: "capitulo-1", num: "01", title: "NCE y Gobernaciones" },
  { id: "capitulo-2", num: "02", title: "Municipios y Capitales" },
  { id: "capitulo-3", num: "03", title: "Gran Chaco: La Propuesta 70/65/60" },
  { id: "capitulo-4", num: "04", title: "Autonomías Indígenas (GAIOC)" },
  { id: "epilogo", num: "05", title: "Rumbo al 1 de Enero 2027" },
];

export const NORMATIVE_MILESTONES: NormativeCardItem[] = [
  {
    code: "Ley N° 1755",
    date: "30 de julio de 2026",
    title: "Modificaciones al Presupuesto General del Estado (PGE) 2026",
    impact:
      "Otorgó mayor flexibilidad financiera e inyección inmediata de recursos a las Entidades Territoriales Autónomas antes de la firma de Sucre.",
    pdfUrl: "/uploads/timeline/l17552078ncpp-1791820399991.pdf",
    tag: "Ley",
  },
  {
    code: "Acuerdo N° 001/2026",
    date: "5 de agosto de 2026",
    title: "Firma Histórica de Sucre (Casa de la Libertad)",
    impact:
      "El Presidente del Estado y las 9 Gobernaciones fijan 13 ejes: dominio tributario (Ley 154), condicionalidad del gasto, alivio fiscal y Ley Especial de Coparticipación.",
    pdfUrl: "/Acuerdo-001-2026-Agenda-50-50.pdf",
    tag: "Acuerdo",
  },
  {
    code: "D.S. N° 5686",
    date: "31 de agosto de 2026",
    title: "Programa de Readecuación Financiera Territorial (PRFT)",
    impact:
      "Crea el mecanismo oficial de reprogramación de obligaciones y saneamiento fiscal para gobernaciones y municipios.",
    pdfUrl: "/uploads/timeline/ds56862091ncpp-1791820824168.pdf",
    tag: "Decreto",
  },
  {
    code: "Ley N° 1763",
    date: "17 de septiembre de 2026",
    title: "Modificaciones a la Ley N° 492",
    impact:
      "Ajusta el marco de acuerdos y convenios intergubernativos para agilizar la concurrencia entre el Nivel Central y las ETA.",
    pdfUrl: "/uploads/timeline/l17632099ncpp-1791820165032.pdf",
    tag: "Ley",
  },
  {
    code: "Acuerdo N° 002/2026",
    date: "29 de septiembre de 2026",
    title: "Pacto con GAM de Capitales, El Alto y AMB",
    impact:
      "Establece 3 ejes estratégicos con enfoque diferenciado para conurbación, salud, reporte único y financiamiento municipal.",
    pdfUrl:
      "/uploads/documents/acuerdo-n-002-2026-agenda-50-50-1791410091154-1795209355642.pdf",
    tag: "Acuerdo",
  },
  {
    code: "Ley N° 1771",
    date: "30 de septiembre de 2026",
    title: "Adecuación del Financiamiento de Obligaciones Públicas",
    impact:
      "Libera cargas financieras y adecúa obligaciones públicas territoriales (incluyendo el alivio en el pago de prediarios a gobernaciones).",
    pdfUrl:
      "/uploads/timeline/l17712108ncpp-1791818186397-1795463201854.pdf",
    tag: "Ley",
  },
  {
    code: "D.S. N° 5738",
    date: "5 de octubre de 2026",
    title: "Diploma de Bachiller en Formato Digital",
    impact:
      "Simplificación administrativa y modernización de servicios públicos con validez jurídica, integridad y seguridad digital.",
    pdfUrl:
      "/uploads/timeline/ds57382111ncpp-1791820635763-1795463519728.pdf",
    tag: "Decreto",
  },
];

export const TERRITORIAL_AGREEMENTS: TerritorialBlock[] = [
  {
    id: "vinto",
    city: "Vinto, Cochabamba",
    date: "12 de septiembre de 2026",
    actor: "CONAIOC + 7 GAIOC (+2 en trámite)",
    headline: "Sin las GAIOC no hay Agenda 50/50",
    highlights: [
      "Participaron Charagua Iyambae, Uru Chipaya, Kereimba Iyambae, Salinas, Raqaypampa, Jatun Ayllu Yura y TIM, junto a Challa y Lomerío en trámite.",
      "Señalaron 3 deudas históricas del Estado: justicia indígena, consulta previa y gestión pública acorde a formas propias.",
      "Propuesta de un Fondo Compensatorio para GAIOC en situación de vulnerabilidad (productivo, turístico y cultural) y reforma a la Ley 031.",
    ],
    pdfUrl:
      "/uploads/documents/acta-de-reuni-n-entre-el-viceministerio-de-autonom-as-y-tierras-con-la-conaioc-1791837355925-1795209480938.pdf",
  },
  {
    id: "porongo",
    city: "Porongo, Santa Cruz",
    date: "23 de septiembre de 2026",
    actor: "FAM-Bolivia + AMDEs + Gobierno Nacional",
    headline: "Alivio financiero, FPIEEH y USD 100 millones de inversión",
    highlights: [
      "Aplicación preferente del PRFT (D.S. 5686) y análisis de condonación de multas e intereses con Cajas de Salud.",
      "Consulta técnica en 15 días al Min. Hidrocarburos para suspender el débito del 12% del FPIEEH en 2027 e iniciar su devolución.",
      "Compromiso ante el alza del diésel (D.S. 5716): fideicomiso para capital/operaciones y USD 100 millones en ejecución para obras municipales.",
    ],
    pdfUrl:
      "/uploads/documents/acta---reunio-n-sam-gob-23-09-26-1791464202091-1795209428355.pdf",
  },
  {
    id: "cobija",
    city: "Cobija, Pando",
    date: "12 de octubre de 2026",
    actor: "Gobernaciones + Ministerios del NCE",
    headline: "Hoja de ruta normativa desde la Amazonía",
    highlights: [
      "Mandato para presentar el Proyecto de Ley Especial de Coparticipación Tributaria y Distribución de Recursos Fiscales.",
      "Revisión conjunta del 12% del IDH destinado al FPIEEH (Ley 767) para fortalecer balances fiscales y acceso a crédito multilateral.",
      "Consenso para Ley Básica de Relacionamiento Internacional (reemplazo de la Ley 699) y reforma a la Ley 154.",
    ],
    pdfUrl:
      "/uploads/documents/conclusiones---reuni-n-de-cobija--pando-1791839198715-2-1795209524955.pdf",
  },
  {
    id: "yacuiba",
    city: "Yacuiba, Gran Chaco",
    date: "6 de noviembre de 2026",
    actor: "Gobierno Autónomo Regional del Gran Chaco (GARGCH) + SEA",
    headline: "Fórmula gradual 70/65/60 y la paradoja logística vial",
    highlights: [
      "Propuesta de reducción progresiva de participación del NCE (70% en 2027, 65% en 2028, 60% en 2029) con coparticipación subnacional del 5%, 10% y 15% en 5 impuestos (IVA, IT, RC-IVA, IUE, ICE).",
      "Criterios propuestos para recursos departamentales y regionales: 60% densidad poblacional y 40% equidad territorial compensatoria.",
      "Denuncia de la paradoja en la Red Vial Fundamental (17% Vías Bolivia / 83% ABC) y pedido de transferencia directa sin intermediación departamental (ref. D.S. 331).",
    ],
    pdfUrl:
      "/uploads/documents/acta-te-cnica-gar-gran-chaco-1795209586476.pdf",
  },
  {
    id: "sam-lapaz",
    city: "La Paz",
    date: "16 de noviembre de 2026",
    actor: "Sistema Asociativo Municipal + Gabinete Ejecutivo",
    headline: "Devolución FPIEEH 2026 y mesas técnicas a diciembre",
    highlights: [
      "El Ministerio de Hidrocarburos propone devolver en 2026 los recursos del FPIEEH 2026 a los GAM para ejecución inmediata.",
      "Remisión del estado de deudas con Cajas de Salud y mesa con el Ministerio de Salud sobre ítems.",
      "Calendario de 8 mesas técnicas del 23 de noviembre al 11 de diciembre (régimen laboral municipal, contrataciones, SUS, seguridad ciudadana, ITV).",
    ],
    pdfUrl:
      "/uploads/documents/agenda-50-50---acta-1795209598866.PDF",
  },
];

export const CHACO_PROJECTION_DATA: ChacoProjectionPoint[] = [
  {
    year: "2027",
    nce: 70,
    subnacional: 5,
    note: "Inicio gradual: 5% coparticipación GAD/GAR",
  },
  {
    year: "2028",
    nce: 65,
    subnacional: 10,
    note: "Consolidación: 10% coparticipación GAD/GAR",
  },
  {
    year: "2029",
    nce: 60,
    subnacional: 15,
    note: "Meta propuesta: 15% coparticipación GAD/GAR",
  },
];

export const ROAD_PARADOX_DATA = [
  { name: "ABC (Administradora Boliviana de Carreteras)", value: 83, color: "#1B2533" },
  { name: "Vías Bolivia (Recaudación retenida)", value: 17, color: "#c79d47" },
];

export const LEVEL_COMPARISONS: LevelComparisonItem[] = [
  {
    id: "nce",
    name: "Nivel Central (NCE)",
    badge: "18 Compromisos",
    color: "blue",
    keyFigure: "5 leyes y decretos ya promulgados entre julio y octubre",
    delivers: [
      "Reforma a la Ley 154 (dominio tributario) y Ley Especial de Coparticipación.",
      "Devolución/suspensión del 12% FPIEEH y saneamiento vía PRFT (D.S. 5686).",
      "Eliminación de condicionalidades de gasto y principio de reporte único.",
    ],
    receives: [
      "Control preservado sobre agregados macrofiscales y endeudamiento.",
      "Corresponsabilidad fiscal subnacional y transparencia en la calidad del gasto.",
    ],
  },
  {
    id: "gad",
    name: "Gobernaciones (9 GAD)",
    badge: "15 Compromisos",
    color: "emerald",
    keyFigure: "9/9 adheridas en Sucre; 4 GAD ya entregaron propuestas tributarias",
    delivers: [
      "Propuestas de nuevos tributos e impuesto ambiental departamental.",
      "Estudios de brechas competenciales y cronogramas de alivio fiscal.",
      "Participación en mesas de Ley 154, Ley 699 y Ley de Coparticipación.",
    ],
    receives: [
      "Ampliación del dominio tributario propio y liberación de cargas (ej. prediarios Ley 1771).",
      "Autonomía presupuestaria sin autorizaciones previas burocráticas.",
    ],
  },
  {
    id: "gam",
    name: "Municipios (GAM - AMB y FAM)",
    badge: "25 Compromisos",
    color: "amber",
    keyFigure: "Acuerdo 002/2026 + USD 100M inversión y devolución FPIEEH 2026",
    delivers: [
      "Diagnósticos operativos de salud, educación, seguridad y conurbación.",
      "Control de precios de canasta familiar y transparencia municipal.",
      "Propuestas para reforma laboral municipal y cartas orgánicas.",
    ],
    receives: [
      "Devolución de recursos FPIEEH 2026 y alivio financiero diferenciado.",
      "Fideicomiso e inversión municipal de USD 100M ante impacto del diésel.",
    ],
  },
  {
    id: "chaco",
    name: "Gran Chaco (GARGCH)",
    badge: "Autonomía Regional",
    color: "purple",
    keyFigure: "Propuesta 70/65/60 y transferencia directa ref. D.S. 331",
    delivers: [
      "Proyecto de Ley de Coparticipación Tributaria sobre 5 impuestos nacionales.",
      "Modelo piloto nacional de gestión concurrente en salud y educación.",
    ],
    receives: [
      "Asignación directa sin intermediación departamental y circuito vial cerrado.",
      "Fondo Compensatorio por concentración de NIT en otros departamentos.",
    ],
  },
  {
    id: "gaioc",
    name: "Autonomías Indígenas (CONAIOC)",
    badge: "7+2 GAIOC",
    color: "rose",
    keyFigure: "Consejo Asesor Permanente y capacitación en Sub-Sistemas",
    delivers: [
      "Propuestas de reforma a la Ley 031 para destrabar acceso a AIOC.",
      "Diagnósticos productivos, turísticos y de gestión pública propia.",
    ],
    receives: [
      "Fondo Compensatorio para GAIOC vulnerables y recuperación de fondos.",
      "Flexibilización del certificado de ancestralidad y Ley de Gestión Pública.",
    ],
  },
];
