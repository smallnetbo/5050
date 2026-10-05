"use client";

import { useState, useMemo } from "react";
import {
  commitmentLevels,
  commitmentsData,
  CommitmentItem,
} from "@/lib/commitments-data";
import {
  Landmark,
  Building2,
  Building,
  Layers,
  Search,
  CheckCircle2,
  Clock,
  Calendar,
  Filter,
  FileText,
  AlertCircle,
  Sparkles,
  ArrowUpDown,
  ChevronDown,
  Info,
  X,
  ExternalLink,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Landmark,
  Building2,
  Building,
  Layers,
};

interface LevelCommitmentsProps {
  commitments?: CommitmentItem[];
}

export function LevelCommitments({ commitments: propCommitments }: LevelCommitmentsProps = {}) {
  const itemsList = propCommitments && propCommitments.length > 0 ? propCommitments : commitmentsData;
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<CommitmentItem | null>(null);

  // Filtrado reactivo
  const filteredItems = useMemo(() => {
    return itemsList.filter((item) => {
      // Filtro por nivel
      const matchesLevel =
        selectedLevel === "all" || item.levelId === selectedLevel;

      // Filtro por búsqueda
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.commitment.toLowerCase().includes(q) ||
        item.deliverable.toLowerCase().includes(q) ||
        item.responsible.toLowerCase().includes(q) ||
        (item.category && item.category.toLowerCase().includes(q));

      // Filtro por estado
      let matchesStatus = true;
      if (statusFilter === "deadline") {
        matchesStatus = Boolean(item.deadlineDate || item.status.includes("/"));
      } else if (statusFilter === "completed") {
        matchesStatus =
          item.status.toLowerCase().includes("cumplido") ||
          item.status.toLowerCase().includes("entregado");
      } else if (statusFilter === "in_progress") {
        matchesStatus =
          item.status.toLowerCase().includes("curso") ||
          item.status.toLowerCase().includes("continuo") ||
          item.status.toLowerCase().includes("permanente") ||
          item.status.toLowerCase().includes("convocatoria");
      } else if (statusFilter === "no_deadline") {
        matchesStatus = item.status.toLowerCase().includes("sin plazo");
      }

      return matchesLevel && matchesSearch && matchesStatus;
    });
  }, [selectedLevel, searchQuery, statusFilter]);

  // Helper para badge de estado visual
  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("cumplido") || s.includes("entregado")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40">
          <CheckCircle2 size={12} /> {status}
        </span>
      );
    }
    if (status.includes("/")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/50 shadow-2xs">
          <Clock size={12} className="text-amber-600" /> {status}
        </span>
      );
    }
    if (s.includes("continuo") || s.includes("permanente") || s.includes("curso")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300/40">
          <Sparkles size={12} /> {status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
        {status}
      </span>
    );
  };

  // Helper para badge de nivel
  const getLevelBadge = (levelId: string) => {
    switch (levelId) {
      case "nce":
        return {
          label: "Nivel Central",
          cls: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-300/30",
        };
      case "gad":
        return {
          label: "Gobernaciones",
          cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300/30",
        };
      case "gam":
        return {
          label: "Municipios",
          cls: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300/30",
        };
      case "conjunto":
      default:
        return {
          label: "Conjunto",
          cls: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-300/30",
        };
    }
  };

  return (
    <section
      id="compromisos"
      className="bg-white dark:bg-[#0B111A] py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300"
    >
      <div className="container-page max-w-6xl space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 text-xs font-black uppercase text-emerald-800 dark:text-emerald-400">
              Matriz de Responsabilidades & Entregables
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Compromisos por Nivel
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-300 font-medium">
              Tabla interactiva que detalla quién remite cada entregable, con responsabilidades técnicas, plazos y alcances normativos acordados entre el Nivel Central, las Gobernaciones y los Municipios.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-black">
              Total: {itemsList.length} Compromisos Oficiales
            </div>
          </div>
        </div>

        {/* Level Tabs (Navegación Interactiva por Nivel) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <button
            onClick={() => setSelectedLevel("all")}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedLevel === "all"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md font-black scale-[1.01]"
                : "bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">
                Vista Integral
              </span>
              <span className="text-xs font-black">{itemsList.length}</span>
            </div>
            <div className="mt-1 text-sm font-black truncate">Todos los Niveles</div>
          </button>

          {commitmentLevels.map((lvl) => {
            const Icon = iconMap[lvl.iconName] || Landmark;
            const isSelected = selectedLevel === lvl.id;
            const lvlCount = itemsList.filter((i) => i.levelId === lvl.id).length;

            return (
              <button
                key={lvl.id}
                onClick={() => setSelectedLevel(lvl.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md font-black scale-[1.01]"
                    : "bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-75 truncate max-w-[80px]">
                    {lvl.badge}
                  </span>
                  <span className="text-xs font-black">{lvlCount}</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm font-black truncate">
                  <Icon size={14} className="shrink-0" />
                  <span className="truncate">{lvl.shortName}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Buscar compromiso, entregable o entidad responsable..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <Filter size={15} className="text-slate-400 hidden sm:inline" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Todos los plazos ({commitmentsData.length})</option>
              <option value="deadline">Con fecha límite estipulada</option>
              <option value="completed">Cumplidos / Entregados</option>
              <option value="in_progress">En curso / Continuo</option>
              <option value="no_deadline">Sin plazo fijo</option>
            </select>

            <span className="text-xs font-bold text-slate-500 shrink-0">
              ({filteredItems.length} resultados)
            </span>
          </div>
        </div>

        {/* Interactive Table View (Desktop) */}
        <div className="hidden lg:block overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">
                  <th className="py-4 px-5 w-44">Compromiso</th>
                  <th className="py-4 px-5">¿Qué debe entregar realmente?</th>
                  <th className="py-4 px-5 w-48">Quién</th>
                  <th className="py-4 px-5 text-center w-36">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredItems.map((item) => {
                  const lvlBadge = getLevelBadge(item.levelId);

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      {/* 1. Compromiso */}
                      <td className="py-4 px-5 align-top">
                        <div className="font-black text-slate-900 dark:text-white text-sm">
                          {item.commitment}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          {selectedLevel === "all" && (
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${lvlBadge.cls}`}
                            >
                              {lvlBadge.label}
                            </span>
                          )}
                          {item.category && (
                            <span className="text-[10px] font-bold text-slate-400">
                              • {item.category}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 2. ¿Qué debe entregar realmente? */}
                      <td className="py-4 px-5 align-top">
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                          {item.deliverable}
                        </p>
                      </td>

                      {/* 3. Quién */}
                      <td className="py-4 px-5 align-top">
                        <span className="font-extrabold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg inline-block">
                          {item.responsible}
                        </span>
                      </td>

                      {/* 4. Estado */}
                      <td className="py-4 px-5 align-top text-center whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile / Tablet Cards View */}
        <div className="lg:hidden space-y-3">
          {filteredItems.map((item) => {
            const lvlBadge = getLevelBadge(item.levelId);

            return (
              <article
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-3 cursor-pointer hover:border-emerald-500/40 transition"
              >
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${lvlBadge.cls}`}
                      >
                        {lvlBadge.label}
                      </span>
                      {item.category && (
                        <span className="text-[10px] font-bold text-slate-400">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <h3 className="font-black text-slate-900 dark:text-white text-base">
                      {item.commitment}
                    </h3>
                  </div>
                  <div>{getStatusBadge(item.status)}</div>
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 block">
                    ¿Qué debe entregar realmente?
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium mt-0.5">
                    {item.deliverable}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold">Quién:</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    {item.responsible}
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* Modal Detalle de Compromiso */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X size={20} />
              </button>

              <div>
                <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                  {selectedItem.levelName}
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                  {selectedItem.commitment}
                </h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                    ¿Qué debe entregar realmente?
                  </span>
                  <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                    {selectedItem.deliverable}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Quién Remite
                    </span>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200 mt-0.5 block">
                      {selectedItem.responsible}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Estado / Plazo
                    </span>
                    <div className="mt-1">{getStatusBadge(selectedItem.status)}</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black transition"
                >
                  Cerrar Detalle
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
