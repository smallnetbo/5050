import { prisma } from "../lib/db";

const MODULE_CONFIGS = [
  { key: "revista", label: "Portal Revista 50/50", enabled: true, showInNavbar: true },
  { key: "ruta-viva", label: "Portal Ruta Viva 50/50", enabled: true, showInNavbar: true },
  { key: "ruta-viva-mapa", label: "Ruta Viva · Mapa Territorial", enabled: true, showInNavbar: false },
  { key: "ruta-viva-timeline", label: "Ruta Viva · Línea Audiovisual", enabled: true, showInNavbar: false },
  { key: "ruta-viva-kit", label: "Ruta Viva · Kit de Redes y Prensa", enabled: true, showInNavbar: false },
  { key: "semaforizacion-ejecutiva", label: "Semaforización Ejecutiva y Trazabilidad", enabled: true, showInNavbar: false },
];

const EDITION_01_CHAPTERS = [
  {
    slug: "prologo",
    order: 0,
    kicker: "Prólogo · El punto de partida",
    title: "17 años después, el Censo 2024 aceleró el Pacto de Sucre",
    summary:
      "El 5 de agosto de 2026, en la Casa de la Libertad de Sucre, el Gobierno Nacional y las 9 Gobernaciones firmaron el Acuerdo N° 001/2026, reconociendo que tras más de diecisiete años el proceso autonómico seguía inconcluso.",
    content:
      "La Agenda 50/50 nace como una reforma estructural del Estado basada en cuatro fundamentos: ordenamiento competencial, autonomía financiera, corresponsabilidad fiscal y transparencia verifiable.",
    quoteText: "La Agenda 50/50 no es el final, es el principio de lo que realmente se quiere construir para el futuro de la patria.",
    quoteSource: "Encuentro Nacional con Municipios · La Paz, 27 de agosto de 2026",
    linkedActor: "NCE + 9 GAD",
    linkedDocumentId: "doc-1",
    linkedMediaId: "v-4",
    isVisible: true,
  },
  {
    slug: "capitulo-1",
    order: 1,
    kicker: "Capítulo 01 · Nivel Central y 9 Gobernaciones",
    title: "De la firma en Sucre a las primeras leyes y decretos promulgados",
    summary:
      "Entre julio y octubre de 2026, el proceso pasó del papel a la Gaceta Oficial: Ley N° 1755 (PGE 2026), D.S. N° 5686 (PRFT), Ley N° 1763, Ley N° 1771 (prediarios) y D.S. N° 5738.",
    content:
      "En paralelo, las conclusiones de Cobija, Pando (12/10/2026) fijaron el mandato para la Ley Especial de Coparticipación, la reforma a la Ley 154 y el reemplazo de la Ley 699 de Relacionamiento Internacional.",
    quoteText: "Avanzar hacia una autonomía con financiamiento efectivo y responsabilidades claras, compatible con la sostenibilidad fiscal.",
    quoteSource: "Conclusiones de Cobija, Pando · 12 de octubre de 2026",
    linkedActor: "NCE + GAD",
    linkedDocumentId: "cmv5qsmn900019rjpk9ung5dm",
    linkedMediaId: "cmwtfm0np0000gfxb17825cg0",
    isVisible: true,
  },
  {
    slug: "capitulo-2",
    order: 2,
    kicker: "Capítulo 02 · Municipios (GAM-AMB y FAM-Bolivia)",
    title: "El bloque municipal: Acuerdo 002/2026, USD 100M y devolución del FPIEEH",
    summary:
      "Con 25 compromisos específicos, el proceso articuló a las 9 ciudades capitales más El Alto (Acuerdo N° 002/2026) y al municipalismo rural y departamental (FAM-Bolivia y AMDEs).",
    content:
      "En Porongo (23/09) se acordó la aplicación preferente del PRFT, consulta por el 12% FPIEEH y USD 100 millones en obras municipales. En La Paz (16/11) el Min. Hidrocarburos propuso devolver el FPIEEH 2026 para ejecución inmediata.",
    quoteText: "No debe determinarse primero qué porcentaje corresponde a los municipios, sino cuánto cuesta ejercer las competencias municipales.",
    quoteSource: "Acta FAM-Bolivia / AMDEs · Porongo, 23 de septiembre de 2026",
    linkedActor: "GAM / AMB / FAM",
    linkedDocumentId: "doc-2",
    linkedMediaId: "v-3",
    isVisible: true,
  },
  {
    slug: "capitulo-3",
    order: 3,
    kicker: "Capítulo 03 · Autonomía Regional del Gran Chaco",
    title: "Yacuiba puso números sobre la mesa: la fórmula gradual 70/65/60",
    summary:
      "El 6 de noviembre de 2026 en Yacuiba, el GARGCH presentó ante el SEA y el Viceministerio de Autonomías una propuesta concreta de reconfiguración tributaria en 4 ejes.",
    content:
      "Incluye reducción gradual del NCE (70% en 2027, 65% en 2028, 60% en 2029) con coparticipación subnacional del 5%, 10% y 15% sobre 5 impuestos, revisión de peajes (17% Vías Bolivia / 83% ABC) y transferencia directa ref. D.S. 331.",
    quoteText: "Circuito cerrado de recursos bajo el modelo 50/50 para vincular la recaudación vial con la inversión regional.",
    quoteSource: "Acta Técnica GARGCH · Yacuiba, 6 de noviembre de 2026",
    linkedActor: "Gran Chaco (GAR)",
    linkedDocumentId: "cmwl6bpfd0000itil4vh9awka",
    linkedMediaId: null,
    isVisible: true,
  },
  {
    slug: "capitulo-4",
    order: 4,
    kicker: "Capítulo 04 · Autonomías Indígenas (CONAIOC / GAIOC)",
    title: "Desde Vinto: «No hay Agenda 50/50 sin las GAIOC»",
    summary:
      "El 12 de septiembre de 2026 en Vinto, siete GAIOC constituidas junto a Challa y Lomerío en trámite conformaron el Consejo Asesor Permanente.",
    content:
      "Señalaron 3 deudas históricas (justicia indígena, consulta previa y gestión pública acorde a formas propias), propusieron flexibilizar el certificado de ancestralidad en la Ley 031 y crear un Fondo Compensatorio para GAIOC vulnerables.",
    quoteText: "No hay Agenda 50/50 sin las GAIOC.",
    quoteSource: "Acta CONAIOC · Vinto, 12 de septiembre de 2026",
    linkedActor: "CONAIOC / GAIOC",
    linkedDocumentId: "cmv5pp52u00009rjp1di5qodv",
    linkedMediaId: null,
    isVisible: true,
  },
  {
    slug: "epilogo",
    order: 5,
    kicker: "Epílogo · Meta 1 de Enero de 2027",
    title: "Próxima parada: Mesas técnicas del 23 de noviembre al 11 de diciembre",
    summary:
      "Comparador de corresponsabilidad multinivel y hoja de ruta final hacia la entrada en vigencia de la Gestión Fiscal 50/50.",
    content:
      "Las mesas técnicas de cierre abordan régimen laboral municipal, contrataciones, sostenibilidad del SUS, seguridad ciudadana, ITV y el proyecto de Ley Especial de Coparticipación.",
    quoteText: "El desarrollo empieza en las regiones con reglas claras y corresponsabilidad fiscal.",
    quoteSource: "Servicio Estatal de Autonomías (SEA)",
    linkedActor: "Multinivel",
    linkedDocumentId: "cmwl6ipxf0001itilg3ifuqw0",
    linkedMediaId: null,
    isVisible: true,
  },
];

