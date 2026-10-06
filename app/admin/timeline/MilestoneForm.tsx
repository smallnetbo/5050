"use client";

import { useState, useTransition } from "react";
import {
  upsertMilestoneAction,
  deleteMilestoneAction,
  MilestoneInput,
  MilestoneDocument,
} from "@/lib/actions/timeline.actions";
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Plus,
  X,
  FileText,
  Users,
  Calendar,
  Tag,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { uploadFileWithProgress } from "@/lib/client-upload";

interface MilestoneFormProps {
  initialData?: MilestoneInput | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function MilestoneForm({ initialData, onSuccess, onCancel }: MilestoneFormProps) {
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(initialData?.title || "");
  const [dateText, setDateText] = useState(initialData?.dateText || "");
  const [status, setStatus] = useState<"Cumplido" | "En proceso" | "Pendiente" | "Programado" | "Meta">(
    initialData?.status || "En proceso"
  );
  const [detail, setDetail] = useState(initialData?.detail || "");
  const [image, setImage] = useState(initialData?.image || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(initialData?.image || "");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const [participants, setParticipants] = useState<string[]>(initialData?.participants || []);
  const [newParticipant, setNewParticipant] = useState("");

  const [documents, setDocuments] = useState<MilestoneDocument[]>(
    initialData?.documents || []
  );
  const [docName, setDocName] = useState("");
  const [docSize, setDocSize] = useState("");

  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Participant tag handlers
  const handleAddParticipant = () => {
    const trimmed = newParticipant.trim();
    if (!trimmed) return;
    if (!participants.includes(trimmed)) {
      setParticipants([...participants, trimmed]);
    }
    setNewParticipant("");
  };

  const handleRemoveParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  // Document handlers
  const handleAddDocument = () => {
    const nameTrimmed = docName.trim();
    const sizeTrimmed = docSize.trim() || "1.0 MB";
    if (!nameTrimmed) return;

    setDocuments([...documents, { name: nameTrimmed, size: sizeTrimmed }]);
    setDocName("");
    setDocSize("");
  };

  const handleRemoveDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);

    if (!title.trim() || !detail.trim() || !dateText.trim()) {
      setToast({ type: "error", message: "Complete los campos obligatorios (*)." });
      return;
    }

    startTransition(async () => {
      let finalImage = image.trim();

      if (imageFile) {
        try {
          setUploadProgress(0);
          finalImage = await uploadFileWithProgress(imageFile, "timeline", (p) => {
            setUploadProgress(p.percent);
          });
          setUploadProgress(100);
        } catch (uploadErr: any) {
          setToast({ type: "error", message: uploadErr.message || "Error al subir la imagen." });
          setUploadProgress(null);
          return;
        }
      }

      const res = await upsertMilestoneAction({
        id: initialData?.id,
        title,
        dateText,
        status,
        detail,
        image: finalImage || null,
        order: initialData?.order,
        participants,
        documents,
      });

      if (res.success) {
        setToast({ type: "success", message: res.message || "Guardado exitosamente." });
        if (onSuccess) {
          setTimeout(() => onSuccess(), 600);
        }
      } else {
        setToast({ type: "error", message: res.error || "Error al guardar hito." });
      }
    });
  };

