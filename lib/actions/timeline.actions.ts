"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";

export interface MilestoneInput {
  id?: number;
  title: string;
  dateText: string;
  status: "Cumplido" | "En proceso" | "Programado" | "Meta";
  detail: string;
  order?: number;
}

export async function upsertMilestoneAction(data: MilestoneInput) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) {
    return { success: false, error: "No autorizado. Inicie sesión." };
  }

  try {
    if (data.id) {
      await prisma.milestone.update({
        where: { id: data.id },
        data: {
          title: data.title,
          dateText: data.dateText,
          status: data.status,
          detail: data.detail,
          order: data.order ?? 0,
        },
      });
    } else {
      await prisma.milestone.create({
        data: {
          title: data.title,
          dateText: data.dateText,
          status: data.status,
          detail: data.detail,
          order: data.order ?? 0,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/timeline");

    return { success: true, message: "Hito guardado y revalidado con éxito." };
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
    revalidatePath("/");
    revalidatePath("/admin/timeline");
    return { success: true, message: "Hito eliminado correctamente." };
  } catch (error) {
    return { success: false, error: "No se pudo eliminar el hito." };
  }
}
