"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Building2,
  Landmark,
  Scale,
  Sparkles,
  Users,
  Calendar,
  X,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Layers,
} from "lucide-react";

export function AcuerdosSection() {
  const [activeTab, setActiveTab] = useState<"todos" | "001" | "002">("todos");
  const [pdfModalUrl, setPdfModalUrl] = useState<string | null>(null);
  const [pdfModalTitle, setPdfModalTitle] = useState<string>("");

  const openPdfViewer = (url: string, title: string) => {
    setPdfModalUrl(url);
    setPdfModalTitle(title);
  };

  const closePdfViewer = () => {
    setPdfModalUrl(null);
    setPdfModalTitle("");
  };

  return (
    <section id="acuerdos" className="py-20 bg-white dark:bg-[#0B111A] border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="container-page">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-500/30 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
              <Scale size={14} />
              Marco Convencional de la Agenda 50/50
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Los Acuerdos Político-Técnicos
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium max-w-2xl leading-relaxed">
              Consulte el texto íntegro, el alcance competencial y los anexos de los dos grandes instrumentos que sientan las bases del pacto fiscal y la reforma autonómica boliviana.
            </p>
          </div>

          {/* Quick Filter Switch */}
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start md:self-end">
            <button
              onClick={() => setActiveTab("todos")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                activeTab === "todos"
                  ? "bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Todos los Acuerdos
            </button>
            <button
              onClick={() => setActiveTab("001")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                activeTab === "001"
                  ? "bg-emerald-500 text-slate-950 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Acuerdo 001 (GAD)
            </button>
            <button
              onClick={() => setActiveTab("002")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                activeTab === "002"
                  ? "bg-emerald-500 text-slate-950 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Acuerdo 002 (GAM + AMB)
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-8 lg:grid-cols-2 items-stretch">
          {/* Card 1: Acuerdo 001/2026 (GAD) */}
          {(activeTab === "todos" || activeTab === "001") && (
            <div className="relative rounded-[32px] border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#131B28] p-7 sm:p-9 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-3 py-1 text-xs font-black uppercase tracking-wider">
                      Nivel Departamental
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar size={13} /> 5 de Agosto de 2026
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">PDF · 1.44 MB</span>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
                    <Landmark size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                      Acuerdo N° 001/2026 de Sucre
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                      Suscrito en la Casa de la Libertad con los 9 Gobiernos Autónomos Departamentales (GAD).
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  Establece la ruta para la reforma estructural del Estado hacia las autonomías reales, sentando las bases del <strong>Pacto 50/50</strong> en recursos, competencias y toma de decisiones. Plantea la revisión y modificación de la Ley N° 154 de clasificación de impuestos, el alivio financiero de deudas y la creación de la Ley Especial de Coparticipación 2027.
                </p>

                {/* Key Points / Badges */}
                <div className="mt-6 space-y-2.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Puntos Clave Acordados:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900/80 p-2.5 border border-slate-200/80 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200">
                      <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                      <span>Reforma Ley 154 (Impuestos Propios)</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900/80 p-2.5 border border-slate-200/80 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200">
                      <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                      <span>Alivio de Deudas con FNDR</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900/80 p-2.5 border border-slate-200/80 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200">
                      <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                      <span>Derogación de Gastos Condicionados</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900/80 p-2.5 border border-slate-200/80 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200">
                      <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                      <span>Ley Especial de Coparticipación 2027</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <Users size={15} className="text-slate-400 shrink-0" />
                  <span><strong>Firmantes:</strong> Presidente del Estado y Gobernadores de La Paz, Santa Cruz, Cochabamba, Chuquisaca, Oruro, Potosí, Tarija, Beni y Pando.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => openPdfViewer("/Acuerdo-001-2026-Agenda-50-50.pdf", "Acuerdo N° 001/2026 de Sucre (GAD)")}
                  className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-4 py-2.5 text-xs font-bold border border-slate-200 dark:border-slate-700 transition shadow-2xs cursor-pointer"
                >
                  <Eye size={15} className="text-blue-500" />
                  <span>Leer Documento</span>
                </button>

                <a
                  href="/Acuerdo-001-2026-Agenda-50-50.pdf"
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 text-xs font-black transition shadow-sm cursor-pointer"
                >
                  <Download size={15} />
                  <span>Descargar PDF Oficial</span>
                </a>
              </div>
            </div>
          )}

          {/* Card 2: Acuerdo 002/2026 (GAM + AMB) */}
          {(activeTab === "todos" || activeTab === "002") && (
            <div className="relative rounded-[32px] border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#131B28] p-7 sm:p-9 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-3 py-1 text-xs font-black uppercase tracking-wider">
                      Nivel Municipal
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar size={13} /> 2026
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">PDF · 11.75 MB</span>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
                    <Building2 size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                      Acuerdo N° 002/2026
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                      Gobiernos Autónomos Municipales de Ciudades Capitales y El Alto articulados por la AMB.
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  Instrumento de articulación intergubernativa centrado en la sostenibilidad del sistema de salud en hospitales de 1er y 2do nivel, viabilidad técnica de la restitución del <strong>12% del FPIEEH</strong>, flexibilización de 25 condicionalidades presupuestarias que pesan sobre los municipios, y desburocratización de la inversión local.
                </p>

                {/* Key Points / Badges */}
                <div className="mt-6 space-y-2.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Puntos Clave Acordados:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900/80 p-2.5 border border-slate-200/80 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                      <span>FPIEEH (Respuesta Técnica en 12 días)</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900/80 p-2.5 border border-slate-200/80 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                      <span>Sostenibilidad Hospitales 1° y 2° Nivel</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900/80 p-2.5 border border-slate-200/80 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                      <span>Revisión 25 Condicionalidades del Gasto</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900/80 p-2.5 border border-slate-200/80 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                      <span>Reforma SAFCO y Régimen Laboral Edil</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <Users size={15} className="text-slate-400 shrink-0" />
                  <span><strong>Firmantes:</strong> Gobierno Nacional, Alcaldes de las 9 Capitales + El Alto y Directiva de la AMB.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => openPdfViewer("/Acuerdo-002-2026-Agenda-50-50.pdf", "Acuerdo N° 002/2026 (GAM + AMB)")}
                  className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-4 py-2.5 text-xs font-bold border border-slate-200 dark:border-slate-700 transition shadow-2xs cursor-pointer"
                >
                  <Eye size={15} className="text-emerald-500" />
                  <span>Leer Documento</span>
                </button>

                <a
                  href="/Acuerdo-002-2026-Agenda-50-50.pdf"
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 text-xs font-black transition shadow-sm cursor-pointer"
                >
                  <Download size={15} />
                  <span>Descargar PDF Oficial</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Informative Note Box */}
        <div className="mt-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-4 sm:p-5 flex items-start gap-3.5">
          <Sparkles size={20} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 font-medium leading-relaxed">
            <strong>Articulación con Gobiernos Municipales (FAM):</strong> Además de los Acuerdos 001 (GAD) y 002 (GAM capitales + El Alto), el proceso contempla la incorporación de los municipios articulados por la FAM-Bolivia, cuya reunión se encuentra programada en la hoja de ruta y no cuenta a la fecha con compromisos formalizados.
          </p>
        </div>
      </div>

      {/* Embedded PDF Viewer Modal */}
      {pdfModalUrl && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-[#0F2942]/90 dark:bg-black/90 backdrop-blur-md p-2 sm:p-4 md:p-6 animate-in fade-in">
          <div className="w-full h-full flex flex-col rounded-[24px] bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0">
              <div className="flex items-center gap-3">
                <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 px-2.5 py-1 text-xs font-black uppercase">
                  Visor Oficial
                </span>
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white line-clamp-1">
                  {pdfModalTitle}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={pdfModalUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-bold transition"
                >
                  <Download size={14} /> Descargar
                </a>
                <button
                  onClick={closePdfViewer}
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
                src={pdfModalUrl}
                className="w-full h-full border-none"
                title={`Visor PDF ${pdfModalTitle}`}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
