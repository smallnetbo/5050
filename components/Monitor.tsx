"use client";

import { useState, useEffect } from "react";
import { Scale, FileClock, Target, Landmark, BarChart3, Wallet, Sliders, RefreshCw, ChevronRight, CheckCircle2, ArrowRight } from "lucide-react";
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

  // Simulator State: Revenue split slider (default 50% / 50% target, current 85% Central / 15% Subnacional)
  const [subnationalRatio, setSubnationalRatio] = useState(50);
  const totalBudgetBs = 60000; // Simulated Total Coparticipation Fund in Millions Bs

  const subnationalAmount = Math.round((totalBudgetBs * subnationalRatio) / 100);
  const centralAmount = totalBudgetBs - subnationalAmount;

  const chartData = [
    { name: "Nivel Central del Estado", value: centralAmount, fill: "#0F2942" },
    { name: "Autonomías Subnacionales (GAD/GAM/AIOC)", value: subnationalAmount, fill: "#10B981" },
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
      color: "emerald"
    },
    {
      v: "90 Días",
      t: "Plazo Máximo Ley 154",
      d: "Plazo límite para la entrega del anteproyecto de modificación del dominio tributario.",
      Icon: FileClock,
      color: "amber"
    },
    {
      v: "Gestión 2027",
      t: "Ley de Coparticipación",
      d: "Entrada en vigencia de la nueva distribución fiscal y fórmula equitativa.",
      Icon: Target,
      color: "blue"
    },
    {
      v: "5 Comisiones",
      t: "Mesas Técnicas Activas",
      d: "Equipos de hacienda, jurídica, tributaria, alivio de deuda y competencias sesionando.",
      Icon: Scale,
      color: "purple"
    },
    {
      v: "1 Reporte",
      t: "Principio Reporte Único",
      d: "Desburocratización y canal único de información fiscal ante el MEFP.",
      Icon: BarChart3,
      color: "teal"
    },
    {
      v: "7 Instrumentos",
      t: "Vías de Implementación",
      d: "Proyectos de ley, decretos, convenios intergubernativos y reglamentos.",
      Icon: Wallet,
      color: "indigo"
    }
  ];

  return (
    <section id="monitor" className="bg-slate-50 py-20 border-y border-slate-200">
      <div className="container-page">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-100 px-3 py-1 text-xs font-black uppercase text-emerald-800 tracking-wider">
              <BarChart3 size={14} /> Monitor 50/50 & Tablero en Vivo
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Los compromisos y datos, de un vistazo.
            </h2>
            <p className="mt-2 max-w-2xl text-base text-slate-600 font-medium">
              Seguimiento transparente a los hitos del Acuerdo N° 001/2026 de Sucre y simulador pedagógico de recursos fiscales.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-white border border-slate-200 p-2 shadow-xs">
            <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-black text-slate-800 uppercase tracking-wide">
              Datos Actualizados · Agosto 2026
            </span>
          </div>
        </div>

        {/* 1. Countdown Banner for Ley 154 */}
        <div className="mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F2942] via-[#1E3A8A] to-[#0F2942] p-8 text-white shadow-xl relative">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-amber-500/10 blur-2xl pointer-events-none"></div>

          <div className="grid gap-6 md:grid-cols-12 items-center">
            <div className="md:col-span-6 space-y-2">
              <span className="rounded-md bg-amber-400 text-[#0F2942] px-2.5 py-1 text-xs font-black uppercase tracking-wider">
                Hito Prioritario en Curso
              </span>
              <h3 className="text-2xl font-black text-white">Cuenta Regresiva: Anteproyecto de Ley N° 154</h3>
              <p className="text-sm text-slate-300">
                La Mesa Técnica Jurídica-Fiscal tiene como mandato entregar la propuesta de reforma del dominio tributario autonómico.
              </p>
            </div>

            <div className="md:col-span-6 flex justify-center md:justify-end">
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="rounded-2xl bg-white/10 p-3.5 border border-white/15 backdrop-blur-md min-w-[70px]">
                  <div className="text-2xl sm:text-3xl font-black text-amber-300">{timeLeft.days}</div>
                  <div className="text-[10px] font-bold text-slate-300 uppercase mt-0.5">Días</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-3.5 border border-white/15 backdrop-blur-md min-w-[70px]">
                  <div className="text-2xl sm:text-3xl font-black text-white">{timeLeft.hours}</div>
                  <div className="text-[10px] font-bold text-slate-300 uppercase mt-0.5">Horas</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-3.5 border border-white/15 backdrop-blur-md min-w-[70px]">
                  <div className="text-2xl sm:text-3xl font-black text-white">{timeLeft.mins}</div>
                  <div className="text-[10px] font-bold text-slate-300 uppercase mt-0.5">Mins</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-3.5 border border-white/15 backdrop-blur-md min-w-[70px]">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-300">{timeLeft.secs}</div>
                  <div className="text-[10px] font-bold text-slate-300 uppercase mt-0.5">Segs</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Metro KPI Cards Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {kpiCards.map((kpi, idx) => {
            const IconComponent = kpi.Icon;
            return (
              <article
                key={idx}
                className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <IconComponent size={22} />
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-extrabold text-slate-600 uppercase">
                    Métrica Oficial
                  </span>
                </div>
                <div className="mt-6 text-3xl font-black text-slate-900 tracking-tight">{kpi.v}</div>
                <h3 className="mt-1 font-extrabold text-slate-800 text-base">{kpi.t}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 font-medium">{kpi.d}</p>
              </article>
            );
          })}
        </div>

        {/* 3. Interactive Revenue Distribution Simulator Section */}
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-6 mb-8">
            <div>
              <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-black uppercase text-emerald-800">
                Herramienta Didáctica Interactiva
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">
                Simulador de Distribución de Recursos Fiscales
              </h3>
              <p className="text-sm text-slate-600 mt-1 max-w-xl">
                Desliza la barra para simular el impacto en la distribución presupuestaria anual entre el Estado Central y las autonomías subnacionales.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <Sliders className="text-emerald-600" size={24} />
              <div>
                <div className="text-xs font-bold text-slate-500">Porcentaje Subnacional Objetivo</div>
                <div className="text-xl font-black text-[#0F2942]">{subnationalRatio}% / {100 - subnationalRatio}%</div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-center">
            {/* Slider Control Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-black text-slate-700">
                  <span>Actual (~15% Subnacional)</span>
                  <span className="text-emerald-600 font-black text-sm">Objetivo 50%</span>
                  <span>70% Subnacional</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="60"
                  value={subnationalRatio}
                  onChange={(e) => setSubnationalRatio(Number(e.target.value))}
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                  <div className="text-xs font-bold text-slate-500 uppercase">Nivel Central</div>
                  <div className="text-2xl font-black text-[#0F2942] mt-1">
                    Bs. {centralAmount.toLocaleString()} M
                  </div>
                  <div className="text-xs font-semibold text-slate-400 mt-0.5">{100 - subnationalRatio}% del total</div>
                </div>

                <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-200">
                  <div className="text-xs font-bold text-emerald-700 uppercase">Subnacional (GAD/GAM/AIOC)</div>
                  <div className="text-2xl font-black text-emerald-800 mt-1">
                    Bs. {subnationalAmount.toLocaleString()} M
                  </div>
                  <div className="text-xs font-semibold text-emerald-600 mt-0.5">{subnationalRatio}% del total</div>
                </div>
              </div>

              <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200 text-xs font-medium text-amber-900 leading-relaxed">
                💡 <b>Nota explicativa:</b> En el pacto fiscal 50/50, por cada 100 Bolivianos recaudados en impuestos nacionales y recursos coparticipables, 50 Bolivianos financian directamente las competencias departamentales, municipales y comunitarias.
              </div>
            </div>

            {/* Recharts Pie & Bar Visualization Column */}
            <div className="lg:col-span-7 grid gap-6 sm:grid-cols-2 items-center">
              <div className="h-64 w-full flex flex-col items-center justify-center bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <h4 className="text-xs font-black text-slate-700 uppercase mb-2">Proporción Simulada</h4>
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
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

              <div className="h-64 w-full flex flex-col items-center justify-center bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <h4 className="text-xs font-black text-slate-700 uppercase mb-2">Simulación por Departamento (Bs. M)</h4>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={departmentDistributionData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(val: any) => `Bs. ${val} M`} />
                    <Bar dataKey="sim5050" fill="#10B981" radius={[4, 4, 0, 0]} name="Simulado 50/50" />
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