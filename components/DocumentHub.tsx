"use client";

import { useState } from "react";
import { FileText, Download, Search, Eye, Sparkles, CheckCircle2, ShieldCheck, X, BookOpen, ExternalLink } from "lucide-react";
import { documentsList as defaultDocuments, DocumentItem } from "@/lib/agenda-data";

interface DocumentHubProps {
  documents?: DocumentItem[];
}

export function DocumentHub({ documents: propDocuments }: DocumentHubProps) {
  const documentsList = propDocuments && propDocuments.length > 0 ? propDocuments : defaultDocuments;
  const [docSearchQuery, setDocSearchQuery] = useState("");
  const [readingDoc, setReadingDoc] = useState<DocumentItem | null>(null);

  const featuredDoc = documentsList.find((doc) => doc.featured) || documentsList[0];

  const regularDocs = documentsList.filter((doc) => doc.id !== featuredDoc?.id);

  const filteredDocs = regularDocs.filter((doc) => {
    return (
      doc.title.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(docSearchQuery.toLowerCase())
    );
  });

  return (
    <section id="descargas" className="bg-slate-50 dark:bg-[#101620] py-20 border-t border-slate-200 dark:border-amber-500/20 transition-colors duration-300">
      <div className="container-page">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 text-xs font-black uppercase text-emerald-800 dark:text-emerald-400">
              Repositorio Documental Abierto
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Centro de Descargas
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-300 font-medium max-w-2xl">
              Acceso libre y transparente a los acuerdos firmados, borradores de proyectos de ley, actas de la comisión y decretos reglamentarios.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[280px]">
            <Search className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Buscar documento..."
              value={docSearchQuery}
              onChange={(e) => setDocSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none shadow-xs"
            />
          </div>
        </div>

        {/* Flagship Featured Document Card */}
        {featuredDoc && (
          <div className="mb-10 overflow-hidden rounded-[32px] border-2 border-emerald-500/40 dark:border-emerald-500/30 bg-gradient-to-br from-[#0F2942] via-[#1E3A8A] to-[#0F2942] dark:from-slate-900 dark:via-[#0F2942] dark:to-slate-900 p-8 text-white shadow-xl relative">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-emerald-400 text-[#0F2942] px-2.5 py-1 text-xs font-black uppercase tracking-wider">
                    Documento Insignia Oficial
                  </span>
                  <span className="text-xs text-slate-300 font-bold">PDF · {featuredDoc.fileSize}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  {featuredDoc.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-medium">
                  {featuredDoc.description}
                </p>
              </div>

              <div className="flex flex-wrap lg:flex-col gap-3 shrink-0">
                <button
                  onClick={() => setReadingDoc(featuredDoc)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#0F2942] font-black px-6 py-3.5 text-xs shadow-lg transition"
                >
                  <BookOpen size={16} /> Ver Documento
                </button>
                <a
                  href={featuredDoc.fileUrl || "/Acuerdo-001-2026-Agenda-50-50.pdf"}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold px-6 py-3.5 text-xs border border-white/20 transition cursor-pointer"
                >
                  <Download size={16} /> Descargar PDF Oficial
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Regular Document Cards Grid */}
        {filteredDocs.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="rounded-full bg-slate-100 dark:bg-slate-700 px-3 py-0.5 text-[10px] font-black uppercase text-slate-600 dark:text-slate-300">
                      {doc.category}
                    </span>
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-400">{doc.date}</span>
                  </div>

                  <h4 className="mt-2 font-black text-slate-900 dark:text-white text-base leading-snug">
                    {doc.title}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-medium line-clamp-2">
                    {doc.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-400 dark:text-slate-400">{doc.fileSize}</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setReadingDoc(doc)}
                      className="flex items-center gap-1 font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-500"
                    >
                      <Eye size={14} /> Ver
                    </button>
                    <a
                      href={doc.fileUrl || "/Acuerdo-001-2026-Agenda-50-50.pdf"}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-extrabold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                    >
                      <Download size={14} /> Descargar
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full-screen PDF Reader Modal */}
      {readingDoc && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-[#0F2942]/90 dark:bg-black/90 backdrop-blur-md p-2 sm:p-4 md:p-6 animate-in fade-in">
          <div className="w-full h-full flex flex-col rounded-[24px] bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0">
              <div className="flex items-center gap-3">
                <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 px-2.5 py-1 text-xs font-black uppercase">
                  Lector PDF
                </span>
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white line-clamp-1">
                  {readingDoc.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={readingDoc.fileUrl || "/Acuerdo-001-2026-Agenda-50-50.pdf"}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-bold transition"
                >
                  <Download size={14} /> Descargar PDF
                </a>
                <button
                  onClick={() => setReadingDoc(null)}
                  className="rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 p-2 text-slate-700 dark:text-slate-200 transition"
                  title="Cerrar Lector"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Embedded PDF Viewer */}
            <div className="flex-1 w-full h-full bg-slate-900 relative">
              <iframe
                src={readingDoc.fileUrl || "/Acuerdo-001-2026-Agenda-50-50.pdf"}
                className="w-full h-full border-none"
                title={`Lector PDF ${readingDoc.title}`}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
