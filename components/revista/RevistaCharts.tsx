"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  BoardCommitmentItem,
  BOARD_LEVELS,
  BOARD_LEVEL_ORDER,
  BoardLevelCode,
} from "@/lib/board-commitments-data";
import {
  CHACO_PROJECTION_DATA,
  ROAD_PARADOX_DATA,
  LEVEL_COMPARISONS,
} from "@/lib/revista-data";
import { ArrowRightLeft, CheckCircle2, Layers } from "lucide-react";

interface CommitmentsChartProps {
  commitments: BoardCommitmentItem[];
}

export function CommitmentsBreakdownChart({ commitments }: CommitmentsChartProps) {
  const chartData = useMemo(() => {
    const groups = {} as Record<
      BoardLevelCode,
      { label: string; cumplido: number; proceso: number; programado: number; sinPlazo: number; total: number }
    >;

    for (const code of BOARD_LEVEL_ORDER) {
      groups[code] = {
        label: BOARD_LEVELS[code].shortLabel,
        cumplido: 0,
        proceso: 0,
        programado: 0,
        sinPlazo: 0,
        total: 0,
      };
    }

    for (const item of commitments) {
      const bucket = groups[item.nivel];
      if (!bucket) continue;
      bucket.total += 1;
      if (item.cat === "cumplido") bucket.cumplido += 1;
      else if (item.cat === "proceso") bucket.proceso += 1;
      else if (item.cat === "programado") bucket.programado += 1;
      else bucket.sinPlazo += 1;
    }

    return BOARD_LEVEL_ORDER.map((code) => groups[code]);
  }, [commitments]);

  return (
    <div className="rounded-3xl border border-amber-900/10 dark:border-slate-800 bg-white dark:bg-[#17202C] p-6 shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#c79d47]">
            Datos en vivo · Tablero de Compromisos (6 Niveles)
          </span>
          <h4 className="text-lg font-black text-[#1B2533] dark:text-white">
            Distribución de los {commitments.length} Compromisos por Nivel y Estado
          </h4>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
          <Layers size={13} /> Tablero 50/50
        </span>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 16, left: -12, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fontWeight: 700, fill: "#64748b" }} />
            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1B2533",
                borderColor: "#c79d47",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px", fontWeight: 700 }} />
            <Bar dataKey="cumplido" name="Cumplido / Entregado" stackId="a" fill="#3ac167" />
            <Bar dataKey="proceso" name="En proceso" stackId="a" fill="#fcc74f" />
            <Bar dataKey="programado" name="Programado / Continuo" stackId="a" fill="#0ea5e9" />
            <Bar
              dataKey="sinPlazo"
              name="Sin plazo"
              stackId="a"
              fill="#64748b"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ChacoGradualChart() {
  return (
    <div className="rounded-3xl border border-amber-900/10 dark:border-slate-800 bg-white dark:bg-[#17202C] p-6 shadow-soft">
      <div className="mb-4">
        <span className="text-[11px] font-black uppercase tracking-wider text-[#c79d47]">
          Propuesta Técnica · Yacuiba (06/11/2026)
        </span>
        <h4 className="text-lg font-black text-[#1B2533] dark:text-white">
          Reducción Gradual del NCE vs. Coparticipación Subnacional (2027–2029)
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Sobre 5 impuestos nacionales: IVA, IT, RC-IVA, IUE e ICE (manteniendo asignaciones a GAM y universidades).
        </p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={CHACO_PROJECTION_DATA} margin={{ top: 10, right: 20, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="nceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1B2533" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#1B2533" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="subGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3ac167" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#3ac167" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
            <XAxis dataKey="year" tick={{ fontSize: 12, fontWeight: 700, fill: "#64748b" }} />
            <YAxis unit="%" domain={[0, 80]} tick={{ fontSize: 11, fill: "#64748b" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1B2533",
                borderColor: "#c79d47",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px", fontWeight: 700 }} />
            <Area
              type="monotone"
              dataKey="nce"
              name="Nivel Central (%)"
              stroke="#1B2533"
              strokeWidth={3}
              fill="url(#nceGrad)"
            />
            <Area
              type="monotone"
              dataKey="subnacional"
              name="Coparticipación GAD / GAR (%)"
              stroke="#3ac167"
              strokeWidth={3}
              fill="url(#subGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function RoadParadoxChart() {
  return (
    <div className="rounded-3xl border border-amber-900/10 dark:border-slate-800 bg-white dark:bg-[#17202C] p-6 shadow-soft flex flex-col justify-between">
      <div>
        <span className="text-[11px] font-black uppercase tracking-wider text-[#dd3146]">
          Eje 2 · Paradoja Logística Vial
        </span>
        <h4 className="text-lg font-black text-[#1B2533] dark:text-white">
          Distribución Actual de Peajes en la Red Vial Fundamental
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          El GARGCH propone un circuito cerrado 50/50 para reinvertir en las carreteras de la región.
        </p>
      </div>

      <div className="h-56 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={ROAD_PARADOX_DATA}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={82}
              paddingAngle={4}
            >
              {ROAD_PARADOX_DATA.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${value ?? 0}%`}
              contentStyle={{
                backgroundColor: "#1B2533",
                borderColor: "#c79d47",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "11px", fontWeight: 700 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function LevelComparator() {
  const [activeId, setActiveId] = useState<string>("nce");
  const current = LEVEL_COMPARISONS.find((l) => l.id === activeId) || LEVEL_COMPARISONS[0];

  return (
    <div className="rounded-3xl border border-amber-900/15 dark:border-slate-800 bg-white dark:bg-[#17202C] p-6 sm:p-8 shadow-soft">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#c79d47]">
        <ArrowRightLeft size={15} /> Comparador Interactivo de Corresponsabilidad
      </div>
      <h4 className="mt-1 text-xl font-black text-[#1B2533] dark:text-white">
        ¿Qué aporta y qué recibe cada nivel en la Agenda 50/50?
      </h4>

      <div className="mt-5 flex flex-wrap gap-2">
        {LEVEL_COMPARISONS.map((lvl) => {
          const isActive = lvl.id === activeId;
          return (
            <button
              key={lvl.id}
              onClick={() => setActiveId(lvl.id)}
              className={`rounded-xl px-3.5 py-2 text-xs font-extrabold transition cursor-pointer ${
                isActive
                  ? "bg-[#1B2533] text-white dark:bg-[#c79d47] dark:text-[#101620] shadow-md"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700"
              }`}
            >
              {lvl.name}
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl bg-[#FAF8F3] dark:bg-[#101620] border border-amber-900/10 dark:border-slate-800 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-amber-900/10 dark:border-slate-800">
          <div>
            <span className="text-xs font-black uppercase text-[#3ac167]">{current.badge}</span>
            <h5 className="text-lg font-black text-[#1B2533] dark:text-white">{current.name}</h5>
          </div>
          <span className="rounded-lg bg-amber-100/80 dark:bg-amber-950/50 px-3 py-1.5 text-xs font-bold text-amber-900 dark:text-amber-300 border border-amber-300/40">
            {current.keyFigure}
          </span>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-white dark:bg-[#17202C] p-4 border border-slate-200/70 dark:border-slate-800">
            <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2.5">
              Qué aporta / Compromisos técnicos
            </div>
            <ul className="space-y-2">
              {current.delivers.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                  <CheckCircle2 size={15} className="text-[#c79d47] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-white dark:bg-[#17202C] p-4 border border-slate-200/70 dark:border-slate-800">
            <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2.5">
              Qué gana en autonomía y recursos
            </div>
            <ul className="space-y-2">
              {current.receives.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                  <CheckCircle2 size={15} className="text-[#3ac167] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
