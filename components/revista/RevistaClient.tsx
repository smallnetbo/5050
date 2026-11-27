"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  Download,
  FileText,
  ArrowLeft,
  Calendar,
  MapPin,
  Landmark,
  Building2,
  Compass,
  Users,
  CheckCircle2,
  Play,
  ExternalLink,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Milestone, DocumentItem, ConceptStep, MediaItem } from "@/lib/agenda-data";
import { BoardCommitmentItem } from "@/lib/board-commitments-data";
import { RevistaEditionDTO } from "@/lib/productos-service";
import {
  REVISTA_EDITION_META,
  REVISTA_CHAPTERS,
  NORMATIVE_MILESTONES,
  TERRITORIAL_AGREEMENTS,
} from "@/lib/revista-data";
import {
  CommitmentsBreakdownChart,
  ChacoGradualChart,
  RoadParadoxChart,
  LevelComparator,
} from "./RevistaCharts";

interface RevistaClientProps {
  milestones: Milestone[];
  commitments: BoardCommitmentItem[];
  documents: DocumentItem[];
  conceptSteps: ConceptStep[];
  mediaItems?: MediaItem[];
  activeEdition?: RevistaEditionDTO;
  editionsList?: RevistaEditionDTO[];
  isPreviewMode?: boolean;
}

