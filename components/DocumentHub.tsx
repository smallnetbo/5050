"use client";

import { useState, useMemo } from "react";
import {
  FileText,
  Download,
  Search,
  Eye,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  X,
  BookOpen,
  ExternalLink,
  Award,
  Calendar,
  Layers,
  Paperclip,
  Presentation,
  ClipboardList,
  Scale,
  FolderOpen,
  FileCheck,
} from "lucide-react";
import { documentsList as defaultDocuments, DocumentItem } from "@/lib/agenda-data";

interface DocumentHubProps {
  documents?: DocumentItem[];
}

export function DocumentHub({ documents: propDocuments }: DocumentHubProps) {
  const documentsList = propDocuments && propDocuments.length > 0 ? propDocuments : defaultDocuments;
  const [docSearchQuery, setDocSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [readingDoc, setReadingDoc] = useState<DocumentItem | null>(null);

  // Lista de categorías normalizadas para filtros
  const categoriesList = [
    { id: "all", label: "Todos los Documentos" },
    { id: "Acuerdo", label: "Acuerdos" },
    { id: "Acta", label: "Actas" },
    { id: "Presentación", label: "Presentaciones" },
    { id: "Anexo", label: "Anexos" },
    { id: "Proyecto de Ley", label: "Proyectos de Ley" },
  ];

  // Filtro dinámico por búsqueda y categoría
  const filteredDocs = useMemo(() => {
    return documentsList.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
        (doc.department && doc.department.toLowerCase().includes(docSearchQuery.toLowerCase()));

      const matchesCat =
        selectedCategory === "all" ||
        doc.category.toLowerCase().includes(selectedCategory.toLowerCase());

      return matchesSearch && matchesCat;
    });
  }, [documentsList, docSearchQuery, selectedCategory]);

  // Conteo de documentos por categoría
  const getCategoryCount = (catId: string) => {
    if (catId === "all") return documentsList.length;
    return documentsList.filter((d) => d.category.toLowerCase().includes(catId.toLowerCase())).length;
  };

  // Helper para asignar icono según categoría
  const getCategoryIcon = (category: string) => {
    const cat = (category || "").toLowerCase();
    if (cat.includes("acuerdo")) return ShieldCheck;
    if (cat.includes("acta")) return ClipboardList;
    if (cat.includes("presenta")) return Presentation;
    if (cat.includes("anexo")) return Paperclip;
    if (cat.includes("ley")) return Scale;
    return FileText;
  };

  // Helper para colores semánticos de categorías
  const getCategoryBadgeStyle = (category: string) => {
    const cat = (category || "").toLowerCase();
    if (cat.includes("acuerdo")) {
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300/40";
    }
    if (cat.includes("acta")) {
      return "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300/40";
    }
    if (cat.includes("presenta")) {
      return "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300/40";
    }
    if (cat.includes("anexo")) {
      return "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300/40";
    }
    if (cat.includes("ley")) {
      return "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300/40";
    }
    return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300/40";
  };

  return (
    <section
      id="descargas"
      className="bg-slate-50 dark:bg-[#101620] py-20 border-t border-slate-200 dark:border-amber-500/20 transition-colors duration-300"
    >
      <div className="container-page max-w-5xl space-y-8">
        {/* Header de la Sección */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 text-xs font-black uppercase text-emerald-800 dark:text-emerald-400">
              Repositorio Documental Oficial
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Centro de Descargas
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-300 font-medium">
              Acceso abierto, directo e íntegro a los acuerdos oficiales suscritos, actas de mesas técnicas, presentaciones, anexos y anteproyectos normativos del proceso autonómico 50/50.
            </p>
          </div>

          {/* Buscador Rápido */}
          <div className="relative min-w-[280px]">
            <Search className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500" size={17} />
            <input
              type="text"
              placeholder="Buscar por título, contenido o fecha..."
              value={docSearchQuery}
              onChange={(e) => setDocSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 pl-10 pr-4 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden shadow-xs transition"
            />
          </div>
        </div>

        {/* Barra de Filtros por Categoría */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categoriesList.map((cat) => {
            const count = getCategoryCount(cat.id);
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md scale-[1.02]"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isSelected
                      ? "bg-white/20 dark:bg-slate-900/20 text-white dark:text-slate-900"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Listado en Forma de Lista Profesional */}
        {filteredDocs.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-3">
            <div className="h-14 w-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
              <FolderOpen size={28} />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              No se encontraron documentos
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No hay archivos que coincidan con la búsqueda o el filtro seleccionado.
            </p>
            {docSearchQuery && (
              <button
                onClick={() => {
                  setDocSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 underline"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDocs.map((doc) => {
              const IconComponent = getCategoryIcon(doc.category);
              const badgeStyle = getCategoryBadgeStyle(doc.category);
              const safeUrl = doc.fileUrl || "/Acuerdo-001-2026-Agenda-50-50.pdf";

              return (
                <article
                  key={doc.id}
                  className={`group rounded-3xl border transition-all duration-200 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-emerald-500/40 flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                    doc.featured
                      ? "border-emerald-500/30 dark:border-emerald-500/30 ring-1 ring-emerald-500/10"
                      : "border-slate-200/90 dark:border-slate-800"
                  }`}
                >
                  {/* Left Column: Icon & Document Details */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                      <IconComponent size={22} />
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      {/* Meta Tags: Category, Featured, Date, Size */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${badgeStyle}`}
                        >
                          {doc.category}
                        </span>

                        {doc.featured && (
                          <span className="flex items-center gap-1 rounded-full bg-amber-400/10 dark:bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/30 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                            <Award size={11} /> Documento Oficial
                          </span>
                        )}

                        <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          <Calendar size={12} /> {doc.date}
                        </span>

                        <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500">
                          • PDF ({doc.fileSize})
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {doc.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium line-clamp-2">
                        {doc.description}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Actions (Preview & Download) */}
                  <div className="flex items-center gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setReadingDoc(doc)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-black transition active:scale-95"
                      title="Previsualizar documento PDF en pantalla completa"
                    >
                      <Eye size={15} className="text-emerald-600 dark:text-emerald-400" />
                      <span>Previsualizar</span>
                    </button>

                    <a
                      href={safeUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-[#0F2942] text-xs font-black shadow-xs hover:shadow-md transition active:scale-95"
                      title="Descargar archivo PDF oficial"
                    >
                      <Download size={15} />
                      <span>Descargar</span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Visor Modal de PDF Interactivo (Previsualización) */}
      {readingDoc && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-md p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
          <div className="w-full h-full flex flex-col rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0">
              <div className="flex items-center gap-3 min-w-0 pr-4">
                <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 px-2.5 py-1 text-xs font-black uppercase shrink-0">
                  {readingDoc.category}
                </span>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                  {readingDoc.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={readingDoc.fileUrl || "/Acuerdo-001-2026-Agenda-50-50.pdf"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  title="Abrir en pestaña nueva"
                >
                  <ExternalLink size={13} />
                  <span>Abrir en pestaña</span>
                </a>

                <a
                  href={readingDoc.fileUrl || "/Acuerdo-001-2026-Agenda-50-50.pdf"}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#0F2942] px-3.5 py-1.5 text-xs font-black transition shadow-xs"
                >
                  <Download size={13} />
                  <span>Descargar</span>
                </a>

                <button
                  onClick={() => setReadingDoc(null)}
                  className="rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 p-2 text-slate-700 dark:text-slate-200 transition"
                  title="Cerrar visor"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Embedded PDF Viewer */}
            <div className="flex-1 w-full h-full bg-slate-950 relative">
              <iframe
                src={`${readingDoc.fileUrl || "/Acuerdo-001-2026-Agenda-50-50.pdf"}#toolbar=1&navpanes=0`}
                className="w-full h-full border-none"
                title={`Visor PDF: ${readingDoc.title}`}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
