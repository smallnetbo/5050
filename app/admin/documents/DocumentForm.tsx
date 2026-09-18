"use client";

import { useState, useTransition } from "react";
import { upsertDocumentAction, deleteDocumentAction } from "@/lib/actions/documents.actions";
import { Save, Loader2, CheckCircle2, AlertCircle, Trash2, Upload, FileText } from "lucide-react";

interface DocumentFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function DocumentForm({ initialData, onSuccess }: DocumentFormProps) {
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setToast(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await upsertDocumentAction(formData);
      if (res.success) {
        setToast({ type: "success", message: res.message || "Documento guardado." });
        if (onSuccess) onSuccess();
      } else {
        setToast({ type: "error", message: res.error || "Ocurrió un error." });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      <h3 className="text-lg font-black text-slate-900 dark:text-white">
        Subir / Editar Documento PDF (DocumentHub)
      </h3>

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

      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
      {initialData?.fileUrl && <input type="hidden" name="existingFileUrl" value={initialData.fileUrl} />}
      {initialData?.fileSize && <input type="hidden" name="existingFileSize" value={initialData.fileSize} />}

      <div>
        <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
          Título del Documento *
        </label>
        <input
          type="text"
          name="title"
          defaultValue={initialData?.title || ""}
          placeholder="Ej: Anteproyecto de Ley N° 154"
          required
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
            Categoría *
          </label>
          <select
            name="category"
            defaultValue={initialData?.category || "Acuerdo"}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="Acuerdo">Acuerdo</option>
            <option value="Proyecto de Ley">Proyecto de Ley</option>
            <option value="Decreto">Decreto</option>
            <option value="Presentación">Presentación</option>
            <option value="Acta">Acta</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
            Fecha de Publicación *
          </label>
          <input
            type="text"
            name="date"
            defaultValue={initialData?.date || "05/08/2026"}
            placeholder="DD/MM/AAAA"
            required
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
          Descripción Breve *
        </label>
        <textarea
          name="description"
          rows={2}
          defaultValue={initialData?.description || ""}
          placeholder="Resumen del contenido normativo o del acuerdo..."
          required
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* File Upload Box */}
      <div>
        <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
          Archivo PDF a Subir
        </label>
        <div className="flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <Upload className="text-emerald-500 shrink-0" size={24} />
          <input
            type="file"
            name="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            className="text-xs text-slate-500 font-medium file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-emerald-500 file:text-[#0F2942] hover:file:bg-emerald-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          name="featured"
          value="true"
          defaultChecked={initialData?.featured || false}
          className="rounded text-emerald-500 focus:ring-emerald-500 h-4 w-4"
        />
        <label htmlFor="featured" className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
          Marcar como Documento Insignia Destacado
        </label>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0F2942] font-black px-6 py-2.5 text-xs shadow-md transition"
        >
          {isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          <span>{isPending ? "Subiendo y Revalidando..." : "Guardar Documento"}</span>
        </button>
      </div>
    </form>
  );
}
