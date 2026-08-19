export interface Pillar {
  id: number;
  title: string;
  summary: string;
  actions: string[];
  category: "Fiscal" | "Competencial" | "Institucional" | "Normativo";
  iconName: string;
}

export interface Milestone {
  id: number;
  title: string;
  date: string;
  status: "Cumplido" | "En proceso" | "Programado" | "Meta";
  detail: string;
  documents?: { name: string; size: string }[];
  participants?: string[];
}

export interface DepartmentData {
  id: string;
  name: string;
  capital: string;
  governor: string;
  adhered: boolean;
  adhesionDate: string;
  currentFiscalRatio: string; // e.g. "15% Subnacional / 85% Central"
  target5050Impact: string; // e.g. "+ Bs 1.450 Millones/año"
  keyProjects: string[];
  mesasCount: number;
  regionalNotes: string;
  pathD: string; // SVG path representation coordinates
}

export interface DocumentItem {
  id: string;
  title: string;
  category: "Acuerdo" | "Proyecto de Ley" | "Decreto" | "Presentación" | "Acta";
  department?: string;
  date: string;
  fileSize: string;
  description: string;
  downloadsCount: number;
  featured?: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  date: string;
  category: "Comunicado" | "Evento" | "Mesa Técnica" | "Declaración";
  department: string;
  summary: string;
  readTime: string;
  imageUrl: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: "General" | "Pacto Fiscal" | "Normativa" | "Transparencia";
}

export const pillars: Pillar[] = [
  {
    id: 1,
    title: "Autonomía tributaria y esfuerzo fiscal",
    category: "Fiscal",
    iconName: "Scale",
    summary: "Fortalecer la capacidad de los GAD para generar y administrar ingresos propios mediante ampliación de dominio tributario.",
    actions: [
      "Incentivar el esfuerzo fiscal y la eficiencia recaudatoria departamental.",
      "Evaluar la reclasificación de al menos una base imponible atribuida hoy al nivel central.",
      "Revisar sobretasas e impuesto departamental a la afectación del medio ambiente.",
      "Proyecto de modificación de la Ley N° 154 en un plazo máximo de 90 días."
    ]
  },
  {
    id: 2,
    title: "Eliminación de condicionalidad de gasto",
    category: "Fiscal",
    iconName: "LockOpen",
    summary: "Revisión integral y eliminación progresiva de condicionalidades que cargan gasto delegado al presupuesto departamental.",
    actions: [
      "Revisar integralmente las normas nacionales que obligan a financiar ítems centrales.",
      "Derogar progresivamente condicionalidades de gasto destinadas a estructuras extinguidas o del nivel central."
    ]
  },
  {
    id: 3,
    title: "Autonomía de gestión presupuestaria",
    category: "Institucional",
    iconName: "Briefcase",
    summary: "Reservar al nivel central únicamente el control de agregados fiscales, otorgando plena libertad en la composición presupuestaria.",
    actions: [
      "Sustituir autorizaciones previas por obligaciones de información transparente.",
      "Implementar el Principio de Reporte Único (un solo canal, una sola vez, un solo formato).",
      "Coordinar niveles de endeudamiento y agilizar operaciones financieras."
    ]
  },
  {
    id: 4,
    title: "Ley Especial de Coparticipación y Distribución 2027",
    category: "Normativo",
    iconName: "Landmark",
    summary: "Conformar mesa técnica para la redacción de la Ley Especial que regirá la distribución equitativa de recursos desde 2027.",
    actions: [
      "Adecuar transferencias fiscales con criterios de sostenibilidad y equidad territorial.",
      "Revisar legislación que absorbió o restringió competencias constitucionales.",
      "Presentar el proyecto de Ley Especial durante la gestión legislativa 2026."
    ]
  },
  {
    id: 5,
    title: "Criterios de distribución de ingresos",
    category: "Fiscal",
    iconName: "PieChart",
    summary: "Superar asimetrías históricas entre departamentos reconociendo el aporte al desempeño económico y población.",
    actions: [
      "Evaluar criterios de compensación y estímulo a la producción regional.",
      "Coordinar mecanismos de ecualización fiscal para departamentos con menor base imponible."
    ]
  },
  {
    id: 6,
    title: "Alivio financiero y readecuación de deudas",
    category: "Fiscal",
    iconName: "TrendingUp",
    summary: "Atender prioritariamente la sostenibilidad financiera mediante reprogramación de deudas y saneamiento fiscal.",
    actions: [
      "Establecer cronograma de reprogramación o diferimiento de obligaciones con el FNDR y banca.",
      "Impulsar el Programa de Readecuación Financiera Departamental."
    ]
  },
  {
    id: 7,
    title: "Alianzas Público-Privadas (APP)",
    category: "Institucional",
    iconName: "Building2",
    summary: "Marco normativo nacional e intergubernativo para acelerar inversión privada en infraestructura y servicios departamentales.",
    actions: [
      "Desarrollar normativa modelo para licitación y contratación de proyectos APP.",
      "Establecer salvaguardas de responsabilidad fiscal ante controversias o arbitrajes."
    ]
  },
  {
    id: 8,
    title: "Relacionamiento internacional y cooperación",
    category: "Normativo",
    iconName: "Globe",
    summary: "Ajustar la Ley N° 699 para permitir a los GAD gestionar directamente fondos y cooperación internacional no reembolsable.",
    actions: [
      "Modificar el régimen de aprobación previa para convenios de cooperación técnica.",
      "Crear ventanilla única de registro de cooperación internacional descentralizada."
    ]
  },
  {
    id: 9,
    title: "Protección del régimen autonómico y LMAD",
    category: "Normativo",
    iconName: "ShieldCheck",
    summary: "Modificar la Ley Marco de Autonomías para evitar recentralización y blindar las competencias autonómicas.",
    actions: [
      "Revisar y derogar artículos recentralizadores en la Ley N° 031.",
      "Crear mecanismo de alerta temprana ante proyectos de ley invasivos."
    ]
  },
  {
    id: 10,
    title: "Fondos de compensación e incentivos",
    category: "Fiscal",
    iconName: "Coins",
    summary: "Creación de fondos especiales para resguardar el equilibrio fiscal de las regiones con fragilidad financiera.",
    actions: [
      "Diseñar el Fondo de Compensación Autonómica (FCA).",
      "Vincular incentivos a metas de transparencia y reducción de burocracia."
    ]
  }
];

