"use client";

import { useState, useEffect } from "react";
import { Scale, FileClock, Target, Landmark, BarChart3, Wallet, Sliders, ChevronDown, CheckCircle2, ArrowRight } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from "recharts";

export function Monitor() {
  // Balance State: "before" (65/35) vs "after" (50/50)
  const [balanceMode, setBalanceMode] = useState<"before" | "after">("after");

  // Accordion Step State (default step 1 open)
  const [openStep, setOpenStep] = useState<number | null>(1);

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
    { name: "Nivel Central del Estado", value: centralAmount, fill: "#84131D" },
    { name: "Autonomías Subnacionales (GAD/GAM/AIOC)", value: subnationalAmount, fill: "#2D8A4E" },
  ];

  const departmentDistributionData = [
    { name: "La Paz", actual: 1250, sim5050: Math.round(1250 * (subnationalRatio / 18)) },
    { name: "Santa Cruz", actual: 1900, sim5050: Math.round(1900 * (subnationalRatio / 15)) },
    { name: "Cochabamba", actual: 980, sim5050: Math.round(980 * (subnationalRatio / 16)) },
    { name: "Chuquisaca", actual: 520, sim5050: Math.round(520 * (subnationalRatio / 15)) },
    { name: "Tarija", actual: 780, sim5050: Math.round(780 * (subnationalRatio / 21)) },
    { name: "Potosí", actual: 850, sim5050: Math.round(850 * (subnationalRatio / 19)) },
  ];

  const stepsData = [
    {
      num: 1,
      title: "¿Qué es el 50/50?",
      desc: "Una reforma para fortalecer las autonomías: que los recursos, competencias y responsabilidades estén mejor equilibrados entre el Gobierno nacional y las regiones.",
      tag: "Más autonomía para impulsar el desarrollo",
      items: ["Recursos", "Competencias", "Decisión"],
    },
    {
      num: 2,
      title: "¿Qué cambiará?",
      desc: "La Agenda 50/50 plantea una reforma para fortalecer a gobernaciones y municipios.",
      tag: "Un Estado más cercano, eficiente y coordinado",
      items: [
        "Mejor distribución de recursos",
        "Mayor capacidad para generar recursos",
        "Alivio financiero para fortalecer la gestión",
        "Revisar normas y competencias que limitan a las autonomías",
      ],
    },
    {
      num: 3,
      title: "¿Cómo se hará?",
      desc: "El 50/50 será un proceso gradual, técnico y consensuado con las regiones.",
      tag: "Construcción conjunta y responsable",
      items: ["Mesas técnicas", "Nueva normativa", "Indicadores verificables", "Implementación progresiva"],
    },
    {
      num: 4,
      title: "¿Qué busca?",
      desc: "Regiones más fuertes. Mejores servicios para la población.",
      tag: "El desarrollo empieza en las regiones",
      items: [
        "Mayor capacidad para invertir",
        "Más proyectos y mejores servicios",
        "Finanzas regionales transparentes y sostenibles",
        "Mayor coordinación y desarrollo",
      ],
    },
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
        
        {/* INTERACTIVE 50/50 REFORMA COMPONENT WITH HERO PALETTE & FONTS */}
        <div className="rounded-3xl border border-amber-900/10 dark:border-white/10 bg-white/80 dark:bg-[#1B2533]/80 backdrop-blur-xl p-6 sm:p-12 shadow-xl mb-16 transition-colors duration-500">
          
          {/* Hero-styled Header Block */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-block rounded-full bg-[#84131D]/10 dark:bg-[#C9232F]/20 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[#84131D] dark:text-amber-300 border border-[#84131D]/20 dark:border-amber-300/30 mb-4">
              Acuerdo N.º 001/2026 · Reforma autonómica
            </span>
            
            {/* Big 50/50 Brand Logo matching Hero */}
            <div className="flex items-center justify-center text-[#84131D] dark:text-white text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter my-2 leading-none font-geometria">
              <span className="font-geometria">50</span>
              <img
                src="/assets/barra.svg"
                alt="|"
                className="h-[0.72em] w-auto inline-block self-center mx-1 select-none dark:brightness-0 dark:invert"
              />
              <span className="font-geometria">50</span>
            </div>

            <h2 className="font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#84131D] dark:text-white leading-tight mt-3">
              Una nueva relación <span className="text-[#2D8A4E] dark:text-emerald-400">con más autonomía</span> para más desarrollo
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-amber-100/80 font-semibold tracking-wide mt-2">
              Más autonomía. Más capacidad de decisión.
            </p>
          </div>

          {/* SIGNATURE BALANCE BAR COMPONENT */}
          <div className="rounded-2xl border border-amber-900/10 dark:border-slate-700 bg-[#FAF8F3] dark:bg-slate-800/80 p-6 sm:p-8 mb-10 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <span className="font-extrabold text-base text-[#1B2533] dark:text-white">
                La reforma en una imagen
              </span>
              
              {/* Toggle Switch */}
              <div className="inline-flex rounded-full bg-white dark:bg-slate-900 p-1 border border-amber-900/10 dark:border-slate-700 shadow-inner">
                <button
                  type="button"
                  onClick={() => setBalanceMode("before")}
                  className={`rounded-full px-4 py-1.5 text-xs font-extrabold transition-all duration-300 ${
                    balanceMode === "before"
                      ? "bg-[#84131D] text-white shadow-md"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Situación actual (65/35)
                </button>
                <button
                  type="button"
                  onClick={() => setBalanceMode("after")}
                  className={`rounded-full px-4 py-1.5 text-xs font-extrabold transition-all duration-300 ${
                    balanceMode === "after"
                      ? "bg-[#2D8A4E] text-white shadow-md"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Agenda 50/50
                </button>
              </div>
            </div>

            {/* Labels */}
            <div className="flex justify-between text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              <span>Gobierno nacional</span>
              <span>Regiones y municipios</span>
            </div>

            {/* Animated Split Bar */}
            <div className="flex h-14 w-full rounded-xl overflow-hidden border border-amber-900/10 dark:border-slate-700 shadow-inner p-1 bg-white dark:bg-slate-900 gap-1">
              <div
                style={{ flexBasis: balanceMode === "before" ? "65%" : "50%" }}
                className="flex items-center justify-center font-segoe font-bold text-lg text-white bg-[#84131D] rounded-lg transition-all duration-700 ease-out"
              >
                {balanceMode === "before" ? "65%" : "50%"}
              </div>
              <div
                style={{ flexBasis: balanceMode === "before" ? "35%" : "50%" }}
                className="flex items-center justify-center font-segoe font-bold text-lg text-white bg-[#2D8A4E] rounded-lg transition-all duration-700 ease-out"
              >
                {balanceMode === "before" ? "35%" : "50%"}
              </div>
            </div>

            <p className="mt-3 text-xs text-center text-slate-500 dark:text-slate-400 font-medium">
              Representación conceptual del objetivo de equilibrio entre recursos, competencias y decisión.
            </p>
          </div>

          {/* ACCORDION STEPS (1, 2, 3, 4) */}
          <div className="space-y-3 mb-10">
            {stepsData.map((step) => {
              const isOpen = openStep === step.num;
              return (
                <div
                  key={step.num}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "border-[#2D8A4E] dark:border-emerald-500 bg-white dark:bg-slate-800 shadow-md"
                      : "border-amber-900/10 dark:border-slate-700/80 bg-[#FAF8F3] dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenStep(isOpen ? null : step.num)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-black transition-colors ${
                          isOpen
                            ? "bg-[#2D8A4E] text-white"
                            : "bg-[#84131D]/10 dark:bg-white/10 text-[#84131D] dark:text-amber-300"
                        }`}
                      >
                        {step.num}
                      </span>
                      <span className="font-extrabold text-base sm:text-lg text-[#1B2533] dark:text-white">
                        {step.title}
                      </span>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`text-slate-500 dark:text-slate-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#2D8A4E] dark:text-emerald-400" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-700/50">
                      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium mb-3">
                        {step.desc}
                      </p>
                      
                      <div className="inline-block text-xs font-black uppercase tracking-wider text-[#C59B27] dark:text-amber-400 mb-3">
                        ✦ {step.tag}
                      </div>

                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                        {step.items.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 rounded-xl bg-amber-500/10 dark:bg-emerald-500/10 px-3 py-2 border border-amber-500/20 dark:border-emerald-500/20">
                            <span className="h-2 w-2 rounded-full bg-[#2D8A4E] dark:bg-emerald-400"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA Footer Block */}
          <div className="pt-6 border-t border-amber-900/10 dark:border-slate-700 text-center">
            <p className="font-extrabold text-lg text-[#84131D] dark:text-white mb-4">
              El desarrollo empieza en las regiones.
            </p>
            <a
              href="#descargas"
              className="inline-flex items-center gap-2 rounded-full bg-[#2D8A4E] hover:bg-[#247340] text-white px-7 py-3 text-sm font-extrabold shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <span>Conoce el Acuerdo de Sucre</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* 2. Countdown Banner for Ley 154 */}
        <div className="mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-[#84131D] via-[#750A23] to-[#1B2533] p-8 text-white shadow-xl relative border border-amber-500/20">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-amber-400/10 blur-2xl pointer-events-none"></div>

          <div className="grid gap-6 md:grid-cols-12 items-center">
            <div className="md:col-span-6 space-y-2">
              <span className="rounded-md bg-amber-400 text-[#84131D] px-2.5 py-1 text-xs font-black uppercase tracking-wider">
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
                  <div className="text-2xl sm:text-3xl font-black text-amber-300">{timeLeft.days}</div>
                  <div className="text-[10px] font-bold text-slate-200 uppercase mt-0.5">Días</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-3.5 border border-white/15 backdrop-blur-md min-w-[70px]">
                  <div className="text-2xl sm:text-3xl font-black text-white">{timeLeft.hours}</div>
                  <div className="text-[10px] font-bold text-slate-200 uppercase mt-0.5">Horas</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-3.5 border border-white/15 backdrop-blur-md min-w-[70px]">
                  <div className="text-2xl sm:text-3xl font-black text-white">{timeLeft.mins}</div>
                  <div className="text-[10px] font-bold text-slate-200 uppercase mt-0.5">Mins</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-3.5 border border-white/15 backdrop-blur-md min-w-[70px]">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-300">{timeLeft.secs}</div>
                  <div className="text-[10px] font-bold text-slate-200 uppercase mt-0.5">Segs</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Metro KPI Cards Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {kpiCards.map((kpi, idx) => {
            const IconComponent = kpi.Icon;
            return (
              <article
                key={idx}
                className="group rounded-3xl border border-amber-900/10 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-[#2D8A4E] dark:text-emerald-400 group-hover:bg-[#2D8A4E] group-hover:text-white transition-colors">
                    <IconComponent size={22} />
                  </div>
                  <span className="rounded-full bg-amber-50 dark:bg-slate-700 px-3 py-1 text-[11px] font-extrabold text-[#84131D] dark:text-amber-300 uppercase">
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

        {/* 4. Interactive Revenue Distribution Simulator Section */}
        <div className="rounded-[32px] border border-amber-900/10 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-700 pb-6 mb-8">
            <div>
              <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 text-xs font-black uppercase text-[#2D8A4E] dark:text-emerald-300 border border-emerald-500/20">
                Herramienta Didáctica Interactiva
              </span>
              <h3 className="text-2xl font-black text-[#1B2533] dark:text-white mt-2">
                Simulador de Distribución de Recursos Fiscales
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
                Desliza la barra para simular el impacto en la distribución presupuestaria anual entre el Estado Central y las autonomías subnacionales.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-[#FAF8F3] dark:bg-slate-900 p-4 rounded-2xl border border-amber-900/10 dark:border-slate-700">
              <Sliders className="text-[#2D8A4E] dark:text-emerald-400" size={24} />
              <div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Porcentaje Subnacional Objetivo</div>
                <div className="text-xl font-black text-[#84131D] dark:text-amber-300">{subnationalRatio}% / {100 - subnationalRatio}%</div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-center">
            {/* Slider Control Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-black text-slate-700 dark:text-slate-300">
                  <span>Actual (~15% Subnacional)</span>
                  <span className="text-[#2D8A4E] dark:text-emerald-400 font-black text-sm">Objetivo 50%</span>
                  <span>70% Subnacional</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="60"
                  value={subnationalRatio}
                  onChange={(e) => setSubnationalRatio(Number(e.target.value))}
                  className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#2D8A4E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[#FAF8F3] dark:bg-slate-900 p-4 border border-amber-900/10 dark:border-slate-700">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Nivel Central</div>
                  <div className="text-2xl font-black text-[#84131D] dark:text-white mt-1">
                    Bs. {centralAmount.toLocaleString()} M
                  </div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{100 - subnationalRatio}% del total</div>
                </div>

                <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 p-4 border border-emerald-200 dark:border-emerald-800">
                  <div className="text-xs font-bold text-[#2D8A4E] dark:text-emerald-300 uppercase">Subnacional (GAD/GAM/AIOC)</div>
                  <div className="text-2xl font-black text-[#2D8A4E] dark:text-emerald-400 mt-1">
                    Bs. {subnationalAmount.toLocaleString()} M
                  </div>
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-300 mt-0.5">{subnationalRatio}% del total</div>
                </div>
              </div>

              <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/40 p-4 border border-amber-200 dark:border-amber-800/60 text-xs font-medium text-amber-900 dark:text-amber-200 leading-relaxed">
                💡 <b>Nota explicativa:</b> En el pacto fiscal 50/50, por cada 100 Bolivianos recaudados en impuestos nacionales y recursos coparticipables, 50 Bolivianos financian directamente las competencias departamentales, municipales y comunitarias.
              </div>
            </div>

            {/* Recharts Pie & Bar Visualization Column */}
            <div className="lg:col-span-7 grid gap-6 sm:grid-cols-2 items-center">
              <div className="h-64 w-full flex flex-col items-center justify-center bg-[#FAF8F3] dark:bg-slate-900 rounded-2xl p-4 border border-amber-900/10 dark:border-slate-700">
                <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase mb-2">Proporción Simulada</h4>
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

              <div className="h-64 w-full flex flex-col items-center justify-center bg-[#FAF8F3] dark:bg-slate-900 rounded-2xl p-4 border border-amber-900/10 dark:border-slate-700">
                <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase mb-2">Simulación por Departamento (Bs. M)</h4>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={departmentDistributionData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(val: any) => `Bs. ${val} M`} />
                    <Bar dataKey="sim5050" fill="#2D8A4E" radius={[4, 4, 0, 0]} name="Simulado 50/50" />
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