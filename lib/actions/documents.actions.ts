"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/uploads";
import { syncDatabaseToAgendaData } from "@/lib/sync-seeds";
import { enqueueDocumentIndex } from "@/lib/pdf-indexer";
import { ensureDocumentOrderColumn } from "@/lib/document-order";

export async function upsertDocumentAction(formData: FormData) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) return { success: false, error: "No autorizado." };

  try {
    const id = (formData.get("id") as string) || undefined;
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const date = formData.get("date") as string;
    const department = (formData.get("department") as string) || undefined;
    const description = formData.get("description") as string;
    const featured = formData.get("featured") === "true";
    const file = formData.get("file") as File | null;

    const hasExistingFileUrl = formData.has("existingFileUrl");
    let fileUrl: string | null | undefined = undefined;
    if (hasExistingFileUrl) {
      const rawVal = formData.get("existingFileUrl") as string;
      fileUrl = rawVal && rawVal.trim().length > 0 ? rawVal.trim() : null;
    }

    let fileSize = (formData.get("existingFileSize") as string) || "1.0 MB";

    const hasNewFile = Boolean(file && file.size > 0);
    if (hasNewFile && file) {
      fileUrl = await saveUploadedFile(file, "documents");
      fileSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    }

    let savedId = id;
    if (id) {
      const updated = await prisma.documentItem.update({
        where: { id },
        data: {
          title,
          category,
          date,
          department,
          description,
          featured,
          ...(fileUrl !== undefined ? { fileUrl } : {}),
          ...(hasNewFile ? { indexStatus: "INDEXING", indexError: null } : {}),
          fileSize,
        },
      });
      savedId = updated.id;
    } else {
      await ensureDocumentOrderColumn();
      const minRows = await prisma.$queryRawUnsafe<Array<{ minOrder: number | bigint | null }>>(
        `SELECT MIN("order") AS "minOrder" FROM "DocumentItem";`
      );
      const nextTopOrder = Number(minRows[0]?.minOrder ?? 0) - 1;

      const created = await prisma.documentItem.create({
        data: {
          title,
          category,
          date,
          department,
          description,
          featured,
          fileUrl: fileUrl || null,
          fileSize,
          indexStatus: fileUrl ? "INDEXING" : "PENDING",
        },
      });
      await prisma.$executeRawUnsafe(
        `UPDATE "DocumentItem" SET "order" = ? WHERE "id" = ?;`,
        nextTopOrder,
        created.id
      );
      savedId = created.id;
    }

    if (savedId && (hasNewFile || (!id && fileUrl))) {
      enqueueDocumentIndex(savedId, { force: true });
    }

    try {
      await syncDatabaseToAgendaData();
    } catch (syncErr) {
      console.warn("Advertencia al sincronizar agenda-data.ts:", syncErr);
    }

    revalidatePath("/");
    revalidatePath("/admin/documents");

    return { success: true, message: "Documento guardado y revalidado con éxito." };
  } catch (error: any) {
    console.error("Error guardando documento:", error);
    return { success: false, error: error?.message || "Error al guardar el documento." };
  }
}

export async function reindexDocumentAction(id: string) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) return { success: false, error: "No autorizado." };

  try {
    await prisma.documentItem.update({
      where: { id },
      data: { indexStatus: "INDEXING", indexError: null },
    });
    enqueueDocumentIndex(id, { force: true });
    revalidatePath("/admin/documents");
    return { success: true, message: "Indexación OCR encolada en segundo plano." };
  } catch (error: any) {
    console.error("Error al re-indexar documento:", error);
    return { success: false, error: error?.message || "Error al iniciar la re-indexación." };
  }
}

export async function deleteDocumentAction(id: string) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) return { success: false, error: "No autorizado." };

  try {
    await prisma.documentItem.delete({ where: { id } });

    try {
      await syncDatabaseToAgendaData();
    } catch (syncErr) {
      console.warn("Advertencia al sincronizar agenda-data.ts:", syncErr);
    }

    revalidatePath("/");
    revalidatePath("/admin/documents");
    return { success: true, message: "Documento eliminado." };
  } catch (error: any) {
    console.error("Error al eliminar documento:", error);
    return { success: false, error: error?.message || "Error al eliminar documento." };
  }
}