const SEDES = [
  {
    slug: "sucre",
    city: "Sucre",
    department: "CH",
    lat: -19.0196,
    lng: -65.2627,
    title: "Acuerdo N° 001/2026 — Casa de la Libertad",
    dateLabel: "5 de agosto de 2026",
    actors: "Presidente del Estado + 9 Gobernaciones",
    summary:
      "Firma fundacional de la Agenda 50/50. Fija 13 temáticas prioritarias: ampliación del dominio tributario (Ley 154 en 90 días), eliminación de condicionalidades de gasto, alivio fiscal y Ley Especial de Coparticipación para 2027.",
    keyFiguresJson: JSON.stringify([
      "9/9 Gobernaciones adheridas",
      "13 temáticas estructurales",
      "Meta: Gestión Fiscal 2027",
    ]),
    linkedDocumentId: "doc-1",
    linkedChapterSlug: "prologo",
    accent: "gold",
    order: 1,
    isVisible: true,
  },
  {
    slug: "lapaz",
    city: "La Paz",
    department: "LP",
    lat: -16.4897,
    lng: -68.1193,
    title: "Acuerdo N° 002/2026 (Capitales/El Alto) y Acta SAM",
    dateLabel: "29/09/2026 y 16/11/2026",
    actors: "Gobierno Nacional + AMB + Sistema Asociativo Municipal",
    summary:
      "Pacto de 3 ejes con ciudades capitales y El Alto con enfoque diferenciado, seguido por el Acta del 16 de noviembre que compromete la devolución en 2026 del FPIEEH 2026 y 8 mesas técnicas hasta el 11 de diciembre.",
    keyFiguresJson: JSON.stringify([
      "10 ciudades principales (AMB)",
      "Devolución FPIEEH 2026",
      "8 mesas técnicas (23/11–11/12)",
    ]),
    linkedDocumentId: "doc-2",
    linkedChapterSlug: "capitulo-2",
    accent: "emerald",
    order: 2,
    isVisible: true,
  },
  {
    slug: "vinto",
    city: "Vinto",
    department: "CB",
    lat: -17.3975,
    lng: -66.3167,
    title: "Encuentro CONAIOC / Autonomías Indígenas (GAIOC)",
    dateLabel: "12 de septiembre de 2026",
    actors: "Viceministerio de Autonomías + SEA + CONAIOC",
    summary:
      "Siete GAIOC constituidas y dos en trámite conformaron el Consejo Asesor Permanente, plantearon 3 deudas históricas (justicia indígena, consulta previa y gestión propia) y un Fondo Compensatorio para GAIOC vulnerables.",
    keyFiguresJson: JSON.stringify([
      "7 GAIOC + 2 en trámite",
      "Consejo Asesor Permanente",
      "Reforma Ley N° 031",
    ]),
    linkedDocumentId: "cmv5pp52u00009rjp1di5qodv",
    linkedChapterSlug: "capitulo-4",
    accent: "emerald",
    order: 3,
    isVisible: true,
  },
  {
    slug: "porongo",
    city: "Porongo",
    department: "SC",
    lat: -17.8506,
    lng: -63.3106,
    title: "Pacto FAM-Bolivia / AMDEs y Alivio Municipal",
    dateLabel: "23 de septiembre de 2026",
    actors: "FAM-Bolivia + AMDEs + MEFP + Vocería Presidencial",
    summary:
      "Acuerdo en 4 puntos: aplicación preferente del PRFT (D.S. 5686), consulta por el no débito y devolución del 12% FPIEEH, y medidas de mitigación por el diésel (D.S. 5716) con fideicomiso y USD 100 millones en obras.",
    keyFiguresJson: JSON.stringify([
      "USD 100M inversión municipal",
      "12% FPIEEH (Ley 767)",
      "PRFT preferente (D.S. 5686)",
    ]),
    linkedDocumentId: "cmuzjj5mu0000dpvbiyb6hjhh",
    linkedChapterSlug: "capitulo-2",
    accent: "gold",
    order: 4,
    isVisible: true,
  },
  {
    slug: "cobija",
    city: "Cobija",
    department: "PD",
    lat: -11.0267,
    lng: -68.7692,
    title: "Conclusiones Departamentales desde la Amazonía",
    dateLabel: "12 de octubre de 2026",
    actors: "Gobernaciones (GAD) + Ministerios del NCE",
    summary:
      "Mandato conjunto para presentar el Proyecto de Ley Especial de Coparticipación, revisar el 12% del IDH (Ley 767), redactar la Ley Básica de Relacionamiento Internacional (reemplazo Ley 699) y concluir la reforma a la Ley 154.",
    keyFiguresJson: JSON.stringify([
      "Ley Especial Coparticipación",
      "Reemplazo Ley N° 699",
      "Reforma Ley N° 154",
    ]),
    linkedDocumentId: "cmv5qsmn900019rjpk9ung5dm",
    linkedChapterSlug: "capitulo-1",
    accent: "emerald",
    order: 5,
    isVisible: true,
  },
  {
    slug: "yacuiba",
    city: "Yacuiba",
    department: "TJ",
    lat: -22.0164,
    lng: -63.6775,
    title: "Acta Técnica Regional del Gran Chaco (4 Ejes)",
    dateLabel: "6 de noviembre de 2026",
    actors: "GARGCH + Viceministerio de Autonomías + SEA",
    summary:
      "Propuesta gradual de reducción del NCE (70%→65%→60%) y coparticipación subnacional (5%→10%→15%) en 5 impuestos; denuncia de la paradoja vial (17% Vías Bolivia / 83% ABC); piloto de salud y transferencia directa ref. D.S. 331.",
    keyFiguresJson: JSON.stringify([
      "Fórmula 70% / 65% / 60%",
      "Peajes: 17% Vías Bolivia / 83% ABC",
      "Transferencia directa ref. D.S. 331",
    ]),
    linkedDocumentId: "cmwl6bpfd0000itil4vh9awka",
    linkedChapterSlug: "capitulo-3",
    accent: "red",
    order: 6,
    isVisible: true,
  },
];

