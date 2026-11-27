import { prisma } from "@/lib/db";

export interface SiteModuleConfigDTO {
  key: string;
  label: string;
  enabled: boolean;
  showInNavbar: boolean;
}

export interface RevistaChapterDTO {
  id: string;
  editionId: string;
  slug: string;
  order: number;
  kicker: string;
  title: string;
  summary: string;
  content: string;
  quoteText: string | null;
  quoteSource: string | null;
  linkedActor: string | null;
  linkedDocumentId: string | null;
  linkedMediaId: string | null;
  isVisible: boolean;
}

export interface RevistaEditionDTO {
  id: string;
  slug: string;
  editionNumber: number;
  title: string;
  subtitle: string;
  periodLabel: string;
  coverImage: string | null;
  isVisible: boolean;
  isFeatured: boolean;
  publishedAt: string | null;
  order: number;
  chapters: RevistaChapterDTO[];
}

export interface RutaVivaSedeDTO {
  id: string;
  slug: string;
  city: string;
  department: string;
  lat: number;
  lng: number;
  title: string;
  dateLabel: string;
  actors: string;
  summary: string;
  keyFigures: string[];
  linkedDocumentId: string | null;
  linkedChapterSlug: string | null;
  accent: "emerald" | "gold" | "red";
  order: number;
  isVisible: boolean;
}

export interface RutaVivaCardDTO {
  id: string;
  slug: string;
  title: string;
  category: string;
  subtitle: string;
  heroStat: string;
  heroStatLabel: string;
  bullets: string[];
  footerNote: string;
  copyText: string;
  templateType: "emerald" | "gold" | "red";
  order: number;
  isVisible: boolean;
}

export const DEFAULT_MODULE_CONFIGS: SiteModuleConfigDTO[] = [
  { key: "revista", label: "Portal Revista 50/50", enabled: true, showInNavbar: true },
  { key: "ruta-viva", label: "Portal Ruta Viva 50/50", enabled: true, showInNavbar: true },
  { key: "ruta-viva-mapa", label: "Ruta Viva · Mapa Territorial", enabled: true, showInNavbar: false },
  { key: "ruta-viva-timeline", label: "Ruta Viva · Línea Audiovisual", enabled: true, showInNavbar: false },
  { key: "ruta-viva-kit", label: "Ruta Viva · Kit de Redes y Prensa", enabled: true, showInNavbar: false },
  { key: "semaforizacion-ejecutiva", label: "Semaforización Ejecutiva y Trazabilidad", enabled: true, showInNavbar: false },
];

export async function getModuleConfigs(): Promise<SiteModuleConfigDTO[]> {
  try {
    let rows: any[] = [];
    if ((prisma as any).siteModuleConfig) {
      rows = await prisma.siteModuleConfig.findMany();
    } else {
      rows = await prisma.$queryRawUnsafe<any[]>(
        `SELECT "key", "label", "enabled", "showInNavbar" FROM "SiteModuleConfig";`
      );
    }
    if (!rows || rows.length === 0) return DEFAULT_MODULE_CONFIGS;

    const map = new Map<string, SiteModuleConfigDTO>();
    for (const def of DEFAULT_MODULE_CONFIGS) map.set(def.key, def);
    for (const r of rows) {
      map.set(r.key, {
        key: r.key,
        label: r.label,
        enabled: Boolean(r.enabled),
        showInNavbar: Boolean(r.showInNavbar),
      });
    }
    return Array.from(map.values());
  } catch {
    return DEFAULT_MODULE_CONFIGS;
  }
}

