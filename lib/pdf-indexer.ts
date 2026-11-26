import fs from "fs/promises";
import path from "path";
import os from "os";
import crypto from "crypto";
import { execFile } from "child_process";
import { promisify } from "util";
import { prisma } from "@/lib/db";

const execFileAsync = promisify(execFile);

export interface IndexResult {
  documentId: string;
  title: string;
  skipped: boolean;
  pageCount: number;
  nativePages: number;
  ocrPages: number;
  totalChars: number;
}

/**
 * Normaliza texto para búsqueda tolerante a tildes, mayúsculas y espacios.
 */
export function normalizeForSearch(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s/%.,:-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Limpia saltos de línea rotos y caracteres basura manteniendo legibilidad para snippets.
 */
export function cleanRawText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/-\n([a-záéíóúñ])/gi, "$1")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFD]/g, " ")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countUsefulChars(text: string): number {
  return text.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ]/g, "").length;
}

/**
 * Resuelve la ruta absoluta en disco de un PDF a partir de su fileUrl.
 */
export function resolveLocalPdfPath(fileUrl?: string | null): string | null {
  if (!fileUrl) return null;
  let cleanUrl = fileUrl.trim();
  if (!cleanUrl) return null;

  // Si es URL completa hacia el mismo dominio, extraer pathname
  if (/^https?:\/\//i.test(cleanUrl)) {
    try {
      const parsed = new URL(cleanUrl);
      cleanUrl = parsed.pathname;
    } catch {
      return null;
    }
  }

  const relativePath = cleanUrl.startsWith("/") ? cleanUrl.slice(1) : cleanUrl;
  const decoded = decodeURIComponent(relativePath);
  return path.join(process.cwd(), "public", decoded);
}

async function computeSha256(filePath: string): Promise<string> {
  const buf = await fs.readFile(filePath);
  return crypto.createHash("sha256").update(buf).digest("hex");
}

async function getPdfPageCount(filePath: string): Promise<number> {
  const { stdout } = await execFileAsync("pdfinfo", [filePath], { timeout: 15000 });
  const match = stdout.match(/Pages:\s+(\d+)/i);
  return match ? parseInt(match[1], 10) : 0;
}

async function extractNativePageText(filePath: string, pageNum: number): Promise<string> {
  const { stdout } = await execFileAsync(
    "pdftotext",
    ["-f", String(pageNum), "-l", String(pageNum), "-enc", "UTF-8", filePath, "-"],
    { timeout: 20000, maxBuffer: 10 * 1024 * 1024 }
  );
  return cleanRawText(stdout || "");
}

async function extractOcrPageText(
  filePath: string,
  pageNum: number,
  tmpDir: string
): Promise<string> {
  const prefix = path.join(tmpDir, `page-${pageNum}`);
  const imgPath = `${prefix}.png`;
  try {
    await execFileAsync(
      "pdftoppm",
      ["-png", "-r", "200", "-gray", "-f", String(pageNum), "-l", String(pageNum), "-singlefile", filePath, prefix],
      { timeout: 45000 }
    );
    const { stdout } = await execFileAsync(
      "tesseract",
      [imgPath, "stdout", "-l", "spa", "--psm", "6"],
      { timeout: 60000, maxBuffer: 10 * 1024 * 1024 }
    );
    return cleanRawText(stdout || "");
  } finally {
    await fs.unlink(imgPath).catch(() => {});
  }
}

/**
 * Indexa un DocumentItem página por página (nativo + fallback OCR en español).
 */
export async function indexDocumentById(
  documentId: string,
  options: { force?: boolean } = {}
): Promise<IndexResult> {
  const doc = await prisma.documentItem.findUnique({ where: { id: documentId } });
  if (!doc) {
    throw new Error(`Documento no encontrado: ${documentId}`);
  }

  const filePath = resolveLocalPdfPath(doc.fileUrl);
  if (!filePath) {
    await prisma.documentItem.update({
      where: { id: documentId },
      data: { indexStatus: "ERROR", indexError: "Sin archivo PDF local asociado." },
    });
    throw new Error(`Documento ${doc.title} no tiene fileUrl local.`);
  }

  try {
    await fs.access(filePath);
  } catch {
    await prisma.documentItem.update({
      where: { id: documentId },
      data: { indexStatus: "ERROR", indexError: `Archivo no encontrado: ${doc.fileUrl}` },
    });
    throw new Error(`Archivo no encontrado en disco: ${filePath}`);
  }

  const fileHash = await computeSha256(filePath);
  if (!options.force && doc.indexStatus === "INDEXED" && doc.fileHash === fileHash && doc.pageCount > 0) {
    return {
      documentId: doc.id,
      title: doc.title,
      skipped: true,
      pageCount: doc.pageCount,
      nativePages: 0,
      ocrPages: 0,
      totalChars: 0,
    };
  }

  await prisma.documentItem.update({
    where: { id: documentId },
    data: { indexStatus: "INDEXING", indexError: null },
  });

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), `pdf-ocr-${documentId}-`));

  try {
    const pageCount = await getPdfPageCount(filePath);
    if (pageCount <= 0) {
      throw new Error("El PDF no contiene páginas legibles.");
    }

    let nativePages = 0;
    let ocrPages = 0;
    let totalChars = 0;
    const pagesData: {
      documentId: string;
      pageNumber: number;
      contentRaw: string;
      contentNormalized: string;
    }[] = [];

    for (let p = 1; p <= pageCount; p++) {
      let rawText = await extractNativePageText(filePath, p);
      if (countUsefulChars(rawText) >= 40) {
        nativePages++;
      } else {
        const ocrText = await extractOcrPageText(filePath, p, tmpDir);
        if (countUsefulChars(ocrText) > countUsefulChars(rawText)) {
          rawText = ocrText;
        }
        ocrPages++;
      }

      totalChars += rawText.length;
      pagesData.push({
        documentId: doc.id,
        pageNumber: p,
        contentRaw: rawText,
        contentNormalized: normalizeForSearch(rawText),
      });
    }

    await prisma.$transaction([
      prisma.documentPageIndex.deleteMany({ where: { documentId: doc.id } }),
      prisma.documentPageIndex.createMany({ data: pagesData }),
      prisma.documentItem.update({
        where: { id: doc.id },
        data: {
          fileHash,
          indexStatus: "INDEXED",
          pageCount,
          indexError: null,
          lastIndexedAt: new Date(),
        },
      }),
    ]);

    return {
      documentId: doc.id,
      title: doc.title,
      skipped: false,
      pageCount,
      nativePages,
      ocrPages,
      totalChars,
    };
  } catch (err: any) {
    await prisma.documentItem.update({
      where: { id: doc.id },
      data: {
        indexStatus: "ERROR",
        indexError: String(err?.message || "Error en indexación OCR").slice(0, 500),
      },
    });
    throw err;
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}

// Cola en memoria con concurrencia = 1 para no saturar CPU/RAM del VPS
let indexQueue: Promise<void> = Promise.resolve();

export function enqueueDocumentIndex(documentId: string, options: { force?: boolean } = {}) {
  indexQueue = indexQueue
    .then(async () => {
      try {
        await indexDocumentById(documentId, options);
      } catch (err) {
        console.error(`[PDF Indexer] Error indexando ${documentId}:`, err);
      }
    })
    .catch(() => {});
}
