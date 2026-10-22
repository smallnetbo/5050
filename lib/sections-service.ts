import { prisma } from "@/lib/db";
import { DEFAULT_PAGE_SECTIONS, PageSectionItem } from "@/lib/sections-config";

export async function getPageSections(): Promise<PageSectionItem[]> {
  try {
    const prismaAny = prisma as any;
    let dbSections: any[] = [];

    if (prismaAny.pageSection && typeof prismaAny.pageSection.findMany === "function") {
      dbSections = await prismaAny.pageSection.findMany({
        orderBy: { order: "asc" },
      });
    } else {
      dbSections = await prisma.$queryRawUnsafe<any[]>(
        `SELECT id, "order", enabled FROM PageSection ORDER BY "order" ASC`
      );
    }

    if (!dbSections || dbSections.length === 0) {
      return [...DEFAULT_PAGE_SECTIONS];
    }

    const dbMap = new Map(
      dbSections.map((s) => [s.id, { ...s, enabled: Boolean(s.enabled) }])
    );

    // Combinar con la metadata por defecto
    const merged: PageSectionItem[] = DEFAULT_PAGE_SECTIONS.map((def) => {
      const found = dbMap.get(def.id);
      if (found) {
        return {
          ...def,
          order: found.order,
          enabled: Boolean(found.enabled),
        };
      }
      return def;
    });

    // Ordenar de forma ascendente por el campo 'order'
    merged.sort((a, b) => a.order - b.order);

    return merged;
  } catch (error) {
    console.warn("Error leyendo PageSection de la BD, usando secciones por defecto:", error);
    return [...DEFAULT_PAGE_SECTIONS];
  }
}
