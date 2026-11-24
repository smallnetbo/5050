"use client";

import { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import {
  BoardCommitmentItem,
  BoardLevelCode,
  BoardRubroCode,
  BoardStatusCat,
  BOARD_LEVELS,
  BOARD_LEVEL_ORDER,
  BOARD_RUBRO_LABELS,
  BOARD_STATUS_LABELS,
} from "@/lib/board-commitments-data";
import { BoardCommitmentInput } from "@/lib/actions/board-commitments.actions";
import { ModalPortal } from "@/components/ModalPortal";

interface BoardCommitmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BoardCommitmentInput) => Promise<void>;
  initialData?: BoardCommitmentItem | null;
}

export function BoardCommitmentModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: BoardCommitmentModalProps) {
  const [formData, setFormData] = useState<BoardCommitmentInput>({
    nivel: "2.1",
    rubro: "fiscal",
    tematica: "",
    entregable: "",
    responsable: "",
    estado: "Sin plazo",
    cat: "sin_plazo",
    order: 0,
    active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        nivel: initialData.nivel,
        rubro: initialData.rubro,
        tematica: initialData.tematica,
        entregable: initialData.entregable,
        responsable: initialData.responsable,
        estado: initialData.estado,
        cat: initialData.cat,
        order: initialData.order ?? initialData.id,
        active: initialData.active !== undefined ? initialData.active : true,
      });
    } else {
      setFormData({
        nivel: "2.1",
        rubro: "fiscal",
        tematica: "",
        entregable: "",
        responsable: "",
        estado: "Sin plazo",
        cat: "sin_plazo",
        order: 0,
        active: true,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {formData.id ? `Editar Compromiso #${formData.id}` : "Nuevo Compromiso del Tablero"}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Registro para el Tablero Interactivo de Compromisos por Nivel (2.1 - 2.7).
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  Nivel de Gobierno *
                </label>
                <select
                  required
                  value={formData.nivel}
                  onChange={(e) => setFormData({ ...formData, nivel: e.target.value as BoardLevelCode })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  {BOARD_LEVEL_ORDER.map((code) => (
                    <option key={code} value={code}>
                      {BOARD_LEVELS[code].shortLabel} — {BOARD_LEVELS[code].title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  Rubro Temático *
                </label>
                <select
                  required
                  value={formData.rubro}
                  onChange={(e) => setFormData({ ...formData, rubro: e.target.value as BoardRubroCode })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  {(Object.keys(BOARD_RUBRO_LABELS) as BoardRubroCode[]).map((r) => (
                    <option key={r} value={r}>
                      {BOARD_RUBRO_LABELS[r]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                Temática / Título *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Ley N° 154, Salud, Reporte único..."
                value={formData.tematica}
                onChange={(e) => setFormData({ ...formData, tematica: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                ¿Qué debe hacerse? / Entregable *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe el entregable concreto o acción comprometida..."
                value={formData.entregable}
                onChange={(e) => setFormData({ ...formData, entregable: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                Responsable(s) *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. MEFP + SEA + GAD + GAM"
                value={formData.responsable}
                onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  Categoría Semáforo *
                </label>
                <select
                  required
                  value={formData.cat}
                  onChange={(e) => setFormData({ ...formData, cat: e.target.value as BoardStatusCat })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  {(Object.keys(BOARD_STATUS_LABELS) as BoardStatusCat[]).map((cat) => (
                    <option key={cat} value={cat}>
                      {BOARD_STATUS_LABELS[cat].title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  Texto de Estado *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Cumplido, En proceso, Noviembre 2026..."
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  Orden
                </label>
                <input
                  type="number"
                  value={formData.order ?? 0}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="board-active-check"
                type="checkbox"
                checked={formData.active ?? true}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="board-active-check" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Visible en el portal público
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#0F2942] text-xs font-black transition disabled:opacity-50 shadow-md"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span>{formData.id ? "Guardar Cambios" : "Crear Compromiso"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}