  const handleDelete = () => {
    if (!initialData?.id) return;
    if (!confirm(`¿Está seguro de eliminar el hito "${title}"?`)) return;

    startTransition(async () => {
      const res = await deleteMilestoneAction(initialData.id!);
      if (res.success) {
        if (onSuccess) onSuccess();
      } else {
        setToast({ type: "error", message: res.error || "No se pudo eliminar el hito." });
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-[#151D2A] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-6"
    >
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1 rounded-md">
            {initialData?.id ? `Modificando Hito #${initialData.id}` : "Nuevo Hito"}
          </span>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {initialData?.id ? "Editar Hito del Cronograma" : "Agregar Nuevo Hito a la Hoja de Ruta"}
          </h3>
        </div>

        {initialData?.id && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 text-xs font-black hover:bg-rose-100 transition"
          >
            <Trash2 size={14} /> Eliminar Hito
          </button>
        )}
      </div>

      {toast && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80"
              : "bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/80"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Info */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
            Título del Hito *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Firma del Acuerdo N° 001/2026 en Sucre"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
              Fecha / Cronograma *
            </label>
            <div className="relative">
              <input
                type="text"
                value={dateText}
                onChange={(e) => setDateText(e.target.value)}
                placeholder="Ej: 5 de Agosto de 2026 / Enero - Julio 2026"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 pl-9 pr-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                required
              />
              <Calendar className="absolute left-3 top-3 text-slate-400" size={14} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
              Estado del Hito *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
            >
              <option value="Cumplido">Cumplido (Verde)</option>
              <option value="En proceso">En proceso (Naranja)</option>
              <option value="Pendiente">Pendiente (Gris)</option>
              <option value="Programado">Programado (Gris/Azul)</option>
              <option value="Meta">Meta (Especial 2027)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
            Detalle / Descripción del Hito *
          </label>
          <textarea
            rows={3}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="Describa brevemente los objetivos, acuerdos alcanzados o próximos pasos técnicos..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
            required
          />
        </div>
      </div>

      {/* Image Input Section (Para círculos de la timeline y tarjeta) */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <label className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ImageIcon size={14} className="text-emerald-500" />
            <span>Imagen del Hito (Círculo de la línea de tiempo y modal)</span>
          </span>
          <span className="text-[10px] font-bold text-slate-400">Opcional</span>
        </label>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Circular preview matching the screenshot circles */}
          <div className="relative shrink-0 flex flex-col items-center gap-1">
            <div className="w-20 h-20 rounded-full border-2 border-emerald-400 dark:border-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.45)] ring-4 ring-emerald-500/20 overflow-hidden bg-slate-900 flex items-center justify-center relative group">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Vista previa circular"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-2 text-slate-400">
                  <ImageIcon size={22} className="mx-auto text-emerald-400 opacity-70" />
                  <span className="text-[9px] font-bold block mt-0.5">Sin img</span>
                </div>
              )}
            </div>
            <span className="text-[10px] font-bold text-slate-400">Vista en círculo</span>

            {imagePreview && (
              <button
                type="button"
                onClick={() => {
                  setImage("");
                  setImageFile(null);
                  setImagePreview("");
                }}
                className="absolute top-0 right-0 p-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow transition"
                title="Quitar imagen"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Upload button and URL field */}
          <div className="flex-1 space-y-2 w-full">
            <div className="flex flex-col sm:flex-row gap-2">
              <label className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs font-black cursor-pointer transition shrink-0">
                <Upload size={14} />
                <span>Subir archivo...</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="hidden"
                />
              </label>

              <input
                type="text"
                value={image}
                onChange={(e) => {
                  setImage(e.target.value);
                  setImagePreview(e.target.value);
                  if (imageFile) setImageFile(null);
                }}
                placeholder="O ingresa ruta/URL (Ej: /assets/video_firma_acuerdo_5050_cover.jpg)"
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {imageFile && (
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <span>Archivo seleccionado: {imageFile.name}</span>
                {uploadProgress !== null && (
                  <span className="text-slate-400">({uploadProgress}%)</span>
                )}
              </div>
            )}
            <p className="text-[11px] text-slate-400">
              Esta imagen se mostrará dentro del círculo de la línea de tiempo y en la cabecera de la tarjeta popup.
            </p>
          </div>
        </div>
      </div>

      {/* Participants Input Section */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <label className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
          <Users size={14} className="text-emerald-500" />
          <span>Actores e Instituciones Involucradas</span>
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            value={newParticipant}
            onChange={(e) => setNewParticipant(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddParticipant();
              }
            }}
            placeholder="Ej: Ministerio de Economía / 9 Gobernadores"
            className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            type="button"
            onClick={handleAddParticipant}
            className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1 transition"
          >
            <Plus size={14} /> Agregar
          </button>
        </div>

        {participants.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {participants.map((p, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60"
              >
                <span>{p}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveParticipant(i)}
                  className="hover:text-rose-500 transition"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Documents Input Section */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <label className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
          <FileText size={14} className="text-emerald-500" />
          <span>Documentos & Resúmenes Adjuntos</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          <input
            type="text"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            placeholder="Nombre doc (Ej: Informe_Diagnostico_2026.pdf)"
            className="sm:col-span-7 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
          <input
            type="text"
            value={docSize}
            onChange={(e) => setDocSize(e.target.value)}
            placeholder="Tamaño (Ej: 3.2 MB)"
            className="sm:col-span-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            type="button"
            onClick={handleAddDocument}
            className="sm:col-span-2 px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-xs font-black text-slate-800 dark:text-slate-100 flex items-center justify-center gap-1 transition"
          >
            <Plus size={14} /> Doc
          </button>
        </div>

        {documents.length > 0 && (
          <div className="space-y-2 pt-1">
            {documents.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 text-xs"
              >
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                  <FileText size={14} className="text-emerald-500" />
                  <span>{doc.name}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({doc.size})</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveDocument(idx)}
                  className="text-slate-400 hover:text-rose-500 transition"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-xs font-extrabold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
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
          <span>{isPending ? "Guardando..." : "Guardar Hito"}</span>
        </button>
      </div>
    </form>
  );
}
