"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";
import { DEFAULT_PAGE_SECTIONS, SectionId } from "@/lib/sections-config";

export interface UpdateSectionPayload {
  id: SectionId;
  order: number;
  enabled: boolean;
}

export async function saveSectionsConfigAction(items: UpdateSectionPayload[]) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) {
    return { success: false, error: "No autorizado. Debe iniciar sesión como administrador." };
  }

  try {
    const prismaAny = prisma as any;

    if (prismaAny.pageSection && typeof prismaAny.pageSection.upsert === "function") {
      await prisma.$transaction(
        items.map((item) =>
          prismaAny.pageSection.upsert({
            where: { id: item.id },
            update: {
              order: item.order,
              enabled: item.enabled,
            },
            create: {
              id: item.id,
              order: item.order,
              enabled: item.enabled,
            },
          })
        )
      );
    } else {
      // Fallback robusto con SQL directo para SQLite en caso de cliente desincronizado
      for (const item of items) {
        await prisma.$executeRawUnsafe(
          `INSERT INTO PageSection (id, "order", enabled, updatedAt) VALUES (?, ?, ?, CURRENT_TIMESTAMP)
           ON CONFLICT(id) DO UPDATE SET "order"=excluded."order", enabled=excluded.enabled, updatedAt=CURRENT_TIMESTAMP;`,
          item.id,
          item.order,
          item.enabled ? 1 : 0
        );
      }
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/sections");

    return {
      success: true,
      message: "¡Orden y visibilidad de secciones actualizados con éxito en todo el portal!",
    };
  } catch (error: any) {
    console.error("Error al guardar orden de secciones:", error);
    return {
      success: false,
      error: error?.message || "Ocurrió un error al guardar la configuración en la base de datos.",
    };
  }
}

export async function resetSectionsConfigAction() {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) {
    return { success: false, error: "No autorizado." };
  }

  try {
    const prismaAny = prisma as any;

    if (prismaAny.pageSection && typeof prismaAny.pageSection.upsert === "function") {
      await prisma.$transaction(
        DEFAULT_PAGE_SECTIONS.map((sec) =>
          prismaAny.pageSection.upsert({
            where: { id: sec.id },
            update: {
              order: sec.order,
              enabled: true,
            },
            create: {
              id: sec.id,
              order: sec.order,
              enabled: true,
            },
          })
        )
      );
    } else {
      for (const sec of DEFAULT_PAGE_SECTIONS) {
        await prisma.$executeRawUnsafe(
          `INSERT INTO PageSection (id, "order", enabled, updatedAt) VALUES (?, ?, 1, CURRENT_TIMESTAMP)
           ON CONFLICT(id) DO UPDATE SET "order"=excluded."order", enabled=1, updatedAt=CURRENT_TIMESTAMP;`,
          sec.id,
          sec.order
        );
      }
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/sections");

    return {
      success: true,
      message: "Se restableció el orden y visibilidad por defecto con éxito.",
    };
  } catch (error: any) {
    console.error("Error al restablecer secciones:", error);
    return {
      success: false,
      error: error?.message || "No se pudo restablecer el orden por defecto.",
    };
  }
}
