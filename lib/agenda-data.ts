export interface MonitorConfig {
  sectionBadge: string;
  sectionTitle: string;
  sectionSubtitle: string;
  showCountdown: boolean;
  countdownBadge: string;
  countdownTitle: string;
  countdownDescription: string;
  countdownResponsible?: string;
  countdownTargetDate: string;
}

export interface MonitorMetric {
  id: number;
  order: number;
  title: string;          // Contador
  value: string;          // Días restantes o texto destacado
  description: string;    // Detalle
  responsible?: string;   // Quién debe cumplir
  deliverable?: string;   // Qué debe entregar
  deadlineDate?: string;  // Fecha límite (formato YYYY-MM-DD o DD/MM/YYYY)
  badge: string;
  category?: string;
  iconName: string;
  colorScheme: string; // "emerald" | "amber" | "red" | "blue"
  active: boolean;
}

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
  category: "Acuerdo" | "Acta" | "Presentación" | "Anexo" | "Proyecto de Ley" | "Decreto" | string;
  department?: string;
  date: string;
  fileUrl?: string;
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

export interface ConceptStep {
  id?: number;
  num: number;
  title: string;
  desc: string;
  tag: string;
  items: string[];
}

export const conceptStepsList: ConceptStep[] = [
  {
    "id": 1,
    "num": 1,
    "title": "¿Qué es la Agenda 50/50?",
    "desc": "Es un proceso de co-construcción colectiva, donde las Entidades Territoriales Autónomas, el Órgano Ejecutivo Nacional, las instituciones privadas y la sociedad civil son actores centrales, cuyo objetivo estratégico es la reforma estructural del Estado para alcanzar autonomias reales, efectivas y eficientes, equilibrando responsabilidades con recursos y considerando capacidades institucionales diferenciadas.",
    "tag": "Un Estado más ordenado, equitativo, eficiente y corresponsable",
    "items": [
      "Decisión",
      "Competencias",
      "Recursos",
      "Equidad y Eficiencia"
    ]
  },
  {
    "id": 2,
    "num": 2,
    "title": "¿Qué cambiará?",
    "desc": "Después de más 15 años de un proceso autonómico inconcluso, la Agenda 50/50 plantea una reforma estructural para ordenar el Estado y fortalecer los gobiernos autónomos departamentales, regional, municipales e indígena originario campesinos",
    "tag": "Más autonomía para impulsar el desarrollo",
    "items": [
      "Revisar las normas que limitan las autonomías",
      "Mejor y progresiva distribución de recursos",
      "Alivio financiero para fortalecer la gestión subnacional",
      "Mayor capacidad para generar recursos"
    ]
  },
  {
    "id": 3,
    "num": 3,
    "title": "¿Cómo se hará?",
    "desc": "La Agenda 50/50 se co-construirá a través de una ruta metodológica que comprende: coordinación técnica, diagnóstico compartido, co-construcción de consensos, ejecución y seguimiento, sobre principios de reglas claras, coresponsabilidad fiscal, coordinación intergubernativa, calidad del gasto y resultados verificables y progresivos",
    "tag": "Co-construcción y Corresponsabilidad",
    "items": [
      "Instancias técnicas nacional y subnacional",
      "Elaboración de diagnósticos sectoriales y territoriales",
      "Resultados verificables",
      "Implementación progresiva"
    ]
  },
  {
    "id": 4,
    "num": 4,
    "title": "¿Qué busca?",
    "desc": "La Agenda 50/50 busca la reforma estructural del Estado para alcanzar autonomias reales, efectivas y eficientes, con gestión territorial fortalecida y responsabilidades compartidas que mejoren la calidad de vida de la población, y que fomenten la generación de riqueza",
    "tag": "El desarrollo empieza en las regiones",
    "items": [
      "Mejorar la calidad del gasto",
      "Promover desarrollo económico",
      "Finanzas regionales transparentes y sostenibles",
      "Fortalecer la gestión pública subnacional"
    ]
  }
];


