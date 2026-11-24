export type BoardLevelCode = "2.1" | "2.2" | "2.3" | "2.4" | "2.6" | "2.7";

export type BoardRubroCode =
  | "fiscal"
  | "energia"
  | "salud"
  | "seguridad"
  | "ley"
  | "institucional"
  | "acuerdos"
  | "datos";

export type BoardStatusCat = "cumplido" | "proceso" | "programado" | "sin_plazo";

export interface BoardCommitmentItem {
  id: number;
  nivel: BoardLevelCode;
  rubro: BoardRubroCode;
  tematica: string;
  entregable: string;
  responsable: string;
  estado: string;
  cat: BoardStatusCat;
  order?: number;
  active?: boolean;
}

export interface BoardLevelMeta {
  code: BoardLevelCode;
  shortLabel: string;
  title: string;
  note: string;
}

export const BOARD_LEVEL_ORDER: BoardLevelCode[] = ["2.1", "2.2", "2.3", "2.4", "2.6", "2.7"];

export const BOARD_LEVELS: Record<BoardLevelCode, BoardLevelMeta> = {
  "2.1": {
    code: "2.1",
    shortLabel: "2.1 NCE",
    title: "2.1 Nivel Central del Estado (NCE)",
    note: "Algunos compromisos involucran la participación de las Entidades Territoriales Autónomas (ETA)",
  },
  "2.2": {
    code: "2.2",
    shortLabel: "2.2 GAD",
    title: "2.2 Gobiernos Autónomos Departamentales (GAD)",
    note: "Compromisos fiscales, presupuestarios y tributarios departamentales",
  },
  "2.3": {
    code: "2.3",
    shortLabel: "2.3 AMB/FAM",
    title:
      "2.3 Asociación de Municipalidades de Bolivia (AMB) (9 GAM capitales + El Alto) — Federación de Asociación de Municipios (FAM Bolivia) — Asociaciones de Municipalidades de Bolivia (AMDE)",
    note: "Compromisos del sistema asociativo municipal",
  },
  "2.4": {
    code: "2.4",
    shortLabel: "2.4 CONAIOC",
    title: "2.4 Coordinadora Nacional de Autonomías Indígena Originario Campesinas (CONAIOC)",
    note: "Autonomías Indígena Originario Campesinas (GAIOCs)",
  },
  "2.6": {
    code: "2.6",
    shortLabel: "2.6 GAR",
    title: "2.6 Gobierno Autónomo Regional del Gran Chaco (GAR)",
    note: "Infraestructura vial, salud, educación y transferencias directas",
  },
  "2.7": {
    code: "2.7",
    shortLabel: "2.7 Conjuntos",
    title: "2.7 Compromisos conjuntos",
    note: "Articulación del Gran Acuerdo Nacional entre NCE y ETA",
  },
};

export const BOARD_STATUS_LABELS: Record<
  BoardStatusCat,
  { title: string; text: string; bg: string; border: string; dot: string }
> = {
  cumplido: {
    title: "Cumplido / Entregado",
    text: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/50",
    border: "border-emerald-200/70 dark:border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  proceso: {
    title: "En proceso / En curso",
    text: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/50",
    border: "border-amber-200/70 dark:border-amber-500/30",
    dot: "bg-amber-400",
  },
  programado: {
    title: "Programado / Continuo",
    text: "text-sky-700 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-950/50",
    border: "border-sky-200/70 dark:border-sky-500/30",
    dot: "bg-sky-500",
  },
  sin_plazo: {
    title: "Sin plazo",
    text: "text-zinc-600 dark:text-slate-300",
    bg: "bg-zinc-100 dark:bg-slate-800/80",
    border: "border-zinc-200 dark:border-slate-700",
    dot: "bg-zinc-300 dark:bg-slate-600",
  },
};

export const BOARD_RUBRO_LABELS: Record<BoardRubroCode, string> = {
  fiscal: "Fiscal / Tributario",
  energia: "Energía / Hidrocarburos",
  salud: "Salud / Educación",
  seguridad: "Seguridad Ciudadana",
  ley: "Normativa / Leyes",
  institucional: "Institucional / Autonomías",
  acuerdos: "Acuerdos / Mesas",
  datos: "Datos / Reportes",
};

