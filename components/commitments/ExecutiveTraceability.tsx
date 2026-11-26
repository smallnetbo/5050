"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Link2,
  FileText,
  ExternalLink,
  Eye,
  Search,
  X,
  CheckCircle2,
  Clock,
  Activity,
} from "lucide-react";
import { DocumentItem } from "@/lib/agenda-data";
import {
  BoardCommitmentItem,
  BoardLevelCode,
  BoardStatusCat,
  BOARD_LEVELS,
  BOARD_LEVEL_ORDER,
} from "@/lib/board-commitments-data";
import {
  NORMATIVE_TRACE_LINKS,
  NormativeTraceLink,
  resolveMatchedBoardItem,
  resolveTracePdfUrl,
} from "@/lib/traceability-data";
import { ModalPortal } from "@/components/ModalPortal";

interface ExecutiveTraceabilityProps {
  commitments: BoardCommitmentItem[];
  documents?: DocumentItem[];
  activeStatusFilter?: "ALL" | BoardStatusCat;
  activeLevelFilter?: "ALL" | BoardLevelCode;
  onSelectStatus?: (status: "ALL" | BoardStatusCat) => void;
  onSelectLevel?: (level: "ALL" | BoardLevelCode) => void;
  onHighlightCommitment?: (commitmentId: number, searchHint: string) => void;
  mode?: "board" | "standalone";
}

const LEVEL_SHORT_NAMES: Record<BoardLevelCode, string> = {
  "2.1": "2.1 NCE — Nivel Central",
  "2.2": "2.2 GAD — Gobernaciones",
  "2.3": "2.3 AMB/FAM — Municipios",
  "2.4": "2.4 CONAIOC — GAIOC",
  "2.6": "2.6 GAR — Gran Chaco",
  "2.7": "2.7 Conjuntos — Multinivel",
};

const STATUS_PILLS: { id: "ALL" | BoardStatusCat; label: string; dotColor?: string }[] = [
  { id: "ALL", label: "Todos" },
  { id: "cumplido", label: "Cumplido / Entregado", dotColor: "#3ac167" },
  { id: "proceso", label: "En proceso / En curso", dotColor: "#c79d47" },
  { id: "programado", label: "Programado / Continuo", dotColor: "#3b82f6" },
  { id: "sin_plazo", label: "Sin plazo", dotColor: "#64748B" },
];

