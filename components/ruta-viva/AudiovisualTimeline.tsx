"use client";

import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import {
  Play,
  FileText,
  ExternalLink,
  CheckCircle2,
  Clock,
  Target,
  Maximize2,
  Film,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Milestone, MediaItem, DocumentItem } from "@/lib/agenda-data";
import {
  ACTOR_FILTER_LABELS,
  ActorBlock,
  classifyMilestoneBlock,
  matchMilestoneVideo,
  findMilestonePdf,
} from "@/lib/ruta-viva-data";

interface AudiovisualTimelineProps {
  milestones: Milestone[];
  mediaItems: MediaItem[];
  documents: DocumentItem[];
}

export function AudiovisualTimeline({
  milestones,
  mediaItems,
  documents,
}: AudiovisualTimelineProps) {
  const [blockFilter, setBlockFilter] = useState<ActorBlock>("all");
  const [selectedId, setSelectedId] = useState<number>(milestones[1]?.id ?? milestones[0]?.id ?? 1);
  const [mediaMode, setMediaMode] = useState<"video" | "photo">("video");
  const videoRef = useRef<HTMLVideoElement>(null);

  const videos = useMemo(
    () => mediaItems.filter((item) => item.type === "videos"),
    [mediaItems]
  );

  const filteredMilestones = useMemo(() => {
    if (blockFilter === "all") return milestones;
    return milestones.filter((m) => classifyMilestoneBlock(m).includes(blockFilter));
  }, [milestones, blockFilter]);

  const activeMilestone =
    filteredMilestones.find((m) => m.id === selectedId) ||
    filteredMilestones[0] ||
    milestones[0];

  const activeIndex = filteredMilestones.findIndex((m) => m.id === activeMilestone?.id);
  const matchedVideo = activeMilestone ? matchMilestoneVideo(activeMilestone, videos) : null;
  const matchedPdf = activeMilestone ? findMilestonePdf(activeMilestone, documents) : null;

  const handleStep = (dir: "prev" | "next") => {
    if (filteredMilestones.length === 0) return;
    const nextIdx =
      dir === "prev"
        ? (activeIndex - 1 + filteredMilestones.length) % filteredMilestones.length
        : (activeIndex + 1) % filteredMilestones.length;
    setSelectedId(filteredMilestones[nextIdx].id);
  };

  const handleFullscreen = () => {
    const el = videoRef.current;
    if (el && el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("cumplido")) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 text-[11px] font-black text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 size={12} /> {status}
        </span>
      );
    }
    if (s.includes("meta")) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-950/60 px-2.5 py-0.5 text-[11px] font-black text-red-800 dark:text-red-300">
          <Target size={12} /> {status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 text-[11px] font-black text-amber-800 dark:text-amber-300">
        <Clock size={12} /> {status}
      </span>
    );
  };

  if (!activeMilestone) return null;

  return (
    <div className="space-y-6">
      {/* Filtros por bloque / actor */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {ACTOR_FILTER_LABELS.map((f) => {
            const isActive = blockFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => {
                  setBlockFilter(f.id);
                  const nextList =
                    f.id === "all"
                      ? milestones
                      : milestones.filter((m) => classifyMilestoneBlock(m).includes(f.id));
                  if (nextList.length > 0) setSelectedId(nextList[0].id);
                }}
                className={`rounded-xl px-3.5 py-2 text-xs font-extrabold transition cursor-pointer ${
                  isActive
                    ? "bg-[#3ac167] text-white shadow-emerald"
                    : "bg-white dark:bg-[#17202C] text-slate-700 dark:text-slate-300 border border-amber-900/10 dark:border-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-800"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
          Mostrando {filteredMilestones.length} de {milestones.length} hitos
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Reproductor Audiovisual Unificado + Ficha Sincronizada */}
        <motion.div
          key={activeMilestone.id}
          initial={{ opacity: 0.6, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="lg:col-span-7 rounded-3xl border border-amber-900/15 dark:border-slate-800 bg-white dark:bg-[#17202C] overflow-hidden shadow-soft"
        >
          {/* Toggle Video / Fotografía real si el hito tiene imagen */}
          <div className="bg-[#1B2533] px-5 py-3 flex items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMediaMode("video")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-extrabold transition cursor-pointer ${
                  mediaMode === "video"
                    ? "bg-[#3ac167] text-white"
                    : "bg-white/10 text-slate-300 hover:bg-white/20"
                }`}
              >
                <Film size={13} /> Video
              </button>
              {activeMilestone.image && (
                <button
                  onClick={() => setMediaMode("photo")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-extrabold transition cursor-pointer ${
                    mediaMode === "photo"
                      ? "bg-[#c79d47] text-[#101620]"
                      : "bg-white/10 text-slate-300 hover:bg-white/20"
                  }`}
                >
                  <ImageIcon size={13} /> Fotografía
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {mediaMode === "video" && matchedVideo?.mediaUrl && (
                <button
                  onClick={handleFullscreen}
                  className="inline-flex items-center gap-1 rounded-lg bg-white/10 hover:bg-white/20 px-2.5 py-1 text-[11px] font-bold text-slate-200 cursor-pointer"
                  title="Pantalla completa"
                >
                  <Maximize2 size={12} /> Pantalla completa
                </button>
              )}
              <button
                onClick={() => handleStep("prev")}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer"
                aria-label="Hito anterior"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={() => handleStep("next")}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer"
                aria-label="Siguiente hito"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          {/* Viewport de Video / Foto */}
          <div className="bg-black aspect-video w-full relative flex items-center justify-center">
            {mediaMode === "photo" && activeMilestone.image ? (
              <img
                src={activeMilestone.image}
                alt={activeMilestone.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : matchedVideo?.embedUrl ? (
              <iframe
                src={matchedVideo.embedUrl}
                title={matchedVideo.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : matchedVideo?.mediaUrl ? (
              <video
                ref={videoRef}
                key={matchedVideo.mediaUrl}
                src={encodeURI(matchedVideo.mediaUrl)}
                poster={activeMilestone.image || matchedVideo.coverUrl || undefined}
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-slate-400 text-xs flex items-center gap-2">
                <Play size={16} /> Sin medio asociado
              </div>
            )}
          </div>

          {/* Detalles del Hito */}
          <div className="p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#c79d47]">
                Hito #{activeMilestone.order || activeIndex + 1} · {activeMilestone.date}
              </span>
              {getStatusBadge(activeMilestone.status)}
            </div>

            <h3 className="text-xl font-black text-[#1B2533] dark:text-white leading-snug">
              {activeMilestone.title}
            </h3>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line line-clamp-5">
              {activeMilestone.detail}
            </p>

            {matchedVideo && (
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Video sincronizado: <span className="text-[#1B2533] dark:text-slate-200">{matchedVideo.title}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-amber-900/10 dark:border-slate-800">
              {matchedPdf && (
                <a
                  href={matchedPdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#1B2533] hover:bg-slate-800 dark:bg-[#c79d47] dark:text-[#101620] text-white px-4 py-2 text-xs font-black transition"
                >
                  <FileText size={14} /> {matchedPdf.name} <ExternalLink size={11} />
                </a>
              )}
              {activeMilestone.participants && activeMilestone.participants.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {activeMilestone.participants.slice(0, 3).map((p, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:text-slate-300"
                    >
                      {p.startsWith("http") ? "Nota Presidencial" : p}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Lista de Capítulos de la Ruta Crítica */}
        <div className="lg:col-span-5 rounded-3xl border border-amber-900/10 dark:border-slate-800 bg-white dark:bg-[#17202C] p-4 shadow-soft max-h-[600px] overflow-y-auto custom-scrollbar space-y-2">
          <div className="px-2 py-1 text-xs font-black uppercase tracking-wider text-slate-400">
            Capítulos de la Ruta ({filteredMilestones.length})
          </div>
          {filteredMilestones.map((m, idx) => {
            const isSelected = m.id === activeMilestone.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setSelectedId(m.id);
                  setMediaMode("video");
                }}
                className={`w-full text-left rounded-2xl p-3.5 transition cursor-pointer border ${
                  isSelected
                    ? "bg-[#1B2533] text-white border-[#1B2533] dark:bg-[#c79d47]/15 dark:border-[#c79d47]"
                    : "bg-[#FAF8F3] dark:bg-[#101620] border-transparent hover:border-amber-900/20 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[11px] font-bold">
                  <span className={isSelected ? "text-[#fcc74f]" : "text-[#c79d47]"}>
                    {String(m.order || idx + 1).padStart(2, "0")} · {m.date}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      m.status.toLowerCase().includes("cumplido")
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
                <div
                  className={`mt-1 text-xs sm:text-sm font-extrabold line-clamp-2 ${
                    isSelected ? "text-white" : "text-[#1B2533] dark:text-slate-200"
                  }`}
                >
                  {m.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
