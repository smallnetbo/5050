import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/uploads";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) {
    return NextResponse.json(
      { success: false, error: "No autorizado. Inicie sesión nuevamente." },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "multimedia";

    if (!file || file.size === 0) {
      return NextResponse.json(
        { success: false, error: "No se proporcionó ningún archivo válido." },
        { status: 400 }
      );
    }

    const fileUrl = await saveUploadedFile(file, folder);

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (error: any) {
    console.error("Error al procesar subida en /api/admin/upload:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Error al procesar la subida del archivo." },
      { status: 500 }
    );
  }
}
