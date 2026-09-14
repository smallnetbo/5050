"use client";

import { useState, useRef, useEffect } from "react";
import { Video, Play, Image as ImageIcon, Volume2, Download, Eye, X } from "lucide-react";

interface VideoItem {
  title: string;
  duration: string;
  thumbnail: string;
  category: string;
  videoUrl: string;
}

interface InfographicItem {
  title: string;
  type: string;
  imageUrl: string;
  description?: string;
}

export function MultimediaHub() {
  const [activeMediaTab, setActiveMediaTab] = useState<"videos" | "infografias" | "audio">("videos");
  const [previewInfographic, setPreviewInfographic] = useState<InfographicItem | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (selectedVideo && videoRef.current) {
      videoRef.current.play().catch(() => { });
    }
  }, [selectedVideo]);

  // Lista de videos con los recursos oficiales en /public/assets y /public/videos
  const videos: VideoItem[] = [
    {
      title: "¿Qué es el 50/50?",
      duration: "Cápsula Informativa",
      thumbnail: "/assets/multimedia_cover.jpg",
      category: "Explicador Oficial",
      videoUrl: "/videos/Agenda5050.mp4"
    },
    {
      title: "¿Qué cambiará? La Agenda 50/50",
      duration: "Reforma Autonómica",
      thumbnail: "/assets/multimedia_cover.jpg",
      category: "Propuesta de Estado",
      videoUrl: "/assets/¿Qué_cambiará__La_Agenda_.mp4"
    },
    {
      title: "La Agenda 50-50 impulsa propuestas para fortalecer las autonomías",
      duration: "Spot Institucional",
      thumbnail: "/assets/multimedia_cover.jpg",
      category: "Participación Nacional",
      videoUrl: "/videos/La Agenda 50-50 impulsa propuestas para fortalecer las autonomías y construir un Estado más eficiente, con la participación de municipios y autoridades de todo el país.mp4"
    }
  ];

  // Lista de infografías con la infografía oficial en /public/assets/infografia Agenda 5050.png
  const infographics: InfographicItem[] = [
    {
      title: "Infografía Oficial: Agenda 50/50",
      type: "Infografía Oficial Destacada",
      imageUrl: "/assets/infografia Agenda 5050.png",
      description: "Estructura general, distribución de recursos y objetivos del pacto fiscal autonómico."
    },
    {
      title: "Mapa del Pacto Fiscal 50/50: Distribución de Recursos",
      type: "Infografía General",
      imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop",
      description: "Desglose territorial de asignaciones presupuestarias."
    },
    {
      title: "Desglose de la Reforma a la Ley 154 de Clasificación Tributaria",
      type: "Normativa Visual",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
      description: "Catálogo de potestades tributarias para gobernaciones y municipios."
    }
  ];

  const audios = [
    { title: "Podcast 50/50 - Ep. 1: El nuevo paradigma autonómico", duration: "12:30 min" },
    { title: "Podcast 50/50 - Ep. 2: Principio de Reporte Único y desburocratización", duration: "09:45 min" },
    { title: "Boletín Radial en Quechua y Aymara: Acuerdos de Sucre", duration: "05:10 min" }
  ];

  return (
    <section id="multimedia" className="bg-[#101620] py-20 text-white transition-colors duration-300">
      <div className="container-page">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="rounded-md bg-emerald-500/20 px-2.5 py-1 text-xs font-black uppercase text-[#3ac167] border border-emerald-500/30">
              Centro Multimedia Didáctico
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
              Recursos Audiovisuales e Infografías
            </h2>
            <p className="mt-2 text-base text-slate-400 max-w-2xl font-medium">
              Aprende de manera sencilla y didáctica cómo funciona el nuevo pacto fiscal con videos oficiales, infografías descargables en alta resolución y contenido auditivo.
            </p>
          </div>

          {/* Media Filter Tabs */}
          <div className="flex rounded-2xl bg-white/10 p-1.5 border border-white/10 backdrop-blur-md">
            <button
              onClick={() => setActiveMediaTab("videos")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${activeMediaTab === "videos"
                  ? "bg-[#3ac167] text-slate-950 shadow-md"
                  : "text-slate-300 hover:text-white"
                }`}
            >
              <Video size={15} /> Videos ({videos.length})
            </button>
            <button
              onClick={() => setActiveMediaTab("infografias")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${activeMediaTab === "infografias"
                  ? "bg-[#3ac167] text-slate-950 shadow-md"
                  : "text-slate-300 hover:text-white"
                }`}
            >
              <ImageIcon size={15} /> Infografías ({infographics.length})
            </button>
            <button
              onClick={() => setActiveMediaTab("audio")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${activeMediaTab === "audio"
                  ? "bg-[#3ac167] text-slate-950 shadow-md"
                  : "text-slate-300 hover:text-white"
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
              <div
                key={idx}
                onClick={() => setSelectedVideo(vid)}
                className="group rounded-3xl border border-white/10 bg-white/5 overflow-hidden hover:border-[#3ac167]/50 transition duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1 shadow-xs hover:shadow-xl"
              >
                <div className="relative aspect-video bg-slate-950 overflow-hidden">
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#dd3146] text-white shadow-xl group-hover:scale-110 group-hover:bg-[#3ac167] group-hover:text-slate-950 transition duration-300 border-2 border-white/20">
                      <Play size={22} className="fill-current ml-1" />
                    </div>
                  </div>
                  <span className="absolute bottom-3 right-3 rounded-lg bg-black/70 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-bold text-white border border-white/10">
                    {vid.duration}
                  </span>
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-black uppercase text-[#3ac167] tracking-wider">
                    {vid.category}
                  </span>
                  <h3 className="mt-1 font-extrabold text-white text-base leading-snug group-hover:text-[#fcc74f] transition-colors">
                    {vid.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Infographics Grid */}
        {activeMediaTab === "infografias" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {infographics.map((info, idx) => (
              <div
                key={idx}
                className="group rounded-3xl border border-white/10 bg-white/5 overflow-hidden hover:border-[#3ac167]/50 transition duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-xs hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                  <img
                    src={encodeURI(info.imageUrl)}
                    alt={info.title}
                    className="w-full h-full object-contain p-2 bg-slate-900 group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition duration-300 grid place-items-center gap-2 p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewInfographic(info)}
                        className="flex items-center gap-2 rounded-xl bg-white text-slate-950 font-black px-4 py-2 text-xs shadow-lg hover:bg-[#3ac167] transition"
                      >
                        <Eye size={16} /> Ver Pantalla Completa
                      </button>
                      <a
                        href={encodeURI(info.imageUrl)}
                        download={info.title.toLowerCase().replace(/\s+/g, "_") + ".png"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-xl bg-[#3ac167] text-slate-950 font-black px-3 py-2 text-xs shadow-lg hover:bg-emerald-400 transition"
                      >
                        <Download size={15} /> Descargar
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-5 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#fcc74f] tracking-wider">
                      {info.type}
                    </span>
                    <h3 className="mt-1 font-bold text-white text-sm leading-snug">
                      {info.title}
                    </h3>
                    {info.description && (
                      <p className="mt-1.5 text-xs text-slate-400 font-medium line-clamp-2">
                        {info.description}
                      </p>
                    )}
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
              <div
                key={idx}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-[#3ac167]/50 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#3ac167] text-slate-950 shadow-md">
                    <Volume2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{aud.title}</h3>
                    <span className="text-xs text-slate-400 font-medium">Duración: {aud.duration}</span>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-3.5 py-2 text-xs font-bold text-[#3ac167] transition">
                  <Play size={14} className="fill-current" /> Escuchar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal Player Dinámico */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-3xl rounded-3xl bg-[#1B2533] p-4 border border-[#3ac167]/40 shadow-2xl relative flex flex-col items-center">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-3 -right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#dd3146] text-white font-bold shadow-lg hover:bg-red-700 transition"
              aria-label="Cerrar video"
            >
              <X size={20} />
            </button>

            <div className="w-full max-h-[75vh] aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center relative shadow-inner">
              <video
                ref={videoRef}
                src={encodeURI(selectedVideo.videoUrl)}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              ></video>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 w-full px-2">
              <div>
                <span className="text-[10px] font-black uppercase text-[#3ac167] tracking-wider">
                  {selectedVideo.category} · {selectedVideo.duration}
                </span>
                <h3 className="text-sm sm:text-base font-black text-white leading-tight mt-0.5">
                  {selectedVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20 self-end sm:self-auto shrink-0 transition"
              >
                Cerrar Reproductor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Infographic Preview Modal */}
      {previewInfographic && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative max-w-5xl max-h-[95vh] overflow-hidden rounded-3xl bg-[#1B2533] p-4 border border-[#3ac167]/40 flex flex-col items-center shadow-2xl">
            <div className="flex justify-between items-center w-full px-2 pb-3 border-b border-white/10 mb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#3ac167] tracking-wider">
                  {previewInfographic.type}
                </span>
                <h3 className="text-sm sm:text-base font-black text-white">
                  {previewInfographic.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={encodeURI(previewInfographic.imageUrl)}
                  download="infografia_agenda_5050.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-xl bg-[#3ac167] hover:bg-emerald-400 text-slate-950 font-black px-3.5 py-1.5 text-xs shadow-md transition"
                >
                  <Download size={14} /> Descargar
                </a>
                <button
                  onClick={() => setPreviewInfographic(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                  aria-label="Cerrar modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="max-h-[80vh] overflow-auto rounded-2xl bg-slate-950/80 p-2 flex items-center justify-center">
              <img
                src={encodeURI(previewInfographic.imageUrl)}
                alt={previewInfographic.title}
                className="max-h-[75vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