export async function getRevistaEditions(includeHidden = false): Promise<RevistaEditionDTO[]> {
  try {
    let editions: any[] = [];
    let chapters: any[] = [];

    if ((prisma as any).revistaEdition && (prisma as any).revistaChapter) {
      editions = await prisma.revistaEdition.findMany({
        where: includeHidden ? undefined : { isVisible: true },
        orderBy: [{ order: "asc" }, { editionNumber: "asc" }],
      });
      chapters = await prisma.revistaChapter.findMany({
        where: includeHidden ? undefined : { isVisible: true },
        orderBy: { order: "asc" },
      });
    } else {
      const edQuery = includeHidden
        ? `SELECT * FROM "RevistaEdition" ORDER BY "order" ASC, "editionNumber" ASC;`
        : `SELECT * FROM "RevistaEdition" WHERE "isVisible" = 1 ORDER BY "order" ASC, "editionNumber" ASC;`;
      const chQuery = includeHidden
        ? `SELECT * FROM "RevistaChapter" ORDER BY "order" ASC;`
        : `SELECT * FROM "RevistaChapter" WHERE "isVisible" = 1 ORDER BY "order" ASC;`;
      editions = await prisma.$queryRawUnsafe<any[]>(edQuery);
      chapters = await prisma.$queryRawUnsafe<any[]>(chQuery);
    }

    return editions.map((ed) => ({
      id: ed.id,
      slug: ed.slug,
      editionNumber: Number(ed.editionNumber),
      title: ed.title,
      subtitle: ed.subtitle,
      periodLabel: ed.periodLabel,
      coverImage: ed.coverImage || null,
      isVisible: Boolean(ed.isVisible),
      isFeatured: Boolean(ed.isFeatured),
      publishedAt: ed.publishedAt || null,
      order: Number(ed.order || 0),
      chapters: chapters
        .filter((c) => c.editionId === ed.id)
        .map((c) => ({
          id: c.id,
          editionId: c.editionId,
          slug: c.slug,
          order: Number(c.order || 0),
          kicker: c.kicker,
          title: c.title,
          summary: c.summary,
          content: c.content,
          quoteText: c.quoteText || null,
          quoteSource: c.quoteSource || null,
          linkedActor: c.linkedActor || null,
          linkedDocumentId: c.linkedDocumentId || null,
          linkedMediaId: c.linkedMediaId || null,
          isVisible: Boolean(c.isVisible),
        })),
    }));
  } catch {
    return [];
  }
}

export async function getRutaVivaSedes(includeHidden = false): Promise<RutaVivaSedeDTO[]> {
  try {
    let rows: any[] = [];
    if ((prisma as any).rutaVivaSede) {
      rows = await prisma.rutaVivaSede.findMany({
        where: includeHidden ? undefined : { isVisible: true },
        orderBy: { order: "asc" },
      });
    } else {
      const q = includeHidden
        ? `SELECT * FROM "RutaVivaSede" ORDER BY "order" ASC;`
        : `SELECT * FROM "RutaVivaSede" WHERE "isVisible" = 1 ORDER BY "order" ASC;`;
      rows = await prisma.$queryRawUnsafe<any[]>(q);
    }

    return rows.map((r) => {
      let keyFigures: string[] = [];
      try {
        keyFigures = JSON.parse(r.keyFiguresJson || "[]");
      } catch {
        keyFigures = [];
      }
      return {
        id: r.id,
        slug: r.slug,
        city: r.city,
        department: r.department,
        lat: Number(r.lat),
        lng: Number(r.lng),
        title: r.title,
        dateLabel: r.dateLabel,
        actors: r.actors,
        summary: r.summary,
        keyFigures,
        linkedDocumentId: r.linkedDocumentId || null,
        linkedChapterSlug: r.linkedChapterSlug || null,
        accent: (r.accent as "emerald" | "gold" | "red") || "emerald",
        order: Number(r.order || 0),
        isVisible: Boolean(r.isVisible),
      };
    });
  } catch {
    return [];
  }
}

export async function getRutaVivaCards(includeHidden = false): Promise<RutaVivaCardDTO[]> {
  try {
    let rows: any[] = [];
    if ((prisma as any).rutaVivaCard) {
      rows = await prisma.rutaVivaCard.findMany({
        where: includeHidden ? undefined : { isVisible: true },
        orderBy: { order: "asc" },
      });
    } else {
      const q = includeHidden
        ? `SELECT * FROM "RutaVivaCard" ORDER BY "order" ASC;`
        : `SELECT * FROM "RutaVivaCard" WHERE "isVisible" = 1 ORDER BY "order" ASC;`;
      rows = await prisma.$queryRawUnsafe<any[]>(q);
    }

    return rows.map((r) => {
      let bullets: string[] = [];
      try {
        bullets = JSON.parse(r.bulletsJson || "[]");
      } catch {
        bullets = [];
      }
      return {
        id: r.id,
        slug: r.slug,
        title: r.title,
        category: r.category,
        subtitle: r.subtitle,
        heroStat: r.heroStat,
        heroStatLabel: r.heroStatLabel,
        bullets,
        footerNote: r.footerNote,
        copyText: r.copyText,
        templateType: (r.templateType as "emerald" | "gold" | "red") || "emerald",
        order: Number(r.order || 0),
        isVisible: Boolean(r.isVisible),
      };
    });
  } catch {
    return [];
  }
}
