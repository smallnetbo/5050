import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { normalizeForSearch } from "@/lib/pdf-indexer";

export const dynamic = "force-dynamic";

export interface PdfSearchHit {
  id: string;
  documentId: string;
  title: string;
  category: string;
  date: string;
  fileUrl: string;
  pageNumber: number;
  snippet: string;
  matchUrl: string;
}

function buildSnippet(raw: string, normalizedQuery: string): string {
  if (!raw) return "";
  const normRaw = normalizeForSearch(raw);
  const idx = normRaw.indexOf(normalizedQuery);

  // Mapear posición aproximada en texto original
  if (idx === -1) {
    return raw.slice(0, 145) + (raw.length > 145 ? "..." : "");
  }

  const ratio = idx / Math.max(1, normRaw.length);
  const approxPos = Math.floor(ratio * raw.length);
  const start = Math.max(0, approxPos - 55);
  const end = Math.min(raw.length, start + 145);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < raw.length ? "..." : "";
  return `${prefix}${raw.slice(start, end).trim()}${suffix}`;
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";
  const normalized = normalizeForSearch(q);

  if (normalized.length < 2) {
    return NextResponse.json({ ok: true, query: q, pdfHits: [] });
  }

  try {
    let pages: {
      id: string;
      pageNumber: number;
      contentRaw: string;
      document: {
        id: string;
        title: string;
        category: string;
        date: string;
        fileUrl: string | null;
      };
    }[] = [];

    if ((prisma as any).documentPageIndex) {
      pages = await prisma.documentPageIndex.findMany({
        where: {
          contentNormalized: {
            contains: normalized,
          },
        },
        include: {
          document: {
            select: {
              id: true,
              title: true,
              category: true,
              date: true,
              fileUrl: true,
            },
          },
        },
        take: 15,
        orderBy: [{ document: { createdAt: "desc" } }, { pageNumber: "asc" }],
      });
    } else {
      const rows = await prisma.$queryRawUnsafe<any[]>(
        `SELECT p."id", p."pageNumber", p."contentRaw",
                d."id" AS "docId", d."title" AS "docTitle", d."category" AS "docCategory",
                d."date" AS "docDate", d."fileUrl" AS "docFileUrl"
         FROM "DocumentPageIndex" p
         INNER JOIN "DocumentItem" d ON d."id" = p."documentId"
         WHERE p."contentNormalized" LIKE ?
         ORDER BY d."createdAt" DESC, p."pageNumber" ASC
         LIMIT 15;`,
        `%${normalized}%`
      );
      pages = rows.map((r) => ({
        id: r.id,
        pageNumber: Number(r.pageNumber),
        contentRaw: r.contentRaw,
        document: {
          id: r.docId,
          title: r.docTitle,
          category: r.docCategory,
          date: r.docDate,
          fileUrl: r.docFileUrl,
        },
      }));
    }

    const pdfHits: PdfSearchHit[] = pages
      .filter((p) => Boolean(p.document?.fileUrl))
      .map((p) => {
        const fileUrl = p.document.fileUrl!;
        return {
          id: p.id,
          documentId: p.document.id,
          title: p.document.title,
          category: p.document.category,
          date: p.document.date,
          fileUrl,
          pageNumber: p.pageNumber,
          snippet: buildSnippet(p.contentRaw, normalized),
          matchUrl: `${fileUrl}#page=${p.pageNumber}`,
        };
      });

    return NextResponse.json({
      ok: true,
      query: q,
      normalizedQuery: normalized,
      pdfHits,
    });
  } catch (error) {
    console.error("Error en /api/search:", error);
    return NextResponse.json(
      { ok: false, error: "Error buscando en documentos.", pdfHits: [] },
      { status: 500 }
    );
  }
}
