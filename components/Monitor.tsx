"use client";

import { useState, useEffect } from "react";

export function Monitor() {
  // Live Countdown Calculation for 90 Days from Aug 5, 2026 -> Nov 3, 2026
  const targetDate = new Date("2026-11-03T23:59:59").getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 76, hours: 14, mins: 32, secs: 45 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, mins, secs });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <section id="monitor" className="bg-[#F9F8F5] dark:bg-[#101620] py-16 sm:py-24 border-y border-amber-900/10 dark:border-amber-500/20 text-[#1B2533] dark:text-white transition-colors duration-500">
      <div className="container-page max-w-5xl">
        
        {/* Section Header */}
        <div className="mb-12 max-w-3xl">
          <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 text-xs font-black uppercase text-emerald-800 dark:text-emerald-400">
            Monitoreo en Tiempo Real
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Indicadores & Plazos
          </h2>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300 font-medium">
            Seguimiento técnico del avance de los compromisos del Acuerdo N° 001/2026.
          </p>
        </div>

        {/* Countdown Banner for Ley 154 */}
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#dd3146] via-[#be1c30] to-[#1B2533] p-8 text-white shadow-xl relative border border-[#fcc74f]/20">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-[#fcc74f]/10 blur-2xl pointer-events-none"></div>

          <div className="grid gap-6 md:grid-cols-12 items-center">
            <div className="md:col-span-6 space-y-2">
              <span className="rounded-md bg-[#fcc74f] text-[#dd3146] px-2.5 py-1 text-xs font-black uppercase tracking-wider">
                Hito Prioritario en Curso
              </span>
              <h3 className="text-2xl font-black text-white">Cuenta Regresiva: Anteproyecto de Ley N° 154</h3>
              <p className="text-sm text-slate-200">
                La Mesa Técnica Jurídica-Fiscal tiene como mandato entregar la propuesta de reforma del dominio tributario autonómico.
              </p>
            </div>

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

      </div>
    </section>
  );
}