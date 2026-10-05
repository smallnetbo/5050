"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  AlertTriangle,
  FileText,
  Calendar,
  ArrowRight,
  ShieldAlert,
  Flame,
  Scale,
  Sparkles,
  Download,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { criticalCountersData, CriticalCounter } from "@/lib/propuesta2-data";

export function CriticalCounters() {
  const [now, setNow] = useState<Date>(new Date());
  const [selectedCounter, setSelectedCounter] = useState<string>("fpieeh");

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateTimeLeft = (targetIso: string) => {
    const difference = new Date(targetIso).getTime() - now.getTime();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false,
    };
  };

  return (
    <section className="relative z-20 -mt-8 sm:-mt-12 mb-16 container-page">
      {/* Top Banner Card: Accesos Directos a Acuerdos 001 y 002 */}
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#0F2942] via-[#1a3a5f] to-[#0F2942] dark:from-slate-900 dark:via-[#162338] dark:to-slate-900 p-5 sm:p-6 text-white shadow-xl border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 text-amber-300">
            <Scale size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md">
                Instrumentos Rectores
              </span>
              <span className="text-xs text-slate-300 font-semibold hidden sm:inline">
                Pacto Fiscal 2026 – 2027
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white mt-1">
              Acuerdos Intergubernativos Oficiales
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          <a
            href="#acuerdos"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 text-xs font-bold text-white transition hover:scale-[1.02] shadow-sm"
          >
            <FileText size={15} className="text-emerald-400" />
            <span>Acuerdo 001/2026 (GAD)</span>
            <ChevronRight size={14} className="text-slate-400" />
          </a>

          <a
            href="#acuerdos"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2.5 text-xs font-black transition hover:scale-[1.02] shadow-md shadow-emerald-500/20"
          >
            <Sparkles size={15} className="text-slate-950" />
            <span>Acuerdo 002/2026 (GAM + AMB)</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* Header of Critical Counters */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/30 px-3 py-1 text-xs font-black uppercase tracking-wide text-rose-800 dark:text-rose-400">
            <Flame size={14} className="animate-pulse" />
            Contadores de Plazos Críticos
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Vencimientos Inmediatos en la Hoja de Ruta
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-2xl">
            Monitoreo en tiempo real de los dos plazos perentorios establecidos en los Acuerdos 001 y 002 para la entrega de informes técnicos y anteproyectos de ley.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          <Calendar size={14} />
          <span>Octubre – Noviembre 2026</span>
        </div>
      </div>

      {/* Grid of the 2 Critical Counters */}
      <div className="grid gap-6 md:grid-cols-2">
        {criticalCountersData.map((item) => {
          const timeLeft = calculateTimeLeft(item.targetIsoDate);
          const isFpieeh = item.id === "fpieeh";

          return (
            <div
              key={item.id}
              className={`relative overflow-hidden rounded-3xl border transition-all duration-300 shadow-md hover:shadow-xl ${
                isFpieeh
                  ? "bg-gradient-to-br from-white via-rose-50/40 to-amber-50/30 dark:from-[#131b28] dark:via-[#1a2130] dark:to-[#171c26] border-rose-200 dark:border-rose-500/30"
                  : "bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/30 dark:from-[#131b28] dark:via-[#1a2333] dark:to-[#171d29] border-blue-200 dark:border-blue-500/30"
              } p-6 sm:p-7 flex flex-col justify-between`}
            >
              {/* Subtle Ambient Light Glow */}
              <div
                className={`absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-40 ${
                  isFpieeh ? "bg-rose-400" : "bg-blue-400"
                }`}
              ></div>

              <div>
                {/* Header Tag & Deadline */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${
                      isFpieeh
                        ? "bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800"
                        : "bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800"
                    }`}
                  >
                    <Clock size={13} />
                    {item.badgeText}
                  </span>

                  <div className="text-right">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                      Fecha Límite
                    </span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {item.deadlineDate}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
                  {item.title}
                </h3>

                {/* Responsible Entity */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    A cargo de:
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold ${
                      isFpieeh
                        ? "bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900"
                        : "bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900"
                    }`}
                  >
                    {item.responsible}
                  </span>
                </div>

                {/* Deliverable Explanation */}
                <div className="mt-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-4">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                    ¿Qué debe entregar realmente?
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                    {item.deliverable}
                  </p>
                </div>
              </div>

              {/* Dynamic Live Counter Block */}
              <div className="mt-6 pt-5 border-t border-slate-200/70 dark:border-slate-800">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2">
                  <span>Cuenta regresiva activa</span>
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    En monitoreo
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-2 sm:p-2.5 shadow-2xs">
                    <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white block font-mono">
                      {item.daysLeftApprox}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
                      Días
                    </span>
                  </div>

                  <div className="rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-2 sm:p-2.5 shadow-2xs">
                    <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white block font-mono">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
                      Horas
                    </span>
                  </div>

                  <div className="rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-2 sm:p-2.5 shadow-2xs">
                    <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white block font-mono">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
                      Min
                    </span>
                  </div>

                  <div className="rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-2 sm:p-2.5 shadow-2xs">
                    <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 block font-mono">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
                      Seg
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Ámbito: <strong className="text-slate-800 dark:text-slate-200">{item.tag}</strong>
                  </span>
                  <a
                    href="#compromisos"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    Ver en compromisos <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
