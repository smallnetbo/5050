export interface CriticalCounter {
  id: string;
  title: string;
  responsible: string;
  deliverable: string;
  deadlineDate: string; // DD/MM/YYYY
  targetIsoDate: string; // ISO date for live countdown
  daysLeftApprox: number;
  badgeText: string;
  colorScheme: "amber" | "emerald" | "blue" | "rose";
  tag: string;
}

export const criticalCountersData: CriticalCounter[] = [
  {
    id: "fpieeh",
    title: "Respuesta Técnica FPIEEH",
    responsible: "Min. Hidrocarburos + MEFP",
    deliverable:
      "Informe técnico que determine la viabilidad de: (a) suspender el 12% del FPIEEH a los GAM en 2027, (b) devolver lo retenido en 2025, o (c) aplicarlo progresivamente en los siguientes años.",
    deadlineDate: "14/10/2026",
    targetIsoDate: "2026-10-14T23:59:59-04:00",
    daysLeftApprox: 12,
    badgeText: "Plazo Crítico · 12 días",
    colorScheme: "rose",
    tag: "GAM / Municipios y AMB",
  },
  {
    id: "ley154",
    title: "Proyecto de Ley Modificación Ley N° 154",
    responsible: "MEFP + 9 GAD",
    deliverable:
      "Texto de Proyecto de Ley que permita a los departamentos crear o modificar sus propios impuestos y ampliar sustancialmente su dominio tributario autonómico.",
    deadlineDate: "03/11/2026",
    targetIsoDate: "2026-11-03T23:59:59-04:00",
    daysLeftApprox: 32,
    badgeText: "Plazo Crítico · 32 días",
    colorScheme: "blue",
    tag: "GAD / 9 Gobernaciones",
  },
];

export type CommitmentState =
  | "con_fecha"
  | "continuo"
  | "sin_plazo"
  | "cumplido"
  | "entregado"
  | "en_curso"
  | "pendiente";

export interface CommitmentItem {
  id: string;
  name: string;
  level: "nce" | "gad" | "gam" | "conjunto";
  responsible: string;
  deliverable: string;
  state: CommitmentState;
  stateLabel: string;
  deadline?: string;
  days?: number;
  category?: string;
  isAmbSpecific?: boolean;
}

export interface StateGlossaryItem {
  state: CommitmentState;
  label: string;
  description: string;
  badgeClass: string;
  dotColor: string;
  count: number;
}

export const stateGlossaryList: StateGlossaryItem[] = [
  {
    state: "con_fecha",
    label: "Con fecha límite",
    description: "Compromisos con fecha perentoria fijada en calendario (ej. 14/10/2026 o 03/11/2026).",
    badgeClass: "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300 dark:border-rose-700",
    dotColor: "bg-rose-500",
    count: 3,
  },
  {
    state: "continuo",
    label: "Continuo",
    description: "Procesos permanentes de intercambio de datos, transferencias y mesas técnicas activas.",
    badgeClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700",
    dotColor: "bg-emerald-500",
    count: 2,
  },
  {
    state: "sin_plazo",
    label: "Sin plazo establecido",
    description: "Compromisos acordados formalmente para formulación técnica sin calendario perentorio cerrado.",
    badgeClass: "bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-300 dark:border-purple-700",
    dotColor: "bg-purple-500",
    count: 51,
  },
  {
    state: "cumplido",
    label: "Cumplido",
    description: "Entregables ya concluidos y remitidos oficialmente por los actores correspondientes.",
    badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-300 dark:border-blue-700",
    dotColor: "bg-blue-500",
    count: 2,
  },
  {
    state: "entregado",
    label: "Entregado",
    description: "Documento remitido a la contraparte para revisión o análisis técnico.",
    badgeClass: "bg-teal-100 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300 border-teal-300 dark:border-teal-700",
    dotColor: "bg-teal-500",
    count: 1,
  },
  {
    state: "en_curso",
    label: "En curso / Pendiente",
    description: "Tareas y sistematizaciones en proceso activo de redacción o diálogo intergubernativo.",
    badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-700",
    dotColor: "bg-amber-500",
    count: 1,
  },
];

