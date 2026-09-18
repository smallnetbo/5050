import { prisma } from "@/lib/db";
import {
  pillars as defaultPillars,
  milestones as defaultMilestones,
  departmentsData as defaultDepartments,
  documentsList as defaultDocuments,
  conceptStepsList as defaultConceptSteps,
  Pillar,
  Milestone,
  DepartmentData,
  DocumentItem,
  ConceptStep,
} from "@/lib/agenda-data";

export interface SiteConfigData {
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroCtaLink: string;
  badgeText: string;
  acuerdoDateText: string;
}

export async function getLandingData() {
  try {
    const [dbPillars, dbMilestones, dbDepartments, dbDocuments, dbConcepts, dbConfig] = await Promise.all([
      prisma.pillar.findMany({ orderBy: { order: "asc" } }),
      prisma.milestone.findMany({ orderBy: { order: "asc" } }),
      prisma.departmentData.findMany(),
      prisma.documentItem.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.conceptStep.findMany({ orderBy: { num: "asc" } }),
      prisma.siteConfig.findUnique({ where: { id: "global" } }),
    ]);

    const mappedPillars: Pillar[] = dbPillars.length > 0
      ? dbPillars.map((p: any) => ({
          id: p.id,
          title: p.title,
          category: p.category as any,
          iconName: p.iconName,
          summary: p.summary,
          actions: JSON.parse(p.actions || "[]"),
        }))
      : defaultPillars;

    const mappedMilestones: Milestone[] = dbMilestones.length > 0
      ? dbMilestones.map((m: any) => ({
          id: m.id,
          title: m.title,
          date: m.dateText,
          status: m.status as any,
          detail: m.detail,
          documents: m.documents ? JSON.parse(m.documents) : undefined,
          participants: m.participants ? JSON.parse(m.participants) : undefined,
        }))
      : defaultMilestones;

    const mappedDepartments: DepartmentData[] = dbDepartments.length > 0
      ? dbDepartments.map((d: any) => ({
          id: d.id,
          name: d.name,
          capital: d.capital,
          governor: d.governor,
          adhered: d.adhered,
          adhesionDate: d.adhesionDate,
          currentFiscalRatio: d.currentFiscalRatio,
          target5050Impact: d.target5050Impact,
          keyProjects: JSON.parse(d.keyProjects || "[]"),
          mesasCount: d.mesasCount,
          regionalNotes: d.regionalNotes,
          pathD: d.pathD,
        }))
      : defaultDepartments;

    const mappedDocuments: DocumentItem[] = dbDocuments.length > 0
      ? dbDocuments.map((doc: any) => ({
          id: doc.id,
          title: doc.title,
          category: doc.category as any,
          department: doc.department || undefined,
          date: doc.date,
          fileSize: doc.fileSize,
          description: doc.description,
          downloadsCount: doc.downloadsCount,
          featured: doc.featured,
        }))
      : defaultDocuments;

    const mappedConcepts: ConceptStep[] = dbConcepts.length > 0
      ? dbConcepts.map((c: any) => ({
          id: c.id,
          num: c.num,
          title: c.title,
          desc: c.desc,
          tag: c.tag,
          items: JSON.parse(c.items || "[]"),
        }))
      : defaultConceptSteps;

    const siteConfig: SiteConfigData = dbConfig
      ? {
          heroTitle: dbConfig.heroTitle,
          heroSubtitle: dbConfig.heroSubtitle,
          heroCtaText: dbConfig.heroCtaText,
          heroCtaLink: dbConfig.heroCtaLink,
          badgeText: dbConfig.badgeText,
          acuerdoDateText: dbConfig.acuerdoDateText,
        }
      : {
          heroTitle: "Hacia una distribución justa 50/50",
          heroSubtitle: "Transformando la descentralización tributaria en Bolivia mediante el Acuerdo N° 001/2026 de Sucre.",
          heroCtaText: "Explorar la Agenda",
          heroCtaLink: "#pilares",
          badgeText: "Acuerdo N° 001/2026 de Sucre",
          acuerdoDateText: "5 de Agosto de 2026",
        };

    return {
      pillars: mappedPillars,
      milestones: mappedMilestones,
      departments: mappedDepartments,
      documents: mappedDocuments,
      conceptSteps: mappedConcepts,
      siteConfig,
    };
  } catch (error) {
    console.warn("DB offline o sin inicializar. Usando datos estáticos por defecto.");
    return {
      pillars: defaultPillars,
      milestones: defaultMilestones,
      departments: defaultDepartments,
      documents: defaultDocuments,
      conceptSteps: defaultConceptSteps,
      siteConfig: {
        heroTitle: "Hacia una distribución justa 50/50",
        heroSubtitle: "Transformando la descentralización tributaria en Bolivia mediante el Acuerdo N° 001/2026 de Sucre.",
        heroCtaText: "Explorar la Agenda",
        heroCtaLink: "#pilares",
        badgeText: "Acuerdo N° 001/2026 de Sucre",
        acuerdoDateText: "5 de Agosto de 2026",
      },
    };
  }
}

