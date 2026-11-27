import { prisma } from "@/lib/db";

let ensurePromise: Promise<void> | null = null;

/**
 * Ensures the "order" column exists on the SQLite "DocumentItem" table
 * and initializes existing rows in createdAt DESC order on first run.
 */
export async function ensureDocumentOrderColumn(): Promise<void> {
  if (!ensurePromise) {
    ensurePromise = (async () => {
      try {
        const columns = await prisma.$queryRawUnsafe<Array<{ name: string }>>(
          `PRAGMA table_info("DocumentItem");`
        );
        const hasOrder = columns.some((c) => c.name === "order");
        if (!hasOrder) {
          await prisma.$executeRawUnsafe(
            `ALTER TABLE "DocumentItem" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;`
          );
          const rows = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
            `SELECT "id" FROM "DocumentItem" ORDER BY "createdAt" DESC;`
          );
          for (let i = 0; i < rows.length; i++) {
            await prisma.$executeRawUnsafe(
              `UPDATE "DocumentItem" SET "order" = ? WHERE "id" = ?;`,
              i,
              rows[i].id
            );
          }
        }
      } catch (err) {
        ensurePromise = null;
        throw err;
      }
    })();
  }
  return ensurePromise;
}

/**
 * Fetches a map of document ID -> display order from SQLite.
 */
export async function getDocumentOrderMap(): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  try {
    await ensureDocumentOrderColumn();
    const rows = await prisma.$queryRawUnsafe<Array<{ id: string; order: number | bigint }>>(
      `SELECT "id", "order" FROM "DocumentItem";`
    );
    for (const row of rows) {
      map.set(row.id, Number(row.order ?? 0));
    }
  } catch (err) {
    console.warn("No se pudo leer el orden de documentos:", err);
  }
  return map;
}

/**
 * Sorts documents ascending by their persisted order, preserving input order on ties.
 */
export function sortDocumentsByOrder<T extends { id: string }>(
  docs: T[],
  orderMap: Map<string, number>
): T[] {
  if (orderMap.size === 0) return docs;
  return [...docs].sort((a, b) => {
    const orderA = orderMap.get(a.id) ?? Number.MAX_SAFE_INTEGER;
    const orderB = orderMap.get(b.id) ?? Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });
}
