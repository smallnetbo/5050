import { writeFile, readFile } from "fs/promises";
import { join } from "path";
import { prisma } from "@/lib/db";

export async function syncDatabaseToAgendaData() {
  try {
    const [dbPillars, dbConcepts, dbMilestones, dbDepartments, dbMedia, dbDocs] = await Promise.all([
      prisma.pillar.findMany({ orderBy: { order: "asc" } }),
      prisma.conceptStep.findMany({ orderBy: { num: "asc" } }),
      prisma.milestone.findMany({ orderBy: { order: "asc" } }),
      prisma.departmentData.findMany(),
      prisma.mediaItem.findMany({ orderBy: { order: "asc" } }),
      prisma.documentItem.findMany({ orderBy: { createdAt: "desc" } }),
    ]);

    const formattedConcepts = dbConcepts.map((c) => ({
      id: c.id,
      num: c.num,
      title: c.title,
      desc: c.desc,
      tag: c.tag,
      items: JSON.parse(c.items || "[]"),
    }));

    const formattedPillars = dbPillars.map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      iconName: p.iconName,
      summary: p.summary,
      actions: JSON.parse(p.actions || "[]"),
    }));

    const formattedMedia = dbMedia.map((m) => ({
      id: m.id,
      title: m.title,
      type: m.type,
      category: m.category || undefined,
      mediaUrl: m.mediaUrl || undefined,
      embedUrl: m.embedUrl || undefined,
      url: m.url || undefined,
      platform: m.platform || undefined,
      coverUrl: m.coverUrl || undefined,
      duration: m.duration || undefined,
      date: m.date || undefined,
      description: m.description || undefined,
      order: m.order || 0,
    }));

    const formattedDocs = dbDocs.map((d) => ({
      id: d.id,
      title: d.title,
      category: d.category,
      department: d.department || undefined,
      date: d.date,
      fileSize: d.fileSize,
      fileUrl: d.fileUrl || undefined,
      description: d.description,
      downloadsCount: d.downloadsCount,
      featured: d.featured,
    }));

    const filePath = join(process.cwd(), "lib", "agenda-data.ts");
    let content = await readFile(filePath, "utf-8");

    // Reemplazar conceptStepsList
    const conceptCode =
      "export const conceptStepsList: ConceptStep[] = " +
      JSON.stringify(formattedConcepts, null, 2) +
      ";";
    content = content.replace(/export const conceptStepsList: ConceptStep\[\] = \[[\s\S]*?\n\];/, conceptCode);

    // Reemplazar pillars
    const pillarsCode =
      "export const pillars: Pillar[] = " + JSON.stringify(formattedPillars, null, 2) + ";";
    content = content.replace(/export const pillars: Pillar\[\] = \[[\s\S]*?\n\];/, pillarsCode);

    // Reemplazar mediaItemsList
    const mediaCode =
      "export const mediaItemsList: MediaItem[] = " + JSON.stringify(formattedMedia, null, 2) + ";";
    content = content.replace(/export const mediaItemsList: MediaItem\[\] = \[[\s\S]*?\n\];/, mediaCode);

    // Reemplazar documentsList
    const docsCode =
      "export const documentsList: DocumentItem[] = " + JSON.stringify(formattedDocs, null, 2) + ";";
    content = content.replace(/export const documentsList: DocumentItem\[\] = \[[\s\S]*?\n\];/, docsCode);

    await writeFile(filePath, content, "utf-8");
  } catch (error) {
    console.error("Error sincronizando DB a agenda-data.ts:", error);
  }
}