export const pillars: Pillar[] = [
  {
    "id": 1,
    "title": "Autonomía tributaria, esfuerzo fiscal y fortalecimiento de los ingresos propios",
    "category": "Fiscal",
    "iconName": "Scale",
    "summary": "Fortalecer la autonomía fiscal de los Gobiernos Autónomos Departamentales mediante mecanismos que amplien su capacidad de generar y administrar ingresos propios, promoviendo el esfuerzo fiscal, la eficiencia recaudatoria y la sostenibilidad de las finanzas públicas.",
    "actions": [
      "Evaluar mecanismos que incentiven el esfuerzo fiscal y la eficiencia recaudatoria de los Gobiemos Autónomos Departamentales, fortaleciendo la generación de ingresos propios y promoviendo una mayor corresponsabilidad fiscal entre los distintos niveles de gobiermo.",
      "Evaluar mecanismos para ampliar el dominio tributario departamental, mediante la reclasificación de al menos una base imponible hoy atribuida al nivel central.",
      "Evaluar alternativas para ampliar las potestades tributarias departamentales, incluyendo la creación de nuevos tributos dentro del marco de la Constitución Politica del Estado",
      "Analizar mecanismos para la aplicación de sobretasas, definiendo su alcance, límites, destino y compatibilidad con el sistema tributario nacional.",
      "Evaluar mecanismos para habilitar el ejercicio efectivo del impuesto departamental a la afectación del medio ambiente, revisando las exclusiones sectoriales que hoy limitan su aplicación",
      "Iniciar el proceso de modificación de la Ley No 154 de Clasificación y Definición de Impuestos y de Regulación para la Creación y/o Modificación de Impuestos de Dominio de los Gobiernos Autónomos, en el marco de promover la generación de mayores recursos departamentales. El proyecto de Ley deberá ser elaborado en un plazo máximo de 90 dias."
    ]
  },
  {
    "id": 2,
    "title": "Condicionalidad de gasto",
    "category": "Fiscal",
    "iconName": "LockOpen",
    "summary": "La autonomia consiste, entre otros aspectos, en decidir en qué gastar: Una parte considerable hoy se decide por normativa nacional.\n",
    "actions": [
      "Revisar integralmente el conjunto de normas nacionales que condicionan el destino del gasto de los GAD",
      "Derogar progresivamente y de manera coordinada las condicionalidades de gasto que financie obligaciones propias del nivel central o que coresponda a estructuras institucionales extinguidas"
    ]
  },
  {
    "id": 3,
    "title": "Autonomía de gestión presupuestaria",
    "category": "Institucional",
    "iconName": "Briefcase",
    "summary": "Ampliar la autonomía en la gestión presupuestaria al máximo posible",
    "actions": [
      "Analizar mecanismos para que la relación presupuestaria entre el nivel central del Estado y los Gobiernos Autónomos Departamentales se justifique únicamente en razones de seguridad fiscal nacional, entendidas como la sostenibilidad de la deuda pública y la consistencia de los agregados fiscales",
      "Reservar al nivel central el control sobre los agregados fiscales y a los Gobiernos Autónomos Departamentales la decisión sobre la composición de su presupuesto",
      "Coordinar con el Nivel Central los niveles de endeudamiento de los gobiernos autónomos departamentales",
      "Sustituir las autorizaciones previas del nivel central sobre decisiones presupuestarias departamentales por obligaciones de información, preservando integramente el acceso del nivel central a los datos que requiere para el seguimiento fiscal y el cumplimiento de compromisos internacionales",
      "Racionalizar las obligaciones de reporte, eliminando duplicaciones entre entidades del nivel central, bajo el principio de reporte único: una sola vez, un solo canal, un solo formato."
    ]
  },
  {
    "id": 4,
    "title": "Competencias y financiamiento intergubernamental",
    "category": "Normativo",
    "iconName": "Landmark",
    "summary": "Equilibrar las transferencias fiscales con el odenamiento competencial y las capacidades\ninstitucionales.",
    "actions": [
      "Revisar la legislación nacional que haya modificado, absorbido, restringido o condicionado el ejercicio de competencias reconocidas constitucionalmente a los GAD.",
      "Identificar competencias que puedan ser fortalecidas, reasignadas o ejercidas mediante mecanismos de coordinación, concurrencia o delegación, con el propósito de mejorar el ejercicio competencial",
      "Evaluar mecanismos para adecuar las transferencias fiscales intergubernamentales al marco competencial previsto en la Constitución Politica del Estado, considerando criterios de sostenibilidad fiscal, equidad teritorial y corresponsabilidad",
      "Las partes acuerdan conformar una mesa técnica especializada para elaborar la propuesta de Ley Especial de Coparticipación y Distribución de Recursos Fiscales, con el propósito de alcanzar los consensos necesarios para su presentación durante la presente gestión legislativa y viabilizar su aplicación a partir de la gestión fiscal 2027, en el marco de la implementación progresiva de la Agenda 50/50."
    ]
  },
  {
    "id": 5,
    "title": "Criterios de distribución de ingresos fiscales",
    "category": "Fiscal",
    "iconName": "PieChart",
    "summary": "Revisar criterios de distribución fiscal que han generado asimetrias entre departamentos",
    "actions": [
      "Evaluar la inclusión de criterios de distribución de ingresos fiscales a los GAD que premien la eficiencia, contribución al desempeño económico departamental y otros factores",
      "Evaluar de manera coordinada con los Gobiernos Autónomos Departamentales los criterios de distribución de ingresos fiscales en función de generar dinamismo económico y equidad entre departamentos."
    ]
  },
  {
    "id": 6,
    "title": "Protección del régimen autonómico",
    "category": "Fiscal",
    "iconName": "TrendingUp",
    "summary": "Medidas para prevenir la vulneración al régimen competencial autonómico en el futuro",
    "actions": [
      "ldentificar y promover los ajustes normativos constitucionales necesarios para garantizar el pleno respeto al régimen autonómico previsto en la Constitución y desarrollado por la jurisprudencia constitucional.",
      "ldentificación y corrección progresiva de las afectaciones al régimen competencial."
    ]
  },
  {
    "id": 7,
    "title": "Alianzas público-privadas",
    "category": "Institucional",
    "iconName": "Building2",
    "summary": "Lograr una mayor fluidez de los acuerdos y ejecucion de proyectos de desarrollo entre el sector privado y público",
    "actions": [
      "Desarrollar una propuesta de normativa nacional que viabilice las alianzas público-privadas desde los GAD",
      "Mantener la responsabilidad fiscal ante medidas de arbitraje."
    ]
  },
  {
    "id": 8,
    "title": "Financiamiento Externo",
    "category": "Normativo",
    "iconName": "Globe",
    "summary": "Modificar la Ley No. 699 de Relacionamiento Internacional y normativa conexa a efectos de aumentar la capacidad legislativa de los Gobiernos Autónomos Departamentales en la materia compartida de relaciones internacionales.\n",
    "actions": []
  },
  {
    "id": 9,
    "title": "Fondos de Compensación",
    "category": "Normativo",
    "iconName": "ShieldCheck",
    "summary": "Analizar y evaluar la creación de fondos de compensación para fortalecer la sostenibilidad financiera de los Gobiernos Autónomos Departamentales",
    "actions": []
  },
  {
    "id": 10,
    "title": "Transferencia de Instituciones",
    "category": "Fiscal",
    "iconName": "Coins",
    "summary": "Iniciar, identificar y evaluar la factibilidad de la transferencia progresiva de instituciones públicas susceptibles de administración departamental, en el marco del fortalecimiento de las autonomias departamentales\n",
    "actions": []
  },
  {
    "id": 11,
    "title": "Alivio Fiscal",
    "category": "Fiscal",
    "iconName": "Scale",
    "summary": "Las partes reconocen la necesidad de atender de manera prioritaria la situación financiera que atraviesan los Gobiernos Autónomos Departamentales. En ese marco, acuerdan establecer un cronograma de trabajo conjunto para evaluar e implementar medidas de alivio\nfinanciero, incluyendo mecanismos de reprogramación o diferimiento de obligaciones financieras, asi como otras acciones orientadas al saneamiento y la sostenibilidad fiscal de las gobernaciones, en el marco de la Agenda 50/50 y el Programa de Readecuación Financiera",
    "actions": []
  }
];

