"use client";

import { useState, useTransition } from "react";
import { upsertMilestoneAction, deleteMilestoneAction, MilestoneInput } from "@/lib/actions/timeline.actions";
import { Save, Loader2, CheckCircle2, AlertCircle, Trash2, Plus } from "lucide-react";

interface MilestoneFormProps {
  initialData?: MilestoneInput | null;
  onCancel?: () => void;
}

export function MilestoneForm({ initialData, onCancel }: MilestoneFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<MilestoneInput>({
    id: initialData?.id,
    title: initialData?.title || "",
    dateText: initialData?.dateText || "",
    status: initialData?.status || "En proceso",
    detail: initialData?.detail || "",
    order: initialData?.order || 0,
  });

  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);

    if (!formData.title.trim() || !formData.detail.trim() || !formData.dateText.trim()) {
      setToast({ type: "error", message: "Complete todos los campos requeridos." });
      return;
    }

    startTransition(async () => {
      const res = await upsertMilestoneAction(formData);
      if (res.success) {
        setToast({ type: "success", message: res.message || "Guardado exitosamente." });
        if (onCancel) setTimeout(onCancel, 800);
      } else {
        setToast({ type: "error", message: res.error || "Error al guardar." });
      }
    });
  };

  const handleDelete = () => {
    if (!formData.id) return;
    if (!confirm("¿Está seguro de eliminar este hito?")) return;

    startTransition(async () => {
      const res = await deleteMilestoneAction(formData.id!);
      if (res.success) {
        if (onCancel) onCancel();
      } else {
        setToast({ type: "error", message: res.error || "No se pudo eliminar." });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
        <h3 className="text-lg font-black text-slate-900 dark:text-white">
          {formData.id ? `Editar Hito #${formData.id}` : "Nuevo Hito de la Agenda"}
        </h3>
        {formData.id && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="flex items-center gap-1.5 text-xs font-extrabold text-rose-500 hover:text-rose-600"
          >
            <Trash2 size={14} /> Eliminar Hito
          </button>
        )}
      </div>

      {toast && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold ${
          toast.type === "success" 
            ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
            : "bg-rose-50 text-rose-800 border border-rose-200"
        }`}>
          {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
          Título del Hito *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Ej: Firma del Acuerdo N° 001/2026 en Sucre"
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
            Fecha / Cronograma *
          </label>
          <input
            type="text"
            value={formData.dateText}
            onChange={(e) => setFormData({ ...formData, dateText: e.target.value })}
            placeholder="Ej: 5 de Agosto de 2026"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
            Estado Actual *
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="Cumplido">Cumplido</option>
            <option value="En proceso">En proceso</option>
            <option value="Programado">Programado</option>
            <option value="Meta">Meta</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
          Detalle / Descripción *
        </label>
        <textarea
          rows={3}
          value={formData.detail}
          onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
          placeholder="Detalle técnico del hito y resultados esperados..."
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-xs font-extrabold text-slate-600 dark:text-slate-300"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-[#0F2942] font-black px-6 py-2.5 text-xs shadow-md transition"
        >
          {isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          <span>{isPending ? "Guardando y Revalidando..." : "Guardar Cambios"}</span>
        </button>
      </div>
    </form>
  );
}
