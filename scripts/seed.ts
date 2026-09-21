import { PrismaClient } from "@prisma/client";
import { pillars, milestones, departmentsData, documentsList, conceptStepsList, mediaItemsList } from "../lib/agenda-data";

const prisma = new PrismaClient();

async function main() {
  console.log("Comprobando y conservando datos de la base de datos...");

  // Config inicial
  await prisma.siteConfig.upsert({
    where: { id: "global" },
    update: {},
    create: {
      id: "global",
      heroTitle: "Hacia una distribución justa 50/50",
      heroSubtitle: "Transformando la descentralización tributaria en Bolivia mediante el Acuerdo N° 001/2026 de Sucre.",
      heroCtaText: "Explorar la Agenda",
      heroCtaLink: "#pilares",
      badgeText: "Acuerdo N° 001/2026 de Sucre",
      acuerdoDateText: "5 de Agosto de 2026",
    },
  });

  // Pilares (No sobreescribir datos existentes del usuario)
  for (let i = 0; i < pillars.length; i++) {
    const p = pillars[i];
    await prisma.pillar.upsert({
      where: { id: p.id },
      update: {}, // Mantener intacto si existe
      create: {
        id: p.id,
        title: p.title,
        category: p.category,
        iconName: p.iconName,
        summary: p.summary,
        actions: JSON.stringify(p.actions),
        order: i,
      },
    });
  }

  // Hitos / Milestones
  for (let i = 0; i < milestones.length; i++) {
    const m = milestones[i];
    await prisma.milestone.upsert({
      where: { id: m.id },
      update: {}, // Mantener intacto si existe
      create: {
        id: m.id,
        title: m.title,
        dateText: m.date,
        status: m.status,
        detail: m.detail,
        documents: JSON.stringify(m.documents || []),
        participants: JSON.stringify(m.participants || []),
        order: i,
      },
    });
  }

  // Departamentos
  for (const d of departmentsData) {
    await prisma.departmentData.upsert({
      where: { id: d.id },
      update: {}, // Mantener intacto si existe
      create: {
        id: d.id,
        name: d.name,
        capital: d.capital,
        governor: d.governor,
        adhered: d.adhered,
        adhesionDate: d.adhesionDate,
        currentFiscalRatio: d.currentFiscalRatio,
        target5050Impact: d.target5050Impact,
        keyProjects: JSON.stringify(d.keyProjects),
        mesasCount: d.mesasCount,
        regionalNotes: d.regionalNotes,
        pathD: d.pathD,
      },
    });
  }

  // Conceptos Acordeón
  for (const cs of conceptStepsList) {
    await prisma.conceptStep.upsert({
      where: { num: cs.num },
      update: {}, // Mantener intacto si existe
      create: {
        num: cs.num,
        title: cs.title,
        desc: cs.desc,
        tag: cs.tag,
        items: JSON.stringify(cs.items),
      },
    });
  }

  // Recurso Multimedia (Solo insertar faltantes)
  for (const m of mediaItemsList) {
    await prisma.mediaItem.upsert({
      where: { id: m.id },
      update: {}, // Mantener intacto si existe
      create: {
        id: m.id,
        title: m.title,
        type: m.type,
        category: m.category,
        mediaUrl: m.mediaUrl,
        embedUrl: m.embedUrl,
        url: m.url,
        platform: m.platform,
        coverUrl: m.coverUrl,
        duration: m.duration,
        date: m.date,
        description: m.description,
        order: m.order || 0,
      },
    });
  }

  // Documentos (Solo insertar faltantes)
  for (const doc of documentsList) {
    await prisma.documentItem.upsert({
      where: { id: doc.id },
      update: {}, // Mantener intacto si existe
      create: {
        id: doc.id,
        title: doc.title,
        category: doc.category,
        department: doc.department || null,
        date: doc.date,
        fileUrl: doc.fileUrl || null,
        fileSize: doc.fileSize,
        description: doc.description,
        downloadsCount: doc.downloadsCount || 0,
        featured: doc.featured || false,
      },
    });
  }

  // Usuario Administrador por defecto
  const defaultAdmin = await prisma.adminUser.findFirst();
  if (!defaultAdmin) {
    const bcrypt = await import("bcryptjs");
    const passwordHash = bcrypt.hashSync("Admin50502026!", 10);
    await prisma.adminUser.create({
      data: {
        email: "admin@agenda5050.gob.bo",
        name: "Administrador Agenda 50/50",
        passwordHash: passwordHash,
        role: "admin",
      },
    });
  }

  console.log("Base de datos verificada y sincronizada respetando los datos modificados por el usuario.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
