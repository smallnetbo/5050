export type SectionId =
  | "Hero"
  | "Concepts"
  | "Monitor"
  | "DocumentHub"
  | "LevelCommitments"
  | "Timeline"
  | "MultimediaHub"
  | "InteractiveNewsGallery3"
  | "CitizenFeedback";

export interface PageSectionItem {
  id: SectionId;
  name: string;
  shortTitle: string;
  description: string;
  navLabel: string;
  footerLabel: string;
  href: string;
  adminHref: string;
  adminLabel: string;
  iconName: string;
  color: string;
  isMail?: boolean;
  order: number;
  enabled: boolean;
}

export const DEFAULT_PAGE_SECTIONS: PageSectionItem[] = [
  {
    id: "Hero",
    name: "Hero / Portada Principal",
    shortTitle: "Hero",
    description: "Cabecera principal, título oficial, acuerdos y botones de acción rápida.",
    navLabel: "Inicio",
    footerLabel: "Inicio",
    href: "#acuerdo",
    adminHref: "/admin/profile",
    adminLabel: "Hero / Portada",
    iconName: "Sparkles",
    color: "bg-amber-500",
    order: 0,
    enabled: true,
  },
  {
    id: "Concepts",
    name: "Conceptos Clave 50/50",
    shortTitle: "Conceptos",
    description: "Acordeón interactivo con los fundamentos pedagógicos y ejes del pacto fiscal.",
    navLabel: "Conceptos",
    footerLabel: "Conceptos",
    href: "#conceptos",
    adminHref: "/admin/concepts",
    adminLabel: "Conceptos 50/50",
    iconName: "HelpCircle",
    color: "bg-teal-600",
    order: 1,
    enabled: true,
  },
  {
    id: "Monitor",
    name: "Monitor & Indicadores 50/50",
    shortTitle: "Monitor",
    description: "Cuenta regresiva oficial, métricas clave e indicadores de seguimiento.",
    navLabel: "Monitor 50/50",
    footerLabel: "Monitor 50/50",
    href: "#monitor",
    adminHref: "/admin/monitor",
    adminLabel: "Monitor & Indicadores",
    iconName: "Activity",
    color: "bg-emerald-600",
    order: 2,
    enabled: true,
  },
  {
    id: "DocumentHub",
    name: "Repositorio Documental (PDFs)",
    shortTitle: "Documentos",
    description: "Descarga pública de acuerdos, decretos, proyectos de ley y actas oficiales.",
    navLabel: "Documentos",
    footerLabel: "Documentos",
    href: "#descargas",
    adminHref: "/admin/documents",
    adminLabel: "DocumentHub (PDFs)",
    iconName: "FileText",
    color: "bg-emerald-500",
    order: 3,
    enabled: true,
  },
  {
    id: "LevelCommitments",
    name: "Compromisos por Nivel de Gobierno",
    shortTitle: "Compromisos",
    description: "Compromisos y entregables del Nivel Central, GADs, GAMs y Mesas Conjuntas.",
    navLabel: "Compromisos",
    footerLabel: "Compromisos",
    href: "#compromisos",
    adminHref: "/admin/commitments",
    adminLabel: "Compromisos x Nivel",
    iconName: "ClipboardList",
    color: "bg-indigo-600",
    order: 4,
    enabled: true,
  },
  {
    id: "Timeline",
    name: "Ruta de Implementación (Hitos)",
    shortTitle: "Timeline",
    description: "Línea de tiempo cronológica con el avance y estado de cada hito acordado.",
    navLabel: "Ruta",
    footerLabel: "Ruta",
    href: "#ruta",
    adminHref: "/admin/timeline",
    adminLabel: "Hitos / Timeline",
    iconName: "Clock",
    color: "bg-blue-500",
    order: 5,
    enabled: true,
  },
  {
    id: "MultimediaHub",
    name: "Centro Multimedia y Prensa",
    shortTitle: "Multimedia",
    description: "Audios, podcasts, conferencias, webinars y videos informativos.",
    navLabel: "Multimedia",
    footerLabel: "Multimedia",
    href: "#multimedia",
    adminHref: "/admin/multimedia",
    adminLabel: "Centro Multimedia",
    iconName: "Video",
    color: "bg-rose-500",
    order: 6,
    enabled: true,
  },
  {
    id: "InteractiveNewsGallery3",
    name: "Galería de Prensa y Noticias",
    shortTitle: "Prensa",
    description: "Módulo interactivo de noticias de prensa, cobertura de medios y comunicados.",
    navLabel: "Prensa",
    footerLabel: "Prensa",
    href: "#prensa",
    adminHref: "/admin/sections#interactiveNewsGallery3",
    adminLabel: "Prensa & Noticias",
    iconName: "Newspaper",
    color: "bg-purple-600",
    order: 7,
    enabled: true,
  },
  {
    id: "CitizenFeedback",
    name: "Co-construcción Ciudadana (Buzón)",
    shortTitle: "Co-construcción",
    description: "Buzón de propuestas, sugerencias ciudadanas y preguntas frecuentes.",
    navLabel: "Co-construcción Ciudadana",
    footerLabel: "Co-construcción",
    href: "#co-construccion",
    adminHref: "/admin/proposals",
    adminLabel: "Co-construcción (Propuestas)",
    iconName: "MessageSquare",
    color: "bg-emerald-700",
    isMail: true,
    order: 8,
    enabled: true,
  },
];