const CARDS = [
  {
    slug: "balance-general",
    title: "La Agenda 50/50 avanza con hechos hacia 2027",
    category: "Placa 01 · Balance General",
    subtitle: "Seguimiento oficial del pacto fiscal y autonómico de Bolivia",
    heroStat: "56",
    heroStatLabel: "Compromisos oficiales en 6 niveles de gobierno",
    bulletsJson: JSON.stringify([
      "13 de 16 hitos de la Ruta Crítica ya cumplidos.",
      "18 compromisos cumplidos o en ejecución activa.",
      "7 acuerdos y actas oficiales publicados con transparencia.",
      "Meta nacional: Aplicación de la Gestión Fiscal 50/50 el 01/01/2027.",
    ]),
    footerNote: "Fuente: Tablero Oficial Agenda 50/50 · SEA Bolivia",
    copyText:
      "📊 BALANCE AGENDA 50/50 RUMBO AL 2027\n\nYa son 56 compromisos monitoreados en 6 niveles de gobierno (NCE, Gobernaciones, Municipios, CONAIOC y Gran Chaco) y 13 de 16 hitos cumplidos desde la Firma de Sucre.\n\nConoce el avance en vivo en agenda50-50.sea.gob.bo/ruta-viva",
    templateType: "emerald",
    order: 1,
    isVisible: true,
  },
  {
    slug: "leyes-decretos",
    title: "De los acuerdos a la Gaceta Oficial",
    category: "Placa 02 · Resultados Normativos",
    subtitle: "Leyes y Decretos Supremos promulgados entre julio y octubre de 2026",
    heroStat: "5",
    heroStatLabel: "Normas nacionales promulgadas en tiempo récord",
    bulletsJson: JSON.stringify([
      "Ley N° 1755 (30/07): Flexibilidad financiera PGE 2026 para las ETA.",
      "D.S. N° 5686 (31/08): Programa de Readecuación Financiera Territorial (PRFT).",
      "Ley N° 1763 (17/09) y Ley N° 1771 (30/09): Alivio de obligaciones y prediarios.",
      "D.S. N° 5738 (05/10): Diploma de Bachiller gratuito y digital.",
    ]),
    footerNote: "Fuente: Repositorio Normativo Agenda 50/50 · SEA",
    copyText:
      "⚖️ LO QUE YA ES LEY EN LA AGENDA 50/50\n\nLa Agenda 50/50 ya se traduce en normas concretas:\n✅ Ley 1755 (PGE 2026 flexible)\n✅ D.S. 5686 (Saneamiento financiero PRFT)\n✅ Ley 1763 y Ley 1771 (Alivio de obligaciones y prediarios)\n✅ D.S. 5738 (Diploma de Bachiller digital)\n\nDescarga los textos oficiales en agenda50-50.sea.gob.bo/ruta-viva",
    templateType: "gold",
    order: 2,
    isVisible: true,
  },
  {
    slug: "fpieeh-municipal",
    title: "Liquidez y obras para los municipios del país",
    category: "Placa 03 · Alivio Municipal",
    subtitle: "Acuerdos de Porongo (FAM/AMDEs) y Sistema Asociativo Municipal (16/11)",
    heroStat: "USD 100M",
    heroStatLabel: "En obras de inversión municipal + devolución del 12% FPIEEH",
    bulletsJson: JSON.stringify([
      "Propuesta del Min. Hidrocarburos para devolver el FPIEEH 2026 de ejecución inmediata.",
      "Consulta técnica para suspender el débito del 12% del FPIEEH en 2027.",
      "Aplicación preferente del PRFT (D.S. 5686) para reprogramación de deudas.",
      "8 mesas técnicas municipales en curso del 23/11 al 11/12.",
    ]),
    footerNote: "Fuente: Actas FAM Porongo (23/09) y SAM La Paz (16/11)",
    copyText:
      "🏛️ MÁS RECURSOS Y ALIVIO PARA LOS MUNICIPIOS\n\nTras los acuerdos con FAM-Bolivia, AMB y el Sistema Asociativo Municipal:\n💧 Devolución de recursos del FPIEEH 2026\n🏗️ USD 100 millones para inversión municipal\n📉 Reprogramación de deudas vía PRFT (D.S. 5686)\n\nDetalles en agenda50-50.sea.gob.bo/ruta-viva",
    templateType: "emerald",
    order: 3,
    isVisible: true,
  },
  {
    slug: "territorios-movimiento",
    title: "Gran Chaco y GAIOC trazan la ruta territorial",
    category: "Placa 04 · Territorios en Movimiento",
    subtitle: "Propuestas concretas desde Yacuiba (06/11) y Vinto (12/09)",
    heroStat: "70→60%",
    heroStatLabel: "Reducción gradual del NCE propuesta en Yacuiba (2027–2029)",
    bulletsJson: JSON.stringify([
      "Gran Chaco: Coparticipación gradual 5%→10%→15% sobre 5 impuestos nacionales.",
      "Paradoja vial: revisión del esquema 17% Vías Bolivia / 83% ABC.",
      "CONAIOC (Vinto): 7 GAIOC constituidas + 2 en trámite en Consejo Asesor.",
      "Fondo Compensatorio propuesto para GAIOC vulnerables y reforma Ley 031.",
    ]),
    footerNote: "Fuente: Actas Oficiales de Vinto (12/09) y Yacuiba (06/11)",
    copyText:
      "🗺️ BOLIVIA CONSTRUYE EL 50/50 DESDE SUS REGIONES\n\n📍 Yacuiba (Gran Chaco): Propuesta gradual 70/65/60 al 2029 y transferencia directa.\n📍 Vinto (CONAIOC): 7+2 GAIOC activan Consejo Asesor Permanente y Fondo Compensatorio.\n\nExplora el mapa interactivo en agenda50-50.sea.gob.bo/ruta-viva",
    templateType: "red",
    order: 4,
    isVisible: true,
  },
];