export const DEFAULT_BOARD_COMMITMENTS: BoardCommitmentItem[] = [
  // 2.1 Nivel Central del Estado (NCE) — 32 compromisos
  { id: 1, nivel: "2.1", rubro: "energia", tematica: "Ley N° 767 de Fondo de Promoción a la Inversión en Exploración y Explotación Hidrocarburífera (FPIEEH)", entregable: "Informe técnico de viabilidad para suspender, devolver o aplicar progresivamente el 12% del FPIEEH a los GAM.", responsable: "Min. Hidrocarburos + MEFP", estado: "En proceso", cat: "proceso", order: 1, active: true },
  { id: 2, nivel: "2.1", rubro: "energia", tematica: "Ley N° 767 de Fondo de Promoción a la Inversión en Exploración y Explotación Hidrocarburífera (FPIEEH)", entregable: "Que en el presupuesto de la gestión 2027 no se aplique el débito del 12%.", responsable: "Min. Hidrocarburos + MEFP", estado: "Sin plazo", cat: "sin_plazo", order: 2, active: true },
  { id: 3, nivel: "2.1", rubro: "energia", tematica: "Ley N° 767 de Fondo de Promoción a la Inversión en Exploración y Explotación Hidrocarburífera (FPIEEH)", entregable: "Que a partir de la gestión 2027 se inicie la devolución de la retención del 12% del FPIEEH.", responsable: "Min. Hidrocarburos + MEFP", estado: "Sin plazo", cat: "sin_plazo", order: 3, active: true },
  { id: 4, nivel: "2.1", rubro: "energia", tematica: "Ley N° 767 de Fondo de Promoción a la Inversión en Exploración y Explotación Hidrocarburífera (FPIEEH)", entregable: "Elaborar la norma que viabilice la devolución de los recursos de la gestión 2026 esta misma gestión.", responsable: "MEFP", estado: "En proceso", cat: "proceso", order: 4, active: true },
  { id: 5, nivel: "2.1", rubro: "energia", tematica: "Ley N° 767 de Fondo de Promoción a la Inversión en Exploración y Explotación Hidrocarburífera (FPIEEH)", entregable: "Propuesta de modificación de la Ley para mejorar sus balances fiscales y fortalecer su capacidad de acceder a financiamiento multilateral.", responsable: "Min. Hidrocarburos", estado: "Sin plazo", cat: "sin_plazo", order: 5, active: true },
  { id: 6, nivel: "2.1", rubro: "fiscal", tematica: "Ley N° 154", entregable: "Proyecto de Ley que permita a los GAD y GAM crear y modificar impuestos propios.", responsable: "MEFP + SEA + GAD + GAM", estado: "Cumplido", cat: "cumplido", order: 6, active: true },
  { id: 7, nivel: "2.1", rubro: "datos", tematica: "Información fiscal", entregable: "Centro de Datos, sistematización de diagnósticos y reportes periódicos de transferencias, ejecución presupuestaria y techos fiscales para que los GAD y GAM planifiquen.", responsable: "MEFP + SEA", estado: "Continuo", cat: "programado", order: 7, active: true },
  { id: 8, nivel: "2.1", rubro: "acuerdos", tematica: "Cronograma de encuentros", entregable: "Calendario público de reuniones con ETA", responsable: "Min. Presidencia / SEA", estado: "Continuo", cat: "programado", order: 8, active: true },
  { id: 9, nivel: "2.1", rubro: "datos", tematica: "Reporte único", entregable: "Norma que elimine la obligación de pedir autorización previa al NCE para que los GAM ejecuten su presupuesto; se reemplaza por reporte de información.", responsable: "MEFP + GAM", estado: "Sin plazo", cat: "sin_plazo", order: 9, active: true },
  { id: 10, nivel: "2.1", rubro: "ley", tematica: "Ley de Alianzas Público Privadas (APP)", entregable: "Proyecto de Ley que permita a GAD y GAM asociarse con empresas privadas para obras públicas.", responsable: "MEFP + Min. Planificación + GAD + GAM", estado: "En proceso", cat: "proceso", order: 10, active: true },
  { id: 11, nivel: "2.1", rubro: "ley", tematica: "Ley N° 699", entregable: "Proyecto de Ley que reemplace la Ley N° 699 para que las ETA puedan acceder a cooperación internacional y financiamiento externo sin tanta burocracia.", responsable: "Min. RREE + SEA + GAD + GAM", estado: "Cumplido", cat: "cumplido", order: 11, active: true },
  { id: 12, nivel: "2.1", rubro: "ley", tematica: "Ley N° 1178", entregable: "Propuesta para simplificar los procedimientos administrativos y reducir la burocracia que frena la inversión pública municipal.", responsable: "MEFP + Contraloría + GAM", estado: "Sin plazo", cat: "sin_plazo", order: 12, active: true },
  { id: 13, nivel: "2.1", rubro: "fiscal", tematica: "Auditoría coparticipación", entregable: "Informe de auditoría que muestre si los recursos de coparticipación tributaria transferidos a los GAM en los últimos años corresponden a lo que establece la ley.", responsable: "MEFP + GAM", estado: "Sin plazo", cat: "sin_plazo", order: 13, active: true },
  { id: 14, nivel: "2.1", rubro: "fiscal", tematica: "Distribución fiscal", entregable: "Estudio con nueva fórmula que considere población, capacidad fiscal, esfuerzo recaudatorio, NBI, IDH y costos reales de servicios urbanos.", responsable: "MEFP + GAM", estado: "En proceso", cat: "proceso", order: 14, active: true },
  { id: 15, nivel: "2.1", rubro: "fiscal", tematica: "Financiamiento modular", entregable: "Propuesta de instrumentos financieros optativos para que cada GAM acceda según su perfil crediticio.", responsable: "MEFP + GAM", estado: "Sin plazo", cat: "sin_plazo", order: 15, active: true },
  { id: 16, nivel: "2.1", rubro: "fiscal", tematica: "Programa de Readecuación Financiera Territorial (PRFT)", entregable: "Reglamento y esquema de reprogramación de deudas y saneamiento fiscal para GAD y GAM.", responsable: "MEFP", estado: "Cumplido", cat: "cumplido", order: 16, active: true },
  { id: 17, nivel: "2.1", rubro: "datos", tematica: "Programa de Readecuación Financiera Territorial (PRFT)", entregable: "Remisión de la información a la FAM de los GAM que solicitaron acceso al PRFT y el estado de situación de cada uno.", responsable: "MEFP", estado: "Sin plazo", cat: "sin_plazo", order: 17, active: true },
  { id: 18, nivel: "2.1", rubro: "ley", tematica: "Condicionalidades de gasto", entregable: "Informe que identifique todas las leyes nacionales que obligan a los GAD y GAM a gastar en competencias que no les corresponden.", responsable: "Min. Presidencia + SEA + GAD + GAM", estado: "Cumplido", cat: "cumplido", order: 18, active: true },
  { id: 19, nivel: "2.1", rubro: "ley", tematica: "Condicionalidades de gasto", entregable: "Normativa que elimine las obligaciones de gasto que financian competencias del nivel central o instituciones que ya no existen.", responsable: "NCE + GAD", estado: "En proceso", cat: "proceso", order: 19, active: true },
  { id: 20, nivel: "2.1", rubro: "institucional", tematica: "LMAD", entregable: "Proyecto de Ley de modificación de la Ley Marco de Autonomías para fortalecer el régimen autonómico.", responsable: "VAT + ETA", estado: "En proceso", cat: "proceso", order: 20, active: true },
  { id: 21, nivel: "2.1", rubro: "fiscal", tematica: "Incremento techo presupuestario gestión 2027", entregable: "Efectuar incremento de un presupuesto adicional a cada uno de los GAMs y Universidades.", responsable: "NCE", estado: "Cumplido", cat: "cumplido", order: 21, active: true },
  { id: 22, nivel: "2.1", rubro: "fiscal", tematica: "Fondos de Compensación", entregable: "Estudio para crear Fondos de Compensación.", responsable: "MEFP + GAD + GAR", estado: "Sin plazo", cat: "sin_plazo", order: 22, active: true },
  { id: 23, nivel: "2.1", rubro: "institucional", tematica: "Transferencia de instituciones", entregable: "Diagnóstico sobre qué instituciones públicas podrían pasar a administración de los GAD.", responsable: "NCE + GAD", estado: "En proceso", cat: "proceso", order: 23, active: true },
  { id: 24, nivel: "2.1", rubro: "acuerdos", tematica: "Proyecto de Ley de Coparticipación Tributaria", entregable: "Instalación de mesa técnica para elaborar el Proyecto de Ley Especial de Coparticipación y Distribución de Recursos Fiscales.", responsable: "NCE + GAD + GAM + CONAIOC + GAR", estado: "En proceso", cat: "proceso", order: 24, active: true },
  { id: 25, nivel: "2.1", rubro: "ley", tematica: "Marco laboral", entregable: "Propuesta de reforma del régimen laboral municipal.", responsable: "Min. Trabajo + AMB", estado: "Sin plazo", cat: "sin_plazo", order: 25, active: true },
  { id: 26, nivel: "2.1", rubro: "energia", tematica: "Diésel", entregable: "Normativa que mitigue el impacto del incremento del precio del diésel en GAM y obras públicas", responsable: "NCE", estado: "Cumplido", cat: "cumplido", order: 26, active: true },
  { id: 27, nivel: "2.1", rubro: "salud", tematica: "Salud", entregable: "Remisión al Sistema Asociativo Municipal del estado de situación sobre deudas con las Cajas de Salud.", responsable: "Min. Salud", estado: "Noviembre 2026", cat: "programado", order: 27, active: true },
  { id: 28, nivel: "2.1", rubro: "salud", tematica: "Salud", entregable: "Instalación mesa técnica de análisis sobre distribución de ítems en coordinación con GAM.", responsable: "Min Salud + GAM", estado: "Noviembre 2026", cat: "programado", order: 28, active: true },
  { id: 29, nivel: "2.1", rubro: "salud", tematica: "Salud", entregable: "Mesa técnica y análisis de sostenibilidad del SUS.", responsable: "Min Salud", estado: "Noviembre 2026", cat: "programado", order: 29, active: true },
  { id: 30, nivel: "2.1", rubro: "seguridad", tematica: "Seguridad Ciudadana", entregable: "Mesa técnica y análisis sobre seguridad ciudadana e inspección técnica vehicular.", responsable: "Min. Gobierno", estado: "Noviembre 2026", cat: "programado", order: 30, active: true },
  { id: 31, nivel: "2.1", rubro: "institucional", tematica: "Consejo Nacional de Autonomías (CNA)", entregable: "Convocatoria al CNA como instancia institucional para incorporar formalmente el tratamiento de la Agenda 50/50 y encaminar los acuerdos alcanzados hacia decisiones de cumplimiento efectivo.", responsable: "NCE", estado: "Sin plazo", cat: "sin_plazo", order: 31, active: true },
  { id: 32, nivel: "2.1", rubro: "ley", tematica: "Marco normativo Agenda 50/50", entregable: "Desarrollar y aprobar el instrumento normativo que otorgue respaldo jurídico a la Agenda 50/50", responsable: "NCE", estado: "Sin plazo", cat: "sin_plazo", order: 32, active: true },

  // 2.2 Gobiernos Autónomos Departamentales (GAD) — 4 compromisos
  { id: 33, nivel: "2.2", rubro: "fiscal", tematica: "Propuestas tributarias", entregable: "Propuestas para ampliar dominio tributario, crear sobretasas, aplicar impuesto ambiental, reclasificar al menos una base imponible del nivel central.", responsable: "Cada GAD", estado: "En proceso (4 GAD)", cat: "proceso", order: 33, active: true },
  { id: 34, nivel: "2.2", rubro: "datos", tematica: "Información al SEA", entregable: "Datos económicos y fiscales de cada departamento para la nueva distribución de ingresos.", responsable: "Cada GAD", estado: "Sin plazo", cat: "sin_plazo", order: 34, active: true },
  { id: 35, nivel: "2.2", rubro: "fiscal", tematica: "Relación presupuestaria", entregable: "Estudio para que el NCE solo controle los agregados fiscales y los GAD decidan su presupuesto.", responsable: "Cada GAD", estado: "Sin plazo", cat: "sin_plazo", order: 35, active: true },
  { id: 36, nivel: "2.2", rubro: "fiscal", tematica: "Transferencias fiscales", entregable: "Estudio para adecuar las transferencias del NCE a las competencias reales de cada GAD.", responsable: "Cada GAD", estado: "Sin plazo", cat: "sin_plazo", order: 36, active: true },

  // 2.3 AMB / FAM Bolivia / AMDE — 11 compromisos
  { id: 37, nivel: "2.3", rubro: "salud", tematica: "Salud", entregable: "Plan municipal que asegure que los hospitales de primer y segundo nivel tengan infraestructura, equipamiento, medicamentos y financiamiento suficiente.", responsable: "Cada GAM", estado: "Sin plazo", cat: "sin_plazo", order: 37, active: true },
  { id: 38, nivel: "2.3", rubro: "fiscal", tematica: "Brechas operativas", entregable: "Diagnóstico que cuantifique cuántos recursos les falta a cada GAM para prestar adecuadamente servicios, como seguridad ciudadana, educación, residuos, movilidad e infraestructura. Tomar en cuenta las externalidades en GAM de regiones metropolitanas.", responsable: "AMB + FAM", estado: "Sin plazo", cat: "sin_plazo", order: 38, active: true },
  { id: 39, nivel: "2.3", rubro: "institucional", tematica: "Gobernanza metropolitana", entregable: "Esquema de coordinación entre municipios conurbados para compartir infraestructura y servicios.", responsable: "GAM conurbados", estado: "Sin plazo", cat: "sin_plazo", order: 39, active: true },
  { id: 40, nivel: "2.3", rubro: "datos", tematica: "Reporte único", entregable: "Medida para que los GAM reporten información al NCE una sola vez, en un solo formato y por un solo canal.", responsable: "Cada GAM", estado: "Sin plazo", cat: "sin_plazo", order: 40, active: true },
  { id: 41, nivel: "2.3", rubro: "ley", tematica: "Cartas Orgánicas", entregable: "Medidas para agilizar la aprobación y vigencia de las Cartas Orgánicas Municipales.", responsable: "Cada GAM + VAT", estado: "Sin plazo", cat: "sin_plazo", order: 41, active: true },
  { id: 42, nivel: "2.3", rubro: "datos", tematica: "Diagnóstico conjunto", entregable: "Diagnóstico consolidado de los 10 GAM sobre la situación municipal", responsable: "AMB", estado: "Cumplido", cat: "cumplido", order: 42, active: true },
  { id: 43, nivel: "2.3", rubro: "institucional", tematica: "Metodología municipal Agenda 50/50", entregable: "Propuesta metodológica de la Agenda 50/50 para GAM", responsable: "AMB", estado: "Sin plazo", cat: "sin_plazo", order: 43, active: true },
  { id: 44, nivel: "2.3", rubro: "ley", tematica: "Normativa priorizada", entregable: "Lista de normas que deben modificarse para fortalecer la autonomía municipal", responsable: "AMB", estado: "Sin plazo", cat: "sin_plazo", order: 44, active: true },
  { id: 45, nivel: "2.3", rubro: "ley", tematica: "Condicionalidad del gasto", entregable: "Análisis de las 25 condicionalidades que pesan sobre los GAM (9 rígidas y 16 flexibles)", responsable: "AMB", estado: "Entregado", cat: "cumplido", order: 45, active: true },
  { id: 46, nivel: "2.3", rubro: "datos", tematica: "Sistematización diagnósticos GAD", entregable: "Documento que ordena las propuestas que enviaron los GAD al SEA", responsable: "AMB", estado: "En curso", cat: "proceso", order: 46, active: true },
  { id: 47, nivel: "2.3", rubro: "acuerdos", tematica: "Socialización PRFT", entregable: "Jornadas de socialización del reglamento del PRFT entre los 10 GAM", responsable: "AMB", estado: "Sin plazo", cat: "sin_plazo", order: 47, active: true },

  // 2.4 CONAIOC — 4 compromisos
  { id: 48, nivel: "2.4", rubro: "institucional", tematica: "Conformación de Consejo Asesor Permanente", entregable: "Analizar instrumentos que permitan operativizar de manera más ágil los procedimientos de consolidación de las AIOC y la modificación de la normativa que acompañe adecuadamente el desarrollo de las autonomías.", responsable: "NCE + VAT + SEA + CONAIOC", estado: "Sin plazo", cat: "sin_plazo", order: 48, active: true },
  { id: 49, nivel: "2.4", rubro: "acuerdos", tematica: "Asistencia Técnica", entregable: "Sobre Sub Sistemas de Administración y otros temas, dirigidos al personal técnico administrativo de los 9 GAIOCs.", responsable: "MEFP + SEA", estado: "Sin plazo", cat: "sin_plazo", order: 49, active: true },
  { id: 50, nivel: "2.4", rubro: "fiscal", tematica: "Recuperación de Fondos", entregable: "Recuperación de fondos que estaban destinados a los pueblos indígenas, apertura de regalías para las AIOCs y otras fuentes de financiamiento.", responsable: "VAT + SEA", estado: "Sin plazo", cat: "sin_plazo", order: 50, active: true },
  { id: 51, nivel: "2.4", rubro: "ley", tematica: "Ley de Gestión Pública", entregable: "Coadyuvar en el tratamiento de la propuesta de Ley de Gestión Pública para los GAIOCs", responsable: "VAT + SEA", estado: "Sin plazo", cat: "sin_plazo", order: 51, active: true },

  // 2.6 Gobierno Autónomo Regional del Gran Chaco (GAR) — 3 compromisos
  { id: 52, nivel: "2.6", rubro: "fiscal", tematica: "Red Vial Fundamental", entregable: "Examinar mecanismos de asignación de recursos para la Red Vial Fundamental en favor del GARGCH.", responsable: "GAR", estado: "Sin plazo", cat: "sin_plazo", order: 52, active: true },
  { id: 53, nivel: "2.6", rubro: "salud", tematica: "Salud y Educación", entregable: "Identificar las necesidades de financiamiento y coordinación intergubermamental en salud y educación.", responsable: "GAR", estado: "Sin plazo", cat: "sin_plazo", order: 53, active: true },
  { id: 54, nivel: "2.6", rubro: "fiscal", tematica: "Transferencia directa recursos", entregable: "Analizar viabilidad técnica, financiera y jurídica de los mecanismos de transferencia directa de recursos.", responsable: "GAR", estado: "Sin plazo", cat: "sin_plazo", order: 54, active: true },

  // 2.7 Compromisos conjuntos — 2 compromisos
  { id: 55, nivel: "2.7", rubro: "acuerdos", tematica: "Consejo de Coordinación Técnica", entregable: "Convocatoria formal al Consejo que articulará el Gran Acuerdo Nacional", responsable: "NCE", estado: "Sin plazo", cat: "sin_plazo", order: 55, active: true },
  { id: 56, nivel: "2.7", rubro: "acuerdos", tematica: "Gran Acuerdo Nacional", entregable: "Acuerdo final que integre el conjunto de acuerdos entre el NCE y las ETA en un solo instrumento", responsable: "Todos", estado: "Sin plazo", cat: "sin_plazo", order: 56, active: true },
];
