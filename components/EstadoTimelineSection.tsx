"use client";

import { useState } from "react";
import {
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  AlertTriangle,
  Users,
  Building,
  Landmark,
  Building2,
  ChevronRight,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  HelpCircle,
  FileText,
  BadgeAlert,
} from "lucide-react";
import { stateGlossaryList } from "@/lib/propuesta2-data";

interface TimelineMilestone {
  id: number;
  title: string;
  date: string;
  badge: "Cumplido" | "Continuo" | "Con fecha" | "Pendiente (Sin compromisos)" | "Programado" | "Meta";
  badgeClass: string;
  actor: string;
  description: string;
  isSpecialNotice?: boolean;
}

export function EstadoTimelineSection() {
  const [selectedMilestone, setSelectedMilestone] = useState<number>(5); // default on the FAM pending milestone or critical deadline

  const timelineMilestones: TimelineMilestone[] = [
    {
      id: 1,
      title: "Diagnóstico Técnico y Censo 2024",
      date: "Enero – Julio 2026",
      badge: "Cumplido",
      badgeClass: "bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700",
      actor: "MEFP + Viceministerio de Autonomías + Técnicos GAD",
      description: "Consolidación de las bases demográficas y financieras territoriales compartidas entre el Nivel Central del Estado y las 9 gobernaciones.",
    },
    {
      id: 2,
      title: "Firma del Acuerdo N° 001/2026 en Sucre",
      date: "5 de Agosto de 2026",
      badge: "Cumplido",
      badgeClass: "bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700",
      actor: "Presidente del Estado y 9 Gobernadores Departamentales",
      description: "Suscripción histórica en la Casa de la Libertad que fija la ruta de descentralización tributaria, alivio financiero y la reforma de la Ley 154.",
    },
    {
      id: 3,
      title: "Suscripción del Acuerdo N° 002/2026",
      date: "Septiembre 2026",
      badge: "Cumplido",
      badgeClass: "bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700",
      actor: "Gobierno Nacional + 10 GAM (Capitales + El Alto) + AMB",
      description: "Acuerdo de 15 puntos prioritarios: análisis FPIEEH, sostenibilidad hospitalaria en 1er y 2do nivel, y flexibilización de 25 condicionalidades del gasto.",
    },
    {
      id: 4,
      title: "Instalación de Mesas Técnicas de Coordinación",
      date: "Proceso Permanente",
      badge: "Continuo",
      badgeClass: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700",
      actor: "NCE + GAD + GAM",
      description: "Reuniones interinstitucionales de trabajo continuo en torno a los tres ejes estratégicos de la Agenda: Fiscal, Competencial y Normativo.",
    },
    {
      id: 5,
      title: "Reunión de Articulación con la FAM-Bolivia",
      date: "En proceso / Por definir",
      badge: "Pendiente (Sin compromisos)",
      badgeClass: "bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border-amber-400 dark:border-amber-600 font-black animate-pulse",
      actor: "Gobierno Nacional + Federación de Asociaciones Municipales (FAM)",
      description: "Hito de articulación con los municipios del país. NOTA TÉCNICA OFICIAL: Actualmente este proceso se encuentra pendiente y NO cuenta aún con compromisos formalizados, a la espera de coordinar la suscripción de acuerdos con el NCE.",
      isSpecialNotice: true,
    },
    {
      id: 6,
      title: "Plazo Crítico 1: Respuesta Técnica FPIEEH",
      date: "14 de Octubre de 2026 (12 días)",
      badge: "Con fecha",
      badgeClass: "bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700",
      actor: "Min. Hidrocarburos + MEFP",
      description: "Entrega del informe técnico de viabilidad para suspender el 12% del FPIEEH a los GAM en 2027, devolver lo retenido en 2025 o aplicarlo progresivamente.",
    },
    {
      id: 7,
      title: "Plazo Crítico 2: Proyecto de Ley Modificación Ley 154",
      date: "3 de Noviembre de 2026 (32 días)",
      badge: "Con fecha",
      badgeClass: "bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700",
      actor: "MEFP + 9 Gobiernos Departamentales",
      description: "Presentación formal del texto del Proyecto de Ley que amplía el dominio tributario departamental y crea nuevos gravámenes propios.",
    },
    {
      id: 8,
      title: "Plenario del Consejo Nacional de Autonomías",
      date: "Noviembre 2026",
      badge: "Programado",
      badgeClass: "bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700",
      actor: "Consejo Nacional de Autonomías + ALP",
      description: "Consolidación de las propuestas en el Gran Acuerdo Nacional y remisión del paquete normativo a la Asamblea Legislativa Plurinacional.",
    },
    {
      id: 9,
      title: "Entrada en Vigencia del Régimen Fiscal 50/50",
      date: "1 de Enero de 2027",
      badge: "Meta",
      badgeClass: "bg-emerald-500 text-slate-950 font-black border-emerald-400",
      actor: "Estado Plurinacional de Bolivia",
      description: "Aplicación efectiva de la Ley Especial de Coparticipación, autonomía presupuestaria plena y readecuación financiera en los presupuestos subnacionales.",
    },
  ];

  const activeMilestoneData =
    timelineMilestones.find((m) => m.id === selectedMilestone) || timelineMilestones[4];

  return (
    <section id="linea-tiempo" className="py-20 bg-white dark:bg-[#0B111A] border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="container-page">
        {/* ================= 1. GLOSARIO DE ESTADOS ================= */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-500/30 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
                <BadgeAlert size={14} />
                Sistema Didáctico de Seguimiento
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Glosario de Estados
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium max-w-2xl leading-relaxed">
                Cada compromiso cuenta con una etiqueta de color codificada que permite identificar de forma intuitiva su naturaleza temporal, su exigibilidad o su grado de cumplimiento.
              </p>
            </div>
          </div>

          {/* Glossary Badges Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stateGlossaryList.map((item) => (
              <div
                key={item.state}
                className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#131B28] p-5 shadow-2xs hover:shadow-sm transition"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${item.badgeClass}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${item.dotColor}`}></span>
                    {item.label}
                  </span>

                  <span className="rounded-lg bg-white dark:bg-slate-800 px-2 py-0.5 text-xs font-extrabold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {item.count} ítems
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ================= 2. LÍNEA DE TIEMPO INTERACTIVA ================= */}
        <div>
          <div className="mb-10 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-500/30 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-blue-800 dark:text-blue-300">
              <Calendar size={14} />
              Ruta Crítica Institucional
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Línea de Tiempo y Próximos Hitos
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              Recorrido cronológico desde los primeros acuerdos hasta la aplicación presupuestaria 2027. Incluye hitos cumplidos, plazos activos y la reunión pendiente con la FAM.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left Column: Interactive Milestone List */}
            <div className="lg:col-span-6 space-y-3">
              {timelineMilestones.map((m) => {
                const isSelected = selectedMilestone === m.id;

                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMilestone(m.id)}
                    className={`w-full rounded-2xl p-4 text-left transition-all duration-200 border cursor-pointer ${
                      isSelected
                        ? "bg-[#0F2942] dark:bg-slate-800 text-white border-[#0F2942] dark:border-slate-700 shadow-md scale-[1.01]"
                        : "bg-slate-50 dark:bg-[#151D2A] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                            isSelected
                              ? "bg-emerald-400 text-slate-950"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          0{m.id}
                        </span>

                        <span className="font-extrabold text-xs sm:text-sm leading-snug">
                          {m.title}
                        </span>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0 ${m.badgeClass}`}
                      >
                        {m.badge}
                      </span>
                    </div>

                    <div
                      className={`ml-10 mt-1.5 text-xs font-semibold ${
                        isSelected ? "text-slate-300" : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {m.date}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Selected Milestone Detail Card */}
            <div className="lg:col-span-6 sticky top-24">
              <div
                className={`rounded-[32px] border p-6 sm:p-8 shadow-md transition-all duration-300 ${
                  activeMilestoneData.isSpecialNotice
                    ? "bg-gradient-to-br from-amber-50/90 via-white to-amber-50/50 dark:from-[#1b1913] dark:via-[#151d2a] dark:to-[#171a22] border-amber-300 dark:border-amber-700"
                    : "bg-slate-50/80 dark:bg-[#151D2A] border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-5">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-600 dark:text-emerald-400">
                    <Calendar size={15} />
                    <span>{activeMilestoneData.date}</span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${activeMilestoneData.badgeClass}`}
                  >
                    {activeMilestoneData.badge}
                  </span>
                </div>

                <div className="text-4xl sm:text-5xl font-black text-slate-200 dark:text-slate-800 mb-2 font-mono">
                  Hito 0{activeMilestoneData.id}
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  {activeMilestoneData.title}
                </h3>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                    Participantes:
                  </span>
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                    {activeMilestoneData.actor}
                  </span>
                </div>

                <div className="mt-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-5">
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                    {activeMilestoneData.description}
                  </p>
                </div>

                {/* Highlight box if this is the FAM meeting */}
                {activeMilestoneData.isSpecialNotice && (
                  <div className="mt-4 rounded-2xl bg-amber-100/70 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 p-4 text-xs text-amber-900 dark:text-amber-200 font-semibold leading-relaxed">
                    <strong className="block text-amber-950 dark:text-amber-100 mb-1">
                      ⚠️ Estado Especial FAM-Bolivia:
                    </strong>
                    A diferencia de los Gobiernos Departamentales (Acuerdo 001) y las Ciudades Capitales + El Alto (Acuerdo 002), la Federación de Asociaciones Municipales de Bolivia (FAM) se encuentra en etapa de diálogo preliminar y actualmente <strong>no cuenta con compromisos suscritos ni metas formalizadas</strong> en la matriz oficial.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
