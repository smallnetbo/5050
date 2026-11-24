"use client";

import { useState, useMemo, useEffect } from "react";
import {
  LayoutGrid,
  CheckCircle2,
  Clock,
  Calendar,
  CircleDashed,
  Search,
  X,
  List,
  Columns3,
  Grid2x2,
  ChevronRight,
  Scale,
  Flame,
  Heart,
  Shield,
  FileCheck2,
  Landmark,
  Users,
  Database,
  Map as MapIcon,
  Building2,
  Sprout,
  Compass,
  Globe,
  Download,
} from "lucide-react";
import {
  BoardCommitmentItem,
  BoardLevelCode,
  BoardRubroCode,
  BoardStatusCat,
  BOARD_LEVELS,
  BOARD_LEVEL_ORDER,
  BOARD_STATUS_LABELS,
  DEFAULT_BOARD_COMMITMENTS,
} from "@/lib/board-commitments-data";
import { ModalPortal } from "./ModalPortal";

interface CommitmentsBoardProps {
  commitments?: BoardCommitmentItem[];
}

function StatusIcon({ cat, className = "w-4 h-4 shrink-0" }: { cat: BoardStatusCat; className?: string }) {
  switch (cat) {
    case "cumplido":
      return <CheckCircle2 className={`${className} text-emerald-600 dark:text-emerald-400`} strokeWidth={1.6} />;
    case "proceso":
      return <Clock className={`${className} text-amber-500 dark:text-amber-400`} strokeWidth={1.6} />;
    case "programado":
      return <Calendar className={`${className} text-sky-600 dark:text-sky-400`} strokeWidth={1.6} />;
    default:
      return <CircleDashed className={`${className} text-zinc-400 dark:text-slate-500`} strokeWidth={1.6} />;
  }
}

function RubroIcon({ rubro, className = "w-4 h-4 text-zinc-500 dark:text-slate-400 shrink-0" }: { rubro: BoardRubroCode; className?: string }) {
  switch (rubro) {
    case "fiscal":
      return <Scale className={className} strokeWidth={1.5} />;
    case "energia":
      return <Flame className={className} strokeWidth={1.5} />;
    case "salud":
      return <Heart className={className} strokeWidth={1.5} />;
    case "seguridad":
      return <Shield className={className} strokeWidth={1.5} />;
    case "ley":
      return <FileCheck2 className={className} strokeWidth={1.5} />;
    case "institucional":
      return <Landmark className={className} strokeWidth={1.5} />;
    case "acuerdos":
      return <Users className={className} strokeWidth={1.5} />;
    case "datos":
      return <Database className={className} strokeWidth={1.5} />;
    default:
      return <FileCheck2 className={className} strokeWidth={1.5} />;
  }
}

function LevelIcon({ code, className = "w-4 h-4 text-zinc-700 dark:text-slate-300 shrink-0" }: { code: BoardLevelCode; className?: string }) {
  switch (code) {
    case "2.1":
      return <Landmark className={className} strokeWidth={1.5} />;
    case "2.2":
      return <MapIcon className={className} strokeWidth={1.5} />;
    case "2.3":
      return <Building2 className={className} strokeWidth={1.5} />;
    case "2.4":
      return <Sprout className={className} strokeWidth={1.5} />;
    case "2.6":
      return <Compass className={className} strokeWidth={1.5} />;
    case "2.7":
      return <Globe className={className} strokeWidth={1.5} />;
    default:
      return <Landmark className={className} strokeWidth={1.5} />;
  }
}

