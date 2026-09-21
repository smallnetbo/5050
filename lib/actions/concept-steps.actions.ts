"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";
import { syncDatabaseToAgendaData } from "@/lib/sync-seeds";

export interface ConceptStepInput {
  id?: number;
  num: number;
  title: string;
  desc: string;
  tag: string;
  items: string[];
}

export async function upsertConceptStepAction(data: ConceptStepInput) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) {
    return { success: false, error: "No autorizado. Inicie sesión." };
  }

  try {
    const conceptNum = Number(data.num);
    const itemsJson = JSON.stringify((data.items || []).filter((i) => i && i.trim() !== ""));

    await prisma.conceptStep.upsert({
      where: { num: conceptNum },
      update: {
        title: data.title,
        desc: data.desc,
        tag: data.tag,
        items: itemsJson,
      },
      create: {
        num: conceptNum,
        title: data.title,
        desc: data.desc,
        tag: data.tag,
        items: itemsJson,
      },
    });

    try {
      await syncDatabaseToAgendaData();
    } catch (syncErr) {
      console.warn("Advertencia al sincronizar archivo agenda-data.ts:", syncErr);
    }

    revalidatePath("/");
    revalidatePath("/admin/concepts");

    return { success: true, message: "Concepto guardado y revalidado con éxito." };
  } catch (error: any) {
    console.error("Error guardando concepto:", error);
    return { success: false, error: error?.message || "Error al guardar en la base de datos." };
  }
}

export async function deleteConceptStepAction(num: number) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) return { success: false, error: "No autorizado." };

  try {
    await prisma.conceptStep.delete({ where: { num } });
    revalidatePath("/");
    revalidatePath("/admin/concepts");
    return { success: true, message: "Concepto eliminado." };
  } catch (error) {
    return { success: false, error: "No se pudo eliminar el concepto." };
  }
}
