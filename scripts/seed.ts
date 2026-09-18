import { PrismaClient } from "@prisma/client";
import { pillars, milestones, departmentsData, documentsList, conceptStepsList } from "../lib/agenda-data";


const prisma = new PrismaClient();

async function main() {
  console.log("Poblando base de datos SQLite para Agenda 50/50...");

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

  // Pilares
  for (let i = 0; i < pillars.length; i++) {
    const p = pillars[i];
    await prisma.pillar.upsert({
      where: { id: p.id },
      update: {
        title: p.title,
        category: p.category,
        iconName: p.iconName,
        summary: p.summary,
        actions: JSON.stringify(p.actions),
        order: i,
      },
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

  // Milestones
  for (let i = 0; i < milestones.length; i++) {
    const m = milestones[i];
    await prisma.milestone.upsert({
      where: { id: m.id },
      update: {
        title: m.title,
        dateText: m.date,
        status: m.status,
        detail: m.detail,
        documents: JSON.stringify(m.documents || []),
        participants: JSON.stringify(m.participants || []),
        order: i,
      },
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
      update: {
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

  // Documentos
  for (const doc of documentsList) {
    await prisma.documentItem.upsert({
      where: { id: doc.id },
      update: {
        title: doc.title,
        category: doc.category,
        date: doc.date,
        fileSize: doc.fileSize,
        description: doc.description,
        downloadsCount: doc.downloadsCount,
        featured: doc.featured || false,
      },
      create: {
        id: doc.id,
        title: doc.title,
        category: doc.category,
        date: doc.date,
        fileSize: doc.fileSize,
        description: doc.description,
        downloadsCount: doc.downloadsCount,
        featured: doc.featured || false,
      },
    });
  }

  // Conceptos Acordeón
  for (const cs of conceptStepsList) {
    await prisma.conceptStep.upsert({
      where: { num: cs.num },
      update: {
        title: cs.title,
        desc: cs.desc,
        tag: cs.tag,
        items: JSON.stringify(cs.items),
      },
      create: {
        num: cs.num,
        title: cs.title,
        desc: cs.desc,
        tag: cs.tag,
        items: JSON.stringify(cs.items),
      },
    });
  }

  console.log("Base de datos poblada exitosamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