export function ExecutiveTraceability({
  commitments,
  documents = [],
  activeStatusFilter = "ALL",
  activeLevelFilter = "ALL",
  onSelectStatus,
  onSelectLevel,
  onHighlightCommitment,
  mode = "board",
}: ExecutiveTraceabilityProps) {
  const router = useRouter();
  const [detailLink, setDetailLink] = useState<NormativeTraceLink | null>(null);

  const stats = useMemo(() => {
    const total = commitments.length;
    const denom = total || 1;
    const cumplido = commitments.filter((c) => c.cat === "cumplido").length;
    const proceso = commitments.filter((c) => c.cat === "proceso").length;
    const programado = commitments.filter((c) => c.cat === "programado").length;
    const sin_plazo = commitments.filter((c) => c.cat === "sin_plazo").length;

    const pct = (n: number) => Math.round((n / denom) * 100);
    const exactPct = (n: number) => (n / denom) * 100;

    const levels = BOARD_LEVEL_ORDER.map((code) => {
      const items = commitments.filter((c) => c.nivel === code);
      const lTotal = items.length;
      const lDenom = lTotal || 1;
      const lCumplido = items.filter((i) => i.cat === "cumplido").length;
      const lProceso = items.filter((i) => i.cat === "proceso").length;
      const lProgramado = items.filter((i) => i.cat === "programado").length;
      const lSinPlazo = items.filter((i) => i.cat === "sin_plazo").length;
      return {
        code,
        label: LEVEL_SHORT_NAMES[code] || BOARD_LEVELS[code].shortLabel,
        total: lTotal,
        cumplido: lCumplido,
        proceso: lProceso,
        programado: lProgramado,
        sin_plazo: lSinPlazo,
        pctCumplido: (lCumplido / lDenom) * 100,
        pctProceso: (lProceso / lDenom) * 100,
        pctProgramado: (lProgramado / lDenom) * 100,
        pctSinPlazo: (lSinPlazo / lDenom) * 100,
      };
    });

    return {
      total,
      cumplido,
      proceso,
      programado,
      sin_plazo,
      pctCumplido: pct(cumplido),
      pctProceso: pct(proceso),
      pctProgramado: pct(programado),
      pctSinPlazo: pct(sin_plazo),
      exactCumplido: exactPct(cumplido),
      exactProceso: exactPct(proceso),
      exactProgramado: exactPct(programado),
      exactSinPlazo: exactPct(sin_plazo),
      levels,
    };
  }, [commitments]);

  const handleStatusClick = (status: "ALL" | BoardStatusCat) => {
    if (onSelectStatus) {
      onSelectStatus(status);
    } else if (mode === "standalone") {
      router.push("/#tablero-compromisos");
    }
  };

  const handleLevelClick = (level: BoardLevelCode) => {
    if (onSelectLevel) {
      onSelectLevel(activeLevelFilter === level ? "ALL" : level);
    } else if (mode === "standalone") {
      router.push("/#tablero-compromisos");
    }
  };

  const handleViewInBoard = (link: NormativeTraceLink) => {
    const matched = resolveMatchedBoardItem(link, commitments);
    if (onHighlightCommitment) {
      onHighlightCommitment(matched?.id ?? link.commitmentId, matched?.tematica ?? link.searchHint);
    } else {
      router.push("/#tablero-compromisos");
    }
  };

  return (
    <div className="rounded-3xl border border-amber-900/15 dark:border-slate-800 bg-[#FAF8F5] dark:bg-slate-900/75 p-5 sm:p-7 shadow-soft transition-colors">
      {/* Encabezado del Módulo */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-amber-900/10 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#c79d47]">
            <Activity size={14} /> Lectura Ejecutiva en Tiempo Real
          </div>
          <h3 className="mt-1 text-xl sm:text-2xl font-black text-[#1B2533] dark:text-white tracking-tight">
            Semaforización y Trazabilidad Ley ↔ Compromiso
          </h3>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-slate-800 border border-amber-900/10 dark:border-slate-700 px-3.5 py-1.5 text-xs font-extrabold text-[#1B2533] dark:text-slate-200 tabular-nums">
          {stats.total} Compromisos · 6 Niveles
        </span>
      </div>

      {/* Layout 2 Columnas en Escritorio, Apilado en Móvil */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* COLUMNA IZQUIERDA: SEMAFORIZACIÓN EJECUTIVA */}
        <div className="lg:col-span-5 rounded-2xl border border-amber-900/10 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-5 space-y-5">
          <div>
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              <span>Semáforo Global</span>
              <span className="tabular-nums text-[#1B2533] dark:text-white">
                {stats.cumplido + stats.proceso} activos / {stats.total}
              </span>
            </div>

            {/* Barra de progreso segmentada */}
            <div className="h-3.5 w-full rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700">
              <div
                style={{ width: `${stats.exactCumplido}%`, backgroundColor: "#3ac167" }}
                title={`Cumplido / Entregado: ${stats.cumplido} (${stats.pctCumplido}%)`}
                className="h-full transition-all duration-300"
              />
              <div
                style={{ width: `${stats.exactProceso}%`, backgroundColor: "#c79d47" }}
                title={`En proceso / En curso: ${stats.proceso} (${stats.pctProceso}%)`}
                className="h-full transition-all duration-300"
              />
              <div
                style={{ width: `${stats.exactProgramado}%`, backgroundColor: "#3b82f6" }}
                title={`Programado / Continuo: ${stats.programado} (${stats.pctProgramado}%)`}
                className="h-full transition-all duration-300"
              />
              <div
                style={{ width: `${stats.exactSinPlazo}%`, backgroundColor: "#64748B" }}
                title={`Sin plazo: ${stats.sin_plazo} (${stats.pctSinPlazo}%)`}
                className="h-full transition-all duration-300"
              />
            </div>

            {/* 5 KPIs Numéricos Compactos */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-3 gap-2">
              <div className="rounded-xl bg-[#FAF8F5] dark:bg-slate-800/70 border border-amber-900/10 dark:border-slate-700/70 p-2.5">
                <div className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
                  Total
                </div>
                <div className="text-lg font-black text-[#1B2533] dark:text-white tabular-nums">
                  {stats.total}
                </div>
              </div>
              <div className="rounded-xl bg-emerald-50/70 dark:bg-emerald-950/35 border border-emerald-200/70 dark:border-emerald-800/40 p-2.5">
                <div className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                  Cumplidos
                </div>
                <div className="text-lg font-black text-emerald-700 dark:text-emerald-300 tabular-nums">
                  {stats.cumplido}{" "}
                  <span className="text-[11px] font-bold opacity-80">({stats.pctCumplido}%)</span>
                </div>
              </div>
              <div className="rounded-xl bg-amber-50/80 dark:bg-amber-950/35 border border-amber-300/60 dark:border-amber-800/40 p-2.5">
                <div className="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-300">
                  En proceso
                </div>
                <div className="text-lg font-black text-amber-800 dark:text-amber-300 tabular-nums">
                  {stats.proceso}{" "}
                  <span className="text-[11px] font-bold opacity-80">({stats.pctProceso}%)</span>
                </div>
              </div>
              <div className="rounded-xl bg-sky-50/80 dark:bg-sky-950/35 border border-sky-200/70 dark:border-sky-800/40 p-2.5">
                <div className="text-[10px] font-bold uppercase text-sky-700 dark:text-sky-300">
                  Programado
                </div>
                <div className="text-lg font-black text-sky-700 dark:text-sky-300 tabular-nums">
                  {stats.programado}{" "}
                  <span className="text-[11px] font-bold opacity-80">({stats.pctProgramado}%)</span>
                </div>
              </div>
              <div className="rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-2.5 col-span-2 sm:col-span-1 lg:col-span-2">
                <div className="text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400">
                  Sin plazo
                </div>
                <div className="text-lg font-black text-slate-700 dark:text-slate-200 tabular-nums">
                  {stats.sin_plazo}{" "}
                  <span className="text-[11px] font-bold opacity-80">({stats.pctSinPlazo}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Desglose por Nivel (6 barras apiladas horizontales) */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-2.5">
            <div className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Desglose por Nivel (clic para filtrar)
            </div>

            {stats.levels.map((lvl) => {
              const isSelected = activeLevelFilter === lvl.code;
              return (
                <button
                  key={lvl.code}
                  type="button"
                  onClick={() => handleLevelClick(lvl.code)}
                  className={`w-full text-left rounded-xl p-2.5 border transition cursor-pointer ${
                    isSelected
                      ? "bg-[#1B2533] text-white border-[#c79d47] dark:bg-slate-800"
                      : "bg-[#FAF8F5] dark:bg-slate-900/60 border-slate-200/70 dark:border-slate-800 hover:border-[#c79d47]/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs font-extrabold mb-1.5">
                    <span className={isSelected ? "text-white" : "text-[#1B2533] dark:text-slate-200"}>
                      {lvl.label}
                    </span>
                    <span
                      className={`tabular-nums text-[11px] ${
                        isSelected ? "text-[#fcc74f]" : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {lvl.total} ({lvl.cumplido}C · {lvl.proceso}P · {lvl.programado}Pr · {lvl.sin_plazo}SP)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-800">
                    <div style={{ width: `${lvl.pctCumplido}%`, backgroundColor: "#3ac167" }} />
                    <div style={{ width: `${lvl.pctProceso}%`, backgroundColor: "#c79d47" }} />
                    <div style={{ width: `${lvl.pctProgramado}%`, backgroundColor: "#3b82f6" }} />
                    <div style={{ width: `${lvl.pctSinPlazo}%`, backgroundColor: "#64748B" }} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Filtros Rápidos Inferiores */}
          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex flex-wrap gap-1.5">
              {STATUS_PILLS.map((pill) => {
                const isActive = activeStatusFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => handleStatusClick(pill.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold transition cursor-pointer border ${
                      isActive
                        ? "bg-[#1B2533] text-white border-[#1B2533] dark:bg-[#c79d47] dark:text-[#101620] dark:border-[#c79d47]"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    {pill.dotColor && (
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: pill.dotColor }}
                      />
                    )}
                    <span>{pill.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: TRAZABILIDAD LEY ↔ COMPROMISO */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Trazabilidad Normativa (6 Vínculos Clave)
            </span>
            <span className="text-[11px] font-bold text-[#c79d47]">
              Norma / Proyecto ← 🔗 → Compromiso en Tablero
            </span>
          </div>

          <div className="space-y-3">
            {NORMATIVE_TRACE_LINKS.map((link) => {
              const pdfUrl = resolveTracePdfUrl(link, documents);
              const isCumplido = link.status === "CUMPLIDO";

              return (
                <div
                  key={link.id}
                  className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-stretch gap-2.5 rounded-2xl border border-amber-900/10 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-3.5 shadow-2xs"
                >
                  {/* Tarjeta Izquierda: Norma o Instancia */}
                  <div className="rounded-xl bg-[#FAF8F5] dark:bg-slate-900/80 border border-amber-900/10 dark:border-slate-800 p-3.5 flex flex-col justify-between gap-2.5">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#c79d47]">
                          Trazabilidad
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                          {link.normDate}
                        </span>
                      </div>
                      <h4 className="mt-1 text-sm font-black text-[#1B2533] dark:text-white leading-snug">
                        {link.normTitle}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
                        {link.normSubtitle}
                      </p>
                      <span
                        className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black border ${
                          isCumplido
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/50"
                            : "bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/50"
                        }`}
                      >
                        {link.summaryPill}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setDetailLink(link)}
                        className="inline-flex items-center gap-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[11px] font-extrabold text-[#1B2533] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
                      >
                        <Eye size={12} className="text-[#c79d47]" /> Ver detalle
                      </button>
                      {pdfUrl && (
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg bg-[#1B2533] dark:bg-[#c79d47] text-white dark:text-[#101620] px-2.5 py-1 text-[11px] font-extrabold hover:opacity-90 transition"
                        >
                          <FileText size={12} /> Descargar PDF <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Conector Central ← 🔗 → */}
                  <div className="flex md:flex-col items-center justify-center gap-1 py-1 md:px-1 text-slate-400 dark:text-slate-500">
                    <span className="text-xs font-black hidden md:inline">←</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100/80 dark:bg-slate-800 border border-amber-300/50 dark:border-slate-700 text-[#c79d47]">
                      <Link2 size={14} />
                    </span>
                    <span className="text-xs font-black hidden md:inline">→</span>
                  </div>

                  {/* Tarjeta Derecha: Compromiso Vinculado en Tablero */}
                  <div className="rounded-xl bg-[#FAF8F5] dark:bg-slate-900/80 border border-amber-900/10 dark:border-slate-800 p-3.5 flex flex-col justify-between gap-2.5">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black ${
                            isCumplido
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                          }`}
                        >
                          {isCumplido ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                          • {link.status}
                        </span>
                      </div>
                      <h4 className="mt-1.5 text-sm font-black text-[#1B2533] dark:text-white leading-snug">
                        {link.commitmentTitle}
                      </h4>
                      <p className="mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        Responsable: {link.commitmentResponsible}
                      </p>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => handleViewInBoard(link)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#3ac167] hover:bg-[#2ea354] text-white px-3 py-1.5 text-[11px] font-black transition cursor-pointer shadow-2xs"
                      >
                        <Search size={12} /> Ver en tablero
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal de Detalle Normativo */}
      {detailLink && (
        <ModalPortal>
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
            onClick={() => setDetailLink(null)}
          >
            <div
              className="w-full max-w-lg rounded-3xl border border-amber-900/15 dark:border-slate-700 bg-white dark:bg-[#17202C] p-6 shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#c79d47]">
                    Trazabilidad Normativa · {detailLink.normDate}
                  </span>
                  <h4 className="mt-1 text-lg font-black text-[#1B2533] dark:text-white">
                    {detailLink.normTitle}
                  </h4>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {detailLink.normSubtitle}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailLink(null)}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                  aria-label="Cerrar detalle"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {detailLink.detailSynthesis}
              </p>

              <div className="rounded-2xl bg-[#FAF8F5] dark:bg-slate-900/70 p-3.5 border border-amber-900/10 dark:border-slate-800 text-xs">
                <div className="font-black uppercase text-[10px] text-slate-400">
                  Compromiso vinculado en Tablero
                </div>
                <div className="font-extrabold text-[#1B2533] dark:text-white mt-0.5">
                  {detailLink.commitmentTitle}
                </div>
                <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                  Responsable: {detailLink.commitmentResponsible}
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-2 pt-2">
                {resolveTracePdfUrl(detailLink, documents) && (
                  <a
                    href={resolveTracePdfUrl(detailLink, documents)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#1B2533] dark:bg-[#c79d47] text-white dark:text-[#101620] px-4 py-2 text-xs font-black"
                  >
                    <FileText size={14} /> Descargar PDF
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const target = detailLink;
                    setDetailLink(null);
                    handleViewInBoard(target);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#3ac167] text-white px-4 py-2 text-xs font-black cursor-pointer"
                >
                  <Search size={14} /> Ver en tablero
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
