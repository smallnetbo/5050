"use client";

import { useState } from "react";
import { CheckCircle2, CircleDashed, Clock3, Calendar, FileText, Users, ChevronRight, Download } from "lucide-react";
import { milestones as defaultMilestones, Milestone } from "@/lib/agenda-data";

interface TimelineProps {
  milestones?: Milestone[];
}

export function Timeline({ milestones: propMilestones }: TimelineProps) {
  const milestonesList = propMilestones && propMilestones.length > 0 ? propMilestones : defaultMilestones;
  const [activeStep, setActiveStep] = useState(0);
  const currentMilestone = milestonesList[activeStep] || milestonesList[0];


  return (
    <section id="ruta" className="bg-slate-50 py-20 border-t border-slate-200">
      <div className="container-page">
        {/* Section Header */}
        <div className="mb-12 max-w-3xl">
          <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-black uppercase text-emerald-800">
            Hoja de Ruta Interactiva
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            De la Firma en Sucre a la Ejecución 2027
          </h2>
          <p className="mt-2 text-base text-slate-600 font-medium">
            Sigue el cronograma evolutivo paso a paso hacia la entrada en vigencia del nuevo régimen autonómico.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Stepper Steps List */}
          <div className="lg:col-span-5 space-y-3">
            {milestonesList.map((m, idx) => {
              const isActive = idx === activeStep;

              const isCompleted = m.status === "Cumplido";
              const inProgress = m.status === "En proceso";

              return (
                <button
                  key={m.id}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full rounded-2xl p-4 text-left transition-all duration-200 border ${isActive
                      ? "bg-[#0F2942] text-white border-[#0F2942] shadow-lg scale-[1.02]"
                      : "bg-white text-slate-800 border-slate-200 hover:bg-slate-100/80"
                    }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <CheckCircle2 className={isActive ? "text-emerald-400" : "text-emerald-600"} size={20} />
                      ) : inProgress ? (
                        <Clock3 className={isActive ? "text-amber-300" : "text-amber-500"} size={20} />
                      ) : (
                        <CircleDashed className={isActive ? "text-slate-400" : "text-slate-400"} size={20} />
                      )}
                      <span className="font-extrabold text-sm sm:text-base">
                        Hito {m.id}: {m.title}
                      </span>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${isCompleted
                          ? isActive ? "bg-emerald-500/30 text-emerald-300" : "bg-emerald-100 text-emerald-800"
                          : inProgress
                            ? isActive ? "bg-amber-500/30 text-amber-300" : "bg-amber-100 text-amber-800"
                            : isActive ? "bg-white/10 text-slate-300" : "bg-slate-100 text-slate-600"
                        }`}
                    >
                      {m.status}
                    </span>
                  </div>

                  <div className={`ml-8 mt-1 text-xs font-semibold ${isActive ? "text-slate-300" : "text-slate-500"}`}>
                    {m.date}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Step Detail Card */}
          <div className="lg:col-span-7">
            <div className="rounded-[34px] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-600">
                  <Calendar size={16} /> {currentMilestone.date}
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                  Estado: {currentMilestone.status}
                </span>
              </div>

              <div className="text-6xl font-black text-slate-200">
                0{currentMilestone.id}
              </div>

              <h3 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {currentMilestone.title}
              </h3>

              <p className="mt-4 text-base leading-relaxed text-slate-600 font-medium">
                {currentMilestone.detail}
              </p>

              {/* Participants */}
              {currentMilestone.participants && (
                <div className="mt-6">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Users size={14} /> Actores e Instituciones Involucradas
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {currentMilestone.participants.map((p, i) => (
                      <span key={i} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-700">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              {currentMilestone.documents && currentMilestone.documents.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 mb-3">
                    <FileText size={14} /> Documentos & Resúmenes Disponibles
                  </h4>
                  <div className="space-y-2">
                    {currentMilestone.documents.map((doc, idx) => (
                      <a
                        key={idx}
                        href="#descargas"
                        className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 transition"
                      >
                        <div className="flex items-center gap-3">
                          <FileText size={18} className="text-emerald-600" />
                          <span className="text-xs font-bold text-slate-800">{doc.name}</span>
                        </div>
                        <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1">
                          <Download size={14} /> {doc.size}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}