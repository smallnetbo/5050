"use client";

import { useState } from "react";
import { MapPin, Building, CheckCircle2, TrendingUp, Sparkles, ShieldCheck } from "lucide-react";
import { departmentsData, DepartmentData } from "@/lib/agenda-data";

export function Territorial() {
  const [selectedDeptId, setSelectedDeptId] = useState<string>("SC");
  const selectedDept = departmentsData.find((d) => d.id === selectedDeptId) || departmentsData[0];

  return (
    <section id="territorio" className="bg-white py-20">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Left Column: Department Selection & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-black uppercase text-emerald-800">
                Dimensión Territorial Desconcentrada
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                La Agenda se construye desde los 9 Departamentos
              </h2>
              <p className="mt-3 text-base leading-relaxed text-slate-600 font-medium">
                El Acuerdo contempla articulación con los 9 Gobiernos Autónomos Departamentales, los Gobiernos Municipales, las Autonomías Indígena Originario Campesinas (AIOC) y el Gran Chaco.
              </p>
            </div>

            {/* Department Buttons Grid */}
            <div className="grid grid-cols-3 gap-2">
              {departmentsData.map((dept) => {
                const isSelected = dept.id === selectedDeptId;
                return (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedDeptId(dept.id)}
                    className={`rounded-2xl p-3 text-left transition-all ${isSelected
                        ? "bg-[#0F2942] text-white shadow-md font-black scale-[1.02]"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold"
                      }`}
                  >
                    <div className="text-xs">{dept.name}</div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? "text-emerald-300" : "text-emerald-600"}`}>
                      {dept.adhered ? "Adherido 9/9" : ""}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-200 flex items-center gap-3">
              <ShieldCheck className="text-emerald-600 shrink-0" size={24} />
              <p className="text-xs font-semibold text-emerald-900">
                <b>100% de Adhesión Territorial:</b> Las 9 Gobernaciones de Bolivia ratificaron el pliego en Sucre el 5 de agosto de 2026.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Regional Card */}
          <div className="lg:col-span-7">
            <div className="rounded-[34px] border border-slate-200 bg-slate-50 p-8 shadow-sm">
              <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin className="text-emerald-600" size={18} />
                    <span className="text-xs font-black uppercase text-slate-400">Departamento Seleccionado</span>
                  </div>
                  <h3 className="mt-1 text-3xl font-black text-slate-900">{selectedDept.name}</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">Capital: {selectedDept.capital} · Gobernador: {selectedDept.governor}</p>
                </div>

                <span className="rounded-full bg-emerald-500 text-white px-3.5 py-1 text-xs font-black">
                  Adhesión Ratificada
                </span>
              </div>

              {/* Fiscal Stats Grid */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-xs">
                  <div className="text-xs font-bold text-slate-400 uppercase">Régimen Fiscal Actual</div>
                  <div className="text-lg font-black text-slate-800 mt-1">{selectedDept.currentFiscalRatio}</div>
                </div>

                <div className="rounded-2xl bg-emerald-500 text-white p-4 shadow-md">
                  <div className="text-xs font-bold text-emerald-100 uppercase">Impacto Estimado 50/50</div>
                  <div className="text-xl font-black mt-1">{selectedDept.target5050Impact}</div>
                </div>
              </div>

              {/* Key Regional Priorities & Projects */}
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                    Prioridades del Departamento
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700 font-medium bg-white p-4 rounded-2xl border border-slate-200">
                    {selectedDept.regionalNotes}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                    Proyectos Estratégicos que Liberan Liquidez
                  </h4>
                  <div className="mt-2 grid sm:grid-cols-3 gap-2">
                    {selectedDept.keyProjects.map((proj, idx) => (
                      <div key={idx} className="rounded-xl bg-white p-3 text-xs font-bold text-slate-800 border border-slate-200 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0"></span>
                        <span className="line-clamp-2">{proj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}