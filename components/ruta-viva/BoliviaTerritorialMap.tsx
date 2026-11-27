"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  FileText,
  ExternalLink,
  BookOpen,
  Calendar,
  Users,
  CheckCircle2,
  Building2,
} from "lucide-react";
import { DepartmentData, DocumentItem } from "@/lib/agenda-data";
import { RutaVivaSedeDTO } from "@/lib/productos-service";
import { TERRITORIAL_PINS, TerritorialPin } from "@/lib/ruta-viva-data";

const BoliviaLeafletInner = dynamic(() => import("./BoliviaLeafletInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[430px] rounded-2xl bg-[#FAF8F5] dark:bg-[#101620] border border-amber-900/10 dark:border-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 animate-pulse">
      Cargando mapa interactivo de Bolivia...
    </div>
  ),
});

interface BoliviaTerritorialMapProps {
  departments: DepartmentData[];
  sedes?: RutaVivaSedeDTO[];
  documents?: DocumentItem[];
}

export function BoliviaTerritorialMap({
  departments,
  sedes,
  documents = [],
}: BoliviaTerritorialMapProps) {
  const pins: TerritorialPin[] = useMemo(() => {
    if (!sedes || sedes.length === 0) return TERRITORIAL_PINS;
    return sedes.map((s) => {
      const doc = documents.find((d) => d.id === s.linkedDocumentId);
      const dept = departments.find((d) => d.id === s.department);
      const fallback = TERRITORIAL_PINS.find((p) => p.id === s.slug);
      return {
        id: s.slug,
        city: s.city,
        departmentId: s.department,
        departmentName: dept?.name || fallback?.departmentName || s.department,
        lon: s.lng,
        lat: s.lat,
        date: s.dateLabel,
        title: s.title,
        actor: s.actors,
        summary: s.summary,
        keyFigures: s.keyFigures,
        pdfUrl: doc?.fileUrl || fallback?.pdfUrl || "#descargas",
        pdfLabel: doc ? `Documento Oficial (PDF)` : fallback?.pdfLabel || "Ver Documento (PDF)",
        revistaHref: s.linkedChapterSlug ? `/revista#${s.linkedChapterSlug}` : "/revista",
        revistaLabel: fallback?.revistaLabel || "Ver en Revista 50/50",
        accent: s.accent,
      };
    });
  }, [sedes, documents, departments]);

  const [selectedPin, setSelectedPin] = useState<TerritorialPin | null>(pins[0] || null);
  const [selectedDeptId, setSelectedDeptId] = useState<string>(pins[0]?.departmentId || "CH");

  const activeDept =
    departments.find((d) => d.id === (selectedPin?.departmentId || selectedDeptId)) ||
    departments[0];

  const handleSelectPin = (pin: TerritorialPin) => {
    setSelectedPin(pin);
    setSelectedDeptId(pin.departmentId);
  };

  const handleSelectDept = (deptId: string) => {
    setSelectedDeptId(deptId);
    const matchingPin = pins.find((p) => p.departmentId === deptId);
    setSelectedPin(matchingPin || null);
  };

  const getPinColor = (accent: TerritorialPin["accent"]) => {
    if (accent === "red") return "#dd3146";
    if (accent === "gold") return "#c79d47";
    return "#3ac167";
  };

  return (
    <div className="space-y-6">
      {/* Selector rápido de las sedes */}
      <div className="flex flex-wrap gap-2">
        {pins.map((pin) => {
          const isSelected = selectedPin?.id === pin.id;
          return (
            <button
              key={pin.id}
              onClick={() => handleSelectPin(pin)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-extrabold transition cursor-pointer ${
                isSelected
                  ? "bg-[#1B2533] text-white dark:bg-[#c79d47] dark:text-[#101620] shadow-md"
                  : "bg-white dark:bg-[#17202C] text-slate-700 dark:text-slate-300 border border-amber-900/10 dark:border-slate-800 hover:bg-amber-50 dark:hover:bg-slate-800"
              }`}
            >
              <MapPin
                size={13}
                style={{ color: isSelected ? "currentColor" : getPinColor(pin.accent) }}
              />
              <span>{pin.city}</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-12 items-stretch">
        {/* Mapa Leaflet + CartoDB Positron + GeoJSON ADM1 */}
        <div className="lg:col-span-6 rounded-3xl border border-amber-900/10 dark:border-slate-800 bg-white dark:bg-[#17202C] p-6 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#c79d47]">
                Cartografía Interactiva · Leaflet + OpenStreetMap
              </span>
              <h3 className="text-lg font-black text-[#1B2533] dark:text-white">
                9 Departamentos y 6 Sedes de Acuerdos
              </h3>
            </div>
            <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 text-[11px] font-black text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
              9/9 Adheridos
            </span>
          </div>

          <div className="w-full h-[450px]">
            <BoliviaLeafletInner
              pins={pins}
              activeDeptId={activeDept?.id || selectedDeptId}
              selectedPinId={selectedPin?.id || null}
              onSelectPin={handleSelectPin}
              onSelectDept={handleSelectDept}
            />
          </div>

          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
            Haz clic en cualquiera de los 6 pines pulsantes o en un departamento para explorar sus
            datos fiscales y documentos oficiales.
          </p>
        </div>

        {/* Panel / Drawer Lateral Dinámico */}
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            {selectedPin ? (
              <motion.div
                key={selectedPin.id}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.25 }}
                className="h-full rounded-3xl border border-amber-900/15 dark:border-slate-800 bg-white dark:bg-[#17202C] p-6 sm:p-7 shadow-soft flex flex-col justify-between gap-5"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-900/10 dark:border-slate-800 pb-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#c79d47]">
                        <MapPin size={14} /> {selectedPin.city} · {selectedPin.departmentName}
                      </div>
                      <h3 className="mt-1 text-xl sm:text-2xl font-black text-[#1B2533] dark:text-white">
                        {selectedPin.title}
                      </h3>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <Calendar size={12} /> {selectedPin.date}
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60">
                    <Users size={13} /> {selectedPin.actor}
                  </div>

                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedPin.summary}
                  </p>

                  {/* Cifras Clave */}
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
                      Cifras y definiciones clave
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedPin.keyFigures.map((fig, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#FAF8F3] dark:bg-[#101620] border border-amber-900/10 dark:border-slate-800 px-3 py-1.5 text-xs font-extrabold text-[#1B2533] dark:text-slate-200"
                        >
                          <CheckCircle2 size={13} className="text-[#3ac167]" /> {fig}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Ficha departamental vinculada desde dev.db */}
                  {activeDept && (
                    <div className="rounded-2xl bg-[#FAF8F3] dark:bg-[#101620] p-4 border border-amber-900/10 dark:border-slate-800 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-slate-400 font-bold uppercase text-[10px]">
                          Gobernación ({activeDept.name})
                        </div>
                        <div className="font-black text-[#1B2533] dark:text-white mt-0.5">
                          {activeDept.governor}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400 font-bold uppercase text-[10px]">
                          Impacto Estimado 50/50
                        </div>
                        <div className="font-black text-[#3ac167] mt-0.5">
                          {activeDept.target5050Impact}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Acciones: PDF oficial y salto a Revista */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-amber-900/10 dark:border-slate-800">
                  <a
                    href={selectedPin.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#1B2533] hover:bg-slate-800 dark:bg-[#c79d47] dark:text-[#101620] text-white px-4 py-2.5 text-xs font-black transition"
                  >
                    <FileText size={14} /> {selectedPin.pdfLabel} <ExternalLink size={12} />
                  </a>
                  <Link
                    href={selectedPin.revistaHref}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#3ac167] hover:bg-[#2ea354] text-white px-4 py-2.5 text-xs font-black transition shadow-emerald"
                  >
                    <BookOpen size={14} /> {selectedPin.revistaLabel}
                  </Link>
                </div>
              </motion.div>
            ) : (
              activeDept && (
                <motion.div
                  key={activeDept.id}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -14 }}
                  transition={{ duration: 0.25 }}
                  className="h-full rounded-3xl border border-amber-900/15 dark:border-slate-800 bg-white dark:bg-[#17202C] p-6 sm:p-7 shadow-soft flex flex-col justify-between gap-5"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-amber-900/10 dark:border-slate-800 pb-4">
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#3ac167]">
                          <Building2 size={14} /> Departamento Adherido
                        </div>
                        <h3 className="mt-1 text-2xl font-black text-[#1B2533] dark:text-white">
                          {activeDept.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-semibold">
                          Capital: {activeDept.capital} · Gobernador: {activeDept.governor}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-[#FAF8F3] dark:bg-[#101620] p-4 border border-amber-900/10 dark:border-slate-800">
                        <div className="text-[10px] font-bold uppercase text-slate-400">
                          Régimen Fiscal Actual
                        </div>
                        <div className="text-sm font-black mt-1">
                          {activeDept.currentFiscalRatio}
                        </div>
                      </div>
                      <div className="rounded-2xl bg-[#3ac167] text-white p-4">
                        <div className="text-[10px] font-bold uppercase text-emerald-100">
                          Impacto Estimado 50/50
                        </div>
                        <div className="text-sm font-black mt-1">
                          {activeDept.target5050Impact}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {activeDept.regionalNotes}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-amber-900/10 dark:border-slate-800">
                    <Link
                      href="/revista#capitulo-1"
                      className="inline-flex items-center gap-2 rounded-2xl bg-[#1B2533] text-white px-4 py-2.5 text-xs font-black hover:bg-slate-800 transition"
                    >
                      <BookOpen size={14} /> Ver Capítulo Departamental en Revista
                    </Link>
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
