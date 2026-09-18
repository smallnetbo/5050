"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/uploads";

export async function upsertDocumentAction(formData: FormData) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) return { success: false, error: "No autorizado." };

  try {
    const id = formData.get("id") as string | null;
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const date = formData.get("date") as string;
    const description = formData.get("description") as string;
    const featured = formData.get("featured") === "true";
    const file = formData.get("file") as File | null;

    let fileUrl = formData.get("existingFileUrl") as string || "";
    let fileSize = formData.get("existingFileSize") as string || "1.0 MB";

    if (file && file.size > 0) {
      fileUrl = await saveUploadedFile(file, "documents");
      fileSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    }

    if (id) {
      await prisma.documentItem.update({
        where: { id },
        data: {
          title,
          category,
          date,
          description,
          featured,
          fileUrl,
          fileSize,
        },
      });
    } else {
      await prisma.documentItem.create({
        data: {
          title,
          category,
          date,
          description,
          featured,
          fileUrl,
          fileSize,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/documents");

    return { success: true, message: "Documento guardado y revalidado con éxito." };
  } catch (error) {
    console.error("Error guardando documento:", error);
    return { success: false, error: "Error al guardar el documento." };
  }
}

export async function deleteDocumentAction(id: string) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) return { success: false, error: "No autorizado." };

  try {
    await prisma.documentItem.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/documents");
    return { success: true, message: "Documento eliminado." };
  } catch (error) {
    return { success: false, error: "Error al eliminar documento." };
  }
}