// Listado exacto de todos los compromisos de las páginas 1 a 8 de "propuesta 2.pdf"
export const commitmentsData: CommitmentItem[] = [
  // ================= 2.1 Presidente / Gobierno Nacional (NCE) =================
  {
    id: "nce-1",
    name: "FPIEEH",
    level: "nce",
    responsible: "Min. Hidrocarburos + MEFP",
    deliverable:
      "Informe técnico sobre viabilidad de suspender, devolver o aplicar progresivamente el 12% del FPIEEH a los GAM.",
    state: "con_fecha",
    stateLabel: "14/10/2026 (12 días)",
    deadline: "14/10/2026",
    days: 12,
    category: "Hidrocarburos y Finanzas",
  },
  {
    id: "nce-2",
    name: "Ley 154",
    level: "nce",
    responsible: "MEFP",
    deliverable:
      "Proyecto de Ley que permita a los GAD crear y modificar impuestos propios.",
    state: "con_fecha",
    stateLabel: "03/11/2026 (32 días)",
    deadline: "03/11/2026",
    days: 32,
    category: "Dominio Tributario",
  },
  {
    id: "nce-3",
    name: "Información fiscal",
    level: "nce",
    responsible: "MEFP",
    deliverable:
      "Reportes periódicos de transferencias, ejecución presupuestaria y techos fiscales para que los GAD y GAM planifiquen.",
    state: "continuo",
    stateLabel: "Continuo",
    category: "Transparencia Fiscal",
  },
  {
    id: "nce-4",
    name: "Cronograma de encuentros",
    level: "nce",
    responsible: "Min. Presidencia / SEA",
    deliverable:
      "Calendario público de reuniones del Presidente con municipios, IOC y Chaco.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Diálogo Territorial",
  },
  {
    id: "nce-5",
    name: "Reporte único",
    level: "nce",
    responsible: "MEFP",
    deliverable:
      "Norma que elimine la obligación de pedir autorización previa al NCE para que los GAM ejecuten su presupuesto; se reemplaza por reporte de información.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Autonomía de Gestión",
  },
  {
    id: "nce-6",
    name: "Ley APP",
    level: "nce",
    responsible: "MEFP / Min. Planificación",
    deliverable:
      "Proyecto de Ley que permita a GAD y GAM asociarse con empresas privadas para obras públicas.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Inversión y Desarrollo",
  },
  {
    id: "nce-7",
    name: "Ley 699",
    level: "nce",
    responsible: "Cancillería / SEA",
    deliverable:
      "Proyecto de Ley que reemplace la Ley 699 para que las ETAs puedan acceder a cooperación internacional y financiamiento externo sin tanta burocracia.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Relaciones Internacionales",
  },
  {
    id: "nce-8",
    name: "Ley 1178",
    level: "nce",
    responsible: "MEFP / Contraloría",
    deliverable:
      "Propuesta para simplificar los procedimientos administrativos y reducir la burocracia que frena la inversión pública municipal.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Simplificación Administrativa",
  },
  {
    id: "nce-9",
    name: "Auditoría coparticipación",
    level: "nce",
    responsible: "MEFP",
    deliverable:
      "Informe de auditoría que muestre si los recursos de coparticipación tributaria transferidos a los GAM en los últimos años corresponden a lo que establece la ley.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Fiscalización y Cuentas",
  },
  {
    id: "nce-10",
    name: "Distribución fiscal",
    level: "nce",
    responsible: "MEFP",
    deliverable:
      "Estudio con nueva fórmula que considere población, capacidad fiscal, esfuerzo recaudatorio, NBI, IDH y costos reales de servicios urbanos.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Equidad Fiscal",
  },
  {
    id: "nce-11",
    name: "Financiamiento modular",
    level: "nce",
    responsible: "MEFP",
    deliverable:
      "Propuesta de instrumentos financieros optativos para que cada GAM acceda según su perfil crediticio.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Acceso al Crédito",
  },
  {
    id: "nce-12",
    name: "PRFT",
    level: "nce",
    responsible: "MEFP",
    deliverable:
      "Reglamento y esquema de reprogramación de deudas y saneamiento fiscal para GAD y GAM.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Alivio Financiero",
  },
  {
    id: "nce-13",
    name: "Normativa que condiciona gasto GAD",
    level: "nce",
    responsible: "SEA / Min. Presidencia",
    deliverable:
      "Informe que identifique todas las leyes nacionales que obligan a los GAD a gastar en cosas que no les corresponden.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Competencias y Gasto",
  },
  {
    id: "nce-14",
    name: "Derogar condicionalidades",
    level: "nce",
    responsible: "NCE",
    deliverable:
      "Norma que elimine las obligaciones de gasto que financian competencias del nivel central o instituciones que ya no existen.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Reforma Normativa",
  },
  {
    id: "nce-15",
    name: "LMAD",
    level: "nce",
    responsible: "Viceministerio de Autonomías",
    deliverable:
      "Anteproyecto de Ley de modificación de la Ley Marco de Autonomías para fortalecer el régimen autonómico.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Marco Autonómico",
  },
  {
    id: "nce-16",
    name: "Fondos de compensación",
    level: "nce",
    responsible: "MEFP",
    deliverable:
      "Estudio para crear fondos que compensen a los departamentos con menos recursos.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Compensación Territorial",
  },
  {
    id: "nce-17",
    name: "Transferencia de instituciones",
    level: "nce",
    responsible: "NCE",
    deliverable:
      "Diagnóstico sobre qué instituciones públicas podrían pasar a administración de los GAD.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Descentralización",
  },
  {
    id: "nce-18",
    name: "Cronograma alivio fiscal GAD",
    level: "nce",
    responsible: "MEFP",
    deliverable:
      "Calendario de medidas de alivio financiero para los gobiernos departamentales.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Alivio Financiero GAD",
  },

  // ================= 2.2 Gobiernos Autónomos Departamentales (GAD) =================
  {
    id: "gad-1",
    name: "Propuestas tributarias",
    level: "gad",
    responsible: "Cada GAD",
    deliverable:
      "Documento con propuestas de cada GAD para ampliar sus ingresos propios.",
    state: "cumplido",
    stateLabel: "Cumplido (4 GAD)",
    category: "Tributos Departamentales",
  },
  {
    id: "gad-2",
    name: "Información al SEA",
    level: "gad",
    responsible: "Cada GAD",
    deliverable:
      "Datos económicos y fiscales de cada departamento para la nueva distribución de ingresos.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Información Económica",
  },
  {
    id: "gad-3",
    name: "Ley 154",
    level: "gad",
    responsible: "Cada GAD + MEFP",
    deliverable:
      "Proyecto de Ley que permita a los departamentos crear o modificar impuestos propios.",
    state: "con_fecha",
    stateLabel: "03/11/2026 (32 días)",
    deadline: "03/11/2026",
    days: 32,
    category: "Dominio Tributario",
  },
  {
    id: "gad-4",
    name: "Estudios tributarios",
    level: "gad",
    responsible: "Cada GAD",
    deliverable:
      "Informes sobre: ampliar dominio tributario, crear sobretasas, aplicar impuesto ambiental, reclasificar al menos una base imponible del nivel central.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Capacidad Recaudadora",
  },
  {
    id: "gad-5",
    name: "Revisar condicionalidades",
    level: "gad",
    responsible: "Cada GAD",
    deliverable:
      "Informe que identifique todas las normas nacionales que obligan a los GAD a gastar en cosas ajenas a sus competencias.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Protección Presupuestaria",
  },
  {
    id: "gad-6",
    name: "Relación presupuestaria",
    level: "gad",
    responsible: "Cada GAD",
    deliverable:
      "Estudio para que el NCE solo controle los agregados fiscales y los GAD decidan su presupuesto.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Autonomía Presupuestaria",
  },
  {
    id: "gad-7",
    name: "Transferencias fiscales",
    level: "gad",
    responsible: "Cada GAD",
    deliverable:
      "Estudio para adecuar las transferencias del NCE a las competencias reales de cada GAD.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Equilibrio Fiscal",
  },
  {
    id: "gad-8",
    name: "Mesa Ley Coparticipación",
    level: "gad",
    responsible: "GAD + NCE",
    deliverable:
      "Instalación de mesa técnica para elaborar el Proyecto de Ley Especial de Coparticipación y Distribución de Recursos Fiscales.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Mesa Coparticipación",
  },
  {
    id: "gad-9",
    name: "Cronograma alivio fiscal",
    level: "gad",
    responsible: "Cada GAD",
    deliverable:
      "Calendario de medidas de reprogramación y diferimiento de deudas de cada GAD.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Saneamiento de Deuda",
  },
  {
    id: "gad-10",
    name: "Propuestas compensación",
    level: "gad",
    responsible: "Cada GAD",
    deliverable:
      "Documento con propuestas de cada GAD sobre fondos de compensación y transferencia de instituciones.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Compensación",
  },
  {
    id: "gad-11",
    name: "LMAD",
    level: "gad",
    responsible: "GAD + NCE",
    deliverable:
      "Propuesta de modificación de la Ley Marco de Autonomías.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Ley Marco",
  },
  {
    id: "gad-12",
    name: "Ley APP",
    level: "gad",
    responsible: "GAD + NCE",
    deliverable:
      "Propuesta de normativa que permita a los GAD asociarse con privados para obras públicas.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Alianzas Público-Privadas",
  },
  {
    id: "gad-13",
    name: "Ley 699",
    level: "gad",
    responsible: "GAD + NCE",
    deliverable:
      "Propuesta de nueva Ley de Relacionamiento Internacional.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Cooperación Externa",
  },
  {
    id: "gad-14",
    name: "Fondos de compensación",
    level: "gad",
    responsible: "GAD + NCE",
    deliverable:
      "Estudio para crear fondos que compensen a los departamentos con menos recursos.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Fondos de Equidad",
  },
  {
    id: "gad-15",
    name: "Transferencia de instituciones",
    level: "gad",
    responsible: "GAD + NCE",
    deliverable:
      "Diagnóstico sobre qué instituciones nacionales podrían pasar a los GAD.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Transferencia Institucional",
  },

  // ================= 2.3 GAM (9 capitales + El Alto) — AMB =================
  {
    id: "gam-1",
    name: "Salud",
    level: "gam",
    responsible: "Cada GAM",
    deliverable:
      "Plan municipal que asegure que los hospitales de primer y segundo nivel tengan infraestructura, equipamiento, medicamentos y financiamiento suficiente.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Salud Municipal",
  },
  {
    id: "gam-2",
    name: "Competencias y cargas",
    level: "gam",
    responsible: "Cada GAM",
    deliverable:
      "Diagnóstico que identifique qué competencias ejerce cada GAM que no le corresponden, cuánto le cuestan y qué duplicidades existen con el NCE.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Competencias Municipales",
  },
  {
    id: "gam-3",
    name: "Brechas operativas",
    level: "gam",
    responsible: "Cada GAM",
    deliverable:
      "Diagnóstico que cuantifique cuánto le falta a cada GAM para prestar bien servicios como seguridad ciudadana, educación, residuos, movilidad e infraestructura.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Servicios Básicos",
  },
  {
    id: "gam-4",
    name: "Gobernanza metropolitana",
    level: "gam",
    responsible: "GAM conurbados",
    deliverable:
      "Esquema de coordinación entre municipios conurbados para compartir infraestructura y servicios.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Áreas Metropolitanas",
  },
  {
    id: "gam-5",
    name: "Reporte único",
    level: "gam",
    responsible: "Cada GAM",
    deliverable:
      "Medida para que los GAM reporten información al NCE una sola vez, en un solo formato y por un solo canal.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Desburocratización",
  },
  {
    id: "gam-6",
    name: "Gobierno abierto",
    level: "gam",
    responsible: "Cada GAM",
    deliverable:
      "Plataforma digital con indicadores de transparencia, Centro de Datos Autonómicos y portal de seguimiento de la Agenda 50/50.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Transparencia y Datos",
  },
  {
    id: "gam-7",
    name: "Ley 1178",
    level: "gam",
    responsible: "Cada GAM",
    deliverable:
      "Propuesta para simplificar los procedimientos administrativos que frenan la inversión pública municipal.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Gestión Pública SAFCO",
  },
  {
    id: "gam-8",
    name: "Normativa restrictiva",
    level: "gam",
    responsible: "Cada GAM",
    deliverable:
      "Informe que identifique las leyes nacionales que limitan la autonomía municipal o condicionan su gasto.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Autonomía Municipal",
  },
  {
    id: "gam-9",
    name: "Cartas Orgánicas",
    level: "gam",
    responsible: "Cada GAM",
    deliverable:
      "Medidas para agilizar la aprobación y vigencia de las Cartas Orgánicas Municipales.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Cartas Orgánicas",
  },
  {
    id: "gam-10",
    name: "Dominio tributario",
    level: "gam",
    responsible: "Cada GAM",
    deliverable:
      "Estudio sobre qué impuestos propios podría crear cada GAM según su capacidad administrativa.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Tributación Local",
  },
  {
    id: "gam-11",
    name: "Ley 699",
    level: "gam",
    responsible: "Cada GAM",
    deliverable:
      "Propuesta de nueva Ley de Relacionamiento Internacional.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Relaciones Internacionales",
  },
  {
    id: "gam-12",
    name: "Ley APP",
    level: "gam",
    responsible: "Cada GAM",
    deliverable:
      "Propuesta de normativa que permita a los GAM asociarse con privados para obras públicas.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Alianzas Público-Privadas",
  },
  {
    id: "gam-13",
    name: "Marco laboral",
    level: "gam",
    responsible: "Cada GAM",
    deliverable:
      "Propuesta de reforma del régimen laboral municipal para reducir conflictividad y contingencias.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Régimen Laboral",
  },
  {
    id: "gam-14",
    name: "Auditoría coparticipación",
    level: "gam",
    responsible: "Cada GAM",
    deliverable:
      "Auditoría que muestre si los recursos de coparticipación transferidos a los GAM corresponden a lo que establece la ley.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Coparticipación Municipal",
  },
  {
    id: "gam-15",
    name: "Distribución fiscal",
    level: "gam",
    responsible: "Cada GAM",
    deliverable:
      "Estudio con nueva fórmula que considere población, capacidad fiscal, esfuerzo recaudatorio, NBI, IDH y costos reales de servicios urbanos.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Fórmula de Distribución",
  },
  {
    id: "gam-16",
    name: "Financiamiento modular",
    level: "gam",
    responsible: "Cada GAM",
    deliverable:
      "Propuesta de instrumentos financieros optativos según el perfil crediticio de cada GAM.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Instrumentos de Crédito",
  },
  {
    id: "gam-17",
    name: "PRFT",
    level: "gam",
    responsible: "Cada GAM",
    deliverable:
      "Esquema de reprogramación de deudas y saneamiento fiscal para cada GAM.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Readecuación Financiera",
  },
  {
    id: "gam-18",
    name: "Análisis FPIEEH",
    level: "gam",
    responsible: "Cada GAM",
    deliverable:
      "Análisis interno de cada GAM sobre el impacto de la respuesta del Min. Hidrocarburos y MEFP.",
    state: "con_fecha",
    stateLabel: "14/10/2026",
    deadline: "14/10/2026",
    days: 12,
    category: "FPIEEH Municipal",
  },
  {
    id: "gam-19",
    name: "AMB – Diagnóstico conjunto",
    level: "gam",
    responsible: "AMB",
    deliverable:
      "Documento único con el diagnóstico de los 10 GAM sobre la situación municipal.",
    state: "cumplido",
    stateLabel: "Cumplido",
    category: "Entregas Oficiales AMB",
    isAmbSpecific: true,
  },
  {
    id: "gam-20",
    name: "AMB – Metodología (Anexo a)",
    level: "gam",
    responsible: "AMB",
    deliverable:
      "Documento con la propuesta metodológica de la Agenda 50/50 para municipios.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Entregas Oficiales AMB",
    isAmbSpecific: true,
  },
  {
    id: "gam-21",
    name: "AMB – Normativa priorizada (Anexo b)",
    level: "gam",
    responsible: "AMB",
    deliverable:
      "Documento con la lista de normas que deben modificarse para fortalecer la autonomía municipal.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Entregas Oficiales AMB",
    isAmbSpecific: true,
  },
  {
    id: "gam-22",
    name: "AMB – Condicionalidad del gasto (Anexo c)",
    level: "gam",
    responsible: "AMB",
    deliverable:
      "Documento con el análisis de las 25 condicionalidades que pesan sobre los GAM (9 rígidas y 16 flexibles).",
    state: "entregado",
    stateLabel: "Entregado",
    category: "Entregas Oficiales AMB",
    isAmbSpecific: true,
  },
  {
    id: "gam-23",
    name: "AMB – Matriz laboral (Anexo d)",
    level: "gam",
    responsible: "AMB",
    deliverable:
      "Documento con la problemática del régimen laboral municipal y propuestas de reforma.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Entregas Oficiales AMB",
    isAmbSpecific: true,
  },
  {
    id: "gam-24",
    name: "AMB – Sistematización GAD",
    level: "gam",
    responsible: "AMB",
    deliverable:
      "Documento que ordena las propuestas que enviaron los GAD al SEA.",
    state: "en_curso",
    stateLabel: "En curso",
    category: "Entregas Oficiales AMB",
    isAmbSpecific: true,
  },
  {
    id: "gam-25",
    name: "AMB – Socialización PRFT",
    level: "gam",
    responsible: "AMB",
    deliverable:
      "Jornadas de socialización del reglamento del PRFT entre los 10 GAM.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Entregas Oficiales AMB",
    isAmbSpecific: true,
  },

  // ================= 2.4 Compromisos Conjuntos =================
  {
    id: "conj-1",
    name: "Mesas técnicas",
    level: "conjunto",
    responsible: "NCE + GAD + GAM",
    deliverable:
      "Reuniones permanentes de trabajo entre NCE, GAD y GAM para los 3 ejes de la Agenda.",
    state: "continuo",
    stateLabel: "Continuo",
    category: "Coordinación Intergubernativa",
  },
  {
    id: "conj-2",
    name: "Consejo de Coordinación Técnica",
    level: "conjunto",
    responsible: "NCE",
    deliverable:
      "Convocatoria formal del Consejo que articulará el Gran Acuerdo Nacional.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Instancia Técnica",
  },
  {
    id: "conj-3",
    name: "Gran Acuerdo Nacional",
    level: "conjunto",
    responsible: "Todos",
    deliverable:
      "Acuerdo final que integre los acuerdos 001 y 002 en un solo instrumento.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Pacto Nacional",
  },
  {
    id: "conj-4",
    name: "Ley Especial de Coparticipación",
    level: "conjunto",
    responsible: "NCE + GAD",
    deliverable:
      "Proyecto de Ley que reemplace el actual sistema de coparticipación tributaria.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Marco Legislativo 2027",
  },
  {
    id: "conj-5",
    name: "Implementación PRFT",
    level: "conjunto",
    responsible: "MEFP + GAD + GAM",
    deliverable:
      "Puesta en marcha del Programa de Readecuación Financiera Territorial.",
    state: "sin_plazo",
    stateLabel: "Sin plazo",
    category: "Readecuación Territorial",
  },
];

