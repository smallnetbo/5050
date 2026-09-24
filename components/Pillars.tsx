"use client";

import { useState } from "react";
import { ArrowRight, X, Scale, LockOpen, Briefcase, Landmark, PieChart, TrendingUp, Building2, Globe, ShieldCheck, Coins, CheckCircle2 } from "lucide-react";
import { pillars as defaultPillars, Pillar } from "@/lib/agenda-data";

interface PillarsProps {
  pillars?: Pillar[];
}

export function Pillars({ pillars: propPillars }: PillarsProps = {}) {
  const pillarsList = propPillars && propPillars.length > 0 ? propPillars : defaultPillars;
  const [selectedPillar, setSelectedPillar] = useState<Pillar | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Todos");

  const categories = ["Todos", "Fiscal", "Competencial", "Institucional", "Normativo"];

  const filteredPillars = activeTab === "Todos"
    ? pillarsList
    : pillarsList.filter((p) => p.category === activeTab);

  const getPillarIcon = (name: string) => {
    switch (name) {
      case "Scale": return <Scale size={24} />;
      case "LockOpen": return <LockOpen size={24} />;
      case "Briefcase": return <Briefcase size={24} />;
      case "Landmark": return <Landmark size={24} />;
      case "PieChart": return <PieChart size={24} />;
      case "TrendingUp": return <TrendingUp size={24} />;
      case "Building2": return <Building2 size={24} />;
      case "Globe": return <Globe size={24} />;
      case "ShieldCheck": return <ShieldCheck size={24} />;
      case "Coins": return <Coins size={24} />;
      default: return <Scale size={24} />;
    }
  };

  return (
    <section id="pilares" className="bg-white dark:bg-[#101620] py-20 transition-colors duration-300">
      <div className="container-page">
        {/* Section Header & Category Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <span className="inline-block rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 px-3 py-1.5 text-xs font-black uppercase text-emerald-800 dark:text-emerald-400 tracking-wide">
              Ejes Estructurales
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Los Pilares Temáticos del Acuerdo
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-300 font-medium">
              El Acuerdo N° 001/2026 prioriza estas materias para fortalecer las autonomías y garantizar la equidad fiscal.
            </p>
          </div>

          {/* Tab Filters */}
          <div className="flex flex-wrap gap-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1.5 border border-slate-200 dark:border-slate-700">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`rounded-xl px-4 py-2 text-xs font-extrabold transition-all ${
                  activeTab === cat
                    ? "bg-[#0F2942] text-white dark:bg-emerald-500 dark:text-[#0F2942] shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid Mosaico */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPillars.map((p) => {
            const sequentialNumber = pillarsList.findIndex((item) => item.id === p.id) + 1;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPillar(p)}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-[#151D2A] p-7 text-left transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:bg-white dark:hover:bg-slate-800/80 hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0F2942] dark:bg-emerald-500/20 text-emerald-400 border border-transparent dark:border-emerald-500/30 group-hover:bg-emerald-600 dark:group-hover:bg-emerald-500 group-hover:text-white dark:group-hover:text-[#0F2942] transition-colors shadow-xs">
                        {getPillarIcon(p.iconName)}
                      </div>
                      <span className="rounded-full bg-slate-200/70 dark:bg-slate-800 px-3 py-1 text-[11px] font-black uppercase text-slate-700 dark:text-slate-300">
                        {p.category}
                      </span>
                    </div>
                    <span className="text-xs font-black text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      Eje #{String(sequentialNumber).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-medium line-clamp-3">
                    {p.summary}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>Ver acciones acordadas ({p.actions.length})</span>
                  <ArrowRight size={16} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Pillar Detail Modal */}
        {selectedPillar && (
          <div
            className="fixed inset-0 z-[100] grid place-items-center bg-[#0F2942]/70 dark:bg-black/80 backdrop-blur-md p-4 animate-in fade-in"
            onClick={() => setSelectedPillar(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[32px] bg-white dark:bg-[#151D2A] p-8 shadow-2xl border border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 px-2.5 py-1 text-xs font-black uppercase text-emerald-800 dark:text-emerald-400">
                      Pilar N° {pillarsList.findIndex((item) => item.id === selectedPillar.id) + 1} · {selectedPillar.category}
                    </span>
                  </div>
                  <h3 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                    {selectedPillar.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedPillar(null)}
                  className="rounded-full bg-slate-100 dark:bg-slate-800 p-2.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                  aria-label="Cerrar modal"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Resumen de la Medida</h4>
                  <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                    {selectedPillar.summary}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                    Acciones Acordadas (Compromisos Concretos)
                  </h4>
                  <ul className="mt-3 space-y-3">
                    {selectedPillar.actions.map((act, i) => (
                      <li key={i} className="flex gap-3 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200 font-medium bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">Acuerdo N° 001/2026 de Sucre</span>
                <button
                  onClick={() => setSelectedPillar(null)}
                  className="rounded-xl bg-[#0F2942] dark:bg-emerald-500 hover:bg-slate-800 dark:hover:bg-emerald-400 text-white dark:text-[#0F2942] px-5 py-2.5 text-xs font-extrabold transition"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}