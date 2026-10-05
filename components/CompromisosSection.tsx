"use client";

import { useState, useMemo } from "react";
import {
  Layers,
  Search,
  Clock,
  CheckCircle2,
  Calendar,
  Building,
  Landmark,
  Building2,
  Users2,
  Filter,
  CheckCheck,
  AlertCircle,
  HelpCircle,
  FileCheck2,
  Tag,
  Sparkles,
} from "lucide-react";
import {
  commitmentsData,
  CommitmentItem,
  CommitmentState,
  stateGlossaryList,
} from "@/lib/propuesta2-data";

export function CompromisosSection() {
  const [activeLevel, setActiveLevel] = useState<"nce" | "gad" | "gam" | "conjunto">("nce");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>("all");

  const levelTabs = [
    {
      id: "nce" as const,
      label: "Presidente / NCE",
      sublabel: "Gobierno Nacional",
      icon: Landmark,
      color: "from-blue-600 to-indigo-700",
      activeBorder: "border-blue-500",
      total: commitmentsData.filter((c) => c.level === "nce").length,
    },
    {
      id: "gad" as const,
      label: "GAD Departamentales",
      sublabel: "9 Gobernaciones",
      icon: Building,
      color: "from-emerald-600 to-teal-700",
      activeBorder: "border-emerald-500",
      total: commitmentsData.filter((c) => c.level === "gad").length,
    },
    {
      id: "gam" as const,
      label: "GAM & AMB",
      sublabel: "9 Capitales + El Alto",
      icon: Building2,
      color: "from-purple-600 to-pink-700",
      activeBorder: "border-purple-500",
      total: commitmentsData.filter((c) => c.level === "gam").length,
    },
    {
      id: "conjunto" as const,
      label: "Compromisos Conjuntos",
      sublabel: "Mesas y Acuerdo Nacional",
      icon: Users2,
      color: "from-amber-600 to-orange-700",
      activeBorder: "border-amber-500",
      total: commitmentsData.filter((c) => c.level === "conjunto").length,
    },
  ];

  const currentLevelCommitments = useMemo(() => {
    return commitmentsData.filter((c) => c.level === activeLevel);
  }, [activeLevel]);

  const filteredCommitments = useMemo(() => {
    return currentLevelCommitments.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.deliverable.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.responsible.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesState =
        selectedStateFilter === "all" || item.state === selectedStateFilter;

      return matchesSearch && matchesState;
    });
  }, [currentLevelCommitments, searchQuery, selectedStateFilter]);

  // Statistics for active tab
  const stats = useMemo(() => {
    const total = currentLevelCommitments.length;
    const conFecha = currentLevelCommitments.filter((c) => c.state === "con_fecha").length;
    const continuo = currentLevelCommitments.filter((c) => c.state === "continuo").length;
    const sinPlazo = currentLevelCommitments.filter((c) => c.state === "sin_plazo").length;
    const cumplido = currentLevelCommitments.filter((c) => c.state === "cumplido" || c.state === "entregado").length;
    const enCurso = currentLevelCommitments.filter((c) => c.state === "en_curso").length;
    return { total, conFecha, continuo, sinPlazo, cumplido, enCurso };
  }, [currentLevelCommitments]);

  const getStateBadge = (item: CommitmentItem) => {
    switch (item.state) {
      case "con_fecha":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700">
            <Clock size={12} />
            {item.deadline ? `Fecha: ${item.deadline}` : item.stateLabel}
          </span>
        );
      case "continuo":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Continuo
          </span>
        );
      case "cumplido":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
            <CheckCircle2 size={12} />
            {item.stateLabel}
          </span>
        );
      case "entregado":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700">
            <FileCheck2 size={12} />
            Entregado
          </span>
        );
      case "en_curso":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
            <Clock size={12} />
            En curso
          </span>
        );
      case "sin_plazo":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-700">
            <Calendar size={12} />
            Sin plazo
          </span>
        );
    }
  };

  return (
    <section id="compromisos" className="py-20 bg-slate-50 dark:bg-[#101620] border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="container-page">
        {/* Section Header */}
        <div className="mb-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-500/30 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
            <Layers size={14} />
            Matriz de Responsabilidades
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Compromisos por Nivel de Gobierno
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Consulte de forma interactiva y detallada cada compromiso, con explicación exacta del entregable, la entidad responsable y el estado en el cronograma institucional.
          </p>
        </div>

        {/* Level Navigation Tabs (A, B, C, D) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {levelTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeLevel === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveLevel(tab.id);
                  setSelectedStateFilter("all");
                }}
                className={`relative rounded-2xl p-4 sm:p-5 text-left transition-all duration-200 border cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? "bg-[#0F2942] dark:bg-slate-800 text-white border-[#0F2942] dark:border-slate-700 shadow-lg scale-[1.02]"
                    : "bg-white dark:bg-[#151D2A] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-100/70 dark:hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isActive
                        ? "bg-emerald-400 text-slate-950 font-black"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <Icon size={20} />
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {tab.total}
                  </span>
                </div>

                <div>
                  <h3 className="font-black text-sm sm:text-base leading-tight">
                    {tab.label}
                  </h3>
                  <span
                    className={`text-[11px] font-semibold block mt-0.5 ${
                      isActive ? "text-slate-300" : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {tab.sublabel}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Filter and Search Bar */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151D2A] p-4 sm:p-5 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-500" size={17} />
              <input
                type="text"
                placeholder={`Buscar entre los ${currentLevelCommitments.length} compromisos de este nivel...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Quick State Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 mr-1 hidden sm:inline">
                Filtrar estado:
              </span>
              <button
                onClick={() => setSelectedStateFilter("all")}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer text-xs ${
                  selectedStateFilter === "all"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                Todos ({stats.total})
              </button>
              {stats.conFecha > 0 && (
                <button
                  onClick={() => setSelectedStateFilter("con_fecha")}
                  className={`px-2.5 py-1.5 rounded-xl transition cursor-pointer text-xs ${
                    selectedStateFilter === "con_fecha"
                      ? "bg-rose-600 text-white font-black"
                      : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 hover:bg-rose-100"
                  }`}
                >
                  Con fecha ({stats.conFecha})
                </button>
              )}
              {stats.continuo > 0 && (
                <button
                  onClick={() => setSelectedStateFilter("continuo")}
                  className={`px-2.5 py-1.5 rounded-xl transition cursor-pointer text-xs ${
                    selectedStateFilter === "continuo"
                      ? "bg-emerald-600 text-white font-black"
                      : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100"
                  }`}
                >
                  Continuo ({stats.continuo})
                </button>
              )}
              {stats.cumplido > 0 && (
                <button
                  onClick={() => setSelectedStateFilter("cumplido")}
                  className={`px-2.5 py-1.5 rounded-xl transition cursor-pointer text-xs ${
                    selectedStateFilter === "cumplido"
                      ? "bg-blue-600 text-white font-black"
                      : "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 hover:bg-blue-100"
                  }`}
                >
                  Cumplido ({stats.cumplido})
                </button>
              )}
              {stats.sinPlazo > 0 && (
                <button
                  onClick={() => setSelectedStateFilter("sin_plazo")}
                  className={`px-2.5 py-1.5 rounded-xl transition cursor-pointer text-xs ${
                    selectedStateFilter === "sin_plazo"
                      ? "bg-purple-600 text-white font-black"
                      : "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 hover:bg-purple-100"
                  }`}
                >
                  Sin plazo ({stats.sinPlazo})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Commitments Cards Grid */}
        {filteredCommitments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center">
            <HelpCircle size={36} className="mx-auto text-slate-400 mb-3" />
            <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
              No se encontraron compromisos
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Prueba cambiando el término de búsqueda o seleccionando otro filtro de estado.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCommitments.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151D2A] p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    {getStateBadge(item)}

                    {item.isAmbSpecific && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-pink-100 dark:bg-pink-950/60 text-pink-800 dark:text-pink-300 px-2 py-0.5 text-[10px] font-black uppercase">
                        <Sparkles size={10} />
                        Entrega AMB
                      </span>
                    )}

                    {item.category && !item.isAmbSpecific && (
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        {item.category}
                      </span>
                    )}
                  </div>

                  {/* Commitment Title */}
                  <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                    {item.name}
                  </h4>

                  {/* Responsible Entity Badge */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                      Quién:
                    </span>
                    <span className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-black text-slate-700 dark:text-slate-300">
                      {item.responsible}
                    </span>
                  </div>

                  {/* Deliverable Explanation Box */}
                  <div className="mt-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/70 p-3.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                      ¿Qué debe entregar realmente?
                    </span>
                    <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.deliverable}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Status indicator tag */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                  <span>ID: {item.id}</span>
                  <span className="font-extrabold text-slate-700 dark:text-slate-300">
                    {item.state === "con_fecha"
                      ? "⚠️ Alta Prioridad"
                      : item.state === "continuo"
                      ? "🔄 Permanente"
                      : item.state === "cumplido" || item.state === "entregado"
                      ? "✅ Finalizado"
                      : "📋 En Formulación"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
