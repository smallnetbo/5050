"use client";

import { useState } from "react";
import { Newspaper, Calendar, Download, Image as ImageIcon, ArrowRight, Share2, Tag, CheckCircle2 } from "lucide-react";
import { newsArticles } from "@/lib/agenda-data";

export function PressNews() {
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("Todos");

  const depts = ["Todos", "Chuquisaca", "La Paz", "Tarija"];

  const filteredNews = selectedDeptFilter === "Todos"
    ? newsArticles
    : newsArticles.filter((n) => n.department === selectedDeptFilter);

  return (
    <section id="prensa" className="bg-white py-20 border-t border-slate-200">
      <div className="container-page">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-black uppercase text-emerald-800">
              Sala de Prensa & Comunicados Oficiales
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Noticias y Cobertura en Medios
            </h2>
            <p className="mt-2 text-base text-slate-600 font-medium max-w-2xl">
              Información oficial de las sesiones, conferencias de prensa y comunicados emitidos por la Secretaría Técnica del Consejo.
            </p>
          </div>

          {/* Department filter buttons */}
          <div className="flex flex-wrap gap-2 rounded-2xl bg-slate-100 p-1.5 border border-slate-200">
            {depts.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDeptFilter(d)}
                className={`rounded-xl px-4 py-2 text-xs font-extrabold transition-all ${selectedDeptFilter === d
                    ? "bg-[#0F2942] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                  }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {filteredNews.map((news) => (
            <article
              key={news.id}
              className="group rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-[#0F2942]/90 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase text-emerald-300">
                    {news.category}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-400 mb-2">
                    <Calendar size={14} /> {news.date} · {news.readTime}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 leading-snug group-hover:text-emerald-600 transition-colors">
                    {news.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600 font-medium">
                    {news.summary}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex justify-between items-center text-xs font-bold">
                <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                  <Tag size={12} /> {news.department}
                </span>
                <span className="text-slate-400 group-hover:text-slate-800 transition flex items-center gap-1">
                  Leer Nota <ArrowRight size={14} />
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Press Kit / Kit de Prensa Banner */}
        <div className="rounded-[32px] bg-gradient-to-br from-[#0F2942] to-[#1E3A8A] p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="rounded-md bg-emerald-400 text-[#0F2942] px-2.5 py-1 text-xs font-black uppercase">
              Recursos para Periodistas & Medios
            </span>
            <h3 className="text-2xl font-black text-white">Kit de Prensa Oficial (Press Kit 2026)</h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Descarga logotipos oficiales vectoriales, fotografías en alta resolución de la firma del Acuerdo en Sucre y comunicados en formato editable.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="#descargas"
              className="flex items-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-[#0F2942] font-black px-5 py-3 text-xs shadow-md transition"
            >
              <Download size={16} /> Descargar Kit de Prensa (ZIP 45 MB)
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
