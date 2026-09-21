"use client";

import { useState } from "react";
import { DocumentItem } from "@/lib/agenda-data";
import { upsertDocumentAction } from "@/lib/actions/documents.actions";
import { X, Upload, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  document?: DocumentItem | null;
  onClose: () => void;
  onSaved: () => void;
}

export function DocumentModalForm({ document, onClose, onSaved }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(document?.title || "");
  const [category, setCategory] = useState(document?.category || "Acuerdo");
  const [date, setDate] = useState(document?.date || "05/08/2026");
  const [department, setDepartment] = useState(document?.department || "");
  const [description, setDescription] = useState(document?.description || "");
  const [featured, setFeatured] = useState(document?.featured || false);
  const [fileUrl, setFileUrl] = useState(document?.fileUrl || "");
  const [fileSize, setFileSize] = useState(document?.fileSize || "1.0 MB");
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (document?.id) formData.append("id", document.id);
      formData.append("title", title);
      formData.append("category", category);
      formData.append("date", date);
      formData.append("department", department);
      formData.append("description", description);
      formData.append("featured", featured ? "true" : "false");
      formData.append("existingFileUrl", fileUrl);
      formData.append("existingFileSize", fileSize);

      if (pdfFile) formData.append("file", pdfFile);

      const res = await upsertDocumentAction(formData);

      if (res.success) {
        onSaved();
      } else {
        setError(res.error || "Error al guardar el documento.");
      }
    } catch (err: any) {
      setError(err.message || "Error inesperado al procesar el formulario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#151D2A] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        {/* Header Modal */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#101620] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                {document ? "Editar Documento PDF" : "Subir Nuevo Documento PDF"}
              </h2>
              <p className="text-xs text-slate-500">
                Complete los metadatos y adjunte el archivo PDF para el DocumentHub.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Título */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Título del Documento *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Anteproyecto de Ley N° 154"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B111A] text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Categoría & Fecha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Categoría *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B111A] text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Acuerdo">Acuerdo</option>
                <option value="Proyecto de Ley">Proyecto de Ley</option>
                <option value="Decreto">Decreto</option>
                <option value="Presentación">Presentación</option>
                <option value="Acta">Acta</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Fecha de Emisión / Publicación *
              </label>
              <input
                type="text"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Ej: 05/08/2026 o 5 de Agosto de 2026"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B111A] text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Departamento Opcional */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Departamento Asociado (Opcional)
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Ej: Chuquisaca, La Paz, Tarija (o dejar en blanco para Nacional)"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B111A] text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Descripción Corta *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Resumen del contenido del documento o acuerdo..."
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B111A] text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Archivo PDF Upload o URL */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-white/5 space-y-3">
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Archivo PDF / Enlace de Descarga
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Subir archivo PDF (recomendado)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  O enlace de URL existente
                </label>
                <input
                  type="text"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="/Acuerdo-001-2026-Agenda-50-50.pdf"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B111A] text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Checkbox Documento Insignia Destacado */}
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <input
              type="checkbox"
              id="featured-check"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="rounded text-emerald-500 focus:ring-emerald-500 h-4 w-4 accent-emerald-500"
            />
            <label htmlFor="featured-check" className="text-xs font-extrabold text-slate-900 dark:text-white cursor-pointer select-none">
              Marcar como Documento Insignia Destacado (Banner Principal)
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-[#0F2942] font-black text-xs transition shadow-md disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Subiendo...
                </>
              ) : (
                <>
                  <Upload size={16} /> {document ? "Actualizar Documento" : "Guardar Documento"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