export const milestones: Milestone[] = [
  {
    id: 1,
    title: "Diagnóstico técnico Censo 2024",
    date: "Enero - Julio 2026",
    status: "Cumplido",
    detail: "Consolidación de la base de datos demográficos y financieros departamentales compartidos entre el MEFP y los 9 GAD.",
    documents: [{ name: "Informe_Diagnostico_Fiscal_2026.pdf", size: "3.2 MB" }],
    participants: ["Ministerio de Economía", "Viceministerio de Autonomías", "Técnicos de 9 GAD"]
  },
  {
    id: 2,
    title: "Firma del Acuerdo N° 001/2026 en Sucre",
    date: "5 de Agosto de 2026",
    status: "Cumplido",
    detail: "Firma histórica en la Casa de la Libertad entre el Gobierno Nacional y los 9 Gobernadores Departamentales.",
    documents: [{ name: "Acuerdo_Oficial_001_2026_Sucre.pdf", size: "5.8 MB" }],
    participants: ["Presidente del Estado", "9 Gobernadores Departamentales", "Representantes Municipalistas"]
  },
  {
    id: 3,
    title: "Modificación de la Ley N° 154 (Dominio Tributario)",
    date: "En curso (Plazo 90 días)",
    status: "En proceso",
    detail: "Mesa técnica redactora para la ampliación del catálogo tributario autonómico y revisión de gravámenes.",
    documents: [{ name: "Borrador_Anteproyecto_Ley154.pdf", size: "1.4 MB" }],
    participants: ["Comisión Jurídica - Fiscal del Consejo"]
  },
  {
    id: 4,
    title: "Redacción de Ley Especial de Coparticipación",
    date: "Gestión Legislativa 2026",
    status: "En proceso",
    detail: "Diseño de las fórmulas de reparto del pacto 50/50 y criterios de ecualización para la ley que regirá desde 2027.",
    documents: [{ name: "Matriz_Criterios_Distribucion.pdf", size: "2.1 MB" }],
    participants: ["Comisión de Hacienda de la ALP", "Representantes GAD"]
  },
  {
    id: 5,
    title: "Encuentros con Municipios, AIOC y Gran Chaco",
    date: "Septiembre - Octubre 2026",
    status: "Programado",
    detail: "Mesas de diálogo territorial descentralizadas con la FAM-Bolivia, autonomías indígenas y la Región Autónoma del Gran Chaco.",
    participants: ["FAM-Bolivia", "CONAIOC", "Gobierno Regional del Gran Chaco"]
  },
  {
    id: 6,
    title: "Plenario del Consejo Nacional de Autonomías",
    date: "Noviembre 2026",
    status: "Programado",
    detail: "Aprobación del paquete normativo consolidado y presentación formal ante la Asamblea Legislativa Plurinacional.",
    participants: ["Consejo Nacional de Autonomías"]
  },
  {
    id: 7,
    title: "Aplicación de la Gestión Fiscal 50/50",
    date: "1 de Enero de 2027",
    status: "Meta",
    detail: "Entrada en vigencia del nuevo régimen de coparticipación fiscal, alivio financiero y autonomía presupuestaria.",
    participants: ["Estado Plurinacional de Bolivia"]
  }
];

