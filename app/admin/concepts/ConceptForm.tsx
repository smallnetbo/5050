"use client";

import { useState, useTransition } from "react";
import { upsertConceptStepAction, ConceptStepInput } from "@/lib/actions/concept-steps.actions";
import { Save, Loader2, CheckCircle2, AlertCircle, Plus, Trash2 } from "lucide-react";

interface ConceptFormProps {
  initialData: ConceptStepInput;
}

export function ConceptForm({ initialData }: ConceptFormProps) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(initialData.title);
  const [desc, setDesc] = useState(initialData.desc);
  const [tag, setTag] = useState(initialData.tag);
  const [items, setItems] = useState<string[]>(initialData.items || []);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleAddItem = () => {
    setItems([...items, ""]);
  };

  const handleItemChange = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = value;
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);

    startTransition(async () => {
      const res = await upsertConceptStepAction({
        id: initialData.id,
        num: initialData.num,
        title,
        desc,
        tag,
        items,
      });

      if (res.success) {
        setToast({ type: "success", message: res.message || "Concepto actualizado." });
      } else {
        setToast({ type: "error", message: res.error || "Ocurrió un error." });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white font-black text-xs">
            {initialData.num}
          </span>
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            Paso #{initialData.num}: {title || `Concepto ${initialData.num}`}
          </h3>
        </div>
      </div>

      {toast && (
        <div className={`p-3 rounded-xl flex items-center gap-2 text-xs font-bold ${
          toast.type === "success"
            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
            : "bg-rose-50 text-rose-800 border border-rose-200"
        }`}>
          {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
          Título (Pregunta/Encabezado) *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: ¿Qué es la Agenda 50/50?"
          required
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div>
        <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
          Descripción Principal *
        </label>
        <textarea
          rows={3}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Explicación detallada de este punto..."
          required
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div>
        <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
          Etiqueta / Slogan Destacado *
        </label>
        <input
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="Ej: Más autonomía para impulsar el desarrollo"
          required
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Dynamic List of Items / Pills */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
            Puntos Clave / Viñetas
          </label>
          <button
            type="button"
            onClick={handleAddItem}
            className="flex items-center gap-1 text-[11px] font-black text-emerald-600 hover:text-emerald-500"
          >
            <Plus size={14} /> Añadir Punto
          </button>
        </div>

        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleItemChange(idx, e.target.value)}
                placeholder={`Punto ${idx + 1}`}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => handleRemoveItem(idx)}
                className="p-2 text-slate-400 hover:text-rose-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0F2942] font-black px-5 py-2.5 text-xs shadow-md transition"
        >
          {isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          <span>{isPending ? "Guardando..." : "Guardar Cambios"}</span>
        </button>
      </div>
    </form>
  );
}
