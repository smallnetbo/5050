"use client";

import { useState } from "react";
import { Video, Play, FileText, Image as ImageIcon, Volume2, Download, Eye, Sparkles, X } from "lucide-react";

export function MultimediaHub() {
  const [activeMediaTab, setActiveMediaTab] = useState<"videos" | "infografias" | "audio">("videos");
  const [previewInfographic, setPreviewInfographic] = useState<string | null>(null);

  const videos = [
    {
      title: "¿Qué es la Agenda 50/50 en 1 minuto?",
      duration: "01:15 min",
      thumbnail: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800&auto=format&fit=crop",
      category: "Explicador Rápido"
    },
    {
      title: "Transmisión Completa: Firma del Acuerdo en Sucre",
      duration: "45:20 min",
      thumbnail: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
      category: "En Vivo / Archivo"
    },
    {
      title: "Mesa Técnica Ley N° 154: ¿Cómo cambia la autonomía tributaria?",
      duration: "06:40 min",
      thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop",
      category: "Especial Técnico"
    }
  ];

  const infographics = [
    {
      title: "Mapa del Pacto Fiscal 50/50: Distribución de Recursos",
      type: "Infografía General",
      imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Desglose de la Reforma a la Ley 154 de Clasificación Tributaria",
      type: "Normativa Visual",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Programa de Alivio Financiero y Readecuación de Deudas GAD",
      type: "Finanzas Públicas",
      imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop"
    }
  ];

  const audios = [
    { title: "Podcast 50/50 - Ep. 1: El nuevo paradigma autonómico", duration: "12:30 min" },
    { title: "Podcast 50/50 - Ep. 2: Principio de Reporte Único y desburocratización", duration: "09:45 min" },
    { title: "Boletín Radial en Quechua y Aymara: Acuerdos de Sucre", duration: "05:10 min" }
  ];

  return (
    <section id="multimedia" className="bg-slate-900 py-20 text-white">
      <div className="container-page">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="rounded-md bg-emerald-500/20 px-2.5 py-1 text-xs font-black uppercase text-emerald-300 border border-emerald-500/30">
              Centro Multimedia Didáctico
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
              Recursos Audiovisuales e Infografías
            </h2>
            <p className="mt-2 text-base text-slate-400 max-w-2xl font-medium">
              Aprende de manera sencilla y transparente cómo funciona el nuevo pacto fiscal con videos, infografías descargables y podcasts.
            </p>
          </div>

          {/* Media Filter Tabs */}
          <div className="flex rounded-2xl bg-white/10 p-1.5 border border-white/10 backdrop-blur-md">
            <button
              onClick={() => setActiveMediaTab("videos")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${activeMediaTab === "videos" ? "bg-emerald-500 text-[#0F2942]" : "text-slate-300 hover:text-white"
                }`}
            >
              <Video size={15} /> Videos
            </button>
            <button
              onClick={() => setActiveMediaTab("infografias")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${activeMediaTab === "infografias" ? "bg-emerald-500 text-[#0F2942]" : "text-slate-300 hover:text-white"
                }`}
            >
              <ImageIcon size={15} /> Infografías
            </button>
            <button
              onClick={() => setActiveMediaTab("audio")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${activeMediaTab === "audio" ? "bg-emerald-500 text-[#0F2942]" : "text-slate-300 hover:text-white"
                }`}
            >
              <Volume2 size={15} /> Podcasts / Audio
            </button>
          </div>
        </div>

        {/* Tab 1: Videos Grid */}
        {activeMediaTab === "videos" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((vid, idx) => (
              <div key={idx} className="group rounded-3xl border border-white/10 bg-white/5 overflow-hidden hover:border-emerald-400/40 transition">
                <div className="relative aspect-video bg-slate-800 overflow-hidden">
                  <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-[#0F2942] shadow-lg group-hover:scale-110 transition">
                      <Play size={20} className="fill-current ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-3 right-3 rounded bg-slate-900/80 px-2 py-0.5 text-[10px] font-bold text-white">
                    {vid.duration}
                  </span>
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">{vid.category}</span>
                  <h3 className="mt-1 font-bold text-white text-base leading-snug">{vid.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Infographics Grid */}
        {activeMediaTab === "infografias" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {infographics.map((info, idx) => (
              <div key={idx} className="group rounded-3xl border border-white/10 bg-white/5 overflow-hidden hover:border-emerald-400/40 transition">
                <div className="relative aspect-[4/3] bg-slate-800 overflow-hidden">
                  <img src={info.imageUrl} alt={info.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90" />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition grid place-items-center gap-2">
                    <button
                      onClick={() => setPreviewInfographic(info.imageUrl)}
                      className="flex items-center gap-2 rounded-xl bg-white text-[#0F2942] font-black px-4 py-2 text-xs shadow-lg hover:bg-emerald-400"
                    >
                      <Eye size={16} /> Previsualizar
                    </button>
                  </div>
                </div>
                <div className="p-5 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">{info.type}</span>
                    <h3 className="mt-1 font-bold text-white text-sm leading-snug">{info.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Podcasts / Audio Grid */}
        {activeMediaTab === "audio" && (
          <div className="space-y-4 max-w-3xl">
            {audios.map((aud, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-emerald-400/40 transition">
                <div className="flex items-center gap-4">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500 text-[#0F2942]">
                    <Volume2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{aud.title}</h3>
                    <span className="text-xs text-slate-400 font-medium">Duración: {aud.duration}</span>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-3.5 py-2 text-xs font-bold text-emerald-300">
                  <Play size={14} /> Escuchar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Infographic Preview Modal */}
      {previewInfographic && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/80 p-4 animate-in fade-in">
          <div className="relative max-w-4xl max-h-[95vh] overflow-hidden rounded-3xl bg-slate-900 p-2">
            <button
              onClick={() => setPreviewInfographic(null)}
              className="absolute top-4 right-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/40"
            >
              <X size={20} />
            </button>
            <img src={previewInfographic} alt="Infografía Agenda 50/50" className="max-h-[85vh] w-auto rounded-2xl mx-auto" />
          </div>
        </div>
      )}
    </section>
  );
}