export const departmentsData: DepartmentData[] = [
  {
    id: "LP",
    name: "La Paz",
    capital: "Nuestra Señora de La Paz",
    governor: "Santos Quispe",
    adhered: true,
    adhesionDate: "5 Ago 2026",
    currentFiscalRatio: "18% Depto / 82% Central",
    target5050Impact: "+ Bs 1.850 M / año",
    keyProjects: ["Carretera Apolo-Ixiamas", "Complejo Agroindustrial Norte", "Saneamiento Cuenca Katari"],
    mesasCount: 4,
    regionalNotes: "Enfoque en electrificación rural, conectividad industrial del norte e infraestructura de salud.",
    pathD: "M 80,40 L 130,50 L 150,90 L 125,130 L 90,140 L 60,100 Z"
  },
  {
    id: "SC",
    name: "Santa Cruz",
    capital: "Santa Cruz de la Sierra",
    governor: "Mario Aguilera (Interino)",
    adhered: true,
    adhesionDate: "5 Ago 2026",
    currentFiscalRatio: "14% Depto / 86% Central",
    target5050Impact: "+ Bs 2.900 M / año",
    keyProjects: ["Hub Logístico Viru Viru", "Electrificación Provincia Velasco", "Mantenimiento Red Vial Departamental"],
    mesasCount: 5,
    regionalNotes: "Prioridad en autonomía tributaria ambiental, APP para infraestructura productiva y alivio financiero.",
    pathD: "M 150,90 L 250,80 L 280,180 L 210,240 L 150,170 Z"
  },
  {
    id: "CB",
    name: "Cochabamba",
    capital: "Cochabamba",
    governor: "Humberto Sánchez",
    adhered: true,
    adhesionDate: "5 Ago 2026",
    currentFiscalRatio: "16% Depto / 84% Central",
    target5050Impact: "+ Bs 1.400 M / año",
    keyProjects: ["Ciudadela Científica", "Riego Trópico y Valles", "Hospital Materno Infantil Tercer Nivel"],
    mesasCount: 4,
    regionalNotes: "Énfasis en desarrollo tecnológico, agroindustria del Valle Alto y fortalecimiento de salud.",
    pathD: "M 125,130 L 175,120 L 180,165 L 140,175 Z"
  },
  {
    id: "CH",
    name: "Chuquisaca",
    capital: "Sucre (Sede del Acuerdo)",
    governor: "Damián Condori",
    adhered: true,
    adhesionDate: "5 Ago 2026",
    currentFiscalRatio: "15% Depto / 85% Central",
    target5050Impact: "+ Bs 980 M / año",
    keyProjects: ["Diagonal Jaime Mendoza", "Parque Industrial Sucre", "Desarrollo Turístico Patrimonio"],
    mesasCount: 4,
    regionalNotes: "Sede de la firma histórica. Prioriza diversificación económica, agua potable e incentivos turísticos.",
    pathD: "M 140,175 L 185,165 L 195,210 L 150,215 Z"
  },
  {
    id: "TJ",
    name: "Tarija",
    capital: "Tarija",
    governor: "Oscar Montes",
    adhered: true,
    adhesionDate: "5 Ago 2026",
    currentFiscalRatio: "21% Depto / 79% Central",
    target5050Impact: "+ Bs 1.150 M / año",
    keyProjects: ["Presea de Alivio Deuda FNDR", "Conexión Energética Gran Chaco", "Presa San Jacinto Ampliación"],
    mesasCount: 5,
    regionalNotes: "Énfasis central en alivio fiscal, reprogramación de fideicomisos e integración con la Región del Gran Chaco.",
    pathD: "M 150,215 L 195,210 L 190,260 L 145,250 Z"
  },
  {
    id: "PT",
    name: "Potosí",
    capital: "Potosí",
    governor: "Marco Antonio Copa",
    adhered: true,
    adhesionDate: "5 Ago 2026",
    currentFiscalRatio: "19% Depto / 81% Central",
    target5050Impact: "+ Bs 1.600 M / año",
    keyProjects: ["Industrialización de Litio (Regalías)", "Aeropuerto Internacional Potosí", "Hospital de Tercer Nivel"],
    mesasCount: 4,
    regionalNotes: "Revisión de regalías mineras, gravámenes ambientales a la extracción y proyectos de valor agregado.",
    pathD: "M 90,170 L 140,175 L 150,215 L 145,250 L 85,220 Z"
  },
  {
    id: "OR",
    name: "Oruro",
    capital: "Oruro",
    governor: "Edson Oczachoque",
    adhered: true,
    adhesionDate: "5 Ago 2026",
    currentFiscalRatio: "17% Depto / 83% Central",
    target5050Impact: "+ Bs 890 M / año",
    keyProjects: ["Puerto Seco Oruro", "Planta Fotovoltaica Fase II", "Carretera Ancaravi-Turco"],
    mesasCount: 3,
    regionalNotes: "Fortalecimiento de logística biocéanica, captación tributaria aduanera/comercial y energía limpia.",
    pathD: "M 80,140 L 125,130 L 140,175 L 90,170 Z"
  },
  {
    id: "BN",
    name: "Beni",
    capital: "Trinidad",
    governor: "Alejandro Unzueta",
    adhered: true,
    adhesionDate: "5 Ago 2026",
    currentFiscalRatio: "12% Depto / 88% Central",
    target5050Impact: "+ Bs 1.250 M / año",
    keyProjects: ["Carretera Trinidad-Guayaramerín", "Defensivos de Inundaciones", "Complejo Cárnico de Exportación"],
    mesasCount: 4,
    regionalNotes: "Foco en infraestructura de integración vial, protección ante eventos climáticos y desarrollo ganadero.",
    pathD: "M 130,50 L 220,40 L 250,80 L 150,90 Z"
  },
  {
    id: "PD",
    name: "Pando",
    capital: "Cobija",
    governor: "Regis Richter",
    adhered: true,
    adhesionDate: "5 Ago 2026",
    currentFiscalRatio: "11% Depto / 89% Central",
    target5050Impact: "+ Bs 620 M / año",
    keyProjects: ["Puente Binacional Cobija", "Electrificación Solar de la Amazonía", "Industrialización de la Castaña"],
    mesasCount: 3,
    regionalNotes: "Atención prioritaria por rezago histórico, desarrollo de economía sostenible amazónica y zonas francas.",
    pathD: "M 90,20 L 160,15 L 130,50 L 80,40 Z"
  }
];

