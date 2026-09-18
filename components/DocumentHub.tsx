"use client";

import { useState } from "react";
import { FileText, Download, Search, Eye, Sparkles, CheckCircle2, ShieldCheck, X, BookOpen, ExternalLink } from "lucide-react";
import { documentsList as defaultDocuments, DocumentItem } from "@/lib/agenda-data";

interface DocumentHubProps {
  documents?: DocumentItem[];
}

export function DocumentHub({ documents: propDocuments }: DocumentHubProps) {
  const documentsList = propDocuments && propDocuments.length > 0 ? propDocuments : defaultDocuments;
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [docSearchQuery, setDocSearchQuery] = useState("");
  const [readingModalOpen, setReadingModalOpen] = useState(false);

  const categories = ["Todos", "Acuerdo", "Proyecto de Ley", "Decreto", "Presentación", "Acta"];

  const filteredDocs = documentsList.filter((doc) => {

    const matchesCategory = selectedCategory === "Todos" || doc.category === selectedCategory;
    const matchesQuery = doc.title.toLowerCase().includes(docSearchQuery.toLowerCase()) || doc.description.toLowerCase().includes(docSearchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <section id="descargas" className="bg-slate-50 py-20 border-t border-slate-200">
      <div className="container-page">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-black uppercase text-emerald-800">
              Repositorio Documental Abierto
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Centro de Descargas & Normativa
            </h2>
            <p className="mt-2 text-base text-slate-600 font-medium max-w-2xl">
              Acceso libre y transparente a los acuerdos firmados, borradores de proyectos de ley, actas de la comisión y decretos reglamentarios.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[280px]">
            <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar documento..."
              value={docSearchQuery}
              onChange={(e) => setDocSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none shadow-xs"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-4 py-2 text-xs font-extrabold transition-all ${selectedCategory === cat
                  ? "bg-[#0F2942] text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Flagship Featured Document Card: Acuerdo 001/2026 */}
        <div className="mb-10 overflow-hidden rounded-[32px] border-2 border-emerald-500/40 bg-gradient-to-br from-[#0F2942] via-[#1E3A8A] to-[#0F2942] p-8 text-white shadow-xl relative">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-emerald-400 text-[#0F2942] px-2.5 py-1 text-xs font-black uppercase tracking-wider">
                  Documento Insignia Oficial
                </span>
                <span className="text-xs text-slate-300 font-bold">PDF · 5.8 MB · 14.250 Descargas</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Acuerdo N° 001/2026 - Firma de Sucre (5 de Agosto de 2026)
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                Documento histórico suscrito por el Gobierno Nacional y los 9 Gobernadores Departamentales que establece la hoja de ruta hacia la redistribución fiscal 50/50 y la reforma a la Ley 154.
              </p>
            </div>

            <div className="flex flex-wrap lg:flex-col gap-3 shrink-0">
              <button
                onClick={() => setReadingModalOpen(true)}
                className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#0F2942] font-black px-6 py-3.5 text-xs shadow-lg transition"
              >
                <BookOpen size={16} /> Leer Transcripción Completa
              </button>
              <button className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold px-6 py-3.5 text-xs border border-white/20 transition">
                <Download size={16} /> Descargar PDF Oficial
              </button>
            </div>
          </div>
        </div>

        {/* Regular Document Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase text-slate-700">
                    {doc.category}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{doc.date}</span>
                </div>

                <h4 className="mt-4 font-black text-slate-900 text-base leading-snug">
                  {doc.title}
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 font-medium line-clamp-2">
                  {doc.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="font-bold text-slate-400">{doc.fileSize}</span>
                <button className="flex items-center gap-1.5 font-extrabold text-emerald-600 hover:text-emerald-700">
                  <Download size={14} /> Descargar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Transcribed Web Reader Modal for Acuerdo N° 001/2026 */}
      {readingModalOpen && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-[#0F2942]/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[34px] bg-white p-8 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-6">
              <div>
                <span className="rounded-md bg-emerald-100 text-emerald-800 px-2.5 py-1 text-xs font-black uppercase">
                  Transcripción Oficial Web
                </span>
                <h3 className="mt-2 text-2xl font-black text-slate-900">
                  Acuerdo N° 001/2026 (Sucre, 5 de Agosto de 2026)
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-1">Suscrito en la Casa de la Libertad por el Estado Central y los 9 GAD</p>
              </div>
              <button
                onClick={() => setReadingModalOpen(false)}
                className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-6 text-slate-800 text-sm leading-relaxed font-medium">
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 font-serif italic text-slate-700">
                "En la ciudad de Sucre, Capital de Bolivia y Cuna de la Libertad, a los cinco días del mes de agosto del año dos mil veintiséis, se reúnen las autoridades del Órgano Ejecutivo Nacional y los Gobiernos Autónomos Departamentales..."
              </div>

              <div>
                <h4 className="font-black text-slate-900 text-base">PRIMERA.- MARCO CONSTITUCIONAL Y PROPÓSITO</h4>
                <p className="mt-1">
                  Las partes ratifican la vigencia plena del régimen autonómico establecido en la Constitución Política del Estado. Se acuerda iniciar formalmente la construcción de la Agenda 50/50 para la equidad fiscal y la desconcentración de competencias.
                </p>
              </div>

              <div>
                <h4 className="font-black text-slate-900 text-base">SEGUNDA.- REFORMA A LA LEY N° 154</h4>
                <p className="mt-1">
                  Se establece un plazo improrrogable de 90 días calendario para la presentación del anteproyecto de modificación a la Ley N° 154 de Clasificación Tributaria, garantizando el fortalecimiento del dominio tributario departamental.
                </p>
              </div>

              <div>
                <h4 className="font-black text-slate-900 text-base">TERCERA.- LEY ESPECIAL DE COPARTICIPACIÓN 2027</h4>
                <p className="mt-1">
                  La Mesa Técnica de Hacienda redactará el proyecto de Ley Especial de Coparticipación y Distribución de Recursos Fiscales para su aplicación a partir de la gestión fiscal 2027.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs text-slate-400 font-bold">Documento Refrendado por los 9 Gobernadores</span>
              <button
                onClick={() => setReadingModalOpen(false)}
                className="rounded-xl bg-[#0F2942] text-white px-5 py-2.5 text-xs font-extrabold"
              >
                Cerrar Lectura
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
