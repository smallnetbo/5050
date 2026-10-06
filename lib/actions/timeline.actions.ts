"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";
import { milestones as defaultMilestones } from "@/lib/agenda-data";
import { syncDatabaseToAgendaData } from "@/lib/sync-seeds";

export interface MilestoneDocument {
  name: string;
  size: string;
}

export interface MilestoneInput {
  id?: number;
  title: string;
  dateText: string;
  status: "Cumplido" | "En proceso" | "Pendiente" | "Programado" | "Meta";
  detail: string;
  image?: string | null;
  order?: number;
  documents?: MilestoneDocument[];
  participants?: string[];
}

export async function upsertMilestoneAction(data: MilestoneInput) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) {
    return { success: false, error: "No autorizado. Inicie sesión." };
  }

  try {
    const documentsJson = data.documents && data.documents.length > 0
      ? JSON.stringify(data.documents)
      : null;

    const participantsJson = data.participants && data.participants.length > 0
      ? JSON.stringify(data.participants)
      : null;

    if (data.id) {
      await prisma.milestone.update({
        where: { id: data.id },
        data: {
          title: data.title.trim(),
          dateText: data.dateText.trim(),
          status: data.status,
          detail: data.detail.trim(),
          image: data.image !== undefined ? (data.image ? data.image.trim() : null) : undefined,
          ...(data.order !== undefined && data.order !== null ? { order: data.order } : {}),
          documents: documentsJson,
          participants: participantsJson,
        },
      });
    } else {
      // Find highest order if not provided
      const maxOrderMilestone = await prisma.milestone.findFirst({
        orderBy: { order: "desc" },
      });
      const newOrder = data.order ?? ((maxOrderMilestone?.order ?? 0) + 1);

      await prisma.milestone.create({
        data: {
          title: data.title.trim(),
          dateText: data.dateText.trim(),
          status: data.status,
          detail: data.detail.trim(),
          image: data.image ? data.image.trim() : null,
          order: newOrder,
          documents: documentsJson,
          participants: participantsJson,
        },
      });
    }

    await syncDatabaseToAgendaData();

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/timeline");

    return { success: true, message: "Hito guardado y sincronizado con éxito." };
  } catch (error) {
    console.error("Error al guardar hito:", error);
    return { success: false, error: "Error interno al guardar en la base de datos." };
  }
}

export async function deleteMilestoneAction(id: number) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) return { success: false, error: "No autorizado." };

  try {
    await prisma.milestone.delete({ where: { id } });
    await syncDatabaseToAgendaData();

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/timeline");
    return { success: true, message: "Hito eliminado correctamente." };
  } catch (error) {
    console.error("Error al eliminar hito:", error);
    return { success: false, error: "No se pudo eliminar el hito." };
  }
}

export async function reorderMilestonesAction(orderedIds: number[]) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) return { success: false, error: "No autorizado." };

  try {
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.milestone.update({
          where: { id },
          data: { order: index + 1 },
        })
      )
    );

    await syncDatabaseToAgendaData();

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/timeline");

    return { success: true, message: "Orden de hitos actualizado correctamente." };
  } catch (error) {
    console.error("Error reordenando hitos:", error);
    return { success: false, error: "No se pudo reordenar los hitos." };
  }
}

export async function seedMilestonesAction() {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) return { success: false, error: "No autorizado." };

  try {
    // Check if table is empty or reset
    await prisma.milestone.deleteMany({});

    for (let index = 0; index < defaultMilestones.length; index++) {
      const m = defaultMilestones[index];
      await prisma.milestone.create({
        data: {
          title: m.title,
          dateText: m.date,
          status: m.status,
          detail: m.detail,
          image: m.image || null,
          order: index + 1,
          documents: m.documents ? JSON.stringify(m.documents) : null,
          participants: m.participants ? JSON.stringify(m.participants) : null,
        },
      });
    }

    await syncDatabaseToAgendaData();

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/timeline");

    return { success: true, message: "Hitos iniciales cargados en la base de datos." };
  } catch (error) {
    console.error("Error sembrando hitos:", error);
    return { success: false, error: "No se pudieron sembrar los hitos iniciales." };
  }
}

