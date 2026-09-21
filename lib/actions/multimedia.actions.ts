"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/uploads";
import { syncDatabaseToAgendaData } from "@/lib/sync-seeds";

export async function upsertMediaItemAction(formData: FormData) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) return { success: false, error: "No autorizado." };

  try {
    const id = (formData.get("id") as string) || undefined;
    const title = (formData.get("title") as string) || "";
    const type = (formData.get("type") as string) || "videos";
    const category = (formData.get("category") as string) || undefined;
    const embedUrl = (formData.get("embedUrl") as string) || undefined;
    const url = (formData.get("url") as string) || undefined;
    const platform = (formData.get("platform") as string) || undefined;
    const duration = (formData.get("duration") as string) || undefined;
    const date = (formData.get("date") as string) || undefined;
    const description = (formData.get("description") as string) || undefined;
    const order = parseInt((formData.get("order") as string) || "0", 10);

    let mediaUrl = (formData.get("mediaUrl") as string) || undefined;
    let coverUrl = (formData.get("coverUrl") as string) || undefined;

    // Subida opcional de archivo de video
    const videoFile = formData.get("videoFile") as File | null;
    if (videoFile && videoFile.size > 0) {
      mediaUrl = await saveUploadedFile(videoFile, "multimedia");
    }

    // Subida opcional de archivo de imagen de portada (thumbnail)
    const coverFile = formData.get("coverFile") as File | null;
    if (coverFile && coverFile.size > 0) {
      coverUrl = await saveUploadedFile(coverFile, "multimedia");
    }

    if (id) {
      await prisma.mediaItem.update({
        where: { id },
        data: {
          title,
          type,
          category,
          mediaUrl,
          embedUrl,
          url,
          platform,
          coverUrl,
          duration,
          date,
          description,
          order,
        },
      });
    } else {
      await prisma.mediaItem.create({
        data: {
          title,
          type,
          category,
          mediaUrl,
          embedUrl,
          url,
          platform,
          coverUrl,
          duration,
          date,
          description,
          order,
        },
      });
    }

    try {
      await syncDatabaseToAgendaData();
    } catch (syncErr) {
      console.warn("Advertencia al sincronizar archivo agenda-data.ts:", syncErr);
    }

    revalidatePath("/");
    revalidatePath("/admin/multimedia");

    return { success: true, message: "Recurso multimedia guardado exitosamente." };
  } catch (error: any) {
    console.error("Error guardando recurso multimedia:", error);
    return { success: false, error: error?.message || "Error al guardar el recurso multimedia." };
  }
}

export async function deleteMediaItemAction(id: string) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) return { success: false, error: "No autorizado." };

  try {
    await prisma.mediaItem.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/multimedia");
    return { success: true, message: "Recurso multimedia eliminado." };
  } catch (error) {
    console.error("Error al eliminar recurso multimedia:", error);
    return { success: false, error: "Error al eliminar recurso multimedia." };
  }
}
