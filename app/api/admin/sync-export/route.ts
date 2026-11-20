import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs";
import os from "os";
import path from "path";
import { execFileSync } from "child_process";

export const dynamic = "force-dynamic";

function isValidToken(provided: string, expected: string): boolean {
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Exporta un paquete .tar.gz con una copia consistente de prisma/dev.db y public/uploads/
 * para sincronizar datos de Producción hacia Desarrollo por HTTPS (sin requerir SSH).
 */
export async function GET(request: NextRequest) {
  const expectedToken = process.env.SYNC_TOKEN;
  if (!expectedToken) {
    return NextResponse.json(
      { error: "SYNC_TOKEN no está configurado en el servidor." },
      { status: 503 }
    );
  }

  const authHeader = request.headers.get("authorization") || "";
  const providedToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : "";

  if (!providedToken || !isValidToken(providedToken, expectedToken)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const cwd = process.cwd();
  const dbPath = path.join(cwd, "prisma", "dev.db");
  if (!fs.existsSync(dbPath)) {
    return NextResponse.json(
      { error: "No se encontró prisma/dev.db en el servidor." },
      { status: 404 }
    );
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "agenda5050-sync-"));
  try {
    const stagingPrismaDir = path.join(tmpDir, "prisma");
    fs.mkdirSync(stagingPrismaDir, { recursive: true });
    const snapshotDbPath = path.join(stagingPrismaDir, "dev.db");

    // Usar sqlite3 .backup para obtener una instantánea consistente aunque haya escrituras activas
    try {
      const escapedDest = snapshotDbPath.replace(/'/g, "''");
      execFileSync("sqlite3", [dbPath, `.backup '${escapedDest}'`]);
    } catch {
      fs.copyFileSync(dbPath, snapshotDbPath);
    }

    const archivePath = path.join(tmpDir, "sync-bundle.tar.gz");
    const tarArgs = ["-czf", archivePath, "-C", tmpDir, "prisma"];

    const uploadsDir = path.join(cwd, "public", "uploads");
    if (fs.existsSync(uploadsDir)) {
      tarArgs.push("-C", cwd, "public/uploads");
    }

    execFileSync("tar", tarArgs);
    const buffer = fs.readFileSync(archivePath);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/gzip",
        "Content-Disposition": 'attachment; filename="agenda5050-sync.tar.gz"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error al generar respaldo de sincronización:", error);
    return NextResponse.json(
      { error: "Error interno al generar el paquete de sincronización." },
      { status: 500 }
    );
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}
