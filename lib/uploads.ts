import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function saveUploadedFile(file: File, folder = "documents"): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Sanitizar nombre de archivo
  const fileExt = file.name.split(".").pop() || "bin";
  const baseName = file.name
    .replace(`.${fileExt}`, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-");
  
  const uniqueName = `${baseName}-${Date.now()}.${fileExt}`;
  
  const uploadDir = join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });

  const filePath = join(uploadDir, uniqueName);
  await writeFile(filePath, buffer);

  return `/uploads/${folder}/${uniqueName}`;
}
