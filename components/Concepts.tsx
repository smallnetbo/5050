"use client";

import { useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { ConceptStep, conceptStepsList as defaultConceptSteps } from "@/lib/agenda-data";

interface ConceptsProps {
  conceptSteps?: ConceptStep[];
}

export function Concepts({ conceptSteps: propConceptSteps }: ConceptsProps = {}) {
  const stepsData = propConceptSteps && propConceptSteps.length > 0 ? propConceptSteps : defaultConceptSteps;
  const [openStep, setOpenStep] = useState<number | null>(1);

  return (
    <section id="conceptos" className="py-12 bg-white dark:bg-[#101620]">
      <div className="container-page">
        <div className="rounded-[36px] border border-amber-900/10 dark:border-slate-800 bg-white dark:bg-[#151D2A] p-6 sm:p-10 shadow-sm">
          {/* Hero-styled Header Block */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-block rounded-full bg-[#dd3146]/10 dark:bg-[#dd3146]/20 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[#dd3146] dark:text-[#fcc74f] border border-[#dd3146]/20 dark:border-[#fcc74f]/30 mb-4">
              Qué es la Agenda 50|50
            </span>

            {/* Big 50/50 Brand Logo matching Hero */}
            <div className="flex items-center justify-center text-[#c79d47] dark:text-white text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter my-2 leading-none font-geometria">
              <span className="font-geometria">50</span>
              <img
                src="/assets/barra.svg"
                alt="|"
                className="h-[0.72em] w-auto inline-block self-center mx-1 select-none dark:brightness-0 dark:invert"
              />
              <span className="font-geometria">50</span>
            </div>

            <h2 className="font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#c79d47] dark:text-white leading-tight mt-3">
              Una nueva relación <span className="text-[#3ac167] dark:text-emerald-400">con más autonomía</span> para más desarrollo
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-amber-100/80 font-semibold tracking-wide mt-2">
              Más autonomía. Más capacidad de decisión.
            </p>
          </div>

          {/* ACCORDION STEPS (1, 2, 3, 4) */}
          <div className="space-y-3 mb-10">
            {stepsData.map((step) => {
              const isOpen = openStep === step.num;
              return (
                <div
                  key={step.num}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen
                      ? "border-[#3ac167] dark:border-emerald-500 bg-white dark:bg-slate-800 shadow-md"
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
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-black transition-colors ${isOpen
                            ? "bg-[#3ac167] text-white"
                            : "bg-[#dd3146]/10 dark:bg-white/10 text-[#dd3146] dark:text-[#fcc74f]"
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
                      className={`text-slate-500 dark:text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#3ac167] dark:text-emerald-400" : ""
                        }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-700/50">
                      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium mb-3">
                        {step.desc}
                      </p>

                      <div className="inline-block text-xs font-black uppercase tracking-wider text-[#c79d47] dark:text-amber-400 mb-3">
                        ✦ {step.tag}
                      </div>

                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                        {step.items.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 rounded-xl bg-amber-500/10 dark:bg-emerald-500/10 px-3 py-2 border border-amber-500/20 dark:border-emerald-500/20">
                            <span className="h-2 w-2 rounded-full bg-[#3ac167] dark:bg-emerald-400"></span>
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
            <p className="font-extrabold text-lg text-[#dd3146] dark:text-white mb-4">
              El desarrollo empieza en las regiones.
            </p>
            <a
              href="#descargas"
              className="inline-flex items-center gap-2 rounded-full bg-[#3ac167] hover:bg-[#2ea354] text-white px-7 py-3 text-sm font-extrabold shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <span>Conoce el Acuerdo de Sucre</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
