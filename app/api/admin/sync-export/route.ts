import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs";
import os from "os";
import path from "path";
import { execFileSync, spawn } from "child_process";

export const dynamic = "force-dynamic";

function isValidToken(provided: string, expected: string): boolean {
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Exporta en streaming un .tar.gz con una copia consistente de prisma/dev.db y public/uploads/
 * sin escribir el archivo comprimido en /tmp (evita errores de espacio en /tmp).
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
  const cleanup = () => {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {
      // ignorar errores de limpieza
    }
  };

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

    const tarArgs = ["-czf", "-", "-C", tmpDir, "prisma"];
    const uploadsDir = path.join(cwd, "public", "uploads");
    if (fs.existsSync(uploadsDir)) {
      tarArgs.push("-C", cwd, "public/uploads");
    }

    const tar = spawn("tar", tarArgs, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";

    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        tar.stdout.on("data", (chunk: Buffer) => {
          controller.enqueue(new Uint8Array(chunk));
        });
        tar.stderr.on("data", (chunk: Buffer) => {
          stderr += chunk.toString();
        });
        tar.on("error", (err) => {
          cleanup();
          controller.error(err);
        });
        tar.on("close", (code) => {
          cleanup();
          if (code === 0) {
            controller.close();
          } else {
            console.error("Error en tar:", stderr);
            controller.error(new Error(`tar exited with code ${code}: ${stderr}`));
          }
        });
      },
      cancel() {
        tar.kill("SIGTERM");
        cleanup();
      },
    });

    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Type": "application/gzip",
        "Content-Disposition": 'attachment; filename="agenda5050-sync.tar.gz"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    cleanup();
    const detail = error instanceof Error ? error.message : String(error);
    console.error("Error al generar respaldo de sincronización:", detail);
    return NextResponse.json(
      { error: "Error interno al generar el paquete de sincronización.", detail },
      { status: 500 }
    );
  }
}
