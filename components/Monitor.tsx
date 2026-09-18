"use client";

import { useState, useEffect } from "react";
import { Scale, FileClock, Target, Landmark, BarChart3, Wallet, Sliders } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from "recharts";

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

  // Simulator State: Revenue split slider
  const [subnationalRatio, setSubnationalRatio] = useState(50);
  const totalBudgetBs = 60000; // Simulated Total Coparticipation Fund in Millions Bs

  const subnationalAmount = Math.round((totalBudgetBs * subnationalRatio) / 100);
  const centralAmount = totalBudgetBs - subnationalAmount;

  const chartData = [
    { name: "Nivel Central del Estado", value: centralAmount, fill: "#dd3146" },
    { name: "Autonomías Subnacionales (GAD/GAM/AIOC)", value: subnationalAmount, fill: "#3ac167" },
  ];

  const departmentDistributionData = [
    { name: "La Paz", actual: 1250, sim5050: Math.round(1250 * (subnationalRatio / 18)) },
    { name: "Santa Cruz", actual: 1900, sim5050: Math.round(1900 * (subnationalRatio / 15)) },
    { name: "Cochabamba", actual: 980, sim5050: Math.round(980 * (subnationalRatio / 16)) },
    { name: "Chuquisaca", actual: 520, sim5050: Math.round(520 * (subnationalRatio / 15)) },
    { name: "Tarija", actual: 780, sim5050: Math.round(780 * (subnationalRatio / 21)) },
    { name: "Potosí", actual: 850, sim5050: Math.round(850 * (subnationalRatio / 19)) },
  ];

  const kpiCards = [
    {
      v: "9/9 GAD",
      t: "Gobernaciones Adheridas",
      d: "100% de los Gobiernos Autónomos Departamentales firmaron el Acuerdo de Sucre.",
      Icon: Landmark,
    },
    {
      v: "90 Días",
      t: "Plazo Máximo Ley 154",
      d: "Plazo límite para la entrega del anteproyecto de modificación del dominio tributario.",
      Icon: FileClock,
    },
    {
      v: "Gestión 2027",
      t: "Ley de Coparticipación",
      d: "Entrada en vigencia de la nueva distribución fiscal y fórmula equitativa.",
      Icon: Target,
    },
    {
      v: "5 Comisiones",
      t: "Mesas Técnicas Activas",
      d: "Equipos de hacienda, jurídica, tributaria, alivio de deuda y competencias sesionando.",
      Icon: Scale,
    },
    {
      v: "1 Reporte",
      t: "Principio Reporte Único",
      d: "Desburocratización y canal único de información fiscal ante el MEFP.",
      Icon: BarChart3,
    },
    {
      v: "7 Instrumentos",
      t: "Vías de Implementación",
      d: "Proyectos de ley, decretos, convenios intergubernativos y reglamentos.",
      Icon: Wallet,
    },
  ];

  return (
    <section id="monitor" className="bg-[#F9F8F5] dark:bg-[#101620] py-16 sm:py-24 border-y border-amber-900/10 dark:border-amber-500/20 text-[#1B2533] dark:text-white transition-colors duration-500">
      <div className="container-page max-w-5xl">
        
        {/* Section Header */}
        <div className="mb-12 max-w-3xl">
          <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 text-xs font-black uppercase text-emerald-800 dark:text-emerald-400">
            Monitoreo en Tiempo Real
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Indicadores & Simulación Fiscal
          </h2>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300 font-medium">
            Seguimiento técnico del avance de los compromisos del Acuerdo N° 001/2026 y simulador de coparticipación.
          </p>
        </div>

        {/* 1. Metro KPI Cards Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {kpiCards.map((kpi, idx) => {
            const IconComponent = kpi.Icon;
            return (
              <article
                key={idx}
                className="group rounded-3xl border border-amber-900/10 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-[#3ac167] dark:text-emerald-400 group-hover:bg-[#3ac167] group-hover:text-white transition-colors">
                    <IconComponent size={22} />
                  </div>
                  <span className="rounded-full bg-amber-50 dark:bg-slate-700 px-3 py-1 text-[11px] font-extrabold text-[#dd3146] dark:text-[#fcc74f] uppercase">
                    Métrica Oficial
                  </span>
                </div>
                <div className="mt-6 text-3xl font-black text-[#1B2533] dark:text-white tracking-tight">{kpi.v}</div>
                <h3 className="mt-1 font-extrabold text-slate-800 dark:text-slate-100 text-base">{kpi.t}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-medium">{kpi.d}</p>
              </article>
            );
          })}
        </div>

        {/* 2. Countdown Banner for Ley 154 */}
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#dd3146] via-[#be1c30] to-[#1B2533] p-8 text-white shadow-xl relative border border-[#fcc74f]/20 mb-16">
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

        {/* 3. SIMULADOR DE COPARTICIPACIÓN 50/50 */}
        <div className="rounded-3xl border border-amber-900/10 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 sm:p-10 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-amber-900/10 dark:border-slate-700">
            <div>
              <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 text-xs font-black uppercase text-[#3ac167] dark:text-emerald-400">
                Simulador Interactivo de Coparticipación
              </span>
              <h3 className="text-2xl font-black text-[#1B2533] dark:text-white mt-2">
                Efecto de la Redistribución Fiscal
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                Ajuste la barra para simular el impacto en los ingresos subnacionales y departamentales.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-[#FAF8F3] dark:bg-slate-900 px-4 py-2 border border-amber-900/10 dark:border-slate-700 shrink-0">
              <Sliders size={18} className="text-[#3ac167]" />
              <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                Porcentaje Subnacional: <strong className="text-[#3ac167]">{subnationalRatio}%</strong>
              </span>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-black text-slate-700 dark:text-slate-300">
                  <span>Actual (~15% Subnacional)</span>
                  <span className="text-[#3ac167] dark:text-emerald-400 font-black text-sm">Objetivo 50%</span>
                  <span>70% Subnacional</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="60"
                  value={subnationalRatio}
                  onChange={(e) => setSubnationalRatio(Number(e.target.value))}
                  className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#3ac167]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[#FAF8F3] dark:bg-slate-900 p-4 border border-amber-900/10 dark:border-slate-700">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Nivel Central</div>
                  <div className="text-2xl font-black text-[#dd3146] dark:text-white mt-1">
                    Bs. {centralAmount.toLocaleString()} M
                  </div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{100 - subnationalRatio}% del total</div>
                </div>

                <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 p-4 border border-emerald-200 dark:border-emerald-800">
                  <div className="text-xs font-bold text-[#3ac167] dark:text-emerald-300 uppercase">Subnacional (GAD/GAM/AIOC)</div>
                  <div className="text-2xl font-black text-[#3ac167] dark:text-emerald-400 mt-1">
                    Bs. {subnationalAmount.toLocaleString()} M
                  </div>
                  <div className="text-xs font-semibold text-[#3ac167] dark:text-emerald-300 mt-0.5">{subnationalRatio}% del total</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid gap-6 sm:grid-cols-2">
              <div className="h-64 w-full flex flex-col items-center justify-center bg-[#FAF8F3] dark:bg-slate-900 rounded-2xl p-4 border border-amber-900/10 dark:border-slate-700">
                <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase mb-2">Distribución Simulación (%)</h4>
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: any) => `Bs. ${Number(val).toLocaleString()} M`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="h-64 w-full flex flex-col items-center justify-center bg-[#FAF8F3] dark:bg-slate-900 rounded-2xl p-4 border border-amber-900/10 dark:border-slate-700">
                <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase mb-2">Simulación por Departamento (Bs. M)</h4>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={departmentDistributionData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(val: any) => `Bs. ${val} M`} />
                    <Bar dataKey="sim5050" fill="#3ac167" radius={[4, 4, 0, 0]} name="Simulado 50/50" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}