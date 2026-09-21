"use client";

import { useState, useRef, useEffect } from "react";
import { Video, Play, X, Tv, ExternalLink, Users, Newspaper } from "lucide-react";
import { MediaItem as MediaItemType } from "@/lib/agenda-data";

interface VideoItem {
  title: string;
  duration: string;
  thumbnail: string;
  category: string;
  videoUrl: string;
}

interface WebinarItem {
  title: string;
  category: string;
  date: string;
  url: string;
  embedUrl: string;
  platform: string;
  thumbnail?: string;
  description: string;
}

interface Props {
  mediaItems?: MediaItemType[];
}

export function MultimediaHub({ mediaItems }: Props) {
  const [activeMediaTab, setActiveMediaTab] = useState<"videos" | "webinars" | "reuniones" | "medios">("videos");
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [selectedWebinar, setSelectedWebinar] = useState<WebinarItem | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (selectedVideo && videoRef.current) {
      videoRef.current.play().catch(() => { });
    }
  }, [selectedVideo]);

  // Listas de datos dinámicas con fallback a listas por defecto
  const videos: VideoItem[] = mediaItems && mediaItems.length > 0
    ? mediaItems
        .filter((item) => item.type === "videos")
        .map((item) => ({
          title: item.title,
          duration: item.duration || "Cápsula Informativa",
          thumbnail: item.coverUrl || "/assets/video_que_es_5050_cover.jpg",
          category: item.category || "Explicador Oficial",
          videoUrl: item.mediaUrl || "",
        }))
    : [
        {
          title: "¿Qué es la Agenda 50/50?",
          duration: "Cápsula Informativa",
          thumbnail: "/assets/video_que_es_5050_cover.jpg",
          category: "Explicador Oficial",
          videoUrl: "/videos/Agenda5050.mp4"
        },
        {
          title: "¿Qué cambiará? La Agenda 50/50",
          duration: "Reforma Autonómica",
          thumbnail: "/assets/video_que_cambiara_cover.jpg",
          category: "Propuesta de Estado",
          videoUrl: "/assets/¿Qué_cambiará__La_Agenda_.mp4"
        },
        {
          title: "La Agenda 50-50 impulsa propuestas para fortalecer las autonomías",
          duration: "Spot Institucional",
          thumbnail: "/assets/video_propuestas_autonomias_cover.jpg",
          category: "Participación Nacional",
          videoUrl: "/videos/La Agenda 50-50 impulsa propuestas para fortalecer las autonomías y construir un Estado más eficiente, con la participación de municipios y autoridades de todo el país.mp4"
        }
      ];

  const webinars: WebinarItem[] = mediaItems && mediaItems.length > 0
    ? mediaItems
        .filter((item) => item.type === "webinars")
        .map((item) => ({
          title: item.title,
          category: item.category || "Diálogo & Debate",
          date: item.date || "Transmisión en Vivo",
          url: item.url || "#",
          embedUrl: item.embedUrl || "",
          platform: item.platform || "Facebook Live",
          thumbnail: item.coverUrl || "/assets/webinar_dialogos_cafe_cover.jpg",
          description: item.description || "",
        }))
    : [
        {
          title: "Diálogos al Café: Análisis y Debate sobre la Agenda 50/50",
          category: "Diálogo & Debate",
          date: "Transmisión en Vivo",
          url: "https://www.facebook.com/dialogosalcafe/videos/4414139728840664/?rdid=5ef4aKa3wd2s7eMY#",
          embedUrl: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fdialogosalcafe%2Fvideos%2F4414139728840664%2F&show_text=false",
          platform: "Facebook Live",
          thumbnail: "/assets/webinar_dialogos_cafe_cover.jpg",
          description: "Espacio de diálogo y análisis sobre el desarrollo regional, desburocratización y propuestas de la Agenda 50/50."
        }
      ];

  const reuniones: WebinarItem[] = mediaItems && mediaItems.length > 0
    ? mediaItems
        .filter((item) => item.type === "reuniones")
        .map((item) => ({
          title: item.title,
          category: item.category || "Gobiernos Autónomos",
          date: item.date || "Cobertura BTV",
          url: item.url || "#",
          embedUrl: item.embedUrl || "",
          platform: item.platform || "Facebook Live / BTV",
          thumbnail: item.coverUrl || "/assets/reunion_btv_cover.jpg",
          description: item.description || "",
        }))
    : [
        {
          title: "Reunión e Informe Oficial - Cobertura BTV Canal Oficial",
          category: "Gobiernos Autónomos",
          date: "Cobertura BTV",
          url: "https://www.facebook.com/BTVCanalOficial/videos/2801286836919000/",
          embedUrl: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FBTVCanalOficial%2Fvideos%2F2801286836919000%2F&show_text=false",
          platform: "Facebook Live / BTV",
          thumbnail: "/assets/reunion_btv_cover.jpg",
          description: "Reunión informativa y cobertura especial sobre los avances de la Agenda 50/50 transmitida por Bolivia TV."
        }
      ];

  const medios: WebinarItem[] = mediaItems && mediaItems.length > 0
    ? mediaItems
        .filter((item) => item.type === "medios")
        .map((item) => ({
          title: item.title,
          category: item.category || "Propuesta Departamental",
          date: item.date || "Cobertura Digital",
          url: item.url || "#",
          embedUrl: item.embedUrl || "",
          platform: item.platform || "Dailymotion",
          thumbnail: item.coverUrl || "/assets/cobertura_medios_5050.jpg",
          description: item.description || "",
        }))
    : [
        {
          title: "¿Cómo se repartirán los recursos? Chuquisaca tiene su propuesta del 50/50",
          category: "Propuesta Departamental",
          date: "El Deber / Cobertura TV",
          url: "https://www.dailymotion.com/video/xausur2",
          embedUrl: "https://www.dailymotion.com/embed/video/xausur2",
          platform: "Dailymotion / El Deber",
          thumbnail: "/assets/cobertura_chuquisaca_5050.jpg",
          description: "Exposición de la propuesta de Chuquisaca para la redistribución tributaria 50/50 entre Gobierno central, municipios y gobernaciones."
        },
        {
          title: "Gobierno y la Federación de Asociaciones Municipales se reunirán por la política 50-50",
          category: "Reunión FAM & Gobierno",
          date: "Bolivia TV (BTV)",
          url: "https://www.dailymotion.com/video/xb14bsu",
          embedUrl: "https://www.dailymotion.com/embed/video/xb14bsu",
          platform: "Dailymotion / BTV",
          thumbnail: "/assets/cobertura_fam_gobierno_5050.jpg",
          description: "Reunión de coordinación entre el Gobierno Central y la FAM Bolivia en el marco de la política 50-50 y acuerdos regionales."
        },
        {
          title: "'JP' Velasco: \"Será la obra más importante de los últimos 50 años\"",
          category: "Infraestructura & Gestión",
          date: "El Deber Noticias",
          url: "https://www.dailymotion.com/video/xb3eo9y",
          embedUrl: "https://www.dailymotion.com/embed/video/xb3eo9y",
          platform: "Dailymotion / El Deber",
          thumbnail: "/assets/cobertura_jp_velasco.jpg",
          description: "Declaraciones del Gobernador de Santa Cruz sobre proyectos clave y coordinación entre Gobernación, Gobierno Nacional y municipios."
        },
        {
          title: "Alcaldes Impulsan el 50/50 - Reportaje Especial",
          category: "Reportaje de Prensa",
          date: "Cobertura Digital",
          url: "https://www.dailymotion.com/video/xawlv6e",
          embedUrl: "https://www.dailymotion.com/embed/video/xawlv6e",
          platform: "Dailymotion",
          thumbnail: "/assets/cobertura_medios_5050.jpg",
          description: "Reportaje y cobertura televisiva sobre la iniciativa de los alcaldes para impulsar la propuesta de la Agenda 50/50."
        },
        {
          title: "Santa Cruz propone nuevo Pacto Fiscal para las regiones",
          category: "Pacto Fiscal",
          date: "Cobertura de Medios",
          url: "https://www.dailymotion.com/video/x9ifgnk",
          embedUrl: "https://www.dailymotion.com/embed/video/x9ifgnk",
          platform: "Dailymotion",
          thumbnail: "/assets/cobertura_scz_pacto_fiscal.jpg",
          description: "Propuestas y debate sobre el nuevo modelo de distribución fiscal e incentivo al desarrollo autonómico."
        }
      ];

  return (
    <section id="multimedia" className="bg-slate-50 dark:bg-[#101620] py-20 text-slate-900 dark:text-white transition-colors duration-300 border-t border-slate-200 dark:border-white/5">
      <div className="container-page">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="rounded-md bg-emerald-500/10 dark:bg-emerald-500/20 px-2.5 py-1 text-xs font-black uppercase text-emerald-600 dark:text-[#3ac167] border border-emerald-500/20 dark:border-emerald-500/30">
              Centro Multimedia
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Recursos Audiovisuales
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-400 max-w-2xl font-medium">
              Videos, webinars, reuniones con gobiernos autónomos y cobertura en medios.
            </p>
          </div>

          {/* Media Filter Tabs */}
          <div className="flex flex-wrap rounded-2xl bg-slate-200/80 dark:bg-white/10 p-1.5 border border-slate-300/80 dark:border-white/10 backdrop-blur-md gap-1">
            <button
              onClick={() => setActiveMediaTab("videos")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${activeMediaTab === "videos"
                ? "bg-[#3ac167] text-slate-950 shadow-md"
                : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                }`}
            >
              <Video size={15} /> Videos ({videos.length})
            </button>
            <button
              onClick={() => setActiveMediaTab("webinars")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${activeMediaTab === "webinars"
                ? "bg-[#3ac167] text-slate-950 shadow-md"
                : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                }`}
            >
              <Tv size={15} /> Webinars ({webinars.length})
            </button>
            <button
              onClick={() => setActiveMediaTab("reuniones")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${activeMediaTab === "reuniones"
                ? "bg-[#3ac167] text-slate-950 shadow-md"
                : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                }`}
            >
              <Users size={15} /> Reuniones con Gobiernos Autónomos ({reuniones.length})
            </button>
            <button
              onClick={() => setActiveMediaTab("medios")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${activeMediaTab === "medios"
                ? "bg-[#3ac167] text-slate-950 shadow-md"
                : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                }`}
            >
              <Newspaper size={15} /> Cobertura en Medios ({medios.length})
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
                className="group rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden hover:border-[#3ac167]/60 dark:hover:border-[#3ac167]/50 transition duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1 shadow-sm hover:shadow-xl"
              >
                <div className="relative aspect-video bg-slate-950 overflow-hidden">
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
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
                  <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-[#3ac167] tracking-wider">
                    {vid.category}
                  </span>
                  <h3 className="mt-1 font-extrabold text-slate-900 dark:text-white text-base leading-snug group-hover:text-emerald-600 dark:group-hover:text-[#fcc74f] transition-colors">
                    {vid.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Webinars Grid */}
        {activeMediaTab === "webinars" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {webinars.map((web, idx) => (
              <div
                key={idx}
                className="group rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden hover:border-[#3ac167]/60 dark:hover:border-[#3ac167]/50 transition duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-sm hover:shadow-xl"
              >
                <div className="relative aspect-video bg-slate-950 overflow-hidden">
                  <img
                    src={web.thumbnail || "/assets/multimedia_cover.jpg"}
                    alt={web.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                  <div className="absolute inset-0 grid place-items-center">
                    <button
                      onClick={() => setSelectedWebinar(web)}
                      className="flex h-14 w-14 items-center justify-center rounded-full bg-[#dd3146] text-white shadow-xl group-hover:scale-110 group-hover:bg-[#3ac167] group-hover:text-slate-950 transition duration-300 border-2 border-white/20"
                      title="Ver Webinar"
                    >
                      <Play size={22} className="fill-current ml-1" />
                    </button>
                  </div>
                  <span className="absolute bottom-3 right-3 rounded-lg bg-blue-600/90 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-bold text-white border border-blue-400/30 flex items-center gap-1">
                    {web.platform}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-[#3ac167] tracking-wider">
                        {web.category}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                        {web.date}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug group-hover:text-emerald-600 dark:group-hover:text-[#fcc74f] transition-colors">
                      {web.title}
                    </h3>
                    {web.description && (
                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 font-medium line-clamp-2">
                        {web.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedWebinar(web)}
                      className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-[#3ac167] hover:text-emerald-700 dark:hover:text-emerald-300 transition"
                    >
                      <Play size={14} className="fill-current" /> Ver Transmisión
                    </button>
                    <a
                      href={web.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
                    >
                      <ExternalLink size={13} /> Facebook
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Reuniones Grid */}
        {activeMediaTab === "reuniones" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reuniones.map((reu, idx) => (
              <div
                key={idx}
                className="group rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden hover:border-[#3ac167]/60 dark:hover:border-[#3ac167]/50 transition duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-sm hover:shadow-xl"
              >
                <div className="relative aspect-video bg-slate-950 overflow-hidden">
                  <img
                    src={reu.thumbnail || "/assets/multimedia_cover.jpg"}
                    alt={reu.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                  <div className="absolute inset-0 grid place-items-center">
                    <button
                      onClick={() => setSelectedWebinar(reu)}
                      className="flex h-14 w-14 items-center justify-center rounded-full bg-[#dd3146] text-white shadow-xl group-hover:scale-110 group-hover:bg-[#3ac167] group-hover:text-slate-950 transition duration-300 border-2 border-white/20"
                      title="Ver Reunión"
                    >
                      <Play size={22} className="fill-current ml-1" />
                    </button>
                  </div>
                  <span className="absolute bottom-3 right-3 rounded-lg bg-emerald-600/90 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-bold text-white border border-emerald-400/30 flex items-center gap-1">
                    {reu.platform}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-[#3ac167] tracking-wider">
                        {reu.category}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                        {reu.date}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug group-hover:text-emerald-600 dark:group-hover:text-[#fcc74f] transition-colors">
                      {reu.title}
                    </h3>
                    {reu.description && (
                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 font-medium line-clamp-2">
                        {reu.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedWebinar(reu)}
                      className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-[#3ac167] hover:text-emerald-700 dark:hover:text-emerald-300 transition"
                    >
                      <Play size={14} className="fill-current" /> Ver Transmisión
                    </button>
                    <a
                      href={reu.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
                    >
                      <ExternalLink size={13} /> Facebook
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Cobertura en Medios Grid */}
        {activeMediaTab === "medios" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {medios.map((med, idx) => (
              <div
                key={idx}
                className="group rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden hover:border-[#3ac167]/60 dark:hover:border-[#3ac167]/50 transition duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-sm hover:shadow-xl"
              >
                <div className="relative aspect-video bg-slate-950 overflow-hidden">
                  <img
                    src={med.thumbnail || "/assets/multimedia_cover.jpg"}
                    alt={med.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                  <div className="absolute inset-0 grid place-items-center">
                    <button
                      onClick={() => setSelectedWebinar(med)}
                      className="flex h-14 w-14 items-center justify-center rounded-full bg-[#dd3146] text-white shadow-xl group-hover:scale-110 group-hover:bg-[#3ac167] group-hover:text-slate-950 transition duration-300 border-2 border-white/20"
                      title="Ver Video"
                    >
                      <Play size={22} className="fill-current ml-1" />
                    </button>
                  </div>
                  <span className="absolute bottom-3 right-3 rounded-lg bg-indigo-600/90 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-bold text-white border border-indigo-400/30 flex items-center gap-1">
                    {med.platform}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-[#3ac167] tracking-wider">
                        {med.category}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                        {med.date}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug group-hover:text-emerald-600 dark:group-hover:text-[#fcc74f] transition-colors">
                      {med.title}
                    </h3>
                    {med.description && (
                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 font-medium line-clamp-2">
                        {med.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedWebinar(med)}
                      className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-[#3ac167] hover:text-emerald-700 dark:hover:text-emerald-300 transition"
                    >
                      <Play size={14} className="fill-current" /> Reproducir Video
                    </button>
                    <a
                      href={med.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
                    >
                      <ExternalLink size={13} /> Dailymotion
                    </a>
                  </div>
                </div>
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

      {/* Webinar Modal Player (Facebook / Dailymotion Embed) */}
      {selectedWebinar && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-3xl rounded-3xl bg-[#1B2533] p-4 border border-[#3ac167]/40 shadow-2xl relative flex flex-col items-center">
            <button
              onClick={() => setSelectedWebinar(null)}
              className="absolute -top-3 -right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#dd3146] text-white font-bold shadow-lg hover:bg-red-700 transition"
              aria-label="Cerrar video"
            >
              <X size={20} />
            </button>

            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center relative shadow-inner">
              <iframe
                src={selectedWebinar.embedUrl}
                width="100%"
                height="100%"
                className="w-full h-full border-0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 w-full px-2">
              <div>
                <span className="text-[10px] font-black uppercase text-[#3ac167] tracking-wider">
                  {selectedWebinar.category} · {selectedWebinar.platform}
                </span>
                <h3 className="text-sm sm:text-base font-black text-white leading-tight mt-0.5">
                  {selectedWebinar.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <a
                  href={selectedWebinar.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-3.5 py-2 text-xs font-bold text-white transition shadow-md"
                >
                  <ExternalLink size={14} /> Ver en {selectedWebinar.platform}
                </a>
                <button
                  onClick={() => setSelectedWebinar(null)}
                  className="rounded-xl bg-white/10 px-3.5 py-2 text-xs font-bold text-white hover:bg-white/20 transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