async function main() {
  console.log("Ejecutando seed idempotente de Productos Editoriales (Revista + Ruta Viva)...");

  for (const mod of MODULE_CONFIGS) {
    await prisma.siteModuleConfig.upsert({
      where: { key: mod.key },
      update: {},
      create: mod,
    });
  }

  const edition = await prisma.revistaEdition.upsert({
    where: { slug: "edicion-01" },
    update: {},
    create: {
      slug: "edicion-01",
      editionNumber: 1,
      title: "De Sucre al 2027",
      subtitle:
        "Crónica interactiva de cómo 17 años de autonomía inconclusa comenzaron a ordenarse en leyes, decretos y pactos territoriales rumbo a la Gestión Fiscal 50/50.",
      periodLabel: "Agosto – Noviembre 2026",
      coverImage: "/assets/video_firma_acuerdo_5050_cover.jpg",
      isVisible: true,
      isFeatured: true,
      publishedAt: "26 de noviembre de 2026",
      order: 1,
    },
  });

  for (const ch of EDITION_01_CHAPTERS) {
    await prisma.revistaChapter.upsert({
      where: {
        editionId_slug: {
          editionId: edition.id,
          slug: ch.slug,
        },
      },
      update: {},
      create: {
        editionId: edition.id,
        ...ch,
      },
    });
  }

  for (const sede of SEDES) {
    await prisma.rutaVivaSede.upsert({
      where: { slug: sede.slug },
      update: {},
      create: sede,
    });
  }

  for (const card of CARDS) {
    await prisma.rutaVivaCard.upsert({
      where: { slug: card.slug },
      update: {},
      create: card,
    });
  }

  console.log("Seed completado: 6 módulos, Edición 01 (6 capítulos), 6 sedes y 4 placas.");
}

main()
  .catch((e) => {
    console.error("Error en seed-productos:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
