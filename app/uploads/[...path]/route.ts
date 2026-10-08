import { NextRequest, NextResponse } from "next/server";
import { stat } from "fs/promises";
import { createReadStream } from "fs";
import { Readable } from "stream";
import { resolve } from "path";

export const dynamic = "force-dynamic";

const MIME_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  mp4: "video/mp4",
  webm: "video/webm",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  txt: "text/plain; charset=utf-8",
  zip: "application/zip",
};

async function handleFileRequest(
  req: NextRequest,
  paramsPromise: Promise<{ path: string[] }>,
  isHead = false
) {
  try {
    const { path: pathSegments = [] } = await paramsPromise;

    if (!pathSegments || pathSegments.length === 0) {
      return new NextResponse("Ruta inválida", { status: 400 });
    }

    const baseDir = resolve(process.cwd(), "public", "uploads");
    const filePath = resolve(baseDir, ...pathSegments);

    // Seguridad: Impedir Directory Traversal (../../)
    if (!filePath.startsWith(baseDir)) {
      return new NextResponse("Acceso no permitido", { status: 403 });
    }

    let fileStat;
    try {
      fileStat = await stat(filePath);
    } catch {
      return new NextResponse("Archivo no encontrado", { status: 404 });
    }

    if (!fileStat.isFile()) {
      return new NextResponse("Recurso no encontrado", { status: 404 });
    }

    const fileName = pathSegments[pathSegments.length - 1];
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    // Si es petición HEAD, responder solo con encabezados
    if (isHead) {
      return new NextResponse(null, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Length": fileStat.size.toString(),
          "Accept-Ranges": "bytes",
          "Content-Disposition": `inline; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
        },
      });
    }

    // Manejo de solicitudes Range (útil para videos, audios y descargas parciales)
    const rangeHeader = req.headers.get("range");
    if (rangeHeader && rangeHeader.startsWith("bytes=")) {
      const parts = rangeHeader.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileStat.size - 1;

      if (isNaN(start) || start >= fileStat.size || (parts[1] && end >= fileStat.size) || start > end) {
        return new NextResponse(null, {
          status: 416,
          headers: {
            "Content-Range": `bytes */${fileStat.size}`,
          },
        });
      }

      const chunkSize = end - start + 1;
      const fileStream = createReadStream(filePath, { start, end });
      const webStream = Readable.toWeb(fileStream) as ReadableStream;

      return new NextResponse(webStream, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileStat.size}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize.toString(),
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    // Respuesta completa (código 200) transmitiendo el flujo de bytes
    const fileStream = createReadStream(filePath);
    const webStream = Readable.toWeb(fileStream) as ReadableStream;

    return new NextResponse(webStream, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": fileStat.size.toString(),
        "Accept-Ranges": "bytes",
        "Content-Disposition": `inline; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Error al servir archivo estático en /uploads:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleFileRequest(req, params, false);
}

export async function HEAD(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleFileRequest(req, params, true);
}
