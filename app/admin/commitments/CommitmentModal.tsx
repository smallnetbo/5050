"use client";

import { useState, useEffect } from "react";
import { CommitmentInput } from "@/lib/actions/commitments.actions";
import { X, Save, Loader2, Landmark, Building2, Building, Layers } from "lucide-react";

interface CommitmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CommitmentInput) => Promise<void>;
  initialData?: CommitmentInput | null;
  defaultLevelId?: "nce" | "gad" | "gam" | "conjunto";
}

const LEVEL_OPTIONS = [
  { id: "nce", name: "Presidente / Gobierno Nacional (NCE)", icon: Landmark },
  { id: "gad", name: "Gobiernos Autónomos Departamentales (GAD)", icon: Building2 },
  { id: "gam", name: "GAM (9 capitales + El Alto) — AMB", icon: Building },
  { id: "conjunto", name: "Compromisos conjuntos", icon: Layers },
];

const QUICK_STATUSES = [
  "14/10/2026",
  "03/11/2026",
  "Sin plazo",
  "Cumplido",
  "Entregado",
  "Continuo",
  "En curso",
  "Permanente",
];

export function CommitmentModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultLevelId = "nce",
}: CommitmentModalProps) {
  const [formData, setFormData] = useState<CommitmentInput>({
    levelId: defaultLevelId,
    commitment: "",
    deliverable: "",
    responsible: "",
    status: "Sin plazo",
    deadlineDate: "",
    category: "General",
    active: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        levelId: initialData.levelId,
        levelName: initialData.levelName,
        commitment: initialData.commitment || "",
        deliverable: initialData.deliverable || "",
        responsible: initialData.responsible || "",
        status: initialData.status || "Sin plazo",
        deadlineDate: initialData.deadlineDate || "",
        category: initialData.category || "General",
        order: initialData.order,
        active: initialData.active ?? true,
      });
    } else {
      setFormData({
        levelId: defaultLevelId,
        commitment: "",
        deliverable: "",
        responsible: "",
        status: "Sin plazo",
        deadlineDate: "",
        category: "General",
        active: true,
      });
    }
    setErrorMsg(null);
  }, [initialData, defaultLevelId, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.commitment.trim()) {
      setErrorMsg("El nombre del compromiso es requerido.");
      return;
    }
    if (!formData.deliverable.trim()) {
      setErrorMsg("Debe especificar '¿Qué debe entregar realmente?'.");
      return;
    }
    if (!formData.responsible.trim()) {
      setErrorMsg("Debe indicar la entidad responsable ('Quién').");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || "Ocurrió un error al guardar el compromiso.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header Modal */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {formData.id ? "Editar Compromiso" : "Nuevo Compromiso por Nivel"}
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Registro para la matriz de entregables de la Agenda 50/50.
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

          {/* Nivel de Gobierno */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
              Nivel de Gobierno *
            </label>
            <div className="grid sm:grid-cols-2 gap-2">
              {LEVEL_OPTIONS.map((lvl) => {
                const Icon = lvl.icon;
                const isSelected = formData.levelId === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        levelId: lvl.id as any,
                        levelName: lvl.name,
                      })
                    }
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left text-xs font-bold transition ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/20"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <Icon size={16} className="shrink-0 text-emerald-500" />
                    <span className="truncate">{lvl.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Compromiso */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                Compromiso (Nombre) *
              </label>
              <input
                type="text"
                required
                value={formData.commitment}
                onChange={(e) => setFormData({ ...formData, commitment: e.target.value })}
                placeholder="Ej. FPIEEH, Ley 154, Salud"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            {/* Quién (Responsable) */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                Quién (Entidad Responsable) *
              </label>
              <input
                type="text"
                required
                value={formData.responsible}
                onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                placeholder="Ej. Min. Hidrocarburos + MEFP, Cada GAD, AMB"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>
          </div>

          {/* ¿Qué debe entregar realmente? */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
              ¿Qué debe entregar realmente? (Entregable / Mandato) *
            </label>
            <textarea
              rows={3}
              required
              value={formData.deliverable}
              onChange={(e) => setFormData({ ...formData, deliverable: e.target.value })}
              placeholder="Describa con precisión técnica qué documento, informe, proyecto de ley o norma debe entregarse..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden resize-none"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Estado / Plazo */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                Estado / Plazo Oficial *
              </label>
              <input
                type="text"
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                placeholder="Ej. 14/10/2026, Sin plazo, Cumplido"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
              <div className="flex flex-wrap gap-1 mt-2">
                {QUICK_STATUSES.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      const updated: any = { status: st };
                      if (st.includes("/")) {
                        const parts = st.split("/");
                        if (parts.length === 3) {
                          updated.deadlineDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
                        }
                      }
                      setFormData({ ...formData, ...updated });
                    }}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                Categoría / Eje Temático
              </label>
              <input
                type="text"
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Ej. Tributario, Fiscal, Normativo, Deuda"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>
          </div>

          {/* Active Switch */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-xs font-black text-slate-800 dark:text-white">
                Visible en la Tabla Pública
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Si está desactivado, el compromiso se ocultará del portal sin ser eliminado.
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
              <span>{formData.id ? "Guardar Cambios" : "Crear Compromiso"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
