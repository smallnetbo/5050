"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";
import { DEFAULT_PAGE_SECTIONS, SectionId } from "@/lib/sections-config";

export interface UpdateSectionPayload {
  id: SectionId;
  order: number;
  enabled: boolean;
  name?: string;
  navLabel?: string;
  footerLabel?: string;
  adminLabel?: string;
}

export async function saveSectionsConfigAction(items: UpdateSectionPayload[]) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) {
    return { success: false, error: "No autorizado. Debe iniciar sesión como administrador." };
  }

  try {
    // Usar SQL directo para compatibilidad inmediata incluso si el cliente Prisma en memoria está en caché
    for (const item of items) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO PageSection (id, "order", enabled, name, navLabel, footerLabel, adminLabel, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(id) DO UPDATE SET "order"=excluded."order", enabled=excluded.enabled, name=excluded.name, navLabel=excluded.navLabel, footerLabel=excluded.footerLabel, adminLabel=excluded.adminLabel, updatedAt=CURRENT_TIMESTAMP;`,
        item.id,
        item.order,
        item.enabled ? 1 : 0,
        item.name?.trim() || null,
        item.navLabel?.trim() || null,
        item.footerLabel?.trim() || null,
        item.adminLabel?.trim() || null
      );
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
    for (const sec of DEFAULT_PAGE_SECTIONS) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO PageSection (id, "order", enabled, name, navLabel, footerLabel, adminLabel, updatedAt) VALUES (?, ?, 1, NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP)
         ON CONFLICT(id) DO UPDATE SET "order"=excluded."order", enabled=1, name=NULL, navLabel=NULL, footerLabel=NULL, adminLabel=NULL, updatedAt=CURRENT_TIMESTAMP;`,
        sec.id,
        sec.order
      );
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
