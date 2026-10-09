"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";
import { commitmentLevels as defaultLevels, CommitmentLevel } from "@/lib/commitments-data";

export interface CommitmentLevelInput {
  id: string;
  oldId?: string;
  name: string;
  shortName: string;
  badge: string;
  description: string;
  iconName?: string;
  colorScheme?: string;
  order?: number;
  active?: boolean;
}

export async function upsertCommitmentLevelAction(data: CommitmentLevelInput) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado. Inicie sesión como administrador." };

  try {
    const rawId = (data.id || "").trim().toLowerCase();
    const cleanId = rawId.replace(/[^a-z0-9_-]/g, "");

    if (!cleanId) {
      return { success: false, error: "El identificador (slug) del nivel es obligatorio y debe contener caracteres válidos." };
    }

    const name = data.name.trim();
    const shortName = data.shortName.trim();
    const badge = data.badge.trim();
    const description = (data.description || "").trim();
    const iconName = data.iconName?.trim() || "Landmark";
    const colorScheme = data.colorScheme?.trim() || "blue";

    if (!name || !shortName || !badge) {
      return { success: false, error: "El nombre completo, nombre corto y badge son obligatorios." };
    }

    // Si se editó el ID de un nivel existente, verificar conflicto y migrar compromisos
    if (data.oldId && data.oldId !== cleanId) {
      const existingWithNewId = await (prisma as any).commitmentLevel.findUnique({
        where: { id: cleanId },
      });
      if (existingWithNewId) {
        return { success: false, error: `Ya existe otro nivel con el identificador "${cleanId}".` };
      }

      // Crear nuevo y migrar compromisos
      const current = await (prisma as any).commitmentLevel.findUnique({
        where: { id: data.oldId },
      });

      await (prisma as any).commitmentLevel.create({
        data: {
          id: cleanId,
          name,
          shortName,
          badge,
          description,
          iconName,
          colorScheme,
          order: data.order ?? current?.order ?? 1,
          active: data.active ?? current?.active ?? true,
        },
      });

      // Actualizar compromisos huérfanos con el nuevo ID y levelName
      await (prisma as any).levelCommitment.updateMany({
        where: { levelId: data.oldId },
        data: {
          levelId: cleanId,
          levelName: name,
        },
      });

      // Eliminar el ID anterior
      await (prisma as any).commitmentLevel.delete({
        where: { id: data.oldId },
      });
    } else {
      // Upsert estándar
      const existing = await (prisma as any).commitmentLevel.findUnique({
        where: { id: cleanId },
      });

      if (existing) {
        await (prisma as any).commitmentLevel.update({
          where: { id: cleanId },
          data: {
            name,
            shortName,
            badge,
            description,
            iconName,
            colorScheme,
            ...(data.order !== undefined ? { order: data.order } : {}),
            ...(data.active !== undefined ? { active: data.active } : {}),
          },
        });

        // Actualizar levelName en compromisos asociados para coherencia
        await (prisma as any).levelCommitment.updateMany({
          where: { levelId: cleanId },
          data: { levelName: name },
        });
      } else {
        const count = await (prisma as any).commitmentLevel.count();
        await (prisma as any).commitmentLevel.create({
          data: {
            id: cleanId,
            name,
            shortName,
            badge,
            description,
            iconName,
            colorScheme,
            order: data.order ?? count + 1,
            active: data.active ?? true,
          },
        });
      }
    }

    revalidatePath("/");
    revalidatePath("/admin/commitments");

    return { success: true, message: `Nivel "${shortName}" guardado con éxito.` };
  } catch (error: any) {
    console.error("Error upserting commitment level:", error);
    return { success: false, error: error?.message || "Error al procesar el nivel de gobierno." };
  }
}

export async function deleteCommitmentLevelAction(id: string, forceDelete: boolean = false) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado." };

  try {
    const commitmentsCount = await (prisma as any).levelCommitment.count({
      where: { levelId: id },
    });

    if (commitmentsCount > 0 && !forceDelete) {
      return {
        success: false,
        hasCommitments: true,
        count: commitmentsCount,
        error: `Este nivel tiene ${commitmentsCount} compromiso(s) asignado(s). Debe reasignarlos o confirmar la eliminación definitiva.`,
      };
    }

    // Si se fuerza la eliminación, eliminar compromisos asociados o reasignar
    if (commitmentsCount > 0 && forceDelete) {
      await (prisma as any).levelCommitment.deleteMany({
        where: { levelId: id },
      });
    }

    await (prisma as any).commitmentLevel.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin/commitments");

    return { success: true, message: "Nivel de gobierno eliminado correctamente." };
  } catch (error: any) {
    console.error("Error deleting commitment level:", error);
    return { success: false, error: error?.message || "No se pudo eliminar el nivel." };
  }
}

export async function reorderCommitmentLevelsAction(orderedIds: string[]) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado." };

  try {
    await Promise.all(
      orderedIds.map((id, index) =>
        (prisma as any).commitmentLevel.update({
          where: { id },
          data: { order: index + 1 },
        })
      )
    );

    revalidatePath("/");
    revalidatePath("/admin/commitments");

    return { success: true, message: "Orden de niveles actualizado correctamente." };
  } catch (error: any) {
    console.error("Error reordering commitment levels:", error);
    return { success: false, error: "Error al actualizar el orden de los niveles." };
  }
}

export async function toggleCommitmentLevelAction(id: string, active: boolean) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado." };

  try {
    await (prisma as any).commitmentLevel.update({
      where: { id },
      data: { active },
    });

    revalidatePath("/");
    revalidatePath("/admin/commitments");

    return { success: true, message: `Nivel ${active ? "activado" : "desactivado"} correctamente.` };
  } catch (error: any) {
    console.error("Error toggling commitment level:", error);
    return { success: false, error: "Error al cambiar estado del nivel." };
  }
}

export async function seedCommitmentLevelsAction() {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado." };

  try {
    await (prisma as any).commitmentLevel.deleteMany();

    for (let i = 0; i < defaultLevels.length; i++) {
      const lvl = defaultLevels[i];
      await (prisma as any).commitmentLevel.create({
        data: {
          id: lvl.id,
          name: lvl.name,
          shortName: lvl.shortName,
          badge: lvl.badge,
          description: lvl.description,
          iconName: lvl.iconName,
          colorScheme: lvl.colorScheme,
          order: i + 1,
          active: true,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/commitments");

    return {
      success: true,
      message: `Se restauraron exitosamente los ${defaultLevels.length} niveles oficiales.`,
    };
  } catch (error: any) {
    console.error("Error en seedCommitmentLevelsAction:", error);
    return { success: false, error: "Error al restaurar los niveles oficiales." };
  }
}
