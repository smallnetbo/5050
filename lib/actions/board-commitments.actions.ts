"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";
import {
  BoardLevelCode,
  BoardRubroCode,
  BoardStatusCat,
  DEFAULT_BOARD_COMMITMENTS,
} from "@/lib/board-commitments-data";

export interface BoardCommitmentInput {
  id?: number;
  nivel: BoardLevelCode;
  rubro: BoardRubroCode;
  tematica: string;
  entregable: string;
  responsable: string;
  estado: string;
  cat: BoardStatusCat;
  order?: number;
  active?: boolean;
}

export async function upsertBoardCommitmentAction(data: BoardCommitmentInput) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return { success: false, error: "No autorizado. Debe iniciar sesión como administrador." };
  }

  try {
    const tematica = data.tematica?.trim();
    const entregable = data.entregable?.trim();
    const responsable = data.responsable?.trim();
    const estado = data.estado?.trim() || "Sin plazo";

    if (!tematica || !entregable || !responsable) {
      return {
        success: false,
        error: "Temática, entregable y responsable son campos obligatorios.",
      };
    }

    const payload = {
      nivel: data.nivel,
      rubro: data.rubro,
      tematica,
      entregable,
      responsable,
      estado,
      cat: data.cat,
      order: Number(data.order) || 0,
      active: data.active !== undefined ? Boolean(data.active) : true,
    };

    const prismaAny = prisma as any;
    let saved;

    if (data.id) {
      saved = await prismaAny.boardCommitment.update({
        where: { id: Number(data.id) },
        data: payload,
      });
    } else {
      const count = await prismaAny.boardCommitment.count();
      saved = await prismaAny.boardCommitment.create({
        data: {
          ...payload,
          order: payload.order || count + 1,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/board-commitments");

    return {
      success: true,
      data: saved,
      message: data.id
        ? "Compromiso del tablero actualizado correctamente."
        : "Nuevo compromiso agregado al tablero.",
    };
  } catch (error: any) {
    console.error("Error en upsertBoardCommitmentAction:", error);
    return {
      success: false,
      error: error?.message || "No se pudo guardar el compromiso.",
    };
  }
}

export async function deleteBoardCommitmentAction(id: number) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return { success: false, error: "No autorizado." };
  }

  try {
    const prismaAny = prisma as any;
    await prismaAny.boardCommitment.delete({
      where: { id: Number(id) },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/board-commitments");

    return { success: true, message: "Compromiso eliminado correctamente." };
  } catch (error: any) {
    console.error("Error en deleteBoardCommitmentAction:", error);
    return {
      success: false,
      error: error?.message || "No se pudo eliminar el compromiso.",
    };
  }
}

export async function toggleBoardCommitmentActiveAction(id: number, active: boolean) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return { success: false, error: "No autorizado." };
  }

  try {
    const prismaAny = prisma as any;
    const updated = await prismaAny.boardCommitment.update({
      where: { id: Number(id) },
      data: { active: Boolean(active) },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/board-commitments");

    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Error en toggleBoardCommitmentActiveAction:", error);
    return {
      success: false,
      error: error?.message || "No se pudo cambiar la visibilidad.",
    };
  }
}

export async function seedBoardCommitmentsAction() {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return { success: false, error: "No autorizado." };
  }

  try {
    const prismaAny = prisma as any;
    const existingCount = await prismaAny.boardCommitment.count();
    if (existingCount > 0) {
      return {
        success: false,
        error: `Ya existen ${existingCount} compromisos en la base de datos.`,
      };
    }

    await prisma.$transaction(
      DEFAULT_BOARD_COMMITMENTS.map((item) =>
        prismaAny.boardCommitment.create({
          data: {
            nivel: item.nivel,
            rubro: item.rubro,
            tematica: item.tematica,
            entregable: item.entregable,
            responsable: item.responsable,
            estado: item.estado,
            cat: item.cat,
            order: item.order ?? item.id,
            active: true,
          },
        })
      )
    );

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/board-commitments");

    return {
      success: true,
      message: `Se importaron los ${DEFAULT_BOARD_COMMITMENTS.length} compromisos base del tablero.`,
    };
  } catch (error: any) {
    console.error("Error en seedBoardCommitmentsAction:", error);
    return {
      success: false,
      error: error?.message || "No se pudieron importar los compromisos base.",
    };
  }
}