export const pillarsAcuerdo002: Pillar[] = [
  {
    id: 101,
    title: "Libertades y eficiencia autonómica",
    category: "Institucional",
    iconName: "Briefcase",
    summary: "Fortalecer las condiciones operativas para que los GAM ejerzan efectivamente sus competencias, tomen decisiones de gestión oportunas y presten servicios públicos eficientes y orientados a resultados.",
    actions: [
      "Priorización del sector salud",
      "Competencias y cargas financieras",
      "Servicios públicos e impacto urbano",
      "Gestión metropolitana y conurbación",
      "Simplificación y reporte único",
      "Transparencia, gestión de datos y rendición de cuentas",
      "Simplificación de la gestión pública"
    ]
  },
  {
    id: 102,
    title: "Reformas normativas",
    category: "Normativo",
    iconName: "Scale",
    summary: "Identificar e impulsar las adecuaciones normativas necesarias para profundizar la autonomía municipal, eliminar restricciones al gasto y estructurar un marco jurídico predecible para el desarrollo local.",
    actions: [
      "Revisión de normativa restrictiva",
      "Cartas orgánicas",
      "Dominio tributario adaptativo",
      "Relacionamiento internacional y cooperación",
      "Inversión y alianzas público-privadas (APP)",
      "Gestión laboral municipal"
    ]
  },
  {
    id: 103,
    title: "Acuerdos fiscales y financiamiento",
    category: "Fiscal",
    iconName: "Coins",
    summary: "Estructurar una relación equilibrada entre las necesidades socioeconómicas del municipio y la capacidad de respuesta institucional del GAM con los recursos disponibles.",
    actions: [
      "Análisis de fuentes",
      "Distribución fiscal equitativa",
      "Financiamiento innovador modular",
      "Gestión presupuestaria eficiente",
      "Alivio y readecuación financiera diferenciada",
      "FPIEEH (Ley N° 767)"
    ]
  }
];

