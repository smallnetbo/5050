"use client";

import { useState } from "react";
import { Pillar } from "@/lib/agenda-data";
import { upsertPillarAction, deletePillarAction } from "@/lib/actions/pillars.actions";
import {
  Save,
  Trash2,
  Plus,
  X,
  Scale,
  LockOpen,
  Briefcase,
  Landmark,
  PieChart,
  TrendingUp,
  Building2,
  Globe,
  ShieldCheck,
  Coins,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from "lucide-react";

interface PillarFormProps {
  initialData?: Pillar;
  isNew?: boolean;
  displayIndex?: number;
  isFirst?: boolean;
  isLast?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  disabled?: boolean;
  onSuccess?: () => void;
}

const AVAILABLE_ICONS = [
  { name: "Scale", label: "Balanza / Fiscal", Icon: Scale },
  { name: "LockOpen", label: "Candado / Libertad", Icon: LockOpen },
  { name: "Briefcase", label: "Maletín / Gestión", Icon: Briefcase },
  { name: "Landmark", label: "Edificio / Ley", Icon: Landmark },
  { name: "PieChart", label: "Gráfico / Coparticipación", Icon: PieChart },
  { name: "TrendingUp", label: "Tendencia / Alivio", Icon: TrendingUp },
  { name: "Building2", label: "Empresa / APP", Icon: Building2 },
  { name: "Globe", label: "Globo / Internacional", Icon: Globe },
  { name: "ShieldCheck", label: "Escudo / Protección", Icon: ShieldCheck },
  { name: "Coins", label: "Monedas / Fondos", Icon: Coins },
];

const CATEGORIES = ["Fiscal", "Competencial", "Institucional", "Normativo"] as const;

export function PillarForm({
  initialData,
  isNew = false,
  displayIndex,
  isFirst = false,
  isLast = false,
  onMoveUp,
  onMoveDown,
  disabled = false,
  onSuccess,
}: PillarFormProps) {
  const [isOpen, setIsOpen] = useState(isNew);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [id] = useState<number | undefined>(initialData?.id);
  const [title, setTitle] = useState(initialData?.title || "");
  const [category, setCategory] = useState<"Fiscal" | "Competencial" | "Institucional" | "Normativo">(
    initialData?.category || "Fiscal"
  );
  const [iconName, setIconName] = useState(initialData?.iconName || "Scale");
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [actions, setActions] = useState<string[]>(
    initialData?.actions && initialData.actions.length > 0 ? initialData.actions : [""]
  );

  const handleActionChange = (index: number, value: string) => {
    const updated = [...actions];
    updated[index] = value;
    setActions(updated);
  };

  const addActionField = () => {
    setActions([...actions, ""]);
  };

  const removeActionField = (index: number) => {
    if (actions.length <= 1) {
      setActions([""]);
      return;
    }
    setActions(actions.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await upsertPillarAction({
      id,
      title,
      category,
      iconName,
      summary,
      actions: actions.filter((a) => a.trim() !== ""),
    });

    setLoading(false);

    if (res.success) {
      setMessage({ type: "success", text: res.message || "Guardado exitosamente." });
      if (isNew) {
        setTitle("");
        setSummary("");
        setActions([""]);
        if (onSuccess) onSuccess();
      }
    } else {
      setMessage({ type: "error", text: res.error || "Error al guardar." });
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm(`¿Está seguro de eliminar el pilar #${id}: "${title}"?`)) return;

    setLoading(true);
    const res = await deletePillarAction(id);
    setLoading(false);

    if (res.success) {
      alert("Pilar eliminado correctamente.");
      if (onSuccess) onSuccess();
    } else {
      setMessage({ type: "error", text: res.error || "Error al eliminar." });
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition">
      {/* Header Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 cursor-pointer flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
      >
        <div className="flex items-center gap-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-black text-sm">
            {displayIndex ? `#${displayIndex}` : isNew ? "+" : `#${id}`}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 text-[10px] font-black uppercase">
                {category}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {actions.filter((a) => a.trim()).length} acciones
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {title || (isNew ? "Crear Nuevo Pilar" : "Sin Título")}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {!isNew && onMoveUp && (
            <button
              type="button"
              disabled={isFirst || disabled}
              onClick={onMoveUp}
              title="Mover Arriba"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronUp size={18} />
            </button>
          )}

          {!isNew && onMoveDown && (
            <button
              type="button"
              disabled={isLast || disabled}
              onClick={onMoveDown}
              title="Mover Abajo"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronDown size={18} />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 ml-1"
          >
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Expandable Form */}
      {isOpen && (
        <form onSubmit={handleSave} className="p-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
          {message && (
            <div
              className={`p-4 rounded-2xl text-xs font-bold ${
                message.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  : "bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Title */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black uppercase text-slate-700 dark:text-slate-300">
                Título del Pilar *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Autonomía tributaria y esfuerzo fiscal"
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3.5 text-sm font-semibold text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-700 dark:text-slate-300">
                Categoría *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3.5 text-sm font-semibold text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Icon */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-700 dark:text-slate-300">
                Icono Visual *
              </label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3.5 text-sm font-semibold text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
              >
                {AVAILABLE_ICONS.map((ic) => (
                  <option key={ic.name} value={ic.name}>
                    {ic.name} — ({ic.label})
                  </option>
                ))}
              </select>
            </div>

            {/* Summary */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black uppercase text-slate-700 dark:text-slate-300">
                Resumen de la Medida *
              </label>
              <textarea
                required
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Breve resumen del objetivo de este pilar..."
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3.5 text-sm font-semibold text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Actions List */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase text-slate-700 dark:text-slate-300">
                  Acciones Acordadas (Compromisos Concretos)
                </label>
                <button
                  type="button"
                  onClick={addActionField}
                  className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
                >
                  <Plus size={14} /> Agregar Acción
                </button>
              </div>

              <div className="space-y-3">
                {actions.map((act, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={act}
                      onChange={(e) => handleActionChange(index, e.target.value)}
                      placeholder={`Acción #${index + 1}...`}
                      className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-xs font-semibold text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeActionField(index)}
                      className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition"
                      title="Eliminar línea"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Controls */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            {!isNew && id ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 px-4 py-2.5 text-xs font-extrabold transition disabled:opacity-50"
              >
                <Trash2 size={16} /> Eliminar Pilar
              </button>
            ) : (
              <div></div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-6 py-3 text-xs shadow-lg transition disabled:opacity-50"
            >
              <Save size={16} /> {loading ? "Guardando..." : isNew ? "Crear Pilar" : "Guardar Cambios"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
