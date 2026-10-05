"use client";

import { useState, useMemo } from "react";
import {
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  CheckCircle2,
  Table,
  FolderDown,
  Sparkles,
  X,
  ExternalLink,
  BookOpen,
  ArrowUpDown,
  Building2,
  Building,
  Landmark,
  Layers,
} from "lucide-react";
import { commitmentsData, processDocumentsList, ProcessDocument } from "@/lib/propuesta2-data";

export function InfoAndDocsSection() {
  const [subSection, setSubSection] = useState<"info" | "docs">("info");

  // State for "Quién Remite Qué" table
  const [searchTable, setSearchTable] = useState("");
  const [selectedActor, setSelectedActor] = useState("all");

  // State for Documents Hub
  const [searchDocs, setSearchDocs] = useState("");
  const [selectedDocType, setSelectedDocType] = useState("all");
  const [readingDoc, setReadingDoc] = useState<ProcessDocument | null>(null);

  // Distinct actors for filter
  const actorsList = [
    { id: "all", label: "Todos los actores" },
    { id: "MEFP", label: "MEFP" },
    { id: "Min. Hidrocarburos", label: "Min. Hidrocarburos" },
    { id: "GAD", label: "Cada GAD (Departamentos)" },
    { id: "GAM", label: "Cada GAM (Municipios)" },
    { id: "AMB", label: "AMB (Asociación Municipalidades)" },
    { id: "NCE", label: "Nivel Central / NCE" },
    { id: "SEA", label: "SEA / Viceministerio" },
  ];

  // Filtered deliverables table data
  const filteredTableData = useMemo(() => {
    return commitmentsData.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTable.toLowerCase()) ||
        item.deliverable.toLowerCase().includes(searchTable.toLowerCase()) ||
        item.responsible.toLowerCase().includes(searchTable.toLowerCase());

      const matchesActor =
        selectedActor === "all" ||
        item.responsible.toLowerCase().includes(selectedActor.toLowerCase());

      return matchesSearch && matchesActor;
    });
  }, [searchTable, selectedActor]);

  // Filtered documents
  const filteredDocsData = useMemo(() => {
    return processDocumentsList.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchDocs.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchDocs.toLowerCase()) ||
        doc.deliverer.toLowerCase().includes(searchDocs.toLowerCase());

      const matchesType =
        selectedDocType === "all" || doc.type === selectedDocType;

      return matchesSearch && matchesType;
    });
  }, [searchDocs, selectedDocType]);

  return (
    <section id="documentos" className="py-20 bg-slate-50 dark:bg-[#101620] border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="container-page">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-500/30 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
              <FolderDown size={14} />
              Transparencia Activa
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Información y Documentos del Proceso
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium max-w-2xl leading-relaxed">
              Consulte la matriz interactiva de entregables por entidad responsable y descargue todos los acuerdos, actas, anexos técnicos y presentaciones oficiales.
            </p>
          </div>

          {/* Toggle between Info (Quién remite qué) and Documentos (Carpeta) */}
          <div className="inline-flex p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start md:self-end shadow-2xs">
            <button
              onClick={() => setSubSection("info")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
                subSection === "info"
                  ? "bg-[#0F2942] dark:bg-emerald-500 text-white dark:text-slate-950 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Table size={15} />
              <span>Quién Remite Qué (Información)</span>
            </button>

            <button
              onClick={() => setSubSection("docs")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
                subSection === "docs"
                  ? "bg-[#0F2942] dark:bg-emerald-500 text-white dark:text-slate-950 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <FileText size={15} />
              <span>Carpeta de Documentos ({processDocumentsList.length})</span>
            </button>
          </div>
        </div>

        {/* ================= SUB-SECCIÓN 1: INFORMACIÓN (QUIÉN REMITE QUÉ) ================= */}
        {subSection === "info" && (
          <div className="animate-in fade-in duration-300">
            {/* Filter controls */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151D2A] p-4 sm:p-5 shadow-xs mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 text-slate-400" size={17} />
                  <input
                    type="text"
                    placeholder="Buscar por compromiso, entregable o entidad..."
                    value={searchTable}
                    onChange={(e) => setSearchTable(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 mr-1 hidden sm:inline">
                    Actor:
                  </span>
                  <select
                    value={selectedActor}
                    onChange={(e) => setSelectedActor(e.target.value)}
                    aria-label="Filtrar por actor responsable"
                    className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-xs font-extrabold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {actorsList.map((act) => (
                      <option key={act.id} value={act.id}>
                        {act.label}
                      </option>
                    ))}
                  </select>

                  <span className="text-xs font-black text-slate-500 dark:text-slate-400 ml-2">
                    {filteredTableData.length} entregables
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Responsive Table */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151D2A] shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 font-black uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-3.5 px-5">Compromiso</th>
                      <th className="py-3.5 px-5">Quién debe remitir</th>
                      <th className="py-3.5 px-5 min-w-[280px]">¿Qué debe entregar realmente?</th>
                      <th className="py-3.5 px-5 text-right">Estado / Plazo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                    {filteredTableData.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
                      >
                        <td className="py-3.5 px-5 font-black text-slate-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            <span>{item.name}</span>
                            {item.isAmbSpecific && (
                              <span className="rounded bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 px-1.5 py-0.2 text-[9px] font-extrabold uppercase">
                                AMB
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-5">
                          <span className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-black text-slate-800 dark:text-slate-200 inline-block">
                            {item.responsible}
                          </span>
                        </td>

                        <td className="py-3.5 px-5 text-slate-700 dark:text-slate-300 leading-relaxed">
                          {item.deliverable}
                        </td>

                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          {item.state === "con_fecha" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 px-2.5 py-0.5 text-[10px] font-black uppercase">
                              {item.deadline}
                            </span>
                          )}
                          {item.state === "continuo" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-2.5 py-0.5 text-[10px] font-black uppercase">
                              Continuo
                            </span>
                          )}
                          {item.state === "cumplido" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800 px-2.5 py-0.5 text-[10px] font-black uppercase">
                              {item.stateLabel}
                            </span>
                          )}
                          {item.state === "entregado" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800 px-2.5 py-0.5 text-[10px] font-black uppercase">
                              Entregado
                            </span>
                          )}
                          {item.state === "en_curso" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 px-2.5 py-0.5 text-[10px] font-black uppercase">
                              En curso
                            </span>
                          )}
                          {item.state === "sin_plazo" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800 px-2.5 py-0.5 text-[10px] font-black uppercase">
                              Sin plazo
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= SUB-SECCIÓN 2: CARPETA DE DOCUMENTOS ================= */}
        {subSection === "docs" && (
          <div className="animate-in fade-in duration-300">
            {/* Filter controls */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151D2A] p-4 sm:p-5 shadow-xs mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 text-slate-400" size={17} />
                  <input
                    type="text"
                    placeholder="Buscar acuerdo, acta, presentación o anexo..."
                    value={searchDocs}
                    onChange={(e) => setSearchDocs(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
                  {["all", "Acuerdo", "Anexo", "Presentación", "Acta"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedDocType(t)}
                      className={`px-3 py-1.5 rounded-xl transition cursor-pointer text-xs ${
                        selectedDocType === t
                          ? "bg-emerald-600 text-white font-black"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                      }`}
                    >
                      {t === "all" ? "Todos los tipos" : t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Documents Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDocsData.map((doc) => (
                <div
                  key={doc.id}
                  className={`rounded-3xl border p-6 flex flex-col justify-between transition-all duration-200 ${
                    doc.featured
                      ? "bg-gradient-to-br from-emerald-50/50 via-white to-slate-50 dark:from-[#13221b] dark:via-[#151D2A] dark:to-[#121924] border-emerald-300 dark:border-emerald-500/40 shadow-sm"
                      : "bg-white dark:bg-[#151D2A] border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-0.5 text-[10px] font-black uppercase text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {doc.badge}
                      </span>
                      <span className="text-xs font-bold text-slate-400">{doc.fileSize}</span>
                    </div>

                    <h4 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                      {doc.title}
                    </h4>

                    <div className="mt-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      Remitente: <strong className="text-slate-700 dark:text-slate-300">{doc.deliverer}</strong>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-medium line-clamp-3">
                      {doc.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                    <button
                      onClick={() => setReadingDoc(doc)}
                      className="inline-flex items-center gap-1.5 font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-500 cursor-pointer"
                    >
                      <Eye size={15} /> Ver PDF
                    </button>

                    <a
                      href={doc.fileUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-3.5 py-1.5 shadow-2xs transition cursor-pointer"
                    >
                      <Download size={14} /> Descargar
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PDF Modal Reader */}
      {readingDoc && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-[#0F2942]/90 dark:bg-black/90 backdrop-blur-md p-2 sm:p-4 md:p-6 animate-in fade-in">
          <div className="w-full h-full flex flex-col rounded-[24px] bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0">
              <div className="flex items-center gap-3">
                <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 px-2.5 py-1 text-xs font-black uppercase">
                  {readingDoc.badge}
                </span>
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white line-clamp-1">
                  {readingDoc.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={readingDoc.fileUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-bold transition"
                >
                  <Download size={14} /> Descargar PDF
                </a>
                <button
                  onClick={() => setReadingDoc(null)}
                  className="rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 p-2 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                  title="Cerrar Lector"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Embedded PDF Viewer */}
            <div className="flex-1 w-full h-full bg-slate-900 relative">
              <iframe
                src={readingDoc.fileUrl}
                className="w-full h-full border-none"
                title={`Visor PDF ${readingDoc.title}`}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
