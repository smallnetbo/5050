"use client";

import { useState, useRef, useEffect } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock3,
  CircleDashed,
  Target,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Users,
  FileText,
  Download,
  Flag,
  ShieldCheck,
  Search,
  Lightbulb,
  Puzzle,
  Check,
  ArrowDownToLine,
  Eye,
} from "lucide-react";
import { milestones as defaultMilestones, Milestone } from "@/lib/agenda-data";

interface TimelineProps {
  milestones?: Milestone[];
}

export function Timeline({ milestones: propMilestones }: TimelineProps) {
  const milestonesList =
    propMilestones && propMilestones.length > 0
      ? propMilestones
      : defaultMilestones;

  // Estado del hito seleccionado para la ventana modal (popup)
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  // Posición del hito seleccionado según su orden en la lista
  const selectedIndex = selectedMilestone
    ? milestonesList.findIndex((m) => m.id === selectedMilestone.id)
    : -1;
  const selectedPosition = selectedIndex >= 0 ? selectedIndex + 1 : 1;
  const formattedSelectedNum =
    selectedPosition < 10 ? `0${selectedPosition}` : `${selectedPosition}`;

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedMilestone(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Navegación dentro del modal
  const handleModalNav = (direction: "prev" | "next") => {
    if (!selectedMilestone) return;
    const currentIndex = milestonesList.findIndex((m) => m.id === selectedMilestone.id);
    if (currentIndex === -1) return;

    if (direction === "prev") {
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : milestonesList.length - 1;
      setSelectedMilestone(milestonesList[prevIndex]);
    } else {
      const nextIndex = currentIndex < milestonesList.length - 1 ? currentIndex + 1 : 0;
      setSelectedMilestone(milestonesList[nextIndex]);
    }
  };

  // Desplazamiento horizontal asistido
  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 380;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Helper de estilo según el estado para los círculos de la captura
  const getNodeTheme = (status: string, index: number) => {
    const s = status.toLowerCase();

    if (s.includes("cumplido") || index === 0 || index === 1) {
      return {
        type: "emerald",
        ringBorder:
          "border-emerald-500 dark:border-emerald-400 shadow-[0_4px_20px_rgba(16,185,129,0.22),0_0_0_3px_rgba(16,185,129,0.15)] dark:shadow-[0_0_24px_rgba(52,211,153,0.55),inset_0_0_12px_rgba(52,211,153,0.25)] dark:ring-4 dark:ring-emerald-500/20",
        titleColor: "text-emerald-700 dark:text-emerald-400",
        badgeBg:
          "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30",
        icon: <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />,
      };
    }

    if (s.includes("proceso") || s.includes("curso")) {
      return {
        type: "amber",
        ringBorder:
          "border-amber-500 dark:border-amber-400 shadow-[0_4px_20px_rgba(245,158,11,0.22),0_0_0_3px_rgba(245,158,11,0.15)] dark:shadow-[0_0_24px_rgba(251,191,36,0.55),inset_0_0_12px_rgba(251,191,36,0.25)] dark:ring-4 dark:ring-amber-500/20",
        titleColor: "text-amber-700 dark:text-amber-400",
        badgeBg:
          "bg-amber-50 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-500/30",
        icon: <Clock3 className="w-8 h-8 text-amber-600 dark:text-amber-400" />,
      };
    }

    if (s.includes("meta")) {
      return {
        type: "cyan",
        ringBorder:
          "border-cyan-500 dark:border-cyan-400 shadow-[0_4px_20px_rgba(6,182,212,0.22),0_0_0_3px_rgba(6,182,212,0.15)] dark:shadow-[0_0_28px_rgba(34,211,238,0.65),inset_0_0_16px_rgba(34,211,238,0.3)] dark:ring-4 dark:ring-cyan-500/25",
        titleColor: "text-cyan-700 dark:text-cyan-300",
        badgeBg:
          "bg-cyan-50 text-cyan-800 dark:bg-cyan-950/70 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/30",
        icon: <Target className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />,
      };
    }

    // Default / Pendiente / Programado (Cyan/Azul institucional de la captura)
    return {
      type: "blue",
      ringBorder:
        "border-cyan-500 dark:border-cyan-400 shadow-[0_4px_20px_rgba(6,182,212,0.22),0_0_0_3px_rgba(6,182,212,0.15)] dark:shadow-[0_0_22px_rgba(34,211,238,0.5),inset_0_0_12px_rgba(34,211,238,0.2)] dark:ring-4 dark:ring-cyan-500/20",
      titleColor: "text-cyan-700 dark:text-cyan-400",
      badgeBg:
        "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
      icon: <Puzzle className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />,
    };
  };

  return (
    <section
      id="ruta"
      className="relative bg-white dark:bg-[#0B111A] py-16 sm:py-24 border-t border-b border-slate-200 dark:border-slate-800 transition-colors duration-300 overflow-hidden text-slate-900 dark:text-white"
    >
      {/* Sutiles halos de resplandor de fondo adaptados al tema */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-96 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-page max-w-7xl relative z-10 space-y-10">
        {/* ENCABEZADO DE LA SECCIÓN */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-500/40 px-3.5 py-1 text-xs font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-widest shadow-2xs">
              <Sparkles size={13} className="text-emerald-600 dark:text-emerald-400" />
              HOJA DE RUTA INTERACTIVA
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Del punto de partida hacia un objetivo común
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              Haz clic en cualquiera de los círculos o títulos para desplegar en ventana emergente la información técnica, actores y documentos oficiales de cada hito.
            </p>
          </div>

          {/* CONTROLES DE DESPLAZAMIENTO HORIZONTAL */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">
              Desplazar cronograma:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScroll("left")}
                aria-label="Desplazar a la izquierda"
                className="p-2.5 rounded-2xl bg-white dark:bg-[#151D2A] border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:border-emerald-500 dark:hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 hover:scale-105 active:scale-95 shadow-xs dark:shadow-md transition"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => handleScroll("right")}
                aria-label="Desplazar a la derecha"
                className="p-2.5 rounded-2xl bg-white dark:bg-[#151D2A] border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:border-emerald-500 dark:hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 hover:scale-105 active:scale-95 shadow-xs dark:shadow-md transition"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* LÍNEA DE TIEMPO HORIZONTAL ESTILO CAPTURA */}
        <div className="relative py-8">
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto pb-10 pt-4 custom-scrollbar scroll-smooth relative"
          >
            {/* Contenedor relativo que sostiene la línea y los nodos */}
            <div className="relative min-w-max px-10 sm:px-16 flex items-start gap-10 sm:gap-14">
              {/* LÍNEA HORIZONTAL CONTINUA DETRÁS DE LOS CÍRCULOS */}
              <div
                className="absolute left-16 right-16 top-10 sm:top-12 -translate-y-1/2 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-blue-500 z-0 opacity-70 dark:opacity-85 shadow-[0_0_8px_rgba(16,185,129,0.35)] dark:shadow-[0_0_12px_rgba(16,185,129,0.5)] pointer-events-none rounded-full"
              />

              {/* LISTA DE NODOS CIRCULARES */}
              {milestonesList.map((m, idx) => {
                const theme = getNodeTheme(m.status, idx);
                const position = idx + 1;
                const formattedNum = position < 10 ? `0${position}` : `${position}`;

                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMilestone(m)}
                    className="group relative z-10 flex flex-col items-center w-44 sm:w-52 shrink-0 cursor-pointer text-center select-none"
                  >
                    {/* CÍRCULO CON RESPLANDOR E IMAGEN INTERNA */}
                    <div
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white dark:bg-[#0A1624] border-2 sm:border-[3px] ${theme.ringBorder} flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-110 relative`}
                    >
                      {m.image ? (
                        <>
                          <img
                            src={m.image}
                            alt={m.title}
                            className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-115"
                          />
                          {/* Sutil overlay de realce */}
                          <div className="absolute inset-0 bg-black/5 dark:bg-black/20 group-hover:bg-transparent transition-colors rounded-full" />
                        </>
                      ) : (
                        <div className="flex items-center justify-center p-2">
                          {theme.icon}
                        </div>
                      )}

                      {/* Icono discreto de inspección al hacer hover */}
                      <div className="absolute inset-0 bg-emerald-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white dark:text-emerald-300 drop-shadow" />
                      </div>
                    </div>

                    {/* TÍTULO Y FECHA DEBAJO DEL CÍRCULO (CON LA TIPOGRAFÍA Y COLOR DE LA CAPTURA) */}
                    <div className="mt-5 space-y-1.5 px-1">
                      <h3
                        className={`text-xs sm:text-sm font-extrabold leading-snug tracking-tight ${theme.titleColor} transition-colors group-hover:underline line-clamp-3`}
                      >
                        {formattedNum}. {m.title}
                      </h3>
                      <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        {m.date}
                      </p>
                      <span className="inline-block text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        Ver tarjeta →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* INDICADOR INFORMATIVO INFERIOR */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80 pt-4">
          <span className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            Línea cronológica interactiva • {milestonesList.length} hitos oficiales
          </span>
          <span className="hidden sm:inline font-medium">
            Haz clic en cualquier círculo para abrir su ficha detallada
          </span>
        </div>
      </div>

      {/* POPUP / MODAL FLOTANTE DE LA TARJETA DEL HITO */}
      {selectedMilestone && (
        <div
          role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setSelectedMilestone(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar rounded-3xl bg-white dark:bg-[#151D2A] border border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-white animate-in zoom-in-95 duration-200"
            >
              {/* BOTÓN CERRAR (X) */}
              <button
                onClick={() => setSelectedMilestone(null)}
                aria-label="Cerrar detalle"
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition shadow-md"
              >
                <X size={20} />
              </button>

              {/* CABECERA VISUAL DEL POPUP (IMAGEN O BANNER INSTITUCIONAL) */}
              {selectedMilestone.image ? (
                <div className="relative overflow-hidden h-52 sm:h-64 bg-slate-900 rounded-t-3xl">
                  <img
                    src={selectedMilestone.image}
                    alt={selectedMilestone.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  <div className="absolute top-4 left-5">
                    <span className="font-mono text-xs font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-emerald-300 px-3 py-1 rounded-full border border-emerald-400/30">
                      HITO {formattedSelectedNum}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-white text-xs">
                    <span className="font-semibold flex items-center gap-1.5 text-xs opacity-90">
                      <Calendar size={13} className="text-emerald-400" /> {selectedMilestone.date}
                    </span>
                    <span className="rounded-full bg-emerald-500/80 backdrop-blur-xs px-3 py-1 text-xs font-black text-white">
                      {selectedMilestone.status}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative overflow-hidden p-6 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 dark:from-[#0F2942] dark:via-[#142C44] dark:to-[#0A1A2B] border-b border-emerald-500/20 text-white rounded-t-3xl">
                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-block text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-2.5 py-0.5 rounded-full mb-2">
                        HITO {formattedSelectedNum}
                      </span>
                      <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5 opacity-90">
                        <Calendar size={13} className="text-emerald-400" /> {selectedMilestone.date}
                      </div>
                    </div>
                    <div className="text-4xl sm:text-5xl font-black font-mono text-white/20 select-none">
                      {formattedSelectedNum}
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-black text-emerald-300">
                      {selectedMilestone.status}
                    </span>
                  </div>
                </div>
              )}

            {/* CUERPO PRINCIPAL DEL MODAL */}
            <div className="p-6 sm:p-8 space-y-5">
              <div>
                <h3
                  id="modal-title"
                  className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight"
                >
                  {selectedMilestone.title}
                </h3>
              </div>

              {/* Detalle / Reseña */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Descripción & Alcance Técnico
                </h4>
                <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-200 font-medium whitespace-pre-line">
                  {selectedMilestone.detail}
                </p>
              </div>

              {/* Actores Involucrados */}
              {selectedMilestone.participants && selectedMilestone.participants.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Users size={13} className="text-emerald-600 dark:text-emerald-500" /> ACTORES E INSTITUCIONES INVOLUCRADAS
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMilestone.participants.map((actor, aIdx) => (
                      <span
                        key={aIdx}
                        className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60"
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Documentos Adjuntos */}
              {selectedMilestone.documents && selectedMilestone.documents.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                    <FileText size={13} className="text-emerald-600 dark:text-emerald-500" /> DOCUMENTOS DISPONIBLES
                  </h4>
                  <div className="space-y-2">
                    {selectedMilestone.documents.map((doc, dIdx) => (
                      <a
                        key={dIdx}
                        href={doc.url || "#descargas"}
                        target={doc.url?.startsWith("http") ? "_blank" : undefined}
                        rel={doc.url?.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/80 p-3 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/60 transition group/doc"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <FileText size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover/doc:text-emerald-600">
                            {doc.name}
                          </span>
                        </div>
                        <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shrink-0 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          <Download size={12} /> {doc.size}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* BARRA DE NAVEGACIÓN INFERIOR DEL POPUP (ANTERIOR / SIGUIENTE / CERRAR) */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleModalNav("prev")}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-black flex items-center gap-1 transition"
                  >
                    <ChevronLeft size={14} /> Anterior
                  </button>
                  <button
                    onClick={() => handleModalNav("next")}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-black flex items-center gap-1 transition"
                  >
                    Siguiente <ChevronRight size={14} />
                  </button>
                </div>

                <button
                  onClick={() => setSelectedMilestone(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-black transition"
                >
                  Cerrar Ficha
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}