"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";
import { syncDatabaseToAgendaData } from "@/lib/sync-seeds";

export interface PillarInput {
  id?: number;
  order?: number;
  title: string;
  category: "Fiscal" | "Competencial" | "Institucional" | "Normativo";
  iconName: string;
  summary: string;
  actions: string[];
}

export async function upsertPillarAction(data: PillarInput) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) {
    return { success: false, error: "No autorizado. Inicie sesión." };
  }

  try {
    const actionsJson = JSON.stringify(data.actions.filter((a) => a.trim() !== ""));

    if (data.id) {
      await prisma.pillar.update({
        where: { id: data.id },
        data: {
          title: data.title,
          category: data.category,
          iconName: data.iconName,
          summary: data.summary,
          actions: actionsJson,
          order: data.order ?? data.id,
        },
      });
    } else {
      await prisma.pillar.create({
        data: {
          title: data.title,
          category: data.category,
          iconName: data.iconName,
          summary: data.summary,
          actions: actionsJson,
          order: data.order ?? 0,
        },
      });
    }

    try {
      await syncDatabaseToAgendaData();
    } catch (syncErr) {
      console.warn("Advertencia al sincronizar archivo agenda-data.ts:", syncErr);
    }

    revalidatePath("/");
    revalidatePath("/admin/pillars");

    return { success: true, message: "Pilar guardado y revalidado con éxito." };
  } catch (error: any) {
    console.error("Error guardando pilar:", error);
    return { success: false, error: error?.message || "Error al guardar el pilar en la base de datos." };
  }
}

export async function deletePillarAction(id: number) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) return { success: false, error: "No autorizado." };

  try {
    await prisma.pillar.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/pillars");
    return { success: true, message: "Pilar eliminado con éxito." };
  } catch (error) {
    console.error("Error eliminando pilar:", error);
    return { success: false, error: "No se pudo eliminar el pilar." };
  }
}

export async function reorderPillarsAction(orderedIds: number[]) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) return { success: false, error: "No autorizado." };

  try {
    const updates = orderedIds.map((id, index) =>
      prisma.pillar.update({
        where: { id },
        data: { order: index },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath("/");
    revalidatePath("/admin/pillars");

    return { success: true, message: "Orden de pilares actualizado con éxito." };
  } catch (error) {
    console.error("Error reordenando pilares:", error);
    return { success: false, error: "Error al actualizar el orden de los pilares." };
  }
}