// Documentos oficiales y descargables
export interface ProcessDocument {
  id: string;
  title: string;
  type: "Acuerdo" | "Acta" | "Presentación" | "Anexo" | "Proyecto de Ley";
  deliverer: string;
  date: string;
  fileSize: string;
  fileUrl: string;
  description: string;
  badge: string;
  featured?: boolean;
}

export const processDocumentsList: ProcessDocument[] = [
  {
    id: "doc-acuerdo-001",
    title: "Acuerdo N° 001/2026 de Sucre (GOBERNACIONES GAD)",
    type: "Acuerdo",
    deliverer: "Gobierno Nacional + 9 GAD",
    date: "05/08/2026",
    fileSize: "1.44 MB",
    fileUrl: "/Acuerdo-001-2026-Agenda-50-50.pdf",
    description:
      "Acuerdo histórico firmado en la Casa de la Libertad para la descentralización fiscal, modificación de la Ley 154, alivio de deudas departamentales y diseño del pacto 50/50.",
    badge: "Oficial GAD",
    featured: true,
  },
  {
    id: "doc-acuerdo-002",
    title: "Acuerdo N° 002/2026 (CIUDADES CAPITALES + EL ALTO + AMB)",
    type: "Acuerdo",
    deliverer: "Gobierno Nacional + 10 GAM + AMB",
    date: "2026",
    fileSize: "11.75 MB",
    fileUrl: "/Acuerdo-002-2026-Agenda-50-50.pdf",
    description:
      "Acuerdo marco intergubernativo de compromisos técnicos, alivio financiero, revisión de condicionalidades del gasto, salud hospitalaria y viabilidad del FPIEEH.",
    badge: "Oficial GAM & AMB",
    featured: true,
  },
  {
    id: "doc-anexo-a",
    title: "AMB – Propuesta Metodológica Agenda 50/50 (Anexo a)",
    type: "Anexo",
    deliverer: "Asociación de Municipalidades de Bolivia (AMB)",
    date: "Septiembre 2026",
    fileSize: "850 KB",
    fileUrl: "/Acuerdo-002-2026-Agenda-50-50.pdf",
    description:
      "Documento con la metodología de trabajo articulada para los 10 municipios capitales en torno a la co-construcción de la Agenda 50/50.",
    badge: "Anexo AMB",
  },
  {
    id: "doc-anexo-b",
    title: "AMB – Normativa Priorizada a Modificar (Anexo b)",
    type: "Anexo",
    deliverer: "AMB + Equipos Jurídicos Municipales",
    date: "Septiembre 2026",
    fileSize: "1.2 MB",
    fileUrl: "/Acuerdo-002-2026-Agenda-50-50.pdf",
    description:
      "Inventario priorizado de disposiciones legales y decretos del nivel central que restringen el ejercicio de la autonomía municipal y el destino del gasto.",
    badge: "Anexo AMB",
  },
  {
    id: "doc-anexo-c",
    title: "AMB – Análisis de las 25 Condicionalidades del Gasto (Anexo c)",
    type: "Anexo",
    deliverer: "AMB",
    date: "Septiembre 2026",
    fileSize: "2.4 MB",
    fileUrl: "/Acuerdo-002-2026-Agenda-50-50.pdf",
    description:
      "Desglose técnico de las 25 condicionalidades que pesan sobre los presupuestos locales: 9 obligaciones rígidas y 16 flexibles transferidas sin fuente de pago.",
    badge: "Entregado AMB",
  },
  {
    id: "doc-anexo-d",
    title: "AMB – Matriz de Problemática Laboral Municipal (Anexo d)",
    type: "Anexo",
    deliverer: "AMB",
    date: "Septiembre 2026",
    fileSize: "980 KB",
    fileUrl: "/Acuerdo-002-2026-Agenda-50-50.pdf",
    description:
      "Propuesta de reforma al régimen laboral en gobiernos municipales para frenar las contingencias por demandas y retención judicial de cuentas.",
    badge: "Anexo AMB",
  },
  {
    id: "doc-ppt-5050",
    title: "Presentación Oficial: Arquitectura de la Agenda 50/50",
    type: "Presentación",
    deliverer: "Servicio Estatal de Autonomías (SEA)",
    date: "Agosto 2026",
    fileSize: "4.8 MB",
    fileUrl: "/Acuerdo-001-2026-Agenda-50-50.pdf",
    description:
      "Diapositivas oficiales presentadas en el Consejo Nacional de Autonomías con el diagnóstico del pacto fiscal y la hoja de ruta hacia el 2027.",
    badge: "Presentación PPT",
  },
  {
    id: "doc-acta-sucre",
    title: "Acta de Instalación de Mesas Técnicas de Coordinación",
    type: "Acta",
    deliverer: "Comisión Técnica SEA - MEFP",
    date: "Agosto 2026",
    fileSize: "1.1 MB",
    fileUrl: "/Acuerdo-001-2026-Agenda-50-50.pdf",
    description:
      "Acta formal de conformación de mesas de trabajo por ejes: Fiscal, Competencial, Normativo e Institucional.",
    badge: "Acta Oficial",
  },
];