export const documentsList: DocumentItem[] = [
  {
    id: "DOC-001",
    title: "Acuerdo N° 001/2026 - Firma Sucre 5 de Agosto",
    category: "Acuerdo",
    date: "05/08/2026",
    fileSize: "5.8 MB",
    description: "Documento oficial completo suscrito por el Presidente del Estado Plurinacional y los 9 Gobernadores Departamentales.",
    downloadsCount: 14250,
    featured: true
  },
  {
    id: "DOC-002",
    title: "Anteproyecto de Modificación de la Ley N° 154 (Clasificación Tributaria)",
    category: "Proyecto de Ley",
    date: "12/08/2026",
    fileSize: "2.4 MB",
    description: "Borrador de ley elaborado por la Mesa Técnica para ampliar el dominio tributario departamental.",
    downloadsCount: 8910,
    featured: true
  },
  {
    id: "DOC-003",
    title: "Matriz del Diagnóstico Fiscal y Financiero Censo 2024",
    category: "Presentación",
    date: "01/08/2026",
    fileSize: "8.1 MB",
    description: "Presentación técnica detallada sobre la distribución actual de recursos y proyecciones del pacto 50/50.",
    downloadsCount: 6540
  },
  {
    id: "DOC-004",
    title: "Reglamento del Principio de Reporte Único Presupuestario",
    category: "Decreto",
    date: "14/08/2026",
    fileSize: "1.8 MB",
    description: "Lineamientos para la simplificación de trámites y eliminación de reportes redundantes hacia el MEFP.",
    downloadsCount: 4200
  },
  {
    id: "DOC-005",
    title: "Acta de la I Sesión Extraordinaria de la Comisión de Hacienda Sucre",
    category: "Acta",
    date: "06/08/2026",
    fileSize: "1.1 MB",
    description: "Acta oficial con los acuerdos metodológicos para la Ley Especial de Coparticipación 2027.",
    downloadsCount: 3100
  },
  {
    id: "DOC-006",
    title: "Guía Didáctica para el Ciudadano: ¿Qué es la Agenda 50/50?",
    category: "Presentación",
    date: "10/08/2026",
    fileSize: "4.5 MB",
    description: "Folleto explicativo en formato infográfico para la pedagogía urbana y rural sobre la autonomía fiscal.",
    downloadsCount: 11200,
    featured: true
  }
];

