"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";

function revalidateAllProductos() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/revista");
  revalidatePath("/ruta-viva");
  revalidatePath("/admin/productos");
}

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

// ---------------------------------------------------------------------------
// 1. Visibilidad Global de Módulos
// ---------------------------------------------------------------------------
export async function toggleModuleConfigAction(
  key: string,
  field: "enabled" | "showInNavbar",
  value: boolean
) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado." };

  try {
    if ((prisma as any).siteModuleConfig) {
      await prisma.siteModuleConfig.update({
        where: { key },
        data: { [field]: value },
      });
    } else {
      const col = field === "enabled" ? `"enabled"` : `"showInNavbar"`;
      await prisma.$executeRawUnsafe(
        `UPDATE "SiteModuleConfig" SET ${col} = ?, "updatedAt" = CURRENT_TIMESTAMP WHERE "key" = ?;`,
        value ? 1 : 0,
        key
      );
    }
    revalidateAllProductos();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error actualizando módulo." };
  }
}

// ---------------------------------------------------------------------------
// 2. Revista Digital 50/50 — Ediciones y Capítulos
// ---------------------------------------------------------------------------
export async function toggleEditionVisibilityAction(id: string, isVisible: boolean) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado." };

  try {
    await prisma.revistaEdition.update({ where: { id }, data: { isVisible } });
    revalidateAllProductos();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error actualizando edición." };
  }
}

export async function setFeaturedEditionAction(id: string) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado." };

  try {
    await prisma.$transaction([
      prisma.revistaEdition.updateMany({ data: { isFeatured: false } }),
      prisma.revistaEdition.update({ where: { id }, data: { isFeatured: true, isVisible: true } }),
    ]);
    revalidateAllProductos();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error marcando edición principal." };
  }
}

export async function upsertRevistaEditionAction(input: {
  id?: string;
  editionNumber: number;
  slug?: string;
  title: string;
  subtitle: string;
  periodLabel: string;
  publishedAt?: string;
  isVisible: boolean;
}) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado." };

  try {
    const cleanSlug =
      input.slug?.trim() ||
      `edicion-${String(input.editionNumber).padStart(2, "0")}`;

    if (input.id) {
      await prisma.revistaEdition.update({
        where: { id: input.id },
        data: {
          editionNumber: input.editionNumber,
          slug: cleanSlug,
          title: input.title.trim(),
          subtitle: input.subtitle.trim(),
          periodLabel: input.periodLabel.trim(),
          publishedAt: input.publishedAt?.trim() || null,
          isVisible: input.isVisible,
        },
      });
    } else {
      await prisma.revistaEdition.create({
        data: {
          editionNumber: input.editionNumber,
          slug: cleanSlug,
          title: input.title.trim(),
          subtitle: input.subtitle.trim(),
          periodLabel: input.periodLabel.trim(),
          publishedAt: input.publishedAt?.trim() || null,
          isVisible: input.isVisible,
          isFeatured: false,
          order: input.editionNumber,
        },
      });
    }
    revalidateAllProductos();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error guardando edición." };
  }
}

export async function duplicateRevistaEditionAction(sourceId: string) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado." };

  try {
    const source = await prisma.revistaEdition.findUnique({
      where: { id: sourceId },
      include: { chapters: { orderBy: { order: "asc" } } },
    });
    if (!source) return { success: false, error: "Edición origen no encontrada." };

    const allEditions = await prisma.revistaEdition.findMany({
      select: { editionNumber: true },
    });
    const maxNum = allEditions.reduce((m, e) => Math.max(m, e.editionNumber), 0);
    const nextNum = maxNum + 1;
    const nextSlug = `edicion-${String(nextNum).padStart(2, "0")}`;

    const created = await prisma.revistaEdition.create({
      data: {
        slug: nextSlug,
        editionNumber: nextNum,
        title: `${source.title} (Copia Ed. ${nextNum})`,
        subtitle: source.subtitle,
        periodLabel: "Nueva Edición (Borrador)",
        coverImage: source.coverImage,
        isVisible: false, // Siempre nace en borrador
        isFeatured: false,
        publishedAt: null,
        order: nextNum,
        chapters: {
          create: source.chapters.map((ch) => ({
            slug: ch.slug,
            order: ch.order,
            kicker: ch.kicker,
            title: ch.title,
            summary: ch.summary,
            content: ch.content,
            quoteText: ch.quoteText,
            quoteSource: ch.quoteSource,
            linkedActor: ch.linkedActor,
            linkedDocumentId: ch.linkedDocumentId,
            linkedMediaId: ch.linkedMediaId,
            isVisible: ch.isVisible,
          })),
        },
      },
    });

    revalidateAllProductos();
    return { success: true, id: created.id, slug: created.slug };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error duplicando edición." };
  }
}

export async function deleteRevistaEditionAction(id: string) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado." };

  try {
    await prisma.revistaEdition.delete({ where: { id } });
    revalidateAllProductos();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error eliminando edición." };
  }
}

export async function toggleChapterVisibilityAction(id: string, isVisible: boolean) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado." };

  try {
    await prisma.revistaChapter.update({ where: { id }, data: { isVisible } });
    revalidateAllProductos();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error actualizando capítulo." };
  }
}