export const milestones: Milestone[] = [
  {
    "id": 1,
    "title": "Diagnóstico técnico Censo 2024",
    "date": "Enero - Julio 2026",
    "status": "Cumplido",
    "detail": "Consolidación de la base de datos demográficos y financieros departamentales compartidos entre el MEFP y los 9 GAD.",
    "participants": [
      "Ministerio de Economía",
      "Viceministerio de Autonomías",
      "Técnicos de 9 GAD"
    ]
  },
  {
    "id": 2,
    "title": "Firma del Acuerdo N° 001/2026 en Sucre",
    "date": "5 de Agosto de 2026",
    "status": "Cumplido",
    "detail": "Firma histórica en la Casa de la Libertad entre el Gobierno Nacional y los 9 Gobernadores Departamentales.",
    "participants": [
      "Presidente del Estado",
      "9 Gobernadores Departamentales",
      "Representantes Municipalistas"
    ]
  },
  {
    "id": 3,
    "title": "Modificación de la Ley N° 154 (Dominio Tributario)",
    "date": "En curso (Plazo 90 días)",
    "status": "En proceso",
    "detail": "Mesa técnica redactora para la ampliación del catálogo tributario autonómico y revisión de gravámenes.",
    "documents": [
      {
        "name": "Borrador_Anteproyecto_Ley154.pdf",
        "size": "1.4 MB"
      }
    ],
    "participants": [
      "Comisión Jurídica - Fiscal del Consejo"
    ]
  },
  {
    "id": 4,
    "title": "Redacción de Ley Especial de Coparticipación",
    "date": "Gestión Legislativa 2026",
    "status": "En proceso",
    "detail": "Diseño de las fórmulas de reparto del pacto 50/50 y criterios de ecualización para la ley que regirá desde 2027.",
    "documents": [
      {
        "name": "Matriz_Criterios_Distribucion.pdf",
        "size": "2.1 MB"
      }
    ],
    "participants": [
      "Comisión de Hacienda de la ALP",
      "Representantes GAD"
    ]
  },
  {
    "id": 5,
    "title": "Encuentros con Municipios",
    "date": "Septiembre - Octubre 2026",
    "status": "Cumplido",
    "detail": "La Paz, 27 de agosto de 2026 (ABI). – Acompañado de ministros y viceministros, el presidente del Estado, Rodrigo Paz, y la Federación de Asociaciones de Municipios (FAM) de Bolivia iniciaron este jueves la reunión en la ciudad de La Paz para tratar una agenda de seis puntos, en la que se prioriza la propuesta gubernamental del 50/50.\n\n“Me siento bendecido de estar con ustedes para poder realmente transformar este Estado. Debe ser la primera vez en la historia de Bolivia que un presidente quiere acabar con el Estado centralista y eso creo que nos suma en el mismo esfuerzo”, expresó el mandatario al inaugurar el encuentro.\n\nEl jefe de Estado exhortó a los alcaldes a acabar con el Estado centralista de “forma ordenada y consistente para no tener retornos, ni coletazos”, sino que se vaya conformando y consolidando el proceso.\n\n“Yo agradecido por este encuentro, no solo como uno más de ustedes en su momento, he sido concejal, he sido alcalde y me siento parte de la familia con la cual tendremos que llevar adelante las grandes transformaciones”, remarcó.\n\nResaltó que en la reunión uno de los temas a tratar es el 50/50, una propuesta del Gobierno nacional que “no es el final, es el principio de lo que realmente se quiere construir para el futuro de la patria”.\n\nEn tanto, el presidente de la FAM-Bolivia, Johnny Torres, indicó que con los representantes ediles analizaron el miércoles una agenda a tratar en el encuentro de esta jornada con las autoridades del Gobierno nacional.\n\n“Hemos estado ayer (miércoles) reunidos todo el día analizando los temas de la agenda. Nosotros tenemos una agenda de seis puntos que la hemos propuesto al Gobierno, primero el 50/50 el cual nosotros esperamos”, puntualizó.\n\nSubrayó que en esta agenda se pide que el 50/50 se consolide en lo posible en el Presupuesto 2027.\n\n“Si se viabiliza el 50/50 como estamos proponiendo, el Gobierno podría disponer del IDH (Impuesto Directo a los Hidrocarburos) para recursos con gobernaciones y otros y por lo tanto los municipios podríamos tener coparticipación, recursos propios y probablemente recursos de crédito”, comentó.\n\nEn la reunión también están presentes los ministros de la Presidencia, Fernando Aramayo; y de Economía y Finanzas Públicas, Christian Morales, además de viceministros de diferentes carteras de Estado.",
    "participants": [
      "FAM-Bolivia"
    ]
  },
  {
    "id": 8,
    "title": "Reunión técnica convocada por la Conaioc Bolivia  junto al Viceministerio de Autonomías y Tierras",
    "date": "12 de Septiembre",
    "status": "Cumplido",
    "detail": "Avanzamos en la co-construcción de la Agenda 50/50.\nDesde el Servicio Estatal de Autonomías, acompañamos la reunión técnica convocada por la Conaioc Bolivia  junto al Viceministerio de Autonomías y Tierras - Bolivia para estructurar la hoja de ruta de la Agenda 50/50. \nEl encuentro contó con la participación de los equipos técnicos de todos los Gobiernos Autónomos Indígena Originario Campesinos (GAIOC). Durante las mesas de trabajo, se analizaron aspectos críticos desde la tramitación burocrática para el acceso a la autonomía, hasta los cuellos de botella administrativos que limitan una gestión pública territorial plenamente eficiente.\nLa sistematización de estos desafíos técnicos permitirá estructurar soluciones viables dentro de la Agenda 50/50. Valoramos la visión de los GAIOC para transformar estas dificultades administrativas en propuestas concretas para las autonomías",
    "participants": [
      "CONAIOC",
      "Viceministerio de Autonomías"
    ]
  },
  {
    "id": 6,
    "title": "Plenario del Consejo Nacional de Autonomías",
    "date": "Noviembre 2026",
    "status": "Programado",
    "detail": "Aprobación del paquete normativo consolidado y presentación formal ante la Asamblea Legislativa Plurinacional.",
    "documents": [],
    "participants": [
      "Consejo Nacional de Autonomías"
    ]
  },
  {
    "id": 7,
    "title": "Aplicación de la Gestión Fiscal 50/50",
    "date": "1 de Enero de 2027",
    "status": "Meta",
    "detail": "Entrada en vigencia del nuevo régimen de coparticipación fiscal, alivio financiero y autonomía presupuestaria.",
    "documents": [],
    "participants": [
      "Estado Plurinacional de Bolivia"
    ]
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
    "id": "doc-1",
    "title": "Acuerdo N° 001/2026 - Firma de Sucre (5 de Agosto de 2026)",
    "category": "Acuerdo",
    "date": "05/08/2026",
    "fileSize": "1.44 MB",
    "fileUrl": "/Acuerdo-001-2026-Agenda-50-50.pdf",
    "description": "Acuerdo firmado en Sucre plantea una ruta técnica para avanzar en autonomía fiscal, alivio financiero, distribución de recursos, competencias y fortalecimiento de los gobiernos departamentales.",
    "downloadsCount": 1420,
    "featured": true
  },
  {
    "id": "doc-2",
    "title": "Acuerdo N° 002/2026 - GAM de Capitales y El Alto",
    "category": "Acuerdo",
    "date": "2026",
    "fileSize": "11.7 MB",
    "fileUrl": "/Acuerdo-002-2026-Agenda-50-50.pdf",
    "description": "Acuerdo técnico suscrito entre el Gobierno Nacional y los Gobiernos Autónomos Municipales de Ciudades Capitales y El Alto en torno a libertades autonómicas, reformas normativas y acuerdos fiscales.",
    "downloadsCount": 860,
    "featured": true
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
    imageUrl: "/assets/multimedia_cover.jpg"
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

export interface MediaItem {
  id: string;
  title: string;
  type: "videos" | "webinars" | "reuniones" | "medios";
  category?: string;
  mediaUrl?: string;
  embedUrl?: string;
  url?: string;
  platform?: string;
  coverUrl?: string;
  duration?: string;
  date?: string;
  description?: string;
  order?: number;
}

export const mediaItemsList: MediaItem[] = [
  {
    "id": "cmur5o8w10000od50ghe1s37j",
    "title": "Primer resultado concreto del proceso de co-construcción de la Agenda 5050",
    "type": "videos",
    "mediaUrl": "/uploads/multimedia/primer-resultado-concreto-del-proceso-de-co-construcci-n-de-la-agenda-5050-1790957195205.mp4",
    "coverUrl": "/uploads/multimedia/primer-resultado-concreto-del-proceso-de-co-construcci-n-de-la-agenda-5050-1790957196267.jpg",
    "description": "La Agenda 50/50 muestra resultados\r\nEl presidente Rodrigo Paz Pereira promulgó la Ley N° 1771, que materializa el Acuerdo 001 firmado con los nueve gobernadores de Bolivia.\r\nCon esta norma, el nivel central del Estado asume el financiamiento del régimen penitenciario, el bono de vacunación y otras obligaciones que hasta ahora recaían en los gobiernos departamentales. Además, se rompe la condicionalidad vigente desde 2005 y se liberan más de 200 millones de bolivianos para que los gobiernos autónomos departamentales decidan sobre sus propios recursos.\r\nEs un resultado concreto del proceso de co-construcción de la Agenda 50/50",
    "order": 0
  },
  {
    "id": "cmur6b5h7000043p7tqz6k9z0",
    "title": "Portales para conocer y acompañar la Agenda 5050",
    "type": "videos",
    "mediaUrl": "/uploads/multimedia/portales-para-conocer-y-acompa-ar-la-agenda-5050-1790958262441.mp4",
    "coverUrl": "/uploads/multimedia/portales-para-conocer-y-acompa-ar-la-agenda-5050-1790958264452.jpg",
    "description": "¡La información sobre el proceso autonómico está al alcance de todas y todos!   Conoce los avances, acuerdos y el Centro de Datos Autonómicos construidos de manera conjunta para transparentar la gestión.   \r\n🔗 Explora toda la información disponible en:\r\n▪️ Portal Agenda 50/50: agenda50-50.sea.gob.bo\r\n▪️ Centro de Datos Autonómicos (CEDIA): cedia.sea.gob.bo\r\n▪️ Presupuesto Abierto: abierto.economiayfinanzas.gob.bo   \r\nMás información, más datos y mayor acceso para conocer y acompañar el proceso autonómico.",
    "order": 0
  },
  {
    "id": "v-1",
    "title": "¿Qué es la Agenda 50/50?",
    "type": "videos",
    "category": "Explicador Oficial",
    "mediaUrl": "/videos/Agenda5050.mp4",
    "coverUrl": "/assets/video_que_es_5050_cover.jpg",
    "duration": "Cápsula Informativa",
    "order": 1
  },
  {
    "id": "w-1",
    "title": "Diálogos al Café: Análisis y Debate sobre la Agenda 50/50",
    "type": "webinars",
    "category": "Diálogo & Debate",
    "embedUrl": "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fdialogosalcafe%2Fvideos%2F4414139728840664%2F&show_text=false",
    "url": "https://www.facebook.com/dialogosalcafe/videos/4414139728840664/?rdid=5ef4aKa3wd2s7eMY#",
    "platform": "Facebook Live",
    "coverUrl": "/assets/webinar_dialogos_cafe_cover.jpg",
    "date": "Transmisión en Vivo",
    "description": "Espacio de diálogo y análisis sobre el desarrollo regional, desburocratización y propuestas de la Agenda 50/50.",
    "order": 1
  },
  {
    "id": "r-1",
    "title": "Reunión e Informe Oficial - Cobertura BTV Canal Oficial",
    "type": "reuniones",
    "category": "Gobiernos Autónomos",
    "embedUrl": "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FBTVCanalOficial%2Fvideos%2F2801286836919000%2F&show_text=false",
    "url": "https://www.facebook.com/BTVCanalOficial/videos/2801286836919000/",
    "platform": "Facebook Live / BTV",
    "coverUrl": "/assets/reunion_btv_cover.jpg",
    "date": "Cobertura BTV",
    "description": "Reunión informativa y cobertura especial sobre los avances de la Agenda 50/50 transmitida por Bolivia TV.",
    "order": 1
  },
  {
    "id": "m-1",
    "title": "¿Cómo se repartirán los recursos? Chuquisaca tiene su propuesta del 50/50",
    "type": "medios",
    "category": "Propuesta Departamental",
    "embedUrl": "https://www.dailymotion.com/embed/video/xausur2",
    "url": "https://www.dailymotion.com/video/xausur2",
    "platform": "Dailymotion / El Deber",
    "coverUrl": "/assets/cobertura_chuquisaca_5050.jpg",
    "date": "El Deber / Cobertura TV",
    "description": "Exposición de la propuesta de Chuquisaca para la redistribución tributaria 50/50 entre Gobierno central, municipios y gobernaciones.",
    "order": 1
  },
  {
    "id": "m-2",
    "title": "Gobierno y la Federación de Asociaciones Municipales se reunirán por la política 50-50",
    "type": "medios",
    "category": "Reunión FAM & Gobierno",
    "embedUrl": "https://www.dailymotion.com/embed/video/xb14bsu",
    "url": "https://www.dailymotion.com/video/xb14bsu",
    "platform": "Dailymotion / BTV",
    "coverUrl": "/assets/cobertura_fam_gobierno_5050.jpg",
    "date": "Bolivia TV (BTV)",
    "description": "Reunión de coordinación entre el Gobierno Central y la FAM Bolivia en el marco de la política 50-50 y acuerdos regionales.",
    "order": 2
  },
  {
    "id": "v-3",
    "title": "La Agenda 50-50 impulsa propuestas para fortalecer las autonomías",
    "type": "videos",
    "category": "Participación Nacional",
    "mediaUrl": "/videos/La Agenda 50-50 impulsa propuestas para fortalecer las autonomías y construir un Estado más eficiente, con la participación de municipios y autoridades de todo el país.mp4",
    "coverUrl": "/assets/video_propuestas_autonomias_cover.jpg",
    "duration": "Spot Institucional",
    "order": 3
  },
  {
    "id": "m-3",
    "title": "'JP' Velasco: \"Será la obra más importante de los últimos 50 años\"",
    "type": "medios",
    "category": "Infraestructura & Gestión",
    "embedUrl": "https://www.dailymotion.com/embed/video/xb3eo9y",
    "url": "https://www.dailymotion.com/video/xb3eo9y",
    "platform": "Dailymotion / El Deber",
    "coverUrl": "/assets/cobertura_jp_velasco.jpg",
    "date": "El Deber Noticias",
    "description": "Declaraciones del Gobernador de Santa Cruz sobre proyectos clave y coordinación entre Gobernación, Gobierno Nacional y municipios.",
    "order": 3
  },
  {
    "id": "m-4",
    "title": "Alcaldes Impulsan el 50/50 - Reportaje Especial",
    "type": "medios",
    "category": "Reportaje de Prensa",
    "embedUrl": "https://www.dailymotion.com/embed/video/xawlv6e",
    "url": "https://www.dailymotion.com/video/xawlv6e",
    "platform": "Dailymotion",
    "coverUrl": "/assets/cobertura_medios_5050.jpg",
    "date": "Cobertura Digital",
    "description": "Reportaje y cobertura televisiva sobre la iniciativa de los alcaldes para impulsar la propuesta de la Agenda 50/50.",
    "order": 4
  },
  {
    "id": "v-4",
    "title": "Firma de acuerdo 50/50",
    "type": "videos",
    "category": "Cobertura Especial",
    "mediaUrl": "/videos/Firma de acuerdo 5050.mp4",
    "coverUrl": "/assets/video_firma_acuerdo_5050_cover.jpg",
    "duration": "Acto Oficial",
    "order": 4
  },
  {
    "id": "m-5",
    "title": "Santa Cruz propone nuevo Pacto Fiscal para las regiones",
    "type": "medios",
    "category": "Pacto Fiscal",
    "embedUrl": "https://www.dailymotion.com/embed/video/x9ifgnk",
    "url": "https://www.dailymotion.com/video/x9ifgnk",
    "platform": "Dailymotion",
    "coverUrl": "/assets/cobertura_scz_pacto_fiscal.jpg",
    "date": "Cobertura de Medios",
    "description": "Propuestas y debate sobre el nuevo modelo de distribución fiscal e incentivo al desarrollo autonómico.",
    "order": 5
  }
];

export const defaultMonitorConfig: MonitorConfig = {
  sectionBadge: "Monitoreo en Tiempo Real",
  sectionTitle: "Indicadores & Plazos",
  sectionSubtitle: "Seguimiento técnico del avance de los compromisos del Acuerdo N° 001/2026.",
  showCountdown: true,
  countdownBadge: "Hito Prioritario en Curso",
  countdownTitle: "Cuenta Regresiva: Proyecto de Ley modificación Ley 154",
  countdownDescription: "Texto de Proyecto de Ley que permita a los departamentos crear o modificar sus propios impuestos y ampliar su dominio tributario.",
  countdownResponsible: "MEFP + 9 GAD",
  countdownTargetDate: "2026-11-03T23:59:59",
};

export const defaultMonitorMetrics: MonitorMetric[] = [
  {
    id: 1,
    order: 1,
    title: "Respuesta técnica FPIEEH",
    value: "12 Días",
    description: "Informe que diga si es viable: (a) suspender el 12% del FPIEEH a los GAM en 2027, (b) devolver lo retenido en 2025, (c) aplicarlo progresivamente en los siguientes años",
    responsible: "Min. Hidrocarburos + MEFP",
    deliverable: "Informe que diga si es viable: (a) suspender el 12% del FPIEEH a los GAM en 2027, (b) devolver lo retenido en 2025, (c) aplicarlo progresivamente en los siguientes años",
    deadlineDate: "2026-10-14",
    badge: "Próximo Vencimiento",
    category: "FPIEEH",
    iconName: "Clock",
    colorScheme: "amber",
    active: true,
  },
  {
    id: 2,
    order: 2,
    title: "Proyecto de Ley modificación Ley 154",
    value: "32 Días",
    description: "Texto de Proyecto de Ley que permita a los departamentos crear o modificar sus propios impuestos y ampliar su dominio tributario",
    responsible: "MEFP + 9 GAD",
    deliverable: "Texto de Proyecto de Ley que permita a los departamentos crear o modificar sus propios impuestos y ampliar su dominio tributario",
    deadlineDate: "2026-11-03",
    badge: "Hito Prioritario",
    category: "Tributario",
    iconName: "Scale",
    colorScheme: "red",
    active: true,
  },
];



