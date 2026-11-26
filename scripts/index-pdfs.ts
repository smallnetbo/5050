import { prisma } from "../lib/db";
import { indexDocumentById } from "../lib/pdf-indexer";

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const idArg = args.find((a) => a.startsWith("--id="));
  const targetId = idArg ? idArg.replace("--id=", "").trim() : null;

  const docs = targetId
    ? await prisma.documentItem.findMany({ where: { id: targetId } })
    : await prisma.documentItem.findMany({ orderBy: { createdAt: "asc" } });

  if (docs.length === 0) {
    console.log("No se encontraron documentos para indexar.");
    return;
  }

  console.log(`Iniciando indexación de ${docs.length} documento(s)${force ? " (modo --force)" : ""}...\n`);

  let totalPages = 0;
  let totalChars = 0;

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    const prefix = `[${i + 1}/${docs.length}] ${doc.title}`;
    try {
      const res = await indexDocumentById(doc.id, { force });
      if (res.skipped) {
        console.log(`${prefix} — Omitido (sin cambios, ${res.pageCount} págs ya indexadas)`);
      } else {
        totalPages += res.pageCount;
        totalChars += res.totalChars;
        console.log(
          `${prefix} — ${res.pageCount} páginas indexadas (Nativo: ${res.nativePages}, OCR: ${res.ocrPages}, ${res.totalChars} caracteres)`
        );
      }
    } catch (err: any) {
      console.error(`${prefix} — ERROR: ${err?.message || err}`);
    }
  }

  console.log(`\nResumen: ${totalPages} páginas nuevas procesadas, ${totalChars} caracteres útiles extraídos.`);
}

main()
  .catch((err) => {
    console.error("Error fatal en index-pdfs:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
