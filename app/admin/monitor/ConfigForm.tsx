"use client";

import { useState } from "react";
import { MonitorConfigInput, updateMonitorConfigAction } from "@/lib/actions/monitor.actions";
import { Save, Loader2, Clock, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

interface ConfigFormProps {
  initialConfig: MonitorConfigInput;
  onSuccess: (msg: string) => void;
}

export function ConfigForm({ initialConfig, onSuccess }: ConfigFormProps) {
  const [config, setConfig] = useState<MonitorConfigInput>(initialConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Formateador amigable para input datetime-local
  const getDatetimeLocalValue = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "2026-11-03T23:59";
      return d.toISOString().slice(0, 16);
    } catch {
      return "2026-11-03T23:59";
    }
  };

  const handleDateChange = (val: string) => {
    if (!val) return;
    // val viene como "YYYY-MM-DDTHH:MM"
    setConfig({ ...config, countdownTargetDate: `${val}:00` });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await updateMonitorConfigAction(config);
      if (res.success) {
        onSuccess(res.message || "Configuración guardada.");
      } else {
        alert(res.error || "Error al guardar configuración.");
      }
    } catch (err: any) {
      alert(err?.message || "Ocurrió un error inesperado.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black">
            <Clock size={20} />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              Banner de Cuenta Regresiva & Encabezado del Monitor
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Ajuste los textos de cabecera y el plazo límite del hito prioritario (Ley N° 154).
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
        >
          <span>{isExpanded ? "Ocultar Ajustes" : "Editar Ajustes"}</span>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {isExpanded && (
        <form onSubmit={handleSave} className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            {/* Section Badge */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                Badge Superior Sección
              </label>
              <input
                type="text"
                value={config.sectionBadge}
                onChange={(e) => setConfig({ ...config, sectionBadge: e.target.value })}
                placeholder="Monitoreo en Tiempo Real"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            {/* Section Title */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                Título Principal Sección
              </label>
              <input
                type="text"
                value={config.sectionTitle}
                onChange={(e) => setConfig({ ...config, sectionTitle: e.target.value })}
                placeholder="Indicadores & Plazos"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            {/* Section Subtitle */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                Subtítulo Sección
              </label>
              <input
                type="text"
                value={config.sectionSubtitle}
                onChange={(e) => setConfig({ ...config, sectionSubtitle: e.target.value })}
                placeholder="Seguimiento técnico del avance..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-amber-700 dark:text-amber-400">
                Ajustes del Banner Rojo / Cuenta Regresiva
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showCountdown}
                  onChange={(e) => setConfig({ ...config, showCountdown: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                <span className="ml-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  {config.showCountdown ? "Banner Activado" : "Banner Oculto"}
                </span>
              </label>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                  Etiqueta del Hito (Badge)
                </label>
                <input
                  type="text"
                  value={config.countdownBadge}
                  onChange={(e) => setConfig({ ...config, countdownBadge: e.target.value })}
                  placeholder="Hito Prioritario en Curso"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                  Fecha & Hora Objetivo (Plazo Límite)
                </label>
                <input
                  type="datetime-local"
                  value={getDatetimeLocalValue(config.countdownTargetDate)}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                  Título del Hito Prioritario
                </label>
                <input
                  type="text"
                  value={config.countdownTitle}
                  onChange={(e) => setConfig({ ...config, countdownTitle: e.target.value })}
                  placeholder="Cuenta Regresiva: Proyecto de Ley modificación Ley 154"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                  Quién debe cumplir (Responsable)
                </label>
                <input
                  type="text"
                  value={config.countdownResponsible || ""}
                  onChange={(e) => setConfig({ ...config, countdownResponsible: e.target.value })}
                  placeholder="Ej. MEFP + 9 GAD"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                Descripción o Mandato del Plazo
              </label>
              <textarea
                rows={2}
                value={config.countdownDescription}
                onChange={(e) => setConfig({ ...config, countdownDescription: e.target.value })}
                placeholder="La Mesa Técnica Jurídica-Fiscal tiene como mandato..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#0F2942] text-xs font-black transition disabled:opacity-50 shadow-md"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              <span>Guardar Configuración General</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
