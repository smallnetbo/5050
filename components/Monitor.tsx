"use client";

import { useState, useEffect } from "react";
import {
  MonitorConfig,
  MonitorMetric,
  defaultMonitorConfig,
  defaultMonitorMetrics,
} from "@/lib/agenda-data";
import {
  Clock,
  Scale,
  Building,
  CheckCircle2,
  TrendingUp,
  Users,
  Calendar,
  ShieldCheck,
  FileText,
  Sparkles,
  Activity,
  Award,
  AlertCircle,
  BarChart3,
  Flame,
  Globe2,
  ChevronRight,
} from "lucide-react";

interface MonitorProps {
  config?: MonitorConfig;
  metrics?: MonitorMetric[];
}

const iconMap: Record<string, React.ElementType> = {
  Clock,
  Scale,
  Building,
  CheckCircle2,
  TrendingUp,
  Users,
  Calendar,
  ShieldCheck,
  FileText,
  Sparkles,
  Activity,
  Award,
  AlertCircle,
  BarChart3,
  Flame,
  Globe2,
};

export function Monitor({
  config = defaultMonitorConfig,
  metrics = defaultMonitorMetrics,
}: MonitorProps) {
  // Live Countdown Calculation for Main Priority Milestone
  const targetDateStr = config?.countdownTargetDate || "2026-11-03T23:59:59";
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [nowTime, setNowTime] = useState<number>(Date.now());

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      setNowTime(now);
      const targetTime = new Date(targetDateStr).getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, mins, secs });
      } else {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDateStr]);

  const activeMetrics = (metrics || []).filter((m) => m.active);

  // Helper para formatear fecha a dd/mm/aaaa
  const formatDateDisplay = (dateString?: string) => {
    if (!dateString) return "—";
    if (dateString.includes("/")) return dateString;
    try {
      const parts = dateString.split("T")[0].split("-");
      if (parts.length === 3) {
        const [year, month, day] = parts;
        return `${day}/${month}/${year}`;
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  // Helper para calcular días restantes de cada fila de la lista
  const calculateDaysLeft = (deadline?: string, fallbackValue?: string) => {
    if (!deadline) {
      if (fallbackValue) return fallbackValue.replace(/[^0-9]/g, "") || fallbackValue;
      return "—";
    }
    try {
      const target = new Date(deadline.includes("T") ? deadline : `${deadline}T23:59:59`).getTime();
      const diff = target - nowTime;
      if (diff <= 0) return "0";
      return Math.ceil(diff / (1000 * 60 * 60 * 24)).toString();
    } catch {
      return fallbackValue || "—";
    }
  };

  return (
    <section
      id="monitor"
      className="bg-[#F9F8F5] dark:bg-[#101620] py-16 sm:py-24 border-y border-amber-900/10 dark:border-amber-500/20 text-[#1B2533] dark:text-white transition-colors duration-500"
    >
      <div className="container-page max-w-5xl space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 text-xs font-black uppercase text-emerald-800 dark:text-emerald-400">
            {config.sectionBadge || "Monitoreo en Tiempo Real"}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {config.sectionTitle || "Indicadores & Plazos"}
          </h2>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300 font-medium">
            {config.sectionSubtitle ||
              "Seguimiento técnico del avance de los compromisos del Acuerdo N° 001/2026."}
          </p>
        </div>

        {/* 1. Hito Prioritario en Curso (Banner de Cuenta Regresiva ajustado según captura) */}
        {config.showCountdown !== false && (
          <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#dd3146] via-[#be1c30] to-[#1B2533] p-8 text-white shadow-xl relative border border-[#fcc74f]/20">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-[#fcc74f]/10 blur-2xl pointer-events-none"></div>

            <div className="grid gap-6 md:grid-cols-12 items-center relative z-10">
              <div className="md:col-span-6 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-[#fcc74f] text-[#dd3146] px-2.5 py-1 text-xs font-black uppercase tracking-wider inline-block">
                    {config.countdownBadge || "Hito Prioritario en Curso"}
                  </span>
                  {config.countdownResponsible && (
                    <span className="rounded-md bg-white/15 backdrop-blur-md px-2.5 py-1 text-xs font-extrabold text-amber-200 border border-white/10">
                      Responsable: {config.countdownResponsible}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-black text-white leading-tight">
                  {config.countdownTitle || "Cuenta Regresiva: Proyecto de Ley modificación Ley 154"}
                </h3>

                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  {config.countdownDescription ||
                    "Texto de Proyecto de Ley que permita a los departamentos crear o modificar sus propios impuestos y ampliar su dominio tributario."}
                </p>

                <div className="flex items-center gap-2 pt-1 text-xs text-amber-200/90 font-bold">
                  <Calendar size={14} className="text-[#fcc74f]" />
                  <span>
                    Fecha Límite Oficial:{" "}
                    <b>{formatDateDisplay(config.countdownTargetDate?.split("T")[0])}</b>
                  </span>
                </div>
              </div>

              {/* Countdown Numbers */}
              <div className="md:col-span-6 flex justify-center md:justify-end">
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className="rounded-2xl bg-white/10 p-3.5 border border-white/15 backdrop-blur-md min-w-[70px]">
                    <div className="text-2xl sm:text-3xl font-black text-[#fcc74f]">{timeLeft.days}</div>
                    <div className="text-[10px] font-bold text-slate-200 uppercase mt-0.5">Días</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3.5 border border-white/15 backdrop-blur-md min-w-[70px]">
                    <div className="text-2xl sm:text-3xl font-black text-[#fcc74f]">{timeLeft.hours}</div>
                    <div className="text-[10px] font-bold text-slate-200 uppercase mt-0.5">Horas</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3.5 border border-white/15 backdrop-blur-md min-w-[70px]">
                    <div className="text-2xl sm:text-3xl font-black text-[#fcc74f]">{timeLeft.mins}</div>
                    <div className="text-[10px] font-bold text-slate-200 uppercase mt-0.5">Min</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3.5 border border-white/15 backdrop-blur-md min-w-[70px]">
                    <div className="text-2xl sm:text-3xl font-black text-[#fcc74f]">{timeLeft.secs}</div>
                    <div className="text-[10px] font-bold text-slate-200 uppercase mt-0.5">Seg</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Lista de Seguimiento de Hitos (Estructura de Tabla / Lista según captura) */}
        {activeMetrics.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  Matriz de Compromisos
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  Plazos & Entregables de las Mesas Técnicas
                </h3>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Clock size={14} />
                {activeMetrics.length} Hitos en Monitoreo
              </span>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-black uppercase text-slate-700 dark:text-slate-300">
                      <th className="py-4 px-6 w-1/4">Contador</th>
                      <th className="py-4 px-6 w-1/5">Quién debe cumplir</th>
                      <th className="py-4 px-6">Qué debe entregar</th>
                      <th className="py-4 px-6 text-center w-32">Fecha límite</th>
                      <th className="py-4 px-6 text-center w-24">Días</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                    {activeMetrics.map((item) => {
                      const daysCount = calculateDaysLeft(item.deadlineDate, item.value);
                      const isUrgent = Number(daysCount) <= 15;

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-amber-50/30 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          {/* 1. Contador / Título */}
                          <td className="py-4 px-6 align-top">
                            <div className="font-black text-slate-900 dark:text-white text-sm">
                              {item.title}
                            </div>
                            {item.category && (
                              <span className="inline-block mt-1 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                {item.category}
                              </span>
                            )}
                          </td>

                          {/* 2. Quién debe cumplir */}
                          <td className="py-4 px-6 align-top">
                            <div className="font-extrabold text-slate-800 dark:text-slate-200">
                              {item.responsible || "Comisión Técnica"}
                            </div>
                          </td>

                          {/* 3. Qué debe entregar */}
                          <td className="py-4 px-6 align-top">
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                              {item.deliverable || item.description}
                            </p>
                          </td>

                          {/* 4. Fecha límite */}
                          <td className="py-4 px-6 align-top text-center">
                            <span className="font-black text-slate-900 dark:text-white whitespace-nowrap bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                              {formatDateDisplay(item.deadlineDate)}
                            </span>
                          </td>

                          {/* 5. Días */}
                          <td className="py-4 px-6 align-top text-center">
                            <div className="inline-flex flex-col items-center">
                              <span
                                className={`text-base font-black px-3 py-1 rounded-xl whitespace-nowrap ${
                                  isUrgent
                                    ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                                    : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                                }`}
                              >
                                {daysCount}
                              </span>
                              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 mt-0.5">
                                días
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards List View */}
            <div className="md:hidden space-y-3">
              {activeMetrics.map((item) => {
                const daysCount = calculateDaysLeft(item.deadlineDate, item.value);
                const isUrgent = Number(daysCount) <= 15;

                return (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400">
                          Contador
                        </span>
                        <h4 className="font-black text-slate-900 dark:text-white text-base">
                          {item.title}
                        </h4>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400 block">
                          Días Restantes
                        </span>
                        <span
                          className={`inline-block font-black text-sm px-2.5 py-0.5 rounded-lg ${
                            isUrgent
                              ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                              : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          }`}
                        >
                          {daysCount} Días
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400">
                        Quién debe cumplir
                      </span>
                      <p className="font-bold text-xs text-slate-800 dark:text-slate-200 mt-0.5">
                        {item.responsible || "Comisión Técnica"}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400">
                        Qué debe entregar
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium mt-0.5">
                        {item.deliverable || item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <span className="text-slate-600 dark:text-slate-400 font-bold">Fecha Límite:</span>
                      <span className="font-black text-slate-900 dark:text-white">
                        {formatDateDisplay(item.deadlineDate)}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}