export async function reorderDocumentsAction(orderedIds: string[]) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) return { success: false, error: "No autorizado." };

  try {
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return { success: false, error: "Lista de documentos inválida." };
    }

    await ensureDocumentOrderColumn();

    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.$executeRawUnsafe(
          `UPDATE "DocumentItem" SET "order" = ? WHERE "id" = ?;`,
          index,
          id
        )
      )
    );

    try {
      await syncDatabaseToAgendaData();
    } catch (syncErr) {
      console.warn("Advertencia al sincronizar agenda-data.ts:", syncErr);
    }

    revalidatePath("/");
    revalidatePath("/admin/documents");
    return { success: true, message: "Orden de documentos actualizado con éxito." };
  } catch (error: any) {
    console.error("Error al reordenar documentos:", error);
    return { success: false, error: error?.message || "Error al actualizar el orden de los documentos." };
  }
}

async function persistCategoriesToDb(categories: { id: string; label: string; isSystem?: boolean }[]) {
  // 1. Asegurar tabla creada en SQLite si no existiera
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "DocCategory" (
      "id" TEXT PRIMARY KEY,
      "label" TEXT NOT NULL,
      "order" INTEGER NOT NULL DEFAULT 0,
      "isSystem" BOOLEAN NOT NULL DEFAULT 0,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Si el modelo de Prisma está disponible en memoria y en tx, usarlo
  if ((prisma as any).docCategory) {
    try {
      let succeeded = false;
      await prisma.$transaction(async (tx: any) => {
        if (tx && tx.docCategory && typeof tx.docCategory.deleteMany === "function") {
          await tx.docCategory.deleteMany({});
          for (let i = 0; i < categories.length; i++) {
            const cat = categories[i];
            await tx.docCategory.create({
              data: {
                id: cat.id,
                label: cat.label,
                order: i,
                isSystem: Boolean(cat.isSystem),
              },
            });
          }
          succeeded = true;
          return;
        }
      });
      if (succeeded) return;
    } catch (txErr) {
      console.warn("Fallo o ausencia de tx.docCategory, aplicando fallback SQL:", txErr);
    }
  }

  // 3. Fallback SQL universal: funciona siempre, sin depender de prisma generate o reinicio de proceso
  await prisma.$executeRawUnsafe(`DELETE FROM "DocCategory";`);
  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    const isSys = cat.isSystem ? 1 : 0;
    await prisma.$executeRawUnsafe(
      `INSERT INTO "DocCategory" ("id", "label", "order", "isSystem", "createdAt", "updatedAt") VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`,
      cat.id,
      cat.label,
      i,
      isSys
    );
  }
}

export async function saveCategoriesAction(categories: { id: string; label: string; isSystem?: boolean }[]) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) return { success: false, error: "No autorizado." };

  try {
    if (!Array.isArray(categories) || categories.length === 0) {
      return { success: false, error: "La lista de categorías no es válida." };
    }

    await persistCategoriesToDb(categories);

    revalidatePath("/");
    revalidatePath("/admin/documents");

    return { success: true, message: "Categorías actualizadas correctamente en la base de datos." };
  } catch (error: any) {
    console.error("Error al guardar categorías:", error);
    return { success: false, error: error?.message || "Error al guardar las categorías." };
  }
}

export async function resetCategoriesAction() {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) return { success: false, error: "No autorizado." };

  try {
    const defaultCats = [
      { id: "all", label: "Todos los Documentos", isSystem: true },
      { id: "Acuerdo", label: "Acuerdos", isSystem: false },
      { id: "Acta", label: "Actas", isSystem: false },
      { id: "Presentación", label: "Presentaciones", isSystem: false },
      { id: "Anexo", label: "Anexos", isSystem: false },
      { id: "Proyecto de Ley", label: "Proyectos de Ley", isSystem: false },
      { id: "Decreto", label: "Decretos", isSystem: false },
    ];

    await persistCategoriesToDb(defaultCats);

    revalidatePath("/");
    revalidatePath("/admin/documents");

    return { success: true, message: "Categorías restauradas a los valores por defecto." };
  } catch (error: any) {
    console.error("Error al restaurar categorías:", error);
    return { success: false, error: error?.message || "Error al restaurar las categorías." };
  }
}