export function CommitmentsBoard({ commitments }: CommitmentsBoardProps = {}) {
  const itemsList = useMemo(
    () => (commitments && commitments.length > 0 ? commitments : DEFAULT_BOARD_COMMITMENTS),
    [commitments]
  );

  const [view, setView] = useState<"list" | "kanban" | "grid">("list");
  const [statusFilter, setStatusFilter] = useState<"ALL" | BoardStatusCat>("ALL");
  const [levelFilter, setLevelFilter] = useState<"ALL" | BoardLevelCode>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<BoardCommitmentItem | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedItem(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const counts = useMemo(() => {
    const total = itemsList.length || 1;
    const c = {
      cumplido: itemsList.filter((i) => i.cat === "cumplido").length,
      proceso: itemsList.filter((i) => i.cat === "proceso").length,
      programado: itemsList.filter((i) => i.cat === "programado").length,
      sin_plazo: itemsList.filter((i) => i.cat === "sin_plazo").length,
    };
    return {
      ...c,
      total: itemsList.length,
      pctCumplido: (c.cumplido / total) * 100,
      pctProceso: (c.proceso / total) * 100,
      pctProgramado: (c.programado / total) * 100,
      pctSinPlazo: (c.sin_plazo / total) * 100,
    };
  }, [itemsList]);

  const levelCounts = useMemo(() => {
    const map: Record<BoardLevelCode, number> = {
      "2.1": 0,
      "2.2": 0,
      "2.3": 0,
      "2.4": 0,
      "2.6": 0,
      "2.7": 0,
    };
    for (const item of itemsList) {
      if (map[item.nivel] !== undefined) map[item.nivel] += 1;
    }
    return map;
  }, [itemsList]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return itemsList.filter((item) => {
      const matchStatus = statusFilter === "ALL" || item.cat === statusFilter;
      const matchLevel = levelFilter === "ALL" || item.nivel === levelFilter;
      const matchQuery =
        !q ||
        item.tematica.toLowerCase().includes(q) ||
        item.entregable.toLowerCase().includes(q) ||
        item.responsable.toLowerCase().includes(q) ||
        item.estado.toLowerCase().includes(q) ||
        item.nivel.toLowerCase().includes(q);
      return matchStatus && matchLevel && matchQuery;
    });
  }, [itemsList, statusFilter, levelFilter, searchQuery]);

  const resetAllFilters = () => {
    setStatusFilter("ALL");
    setLevelFilter("ALL");
    setSearchQuery("");
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Nivel", "Rubro", "Temática", "Entregable", "Responsable", "Estado", "Categoría"];
    const escape = (val: string | number) => `"${String(val).replace(/"/g, '""')}"`;
    const rows = filteredItems.map((i) =>
      [i.id, i.nivel, i.rubro, i.tematica, i.entregable, i.responsable, i.estado, i.cat].map(escape).join(",")
    );
    const csv = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "agenda_50_50_compromisos_por_nivel.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="tablero-compromisos"
      className="py-16 sm:py-20 bg-white dark:bg-[#0B111A] border-t border-slate-200/70 dark:border-slate-800/80 transition-colors"
    >
      <div className="container-page space-y-6">
        {/* Cabecera del Tablero */}
        <div className="rounded-2xl border border-zinc-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-zinc-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex items-center gap-2.5 shrink-0">
                <LayoutGrid className="w-4 h-4 text-zinc-900 dark:text-emerald-400" strokeWidth={1.6} />
                <h2 className="text-sm sm:text-base font-bold tracking-tight text-zinc-900 dark:text-white">
                  Agenda 50/50 · Compromisos por Nivel
                </h2>
              </div>

              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-zinc-100 dark:bg-slate-800 text-zinc-600 dark:text-slate-300 border border-zinc-200 dark:border-slate-700 tabular-nums shrink-0">
                {filteredItems.length} de {counts.total}
              </span>

              {/* Barra de progreso segmentada */}
              <div className="hidden lg:flex items-center gap-3 pl-1">
                <div className="w-32 h-1.5 bg-zinc-100 dark:bg-slate-800 rounded-full overflow-hidden flex border border-zinc-200/70 dark:border-slate-700">
                  <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${counts.pctCumplido}%` }} />
                  <div className="bg-amber-400 h-full transition-all duration-300" style={{ width: `${counts.pctProceso}%` }} />
                  <div className="bg-sky-500 h-full transition-all duration-300" style={{ width: `${counts.pctProgramado}%` }} />
                  <div className="bg-zinc-300 dark:bg-slate-600 h-full transition-all duration-300" style={{ width: `${counts.pctSinPlazo}%` }} />
                </div>
                <div className="flex items-center gap-2.5 text-[11px] text-zinc-500 dark:text-slate-400 font-medium tabular-nums">
                  <span className="flex items-center gap-1" title={`Cumplido / Entregado (${counts.cumplido})`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{counts.cumplido}</span>
                  </span>
                  <span className="flex items-center gap-1" title={`En proceso / En curso (${counts.proceso})`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{counts.proceso}</span>
                  </span>
                  <span className="flex items-center gap-1" title={`Programado / Continuo (${counts.programado})`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                    <span>{counts.programado}</span>
                  </span>
                  <span className="flex items-center gap-1" title={`Sin plazo (${counts.sin_plazo})`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-slate-600" />
                    <span>{counts.sin_plazo}</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleExportCSV}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-zinc-50 dark:hover:bg-slate-700 border border-zinc-200 dark:border-slate-700 rounded-lg transition"
              title="Descargar matriz filtrada en CSV"
            >
              <Download className="w-3.5 h-3.5 text-zinc-500 dark:text-slate-400" />
              <span>Exportar CSV</span>
            </button>
          </div>

          {/* Barra de Controles y Filtros */}
          <div className="bg-zinc-50/50 dark:bg-slate-900/40 px-4 sm:px-6 py-3 space-y-2.5">
            {/* Fila 1: Píldoras de estado + Buscador + Conmutador de vistas */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
                <button
                  type="button"
                  onClick={() => setStatusFilter("ALL")}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition whitespace-nowrap ${
                    statusFilter === "ALL"
                      ? "bg-zinc-900 dark:bg-emerald-500 text-white dark:text-[#0F2942] border-zinc-900 dark:border-emerald-500"
                      : "bg-white dark:bg-slate-800 text-zinc-600 dark:text-slate-300 border-zinc-200 dark:border-slate-700 hover:bg-zinc-50 dark:hover:bg-slate-700"
                  }`}
                >
                  <span>Todos</span>
                  <span className="text-[10px] opacity-75 tabular-nums">{counts.total}</span>
                </button>

                {(["cumplido", "proceso", "programado", "sin_plazo"] as BoardStatusCat[]).map((cat) => {
                  const active = statusFilter === cat;
                  const meta = BOARD_STATUS_LABELS[cat];
                  const cnt = counts[cat];
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setStatusFilter(cat)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition whitespace-nowrap ${
                        active
                          ? "bg-zinc-900 dark:bg-emerald-500 text-white dark:text-[#0F2942] border-zinc-900 dark:border-emerald-500"
                          : "bg-white dark:bg-slate-800 text-zinc-600 dark:text-slate-300 border-zinc-200 dark:border-slate-700 hover:bg-zinc-50 dark:hover:bg-slate-700"
                      }`}
                    >
                      <StatusIcon cat={cat} className="w-3.5 h-3.5 shrink-0" />
                      <span>{meta.title}</span>
                      <span className="text-[10px] opacity-75 tabular-nums">{cnt}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar temática, entregable o actor..."
                    className="w-full pl-8 pr-7 py-1.5 text-xs bg-white dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 rounded-lg text-zinc-800 dark:text-slate-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-emerald-500 transition"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
                      title="Limpiar búsqueda"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Conmutador de Vistas */}
                <div className="inline-flex items-center bg-zinc-100 dark:bg-slate-800 p-0.5 rounded-lg border border-zinc-200 dark:border-slate-700 shrink-0">
                  <button
                    type="button"
                    onClick={() => setView("list")}
                    className={`p-1.5 rounded-md border transition ${
                      view === "list"
                        ? "bg-white dark:bg-slate-900 text-zinc-900 dark:text-emerald-400 border-zinc-200 dark:border-slate-700 shadow-2xs"
                        : "text-zinc-500 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-white border-transparent"
                    }`}
                    title="1. Lista minimalista agrupada por nivel"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("kanban")}
                    className={`p-1.5 rounded-md border transition ${
                      view === "kanban"
                        ? "bg-white dark:bg-slate-900 text-zinc-900 dark:text-emerald-400 border-zinc-200 dark:border-slate-700 shadow-2xs"
                        : "text-zinc-500 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-white border-transparent"
                    }`}
                    title="2. Tablero Kanban de 4 columnas"
                  >
                    <Columns3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("grid")}
                    className={`p-1.5 rounded-md border transition ${
                      view === "grid"
                        ? "bg-white dark:bg-slate-900 text-zinc-900 dark:text-emerald-400 border-zinc-200 dark:border-slate-700 shadow-2xs"
                        : "text-zinc-500 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-white border-transparent"
                    }`}
                    title="3. Matriz compacta de iconos"
                  >
                    <Grid2x2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Fila 2: Filtro rápido por nivel */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-0.5">
              <span className="text-[11px] font-medium text-zinc-400 mr-1 shrink-0">Nivel:</span>
              <button
                type="button"
                onClick={() => setLevelFilter("ALL")}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition whitespace-nowrap ${
                  levelFilter === "ALL"
                    ? "bg-zinc-200/80 dark:bg-slate-700 text-zinc-900 dark:text-white"
                    : "text-zinc-500 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-slate-800"
                }`}
              >
                Todos ({BOARD_LEVEL_ORDER.length})
              </button>
              {BOARD_LEVEL_ORDER.map((code) => {
                const lvl = BOARD_LEVELS[code];
                const active = levelFilter === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLevelFilter(code)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition whitespace-nowrap ${
                      active
                        ? "bg-zinc-200/80 dark:bg-slate-700 text-zinc-900 dark:text-white"
                        : "text-zinc-500 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {lvl.shortLabel} ({levelCounts[code]})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-zinc-200 dark:border-slate-800 rounded-xl">
            <p className="text-sm text-zinc-500 dark:text-slate-400">
              No hay compromisos que coincidan con los filtros seleccionados.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="mt-3 text-xs font-semibold text-zinc-900 dark:text-emerald-400 underline underline-offset-4"
            >
              Restablecer filtros
            </button>
          </div>
        ) : view === "list" ? (
          <div className="space-y-8">
            {BOARD_LEVEL_ORDER.map((code) => {
              const group = filteredItems.filter((i) => i.nivel === code);
              if (group.length === 0) return null;
              const lvl = BOARD_LEVELS[code];
              return (
                <div key={code}>
                  <div className="flex items-start justify-between gap-4 mb-2.5 px-1">
                    <div className="flex items-start gap-2 min-w-0">
                      <div className="mt-0.5">
                        <LevelIcon code={code} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs font-semibold tracking-tight text-zinc-900 dark:text-white leading-snug">
                          {lvl.title}
                        </h3>
                        <p className="text-[11px] text-zinc-400 dark:text-slate-400 mt-0.5">{lvl.note}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-zinc-500 dark:text-slate-300 bg-zinc-100 dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 px-2 py-0.5 rounded tabular-nums shrink-0">
                      {group.length}
                    </span>
                  </div>

                  <div className="border border-zinc-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900/60">
                    {group.map((item) => {
                      const st = BOARD_STATUS_LABELS[item.cat];
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className="group flex items-center justify-between gap-4 px-4 py-3 bg-white dark:bg-transparent hover:bg-zinc-50/90 dark:hover:bg-slate-800/60 border-b border-zinc-200 dark:border-slate-800 last:border-b-0 cursor-pointer transition"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <span title={item.estado}>
                              <StatusIcon cat={item.cat} />
                            </span>
                            <span className="p-1.5 rounded-md bg-zinc-50 dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 group-hover:bg-white dark:group-hover:bg-slate-700 transition">
                              <RubroIcon rubro={item.rubro} />
                            </span>
                            <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center sm:gap-2.5">
                              <span
                                className="text-xs font-semibold text-zinc-900 dark:text-white truncate sm:max-w-[260px] shrink-0"
                                title={item.tematica}
                              >
                                {item.tematica}
                              </span>
                              <span className="text-xs text-zinc-500 dark:text-slate-400 truncate">
                                {item.entregable}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 shrink-0">
                            <span
                              className="hidden md:inline-block text-[11px] font-medium text-zinc-600 dark:text-slate-300 bg-zinc-50 dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 px-2 py-0.5 rounded max-w-[190px] truncate"
                              title={item.responsable}
                            >
                              {item.responsable}
                            </span>
                            <span
                              className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${st.bg} ${st.text} ${st.border} whitespace-nowrap`}
                            >
                              {item.estado}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-zinc-300 dark:text-slate-600 group-hover:text-zinc-600 dark:group-hover:text-slate-300 transition" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : view === "kanban" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(["cumplido", "proceso", "programado", "sin_plazo"] as BoardStatusCat[]).map((cat) => {
              const st = BOARD_STATUS_LABELS[cat];
              const colItems = filteredItems.filter((i) => i.cat === cat);
              return (
                <div
                  key={cat}
                  className="bg-zinc-50/70 dark:bg-slate-900/60 border border-zinc-200 dark:border-slate-800 rounded-xl p-3 flex flex-col max-h-[75vh]"
                >
                  <div className="flex items-center justify-between px-1 pb-2.5 mb-2.5 border-b border-zinc-200 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-2">
                      <StatusIcon cat={cat} />
                      <span className="text-xs font-semibold text-zinc-800 dark:text-slate-100">{st.title}</span>
                    </div>
                    <span className="text-[11px] font-medium text-zinc-500 dark:text-slate-300 bg-white dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 px-1.5 py-0.5 rounded tabular-nums">
                      {colItems.length}
                    </span>
                  </div>

                  <div className="space-y-2 overflow-y-auto pr-0.5 flex-1">
                    {colItems.length === 0 ? (
                      <div className="py-10 text-center text-xs text-zinc-400">Sin elementos</div>
                    ) : (
                      colItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className="group p-3 bg-white dark:bg-slate-900 hover:bg-zinc-50/70 dark:hover:bg-slate-800/80 border border-zinc-200 dark:border-slate-800 hover:border-zinc-300 dark:hover:border-slate-700 rounded-lg cursor-pointer transition space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <RubroIcon rubro={item.rubro} />
                              <span
                                className="text-xs font-semibold text-zinc-900 dark:text-white truncate"
                                title={item.tematica}
                              >
                                {item.tematica}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-zinc-400 shrink-0">{item.nivel}</span>
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {item.entregable}
                          </p>
                          <div className="pt-1.5 border-t border-zinc-100 dark:border-slate-800 flex items-center justify-between gap-2 text-[11px]">
                            <span className="text-zinc-500 dark:text-slate-400 truncate">{item.responsable}</span>
                            <span className={`text-[10px] font-medium ${st.text} shrink-0`}>{item.estado}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group p-4 bg-white dark:bg-slate-900/70 hover:bg-zinc-50/60 dark:hover:bg-slate-800/80 border border-zinc-200 dark:border-slate-800 hover:border-zinc-300 dark:hover:border-slate-700 rounded-xl cursor-pointer transition flex flex-col justify-between gap-3.5"
              >
                <div className="flex items-start justify-between">
                  <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 group-hover:bg-white dark:group-hover:bg-slate-700 flex items-center justify-center transition">
                    <RubroIcon rubro={item.rubro} />
                  </div>
                  <div className="flex items-center gap-1.5" title={item.estado}>
                    <span className="text-[10px] font-mono text-zinc-400">{item.nivel}</span>
                    <StatusIcon cat={item.cat} />
                  </div>
                </div>
                <div>
                  <h3
                    className="text-xs font-semibold text-zinc-900 dark:text-white leading-snug line-clamp-2"
                    title={item.tematica}
                  >
                    {item.tematica}
                  </h3>
                  <p className="text-[11px] text-zinc-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.entregable}
                  </p>
                </div>
                <div className="pt-2.5 border-t border-zinc-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-zinc-500 dark:text-slate-400 truncate">{item.responsable}</span>
                  <span className="text-[10px] text-zinc-400 shrink-0">{item.estado}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Panel Lateral Deslizable (Drawer) en Portal global */}
      {selectedItem && (
        <ModalPortal>
          <div
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-[200] bg-zinc-900/40 dark:bg-black/60 backdrop-blur-[2px] flex justify-end animate-in fade-in duration-150"
          >
            <aside
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white dark:bg-slate-900 h-full border-l border-zinc-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
            >
              <div className="px-6 py-4 border-b border-zinc-200 dark:border-slate-800 flex items-center justify-between shrink-0">
                <span className="text-xs font-mono text-zinc-400">
                  Compromiso #{String(selectedItem.id).padStart(2, "0")} · Sección {selectedItem.nivel}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-slate-800 transition"
                  aria-label="Cerrar detalle"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                <div className="space-y-4">
                  {(() => {
                    const st = BOARD_STATUS_LABELS[selectedItem.cat];
                    return (
                      <div
                        className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium border ${st.bg} ${st.text} ${st.border}`}
                      >
                        <StatusIcon cat={selectedItem.cat} />
                        <span>{selectedItem.estado}</span>
                      </div>
                    );
                  })()}

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-zinc-50 dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 mt-0.5 shrink-0">
                      <RubroIcon rubro={selectedItem.rubro} />
                    </div>
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-white leading-snug">
                      {selectedItem.tematica}
                    </h3>
                  </div>
                </div>

                <div className="border-t border-zinc-200 dark:border-slate-800 pt-5 space-y-5">
                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                      ¿Qué debe hacerse? ¿Qué debe entregarse?
                    </label>
                    <p className="text-sm text-zinc-700 dark:text-slate-200 leading-relaxed bg-zinc-50/80 dark:bg-slate-800/60 p-3.5 rounded-lg border border-zinc-200 dark:border-slate-700">
                      {selectedItem.entregable}
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                      ¿Quién(es)?
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedItem.responsable.split(/\s*\+\s*|\s*\/\s*/).map((actor, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-medium text-zinc-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 px-2.5 py-1 rounded-md"
                        >
                          {actor.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                      Nivel de Gobierno
                    </label>
                    <div className="flex items-start gap-2.5 p-3 rounded-lg border border-zinc-200 dark:border-slate-800 bg-white dark:bg-slate-800/40">
                      <div className="mt-0.5 shrink-0">
                        <LevelIcon code={selectedItem.nivel} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-zinc-900 dark:text-white leading-snug">
                          {BOARD_LEVELS[selectedItem.nivel]?.title || selectedItem.nivel}
                        </div>
                        <div className="text-[11px] text-zinc-500 dark:text-slate-400 mt-1">
                          {BOARD_LEVELS[selectedItem.nivel]?.note}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </ModalPortal>
      )}
    </section>
  );
}