export async function upsertRevistaChapterAction(input: {
  id?: string;
  editionId: string;
  slug?: string;
  order: number;
  kicker: string;
  title: string;
  summary: string;
  content: string;
  quoteText?: string;
  quoteSource?: string;
  linkedActor?: string;
  linkedDocumentId?: string;
  linkedMediaId?: string;
  isVisible: boolean;
}) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado." };

  try {
    const cleanSlug = input.slug?.trim() || slugify(input.title) || `capitulo-${input.order}`;
    if (input.id) {
      await prisma.revistaChapter.update({
        where: { id: input.id },
        data: {
          slug: cleanSlug,
          order: input.order,
          kicker: input.kicker.trim(),
          title: input.title.trim(),
          summary: input.summary.trim(),
          content: input.content.trim(),
          quoteText: input.quoteText?.trim() || null,
          quoteSource: input.quoteSource?.trim() || null,
          linkedActor: input.linkedActor?.trim() || null,
          linkedDocumentId: input.linkedDocumentId?.trim() || null,
          linkedMediaId: input.linkedMediaId?.trim() || null,
          isVisible: input.isVisible,
        },
      });
    } else {
      await prisma.revistaChapter.create({
        data: {
          editionId: input.editionId,
          slug: cleanSlug,
          order: input.order,
          kicker: input.kicker.trim(),
          title: input.title.trim(),
          summary: input.summary.trim(),
          content: input.content.trim(),
          quoteText: input.quoteText?.trim() || null,
          quoteSource: input.quoteSource?.trim() || null,
          linkedActor: input.linkedActor?.trim() || null,
          linkedDocumentId: input.linkedDocumentId?.trim() || null,
          linkedMediaId: input.linkedMediaId?.trim() || null,
          isVisible: input.isVisible,
        },
      });
    }
    revalidateAllProductos();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error guardando capítulo." };
  }
}

export async function deleteRevistaChapterAction(id: string) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado." };

  try {
    await prisma.revistaChapter.delete({ where: { id } });
    revalidateAllProductos();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error eliminando capítulo." };
  }
}

// ---------------------------------------------------------------------------
// 3. Ruta Viva — Sedes y Placas del Kit
// ---------------------------------------------------------------------------
export async function toggleSedeVisibilityAction(id: string, isVisible: boolean) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado." };

  try {
    await prisma.rutaVivaSede.update({ where: { id }, data: { isVisible } });
    revalidateAllProductos();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error actualizando sede." };
  }
}

export async function upsertRutaVivaSedeAction(input: {
  id?: string;
  slug?: string;
  city: string;
  department: string;
  lat: number;
  lng: number;
  title: string;
  dateLabel: string;
  actors: string;
  summary: string;
  keyFigures: string[];
  linkedDocumentId?: string;
  linkedChapterSlug?: string;
  accent: string;
  order: number;
  isVisible: boolean;
}) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado." };

  try {
    const cleanSlug = input.slug?.trim() || slugify(input.city);
    const data = {
      slug: cleanSlug,
      city: input.city.trim(),
      department: input.department,
      lat: Number(input.lat),
      lng: Number(input.lng),
      title: input.title.trim(),
      dateLabel: input.dateLabel.trim(),
      actors: input.actors.trim(),
      summary: input.summary.trim(),
      keyFiguresJson: JSON.stringify(input.keyFigures.filter(Boolean)),
      linkedDocumentId: input.linkedDocumentId?.trim() || null,
      linkedChapterSlug: input.linkedChapterSlug?.trim() || null,
      accent: input.accent || "emerald",
      order: Number(input.order || 0),
      isVisible: input.isVisible,
    };

    if (input.id) {
      await prisma.rutaVivaSede.update({ where: { id: input.id }, data });
    } else {
      await prisma.rutaVivaSede.create({ data });
    }
    revalidateAllProductos();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error guardando sede." };
  }
}

export async function deleteRutaVivaSedeAction(id: string) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado." };

  try {
    await prisma.rutaVivaSede.delete({ where: { id } });
    revalidateAllProductos();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error eliminando sede." };
  }
}

export async function toggleCardVisibilityAction(id: string, isVisible: boolean) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado." };

  try {
    await prisma.rutaVivaCard.update({ where: { id }, data: { isVisible } });
    revalidateAllProductos();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error actualizando placa." };
  }
}

export async function upsertRutaVivaCardAction(input: {
  id?: string;
  title: string;
  category: string;
  subtitle: string;
  heroStat: string;
  heroStatLabel: string;
  bullets: string[];
  footerNote: string;
  copyText: string;
  templateType: string;
  order: number;
  isVisible: boolean;
}) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado." };

  try {
    const data = {
      title: input.title.trim(),
      category: input.category.trim(),
      subtitle: input.subtitle.trim(),
      heroStat: input.heroStat.trim(),
      heroStatLabel: input.heroStatLabel.trim(),
      bulletsJson: JSON.stringify(input.bullets.filter(Boolean)),
      footerNote: input.footerNote.trim(),
      copyText: input.copyText.trim(),
      templateType: input.templateType || "emerald",
      order: Number(input.order || 0),
      isVisible: input.isVisible,
    };

    if (input.id) {
      await prisma.rutaVivaCard.update({ where: { id: input.id }, data });
    } else {
      await prisma.rutaVivaCard.create({
        data: { ...data, slug: slugify(input.title) || `placa-${Date.now()}` },
      });
    }
    revalidateAllProductos();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error guardando placa." };
  }
}