export function RevistaClient({
  milestones,
  commitments,
  documents,
  conceptSteps,
  mediaItems = [],
  activeEdition,
  editionsList = [],
  isPreviewMode = false,
}: RevistaClientProps) {
  const [activeChapter, setActiveChapter] = useState<string>("prologo");
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const isEditionOne = !activeEdition || activeEdition.editionNumber === 1;
  const visibleChapters = activeEdition?.chapters || [];
  const isChapterVisible = (slug: string) =>
    !activeEdition || visibleChapters.some((c) => c.slug === slug && c.isVisible);

  const editionNavItems = activeEdition
    ? visibleChapters.map((c, idx) => ({
      id: c.slug,
      num: String(idx).padStart(2, "0"),
      title: c.title,
    }))
    : REVISTA_CHAPTERS;

  const editionMeta = {
    number: activeEdition
      ? `Edición N° ${String(activeEdition.editionNumber).padStart(2, "0")}`
      : REVISTA_EDITION_META.number,
    period: activeEdition?.periodLabel || REVISTA_EDITION_META.period,
    title: activeEdition?.title || REVISTA_EDITION_META.title,
    subtitle: activeEdition?.subtitle || REVISTA_EDITION_META.subtitle,
  };

  const completedMilestones = milestones.filter((m) =>
    m.status.toLowerCase().includes("cumplido")
  ).length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveChapter(entry.target.id);
          }
        }
      },
      { rootMargin: "-25% 0px -55% 0px" }
    );

    for (const ch of REVISTA_CHAPTERS) {
      const el = document.getElementById(ch.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const handleDownloadPdf = async () => {
    try {
      setDownloadingPdf(true);
      const res = await fetch("/api/revista/pdf");
      if (!res.ok) throw new Error("Error generando PDF");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Revista-Agenda-5050-Edicion-01.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      window.print();
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] dark:bg-[#101620] text-[#1B2533] dark:text-slate-100 transition-colors duration-300">
      {isPreviewMode && (
        <div className="bg-amber-500 text-[#101620] px-4 py-2 text-center text-xs font-black tracking-wide">
          Modo Vista Previa (oculto al público) — Solo visible para administradores con sesión activa
        </div>
      )}
      {/* Sub-barra de navegación de capítulos (Sticky) */}
      <div className="sticky top-16 z-40 border-b border-amber-900/10 dark:border-slate-800 bg-[#FAF8F3]/90 dark:bg-[#101620]/90 backdrop-blur-md print:hidden">
        <div className="container-page flex items-center justify-between gap-4 py-2.5 overflow-x-auto custom-scrollbar">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-600 dark:text-slate-300 hover:text-[#3ac167] shrink-0"
          >
            <ArrowLeft size={14} /> Portal Principal
          </Link>

          <nav className="flex items-center gap-1.5">
            {editionNavItems.map((ch) => {
              const isActive = activeChapter === ch.id;
              return (
                <a
                  key={ch.id}
                  href={`#${ch.id}`}
                  className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[11px] font-extrabold transition ${isActive
                    ? "bg-[#1B2533] text-white dark:bg-[#c79d47] dark:text-[#101620]"
                    : "text-slate-600 dark:text-slate-400 hover:bg-amber-100/60 dark:hover:bg-slate-800"
                    }`}
                >
                  <span className="opacity-60 mr-1">{ch.num}</span>
                  {ch.title.split(":")[0]}
                </a>
              );
            })}
          </nav>

          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#3ac167] hover:bg-[#2ea354] disabled:opacity-60 px-3 py-1.5 text-xs font-black text-white shadow-emerald shrink-0 transition cursor-pointer"
          >
            {downloadingPdf ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Download size={14} />
            )}
            <span>{downloadingPdf ? "Generando..." : "PDF Ejecutivo"}</span>
          </button>
        </div>
      </div>

      {/* Portada Editorial */}
      <section className="relative overflow-hidden border-b border-amber-900/10 dark:border-slate-800 py-14 sm:py-20">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="container-page relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100/80 dark:bg-amber-950/60 border border-amber-400/40 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-300">
              <BookOpen size={14} /> Revista Digital Interactiva · {editionMeta.number} ·{" "}
              {editionMeta.period}
            </div>

            {editionsList.length > 1 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-black uppercase text-slate-400">Ediciones:</span>
                {editionsList.map((ed) => {
                  const isCurr = ed.id === activeEdition?.id;
                  return (
                    <Link
                      key={ed.id}
                      href={`/revista/${ed.slug}${isPreviewMode ? "?preview=1" : ""}`}
                      className={`rounded-xl px-3 py-1 text-xs font-extrabold transition border ${isCurr
                        ? "bg-[#1B2533] text-white border-[#1B2533] dark:bg-[#c79d47] dark:text-[#101620]"
                        : "bg-white dark:bg-[#17202C] text-slate-700 dark:text-slate-300 border-amber-900/15 dark:border-slate-700 hover:bg-amber-50"
                        }`}
                    >
                      Ed. {String(ed.editionNumber).padStart(2, "0")} · {ed.periodLabel}
                      {!ed.isVisible && " (Borrador)"}
                    </Link>
                  );
                })}
              </div>
            )}

            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1B2533] dark:text-white leading-[1.08]">
              50/50 en Movimiento:{" "}
              <span className="gold-gradient-text">{editionMeta.title}</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-700 dark:text-slate-300 font-medium leading-relaxed max-w-3xl">
              {editionMeta.subtitle}
            </p>

            {/* KPIs conectados en vivo */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white dark:bg-[#17202C] p-4 border border-amber-900/10 dark:border-slate-800 shadow-xs">
                <div className="text-2xl sm:text-3xl font-black text-[#3ac167]">
                  {completedMilestones}/{milestones.length}
                </div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                  Hitos Cumplidos en Ruta
                </div>
              </div>
              <div className="rounded-2xl bg-white dark:bg-[#17202C] p-4 border border-amber-900/10 dark:border-slate-800 shadow-xs">
                <div className="text-2xl sm:text-3xl font-black text-[#c79d47]">
                  {commitments.length}
                </div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                  Compromisos Monitoreados
                </div>
              </div>
              <div className="rounded-2xl bg-white dark:bg-[#17202C] p-4 border border-amber-900/10 dark:border-slate-800 shadow-xs">
                <div className="text-2xl sm:text-3xl font-black text-[#1B2533] dark:text-white">
                  {documents.length}
                </div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                  Acuerdos y Actas Oficiales
                </div>
              </div>
              <div className="rounded-2xl bg-white dark:bg-[#17202C] p-4 border border-amber-900/10 dark:border-slate-800 shadow-xs">
                <div className="text-2xl sm:text-3xl font-black text-[#dd3146]">9/9</div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                  Gobernaciones Adheridas
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3 print:hidden">
              <a
                href="#prologo"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#1B2533] hover:bg-slate-800 dark:bg-[#c79d47] dark:text-[#101620] text-white px-6 py-3 text-sm font-black transition shadow-soft"
              >
                <Sparkles size={16} /> Comenzar Lectura
              </a>
              <button
                onClick={handleDownloadPdf}
                disabled={downloadingPdf}
                className="inline-flex items-center gap-2 rounded-2xl border border-amber-900/20 dark:border-slate-700 bg-white dark:bg-[#17202C] hover:bg-amber-50 dark:hover:bg-slate-800 px-6 py-3 text-sm font-black transition cursor-pointer"
              >
                <Download size={16} className="text-[#3ac167]" />
                {downloadingPdf ? "Generando PDF..." : "Descargar Resumen Ejecutivo (PDF)"}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Franja Tricolor Institucional */}
      <div className="w-full h-2 flex">
        <div className="w-1/3 bg-[#dd3146]" />
        <div className="w-1/3 bg-[#fcc74f]" />
        <div className="w-1/3 bg-[#3ac167]" />
      </div>

      {/* Contenido por Capítulos */}
      <div className="container-page py-12 space-y-20">
        {!isEditionOne && (
          <div className="space-y-12">
            {visibleChapters.map((ch) => {
              const linkedDoc = documents.find((d) => d.id === ch.linkedDocumentId);
              const linkedMedia = mediaItems.find((m) => m.id === ch.linkedMediaId);
              return (
                <motion.section
                  key={ch.id}
                  id={ch.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45 }}
                  className="scroll-mt-32 rounded-3xl bg-white dark:bg-[#17202C] p-7 sm:p-9 border border-amber-900/10 dark:border-slate-800 shadow-soft space-y-5"
                >
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-[#c79d47]">
                      {ch.kicker}
                    </span>
                    <h2 className="mt-2 text-2xl sm:text-3xl font-black text-[#1B2533] dark:text-white">
                      {ch.title}
                    </h2>
                  </div>
                  <p className="text-base font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">
                    {ch.summary}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {ch.content}
                  </p>
                  {ch.quoteText && (
                    <blockquote className="rounded-2xl bg-[#FAF8F3] dark:bg-[#101620] border-l-4 border-[#3ac167] p-4 italic text-sm text-slate-700 dark:text-slate-300">
                      “{ch.quoteText}”
                      {ch.quoteSource && (
                        <footer className="mt-1 not-italic text-xs font-bold text-[#c79d47]">
                          — {ch.quoteSource}
                        </footer>
                      )}
                    </blockquote>
                  )}
                  <div className="flex flex-wrap gap-3">
                    {linkedDoc?.fileUrl && (
                      <a
                        href={linkedDoc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#1B2533] text-white px-4 py-2 text-xs font-black"
                      >
                        <FileText size={13} /> {linkedDoc.title} <ExternalLink size={11} />
                      </a>
                    )}
                    {linkedMedia?.mediaUrl && (
                      <video
                        src={encodeURI(linkedMedia.mediaUrl)}
                        controls
                        preload="metadata"
                        className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-700 mt-2"
                      />
                    )}
                  </div>
                </motion.section>
              );
            })}
          </div>
        )}

        {/* PRÓLOGO (Edición 01) */}
        {isEditionOne && isChapterVisible("prologo") && (
          <motion.section
            id="prologo"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="scroll-mt-32 space-y-8"
          >
            <div className="max-w-3xl">
              <span className="text-xs font-black uppercase tracking-widest text-[#c79d47]">
                Prólogo · El punto de partida
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-black">
                17 años después, el Censo 2024 aceleró el Pacto de Sucre
              </h2>
              <p className="mt-4 text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                El 5 de agosto de 2026, en la Casa de la Libertad de Sucre, el Gobierno Nacional y las 9
                Gobernaciones firmaron el <strong>Acuerdo N° 001/2026</strong>, reconociendo que tras más de
                diecisiete años el proceso autonómico seguía inconcluso. La Agenda 50/50 nace como una
                reforma estructural del Estado basada en cuatro fundamentos:
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {conceptSteps.map((step) => (
                <div
                  key={step.num}
                  className="rounded-2xl bg-white dark:bg-[#17202C] p-5 border border-amber-900/10 dark:border-slate-800 shadow-xs"
                >
                  <div className="text-xs font-black text-[#3ac167]">0{step.num}</div>
                  <h3 className="mt-1 text-base font-black">{step.title}</h3>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

            <CommitmentsBreakdownChart commitments={commitments} />
          </motion.section>
        )}

        {/* CAPÍTULO 1: NCE Y GOBERNACIONES */}
        {isEditionOne && isChapterVisible("capitulo-1") && (
          <motion.section
            id="capitulo-1"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="scroll-mt-32 space-y-8 pt-8 border-t border-amber-900/10 dark:border-slate-800"
          >
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#3ac167]">
                  <Landmark size={15} /> Capítulo 01 · Nivel Central y 9 Gobernaciones
                </div>
                <h2 className="text-3xl sm:text-4xl font-black">
                  De la firma en Sucre a las primeras leyes y decretos promulgados
                </h2>
                <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  Entre julio y octubre de 2026, el proceso pasó del papel a la Gaceta Oficial: se promulgó
                  la <strong>Ley N° 1755</strong> (flexibilidad financiera en el PGE 2026), el{" "}
                  <strong>D.S. N° 5686</strong> que creó el Programa de Readecuación Financiera Territorial
                  (PRFT), la <strong>Ley N° 1763</strong> (reforma a la Ley 492), la{" "}
                  <strong>Ley N° 1771</strong> (alivio de obligaciones públicas y prediarios) y el{" "}
                  <strong>D.S. N° 5738</strong>. En paralelo, las conclusiones de{" "}
                  <strong>Cobija, Pando (12/10/2026)</strong> fijaron el mandato para la Ley Especial de
                  Coparticipación, la reforma a la Ley 154 y el reemplazo de la Ley 699 de Relacionamiento
                  Internacional.
                </p>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-3xl overflow-hidden border border-amber-900/15 dark:border-slate-800 bg-[#1B2533] shadow-soft">
                  <video
                    src="/videos/Firma de acuerdo 5050.mp4"
                    poster="/assets/video_firma_acuerdo_5050_cover.jpg"
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full aspect-video object-cover"
                  />
                  <div className="p-4 text-white">
                    <div className="flex items-center gap-1.5 text-[11px] font-black uppercase text-[#fcc74f]">
                      <Play size={12} /> Documento Audiovisual
                    </div>
                    <div className="text-sm font-bold mt-0.5">
                      Firma del Acuerdo N° 001/2026 en la Casa de la Libertad, Sucre
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Línea de normas promulgadas */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {NORMATIVE_MILESTONES.map((norm) => (
                <div
                  key={norm.code}
                  className="rounded-2xl bg-white dark:bg-[#17202C] p-5 border border-amber-900/10 dark:border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 text-[11px] font-black text-emerald-800 dark:text-emerald-300">
                        {norm.tag} · {norm.code}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">{norm.date}</span>
                    </div>
                    <h3 className="mt-3 text-sm font-black">{norm.title}</h3>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {norm.impact}
                    </p>
                  </div>
                  {norm.pdfUrl && (
                    <a
                      href={norm.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#c79d47] hover:underline"
                    >
                      <FileText size={13} /> Abrir documento oficial <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* CAPÍTULO 2: MUNICIPIOS Y CAPITALES */}
        {isEditionOne && isChapterVisible("capitulo-2") && (
          <motion.section
            id="capitulo-2"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="scroll-mt-32 space-y-8 pt-8 border-t border-amber-900/10 dark:border-slate-800"
          >
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#c79d47]">
                <Building2 size={15} /> Capítulo 02 · Municipios (GAM-AMB y FAM-Bolivia)
              </div>
              <h2 className="text-3xl sm:text-4xl font-black">
                El bloque municipal: Acuerdo 002/2026, USD 100M y devolución del FPIEEH
              </h2>
              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Con <strong>25 compromisos específicos</strong>, los Gobiernos Autónomos Municipales
                constituyen el bloque más numeroso de la matriz. El proceso articuló tanto a las 9
                ciudades capitales más El Alto (<strong>Acuerdo N° 002/2026</strong>, 29 de septiembre)
                como al municipalismo rural y departamental representado por <strong>FAM-Bolivia</strong> y
                las <strong>AMDEs</strong> (Porongo, 23 de septiembre y La Paz, 16 de noviembre).
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {TERRITORIAL_AGREEMENTS.filter((t) => t.id === "porongo" || t.id === "sam-lapaz").map(
                (block) => (
                  <div
                    key={block.id}
                    className="rounded-3xl bg-white dark:bg-[#17202C] p-6 border border-amber-900/10 dark:border-slate-800 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs font-bold text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={13} className="text-[#dd3146]" /> {block.city}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={13} /> {block.date}
                        </span>
                      </div>
                      <div className="mt-2 text-xs font-black uppercase text-[#c79d47]">
                        {block.actor}
                      </div>
                      <h3 className="mt-1 text-xl font-black">{block.headline}</h3>
                      <ul className="mt-4 space-y-2.5">
                        {block.highlights.map((h, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                          >
                            <CheckCircle2 size={15} className="text-[#3ac167] shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {block.pdfUrl && (
                      <a
                        href={block.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#c79d47] hover:underline"
                      >
                        <FileText size={14} /> Consultar Acta Oficial (PDF) <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                )
              )}
            </div>
          </motion.section>
        )}

        {/* CAPÍTULO 3: GRAN CHACO */}
        {isEditionOne && isChapterVisible("capitulo-3") && (
          <motion.section
            id="capitulo-3"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="scroll-mt-32 space-y-8 pt-8 border-t border-amber-900/10 dark:border-slate-800"
          >
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#dd3146]">
                <Compass size={15} /> Capítulo 03 · Autonomía Regional del Gran Chaco
              </div>
              <h2 className="text-3xl sm:text-4xl font-black">
                Yacuiba puso números sobre la mesa: la fórmula gradual 70/65/60
              </h2>
              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                El 6 de noviembre de 2026 en Yacuiba, el Gobierno Autónomo Regional del Gran Chaco
                (GARGCH) presentó ante el SEA y el Viceministerio de Autonomías una propuesta concreta de
                reconfiguración tributaria en 4 ejes, junto al pedido de asignación directa sin
                intermediación departamental tomando como referencia operativa el Decreto Supremo N° 331.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <ChacoGradualChart />
              </div>
              <div className="lg:col-span-5">
                <RoadParadoxChart />
              </div>
            </div>
          </motion.section>
        )}

        {/* CAPÍTULO 4: GAIOC / CONAIOC */}
        {isEditionOne && isChapterVisible("capitulo-4") && (
          <motion.section
            id="capitulo-4"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="scroll-mt-32 space-y-8 pt-8 border-t border-amber-900/10 dark:border-slate-800"
          >
            <div className="grid gap-8 lg:grid-cols-12 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#3ac167]">
                  <Users size={15} /> Capítulo 04 · Autonomías Indígenas (CONAIOC / GAIOC)
                </div>
                <h2 className="text-3xl sm:text-4xl font-black">
                  Desde Vinto: &ldquo;No hay Agenda 50/50 sin las GAIOC&rdquo;
                </h2>
                <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  El 12 de septiembre de 2026 en Vinto (Cochabamba), siete autonomías indígena originario
                  campesinas constituidas (<em>Charagua Iyambae, Uru Chipaya, Kereimba Iyambae, Salinas,
                    Raqaypampa, Jatun Ayllu Yura y Territorio Indígena Multiétnico</em>) junto a{" "}
                  <em>Challa y Lomerío</em> en trámite, conformaron un <strong>Consejo Asesor Permanente</strong>{" "}
                  para destrabar los trámites ante los 4 órganos del Estado, flexibilizar el certificado de
                  ancestralidad y crear un <strong>Fondo Compensatorio</strong> para GAIOC vulnerables.
                </p>
              </div>

              <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-[#17202C] p-6 border border-amber-900/10 dark:border-slate-800 shadow-xs">
                <div className="text-xs font-black uppercase text-[#c79d47]">
                  Las 3 Deudas Históricas Señaladas en Vinto
                </div>
                <ol className="mt-4 space-y-3 text-sm font-bold">
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1B2533] text-white text-xs">
                      1
                    </span>
                    <span>Pleno reconocimiento y articulación de la Justicia Indígena.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#c79d47] text-white text-xs">
                      2
                    </span>
                    <span>Consulta previa libre, informada y consensuada.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3ac167] text-white text-xs">
                      3
                    </span>
                    <span>Gestión pública acorde a las formas propias de administración de los PIOS.</span>
                  </li>
                </ol>
                <a
                  href="/uploads/documents/acta-de-reuni-n-entre-el-viceministerio-de-autonom-as-y-tierras-con-la-conaioc-1791837355925-1795209480938.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#c79d47] hover:underline"
                >
                  <FileText size={14} /> Leer Acta de Vinto (PDF) <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </motion.section>
        )}

        {/* EPÍLOGO: COMPARADOR Y RUMBO AL 2027 */}
        {isEditionOne && isChapterVisible("epilogo") && (
          <motion.section
            id="epilogo"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="scroll-mt-32 space-y-8 pt-8 border-t border-amber-900/10 dark:border-slate-800"
          >
            <LevelComparator />

            <div className="rounded-3xl bg-[#1B2533] text-white p-8 sm:p-10 shadow-soft flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="max-w-2xl space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-[#fcc74f]">
                  Cierre de Edición · Meta 1 de Enero de 2027
                </span>
                <h3 className="text-2xl sm:text-3xl font-black">
                  Próxima parada: Mesas técnicas del 23 de noviembre al 11 de diciembre
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Descarga el Resumen Ejecutivo de esta Edición N° 01 en formato PDF para compartir con
                  autoridades, equipos técnicos y prensa, o regresa al portal para explorar los{" "}
                  {commitments.length} compromisos en detalle.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0 print:hidden">
                <button
                  onClick={handleDownloadPdf}
                  disabled={downloadingPdf}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#3ac167] hover:bg-[#2ea354] px-5 py-3 text-sm font-black text-white shadow-emerald transition cursor-pointer"
                >
                  {downloadingPdf ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Download size={16} />
                  )}
                  Descargar PDF Ejecutivo
                </button>
                <Link
                  href="/#tablero-compromisos"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 px-5 py-3 text-sm font-black text-white transition"
                >
                  Ver Tablero de {commitments.length} Compromisos
                </Link>
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