export const newsArticles: NewsArticle[] = [
  {
    id: "NEWS-101",
    title: "Sucre marca el inicio de una nueva era autonómica con la firma del Acuerdo 001/2026",
    date: "5 de Agosto de 2026",
    category: "Evento",
    department: "Chuquisaca",
    summary: "En la histórica Casa de la Libertad, el Gobierno Nacional y las 9 gobernaciones sellaron el compromiso fiscal 50/50.",
    readTime: "4 min lectura",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "NEWS-102",
    title: "Instalan la Mesa Técnica para la reforma prioritaria de la Ley N° 154 en La Paz",
    date: "12 de Agosto de 2026",
    category: "Mesa Técnica",
    department: "La Paz",
    summary: "Equipos de juristas y economistas revisan los tributos subnacionales con la meta de enviar la propuesta a la ALP en 90 días.",
    readTime: "3 min lectura",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "NEWS-103",
    title: "Gobernadores evalúan mecanismos de alivio de deuda con el FNDR y banca pública",
    date: "15 de Agosto de 2026",
    category: "Comunicado",
    department: "Tarija",
    summary: "Se acuerda la reprogramación de fideicomisos para liberar liquidez inmediata en proyectos de inversión regional.",
    readTime: "5 min lectura",
    imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop"
  }
];

export const faqList: FAQItem[] = [
  {
    category: "General",
    question: "¿Qué es la Agenda 50/50 y cuál es su objetivo principal?",
    answer: "La Agenda 50/50 es una estrategia de Estado acordada el 5 de agosto de 2026 en Sucre para reestructurar la relación fiscal y competencial entre el Nivel Central y las autonomías. Su objetivo es alcanzar un equilibrio transparente (50/50) en el esfuerzo, los recursos y las competencias, asegurando que las regiones tengan ingresos suficientes para brindar servicios públicos de calidad."
  },
  {
    category: "Pacto Fiscal",
    question: "¿Cómo afectará la Agenda 50/50 al presupuesto de mi departamento?",
    answer: "Permitirá a cada Gobierno Autónomo Departamental (GAD) captar más ingresos propios mediante nuevos tributos locales, eliminar gastos obligados que corresponden al Estado Central y recibir una mayor coparticipación de recursos a partir de la Ley Especial que regirá en la gestión 2027."
  },
  {
    category: "Normativa",
    question: "¿Por qué es crucial modificar la Ley N° 154?",
    answer: "La Ley N° 154 de Clasificación Tributaria actual limita severamente la capacidad de las gobernaciones para crear impuestos propios. Su reforma en un plazo máximo de 90 días otorgará verdadero dominio tributario a las regiones."
  },
  {
    category: "Transparencia",
    question: "¿Qué es el Principio de Reporte Único?",
    answer: "Es la simplificación administrativa para que las entidades autonómicas reporten sus datos financieros e institucionales una sola vez, por un único canal digital y en un solo formato, eliminando duplicidad burocrática y garantizando datos abiertos al público."
  }
];

export const instruments = [
  "Proyectos de Ley de la ALP",
  "Decretos Supremos de Aplicación",
  "Convenios Intergubernativos",
  "Acuerdos Fiscales Departamentales",
  "Reformas Reglamentarias Locales",
  "Reglamentos de la Ley N° 154",
  "Modelos de Contrato para APP"
];

export const principles = [
  "Corresponsabilidad Fiscal",
  "Equidad Territorial",
  "Autonomía de Gestión",
  "Transparencia Activa",
  "Reporte Único Abierto",
  "Resultados Verificables"
];
