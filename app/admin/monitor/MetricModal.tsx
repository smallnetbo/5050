"use client";

import { useState, useEffect } from "react";
import { MonitorMetricInput } from "@/lib/actions/monitor.actions";
import {
  Clock,
  Scale,
  Building,
  CheckCircle2,
  TrendingUp,
  Users,
  Calendar,
  ShieldCheck,
  FileText,
  Sparkles,
  Activity,
  Award,
  AlertCircle,
  BarChart3,
  Flame,
  Globe2,
  X,
  Save,
  Loader2,
} from "lucide-react";

interface MetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MonitorMetricInput) => Promise<void>;
  initialData?: MonitorMetricInput | null;
}

const AVAILABLE_ICONS = [
  { name: "Clock", label: "Reloj", icon: Clock },
  { name: "Scale", label: "Balanza", icon: Scale },
  { name: "Building", label: "Edificio", icon: Building },
  { name: "CheckCircle2", label: "Verificación", icon: CheckCircle2 },
  { name: "TrendingUp", label: "Crecimiento", icon: TrendingUp },
  { name: "Users", label: "Personas", icon: Users },
  { name: "Calendar", label: "Calendario", icon: Calendar },
  { name: "ShieldCheck", label: "Seguridad", icon: ShieldCheck },
  { name: "FileText", label: "Documento", icon: FileText },
  { name: "Sparkles", label: "Destacado", icon: Sparkles },
  { name: "Activity", label: "Monitoreo", icon: Activity },
  { name: "Award", label: "Logro", icon: Award },
  { name: "AlertCircle", label: "Alerta", icon: AlertCircle },
  { name: "BarChart3", label: "Estadística", icon: BarChart3 },
  { name: "Flame", label: "Prioridad", icon: Flame },
  { name: "Globe2", label: "Territorial", icon: Globe2 },
];

const COLOR_OPTIONS = [
  { id: "amber", label: "Ámbar / En curso", bg: "bg-amber-500", text: "text-amber-600" },
  { id: "red", label: "Rojo / Prioritario", bg: "bg-[#dd3146]", text: "text-[#dd3146]" },
  { id: "emerald", label: "Esmeralda / Cumplido", bg: "bg-emerald-500", text: "text-emerald-600" },
  { id: "blue", label: "Azul Autonómico", bg: "bg-blue-600", text: "text-blue-600" },
  { id: "purple", label: "Púrpura", bg: "bg-purple-600", text: "text-purple-600" },
];

export function MetricModal({ isOpen, onClose, onSave, initialData }: MetricModalProps) {
  const [formData, setFormData] = useState<MonitorMetricInput>({
    title: "",
    responsible: "",
    deliverable: "",
    deadlineDate: "",
    value: "",
    description: "",
    badge: "En curso",
    category: "General",
    iconName: "Clock",
    colorScheme: "amber",
    active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        order: initialData.order,
        title: initialData.title || "",
        responsible: initialData.responsible || "",
        deliverable: initialData.deliverable || initialData.description || "",
        deadlineDate: initialData.deadlineDate || "",
        value: initialData.value || "",
        description: initialData.description || initialData.deliverable || "",
        badge: initialData.badge || "En curso",
        category: initialData.category || "General",
        iconName: initialData.iconName || "Clock",
        colorScheme: initialData.colorScheme || "amber",
        active: initialData.active ?? true,
      });
    } else {
      setFormData({
        title: "",
        responsible: "",
        deliverable: "",
        deadlineDate: "",
        value: "",
        description: "",
        badge: "En curso",
        category: "General",
        iconName: "Clock",
        colorScheme: "amber",
        active: true,
      });
    }
    setErrorMsg(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Actualizar días automáticamente si se cambia la fecha límite y el valor está vacío
  const handleDateChange = (dateVal: string) => {
    const updated = { ...formData, deadlineDate: dateVal };
    if (dateVal) {
      try {
        const target = new Date(dateVal.includes("T") ? dateVal : `${dateVal}T23:59:59`).getTime();
        const diff = target - Date.now();
        const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
        if (!formData.value || formData.value.includes("Días")) {
          updated.value = `${days} Días`;
        }
      } catch {
        // ignore
      }
    }
    setFormData(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMsg("El nombre del Contador / Hito es requerido.");
      return;
    }
    if (!formData.responsible?.trim()) {
      setErrorMsg("Debe especificar 'Quién debe cumplir' (Responsable).");
      return;
    }
    if (!formData.deliverable?.trim() && !formData.description?.trim()) {
      setErrorMsg("Debe indicar 'Qué debe entregar' (Entregable/Mandato).");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      await onSave({
        ...formData,
        description: formData.deliverable || formData.description,
        value: formData.value?.trim() || "0",
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || "Ocurrió un error al guardar el hito.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {formData.id ? "Editar Hito de Monitoreo" : "Nuevo Hito de Monitoreo"}
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Registro para la lista de plazos y compromisos técnicos del Acuerdo 50/50.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs font-bold text-rose-600 dark:text-rose-400">
              {errorMsg}
            </div>
          )}

          {/* 1. Contador (Nombre del Hito) */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
              Contador / Nombre del Hito *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej. Respuesta técnica FPIEEH / Proyecto de Ley modificación Ley 154"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-hidden"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* 2. Quién debe cumplir */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                Quién debe cumplir (Responsable) *
              </label>
              <input
                type="text"
                value={formData.responsible || ""}
                onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                placeholder="Ej. Min. Hidrocarburos + MEFP / MEFP + 9 GAD"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            {/* 4. Fecha Límite */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                Fecha Límite *
              </label>
              <input
                type="date"
                value={formData.deadlineDate || ""}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>
          </div>

          {/* 3. Qué debe entregar */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
              Qué debe entregar (Entregable / Mandato) *
            </label>
            <textarea
              rows={3}
              value={formData.deliverable || formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  deliverable: e.target.value,
                  description: e.target.value,
                })
              }
              placeholder="Ej. Informe que diga si es viable: (a) suspender el 12% del FPIEEH a los GAM en 2027, (b) devolver lo retenido en 2025, (c) aplicarlo progresivamente en los siguientes años..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden resize-none"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* 5. Días restantes */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                Días Restantes (o texto de plazo)
              </label>
              <input
                type="text"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="Ej. 12 Días / 32 Días"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            {/* Categoría o Ámbito */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                Ámbito / Eje Temático
              </label>
              <input
                type="text"
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Ej. FPIEEH, Dominio Tributario, Regalías"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>
          </div>

          {/* Color Scheme Picker */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-2">
              Color de Alerta
            </label>
            <div className="flex flex-wrap gap-2.5">
              {COLOR_OPTIONS.map((col) => {
                const isSelected = formData.colorScheme === col.id;
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, colorScheme: col.id })}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition ${
                      isSelected
                        ? "border-slate-900 dark:border-white ring-2 ring-emerald-500/50 bg-slate-50 dark:bg-slate-800"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${col.bg}`}></span>
                    <span>{col.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Switch */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-xs font-black text-slate-800 dark:text-white">
                Mostrar en la Lista Pública
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Si está desactivado, el hito no aparecerá en la tabla del portal.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#0F2942] text-xs font-black transition disabled:opacity-50 shadow-md"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              <span>{formData.id ? "Guardar Hito" : "Crear Hito"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
