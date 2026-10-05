"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";
import { commitmentsData } from "@/lib/commitments-data";

export interface CommitmentInput {
  id?: string;
  levelId: "nce" | "gad" | "gam" | "conjunto";
  levelName?: string;
  commitment: string;
  deliverable: string;
  responsible: string;
  status: string;
  deadlineDate?: string;
  category?: string;
  order?: number;
  active?: boolean;
}

const levelNameMap: Record<string, string> = {
  nce: "Presidente / Gobierno Nacional (NCE)",
  gad: "Gobiernos Autónomos Departamentales (GAD)",
  gam: "GAM (9 capitales + El Alto) — AMB",
  conjunto: "Compromisos conjuntos",
};

export async function upsertCommitmentAction(data: CommitmentInput) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado." };

  try {
    const levelName = data.levelName || levelNameMap[data.levelId] || "Compromiso";
    const deadlineDate = data.deadlineDate?.trim() || null;
    const category = (data.category || "General").trim();

    if (data.id && !data.id.startsWith("temp-")) {
      // Update
      await (prisma as any).levelCommitment.update({
        where: { id: data.id },
        data: {
          levelId: data.levelId,
          levelName,
          commitment: data.commitment.trim(),
          deliverable: data.deliverable.trim(),
          responsible: data.responsible.trim(),
          status: data.status.trim(),
          deadlineDate,
          category,
          active: data.active ?? true,
          ...(data.order !== undefined ? { order: data.order } : {}),
        },
      });
    } else {
      // Create
      const count = await (prisma as any).levelCommitment.count({
        where: { levelId: data.levelId },
      });

      await (prisma as any).levelCommitment.create({
        data: {
          levelId: data.levelId,
          levelName,
          commitment: data.commitment.trim(),
          deliverable: data.deliverable.trim(),
          responsible: data.responsible.trim(),
          status: data.status.trim(),
          deadlineDate,
          category,
          active: data.active ?? true,
          order: data.order ?? count + 1,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/commitments");

    return { success: true, message: "Compromiso guardado y revalidado con éxito." };
  } catch (error: any) {
    console.error("Error guardando compromiso:", error);
    return { success: false, error: error?.message || "Error al procesar el compromiso." };
  }
}

export async function deleteCommitmentAction(id: string) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado." };

  try {
    await (prisma as any).levelCommitment.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin/commitments");

    return { success: true, message: "Compromiso eliminado correctamente." };
  } catch (error: any) {
    console.error("Error eliminando compromiso:", error);
    return { success: false, error: "No se pudo eliminar el compromiso." };
  }
}

export async function toggleCommitmentAction(id: string, active: boolean) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado." };

  try {
    await (prisma as any).levelCommitment.update({
      where: { id },
      data: { active },
    });

    revalidatePath("/");
    revalidatePath("/admin/commitments");

    return { success: true, message: `Compromiso ${active ? "activado" : "desactivado"}.` };
  } catch (error: any) {
    console.error("Error actualizando estado del compromiso:", error);
    return { success: false, error: "Error al actualizar estado." };
  }
}

export async function reorderCommitmentsAction(orderedIds: string[]) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado." };

  try {
    await Promise.all(
      orderedIds.map((id, index) =>
        (prisma as any).levelCommitment.update({
          where: { id },
          data: { order: index + 1 },
        })
      )
    );

    revalidatePath("/");
    revalidatePath("/admin/commitments");

    return { success: true, message: "Orden de compromisos actualizado." };
  } catch (error: any) {
    console.error("Error reordenando compromisos:", error);
    return { success: false, error: "Error al guardar el nuevo orden." };
  }
}

export async function seedCommitmentsAction() {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado." };

  try {
    await (prisma as any).levelCommitment.deleteMany();

    for (let i = 0; i < commitmentsData.length; i++) {
      const item = commitmentsData[i];
      await (prisma as any).levelCommitment.create({
        data: {
          id: item.id,
          levelId: item.levelId,
          levelName: item.levelName,
          commitment: item.commitment,
          deliverable: item.deliverable,
          responsible: item.responsible,
          status: item.status,
          deadlineDate: item.deadlineDate || null,
          category: item.category || "General",
          order: i + 1,
          active: true,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/commitments");

    return {
      success: true,
      message: `Se restauraron exitosamente los ${commitmentsData.length} compromisos oficiales.`,
    };
  } catch (error: any) {
    console.error("Error en seedCommitmentsAction:", error);
    return { success: false, error: "Error al restaurar los compromisos oficiales." };
  }
}
