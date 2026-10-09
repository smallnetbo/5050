"use client";

import { useState } from "react";
import { CommitmentLevel, CommitmentItem } from "@/lib/commitments-data";
import {
  CommitmentLevelInput,
  upsertCommitmentLevelAction,
  deleteCommitmentLevelAction,
  reorderCommitmentLevelsAction,
  toggleCommitmentLevelAction,
  seedCommitmentLevelsAction,
} from "@/lib/actions/commitment-levels.actions";
import {
  X,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Check,
  AlertCircle,
  Loader2,
  Landmark,
  Building2,
  Building,
  Layers,
  Scale,
  Shield,
  ShieldCheck,
  Users,
  Globe,
  BookOpen,
  GraduationCap,
  Briefcase,
  Award,
  Sparkles,
  Flag,
  Compass,
  Eye,
  EyeOff,
  SlidersHorizontal,
} from "lucide-react";

export const LEVEL_ICONS_MAP: Record<string, React.ElementType> = {
  Landmark,
  Building2,
  Building,
  Layers,
  Scale,
  Shield,
  ShieldCheck,
  Users,
  Globe,
  BookOpen,
  GraduationCap,
  Briefcase,
  Award,
  Sparkles,
  Flag,
  Compass,
};

export const COLOR_SCHEMES: { id: string; label: string; badgeCls: string; borderCls: string; bgActive: string }[] = [
  { id: "blue", label: "Azul (Nivel Central)", badgeCls: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-300/30", borderCls: "border-blue-400", bgActive: "bg-blue-500" },
  { id: "emerald", label: "Esmeralda (Departamentos)", badgeCls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300/30", borderCls: "border-emerald-400", bgActive: "bg-emerald-500" },
  { id: "amber", label: "Ámbar (Municipios)", badgeCls: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300/30", borderCls: "border-amber-400", bgActive: "bg-amber-500" },
  { id: "purple", label: "Púrpura (Conjuntos)", badgeCls: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-300/30", borderCls: "border-purple-400", bgActive: "bg-purple-500" },
  { id: "indigo", label: "Índigo", badgeCls: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-300/30", borderCls: "border-indigo-400", bgActive: "bg-indigo-500" },
  { id: "rose", label: "Rosa", badgeCls: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-300/30", borderCls: "border-rose-400", bgActive: "bg-rose-500" },
  { id: "teal", label: "Verde Azulado (Teal)", badgeCls: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-300/30", borderCls: "border-teal-400", bgActive: "bg-teal-500" },
  { id: "cyan", label: "Cian", badgeCls: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-300/30", borderCls: "border-cyan-400", bgActive: "bg-cyan-500" },
  { id: "slate", label: "Gris / Pizarra", badgeCls: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-300/30", borderCls: "border-slate-400", bgActive: "bg-slate-500" },
];

interface CommitmentLevelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  levels: CommitmentLevel[];
  commitments: CommitmentItem[];
  onLevelsUpdated: () => void;
}

export function CommitmentLevelsModal({
  isOpen,
  onClose,
  levels,
  commitments,
  onLevelsUpdated,
}: CommitmentLevelsModalProps) {
  const [editingLevel, setEditingLevel] = useState<CommitmentLevel | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Form State
  const [formId, setFormId] = useState("");
  const [formName, setFormName] = useState("");
  const [formShortName, setFormShortName] = useState("");
  const [formBadge, setFormBadge] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formIconName, setFormIconName] = useState("Landmark");
  const [formColorScheme, setFormColorScheme] = useState("blue");

  // Deletion prompt state
  const [deletePrompt, setDeletePrompt] = useState<{ id: string; name: string; count: number } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleOpenCreate = () => {
    setEditingLevel(null);
    setFormId("");
    setFormName("");
    setFormShortName("");
    setFormBadge("");
    setFormDescription("");
    setFormIconName("Landmark");
    setFormColorScheme("blue");
    setFormError(null);
    setFormSuccess(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (lvl: CommitmentLevel) => {
    setEditingLevel(lvl);
    setFormId(lvl.id);
    setFormName(lvl.name);
    setFormShortName(lvl.shortName);
    setFormBadge(lvl.badge);
    setFormDescription(lvl.description);
    setFormIconName(lvl.iconName || "Landmark");
    setFormColorScheme(lvl.colorScheme || "blue");
    setFormError(null);
    setFormSuccess(null);
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingLevel(null);
    setFormError(null);
  };

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9_-]/g, "-")
      .replace(/-+/g, "-");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const cleanId = (formId.trim() || generateSlug(formShortName || formName)).toLowerCase();
    if (!cleanId) {
      setFormError("El identificador (slug) es obligatorio.");
      return;
    }
    if (!formName.trim()) {
      setFormError("El nombre oficial completo es obligatorio.");
      return;
    }
    if (!formShortName.trim()) {
      setFormError("El nombre corto para pestañas es obligatorio.");
      return;
    }
    if (!formBadge.trim()) {
      setFormError("La etiqueta / badge superior es obligatoria.");
      return;
    }

    setIsSaving(true);
    try {
      const payload: CommitmentLevelInput = {
        id: cleanId,
        oldId: editingLevel ? editingLevel.id : undefined,
        name: formName.trim(),
        shortName: formShortName.trim(),
        badge: formBadge.trim(),
        description: formDescription.trim(),
        iconName: formIconName,
        colorScheme: formColorScheme,
        active: editingLevel ? editingLevel.active ?? true : true,
      };

      const res = await upsertCommitmentLevelAction(payload);
      if (res.success) {
        setFormSuccess(res.message || "Nivel guardado correctamente.");
        setIsFormOpen(false);
        setEditingLevel(null);
        onLevelsUpdated();
      } else {
        setFormError(res.error || "Error al guardar el nivel.");
      }
    } catch (err: any) {
      setFormError(err?.message || "Ocurrió un error inesperado.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRequest = (lvl: CommitmentLevel) => {
    const count = commitments.filter((c) => c.levelId === lvl.id).length;
    setDeletePrompt({ id: lvl.id, name: lvl.shortName || lvl.name, count });
  };

  const handleConfirmDelete = async (force: boolean = false) => {
    if (!deletePrompt) return;
    setIsDeleting(true);
    try {
      const res = await deleteCommitmentLevelAction(deletePrompt.id, force);
      if (res.success) {
        setDeletePrompt(null);
        setFormSuccess("Nivel eliminado con éxito.");
        onLevelsUpdated();
      } else {
        if (res.hasCommitments && !force) {
          // Re-solicitar confirmación forzada
          setDeletePrompt({
            id: deletePrompt.id,
            name: deletePrompt.name,
            count: res.count || deletePrompt.count,
          });
        }
        alert(res.error || "No se pudo eliminar el nivel.");
      }
    } catch (err: any) {
      alert(err?.message || "Error al eliminar el nivel.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= levels.length) return;

    const reordered = [...levels];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const orderedIds = reordered.map((l) => l.id);
    const res = await reorderCommitmentLevelsAction(orderedIds);
    if (res.success) {
      onLevelsUpdated();
    } else {
      alert(res.error || "Error al reordenar.");
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    const res = await toggleCommitmentLevelAction(id, !currentActive);
    if (res.success) {
      onLevelsUpdated();
    } else {
      alert(res.error || "Error al actualizar visibilidad.");
    }
  };

  const handleRestoreDefaults = async () => {
    if (!confirm("¿Está seguro de restaurar los 4 niveles oficiales por defecto (NCE, GAD, GAM, Conjunto)?")) return;
    const res = await seedCommitmentLevelsAction();
    if (res.success) {
      alert(res.message);
      onLevelsUpdated();
    } else {
      alert(res.error || "Error al restaurar.");
    }
  };

  const PreviewIcon = LEVEL_ICONS_MAP[formIconName] || Landmark;
  const currentPreviewScheme = COLOR_SCHEMES.find((s) => s.id === formColorScheme) || COLOR_SCHEMES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-[#101620] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40">
              <SlidersHorizontal size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                  CRUD Niveles de Gobierno
                </span>
                <span className="text-xs font-bold text-slate-400">({levels.length} Niveles activos)</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Administración de Niveles y Pestañas
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isFormOpen && (
              <button
                onClick={handleOpenCreate}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#0F2942] font-black text-xs transition shadow-sm"
              >
                <Plus size={15} />
                <span>Nuevo Nivel</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Cerrar modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Global Feedback Notifications */}
        {formSuccess && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40 flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2">
              <Check size={16} />
              <span>{formSuccess}</span>
            </div>
            <button onClick={() => setFormSuccess(null)} className="text-emerald-600 hover:opacity-80">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Form: Create / Edit Level */}
          {isFormOpen ? (
            <form onSubmit={handleSave} className="bg-slate-50 dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {editingLevel ? `Editar Nivel: ${editingLevel.shortName}` : "Crear Nuevo Nivel de Gobierno"}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Configure las propiedades del nivel. Aparecerá en las pestañas superiores y en el selector de compromisos.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  Cancelar
                </button>
              </div>

              {formError && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-300/40 flex items-center gap-2 text-xs font-bold">
                  <AlertCircle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ID / Slug */}
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                    Identificador / Slug Único *
                  </label>
                  <input
                    type="text"
                    value={formId}
                    onChange={(e) => setFormId(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                    placeholder="ej: nce, gad, gam, universidades"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Solo minúsculas, números, guiones. Clave primaria en base de datos.
                  </p>
                </div>

                {/* Short Name */}
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                    Nombre Corto (Para Pestañas & Tablas) *
                  </label>
                  <input
                    type="text"
                    value={formShortName}
                    onChange={(e) => {
                      setFormShortName(e.target.value);
                      if (!formId && !editingLevel) {
                        setFormId(generateSlug(e.target.value));
                      }
                    }}
                    placeholder="ej: Nivel Central (NCE), Municipios (GAM)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Texto visible en la pestaña superior y badges de tabla.
                  </p>
                </div>

                {/* Full Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                    Nombre Oficial Completo *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="ej: Presidente / Gobierno Nacional (NCE), Gobiernos Autónomos Departamentales (GAD)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                {/* Badge Label */}
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                    Etiqueta / Badge Superior *
                  </label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="ej: Ejecutivo Nacional, 9 Departamentos, 10 Ciudades"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Aparece en mayúsculas en la parte superior del botón de pestaña.
                  </p>
                </div>

                {/* Color Scheme Picker */}
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                    Esquema de Color Institucional
                  </label>
                  <select
                    value={formColorScheme}
                    onChange={(e) => setFormColorScheme(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {COLOR_SCHEMES.map((scheme) => (
                      <option key={scheme.id} value={scheme.id}>
                        {scheme.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                    Descripción del Nivel de Gobierno
                  </label>
                  <textarea
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Detalle de competencias o alcance institucional de este nivel..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Icon Picker */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2">
                    Ícono Representativo
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {Object.keys(LEVEL_ICONS_MAP).map((iconKey) => {
                      const IconItem = LEVEL_ICONS_MAP[iconKey];
                      const isSelected = formIconName === iconKey;
                      return (
                        <button
                          key={iconKey}
                          type="button"
                          onClick={() => setFormIconName(iconKey)}
                          className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition ${
                            isSelected
                              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-md scale-105"
                              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <IconItem size={18} />
                          <span className="text-[10px] font-bold truncate max-w-[65px]">{iconKey}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Live Preview Card */}
                <div className="md:col-span-2 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Vista Previa de la Pestaña
                  </div>
                  <div className="p-3.5 max-w-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 shadow-xs flex flex-col justify-between min-h-[80px]">
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold opacity-75">
                      <span className="truncate max-w-[90px]">{formBadge || "BADGE"}</span>
                      <span>0</span>
                    </div>
                    <div className="mt-1.5 flex items-start gap-1.5 text-xs font-black leading-snug">
                      <PreviewIcon size={14} className="shrink-0 mt-0.5" />
                      <span className="line-clamp-2 leading-tight break-words">{formShortName || "Nombre del Nivel"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#0F2942] font-black text-xs transition shadow-md disabled:opacity-50"
                >
                  {isSaving && <Loader2 size={14} className="animate-spin" />}
                  <span>{editingLevel ? "Actualizar Nivel" : "Crear Nivel"}</span>
                </button>
              </div>
            </form>
          ) : null}

          {/* Delete Prompt Modal / Warning */}
          {deletePrompt && (
            <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300/40 space-y-3">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-black text-sm">
                <AlertCircle size={18} />
                <span>¿Confirmar eliminación del nivel &quot;{deletePrompt.name}&quot;?</span>
              </div>
              {deletePrompt.count > 0 ? (
                <div className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  <strong>Atención:</strong> Este nivel tiene <strong>{deletePrompt.count} compromisos oficiales</strong> asociados.
                  Si elimina este nivel de forma definitiva, se eliminarán o quedarán sin categoría estos compromisos.
                </div>
              ) : (
                <div className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  Este nivel no tiene compromisos asociados y puede eliminarse con total seguridad.
                </div>
              )}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletePrompt(null)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => handleConfirmDelete(deletePrompt.count > 0)}
                  className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition flex items-center gap-1.5"
                >
                  {isDeleting && <Loader2 size={13} className="animate-spin" />}
                  <span>{deletePrompt.count > 0 ? "Eliminar de todas formas" : "Confirmar eliminación"}</span>
                </button>
              </div>
            </div>
          )}

          {/* List of Existing Levels */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-wider px-1">
              <span>Niveles de Gobierno Configurados ({levels.length})</span>
              <span>Acciones</span>
            </div>

            {levels.map((lvl, index) => {
              const IconComp = LEVEL_ICONS_MAP[lvl.iconName] || Landmark;
              const count = commitments.filter((c) => c.levelId === lvl.id).length;
              const scheme = COLOR_SCHEMES.find((s) => s.id === lvl.colorScheme) || COLOR_SCHEMES[0];

              return (
                <div
                  key={lvl.id}
                  className={`p-4 rounded-3xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    lvl.active === false
                      ? "bg-slate-100/60 dark:bg-slate-900/40 border-dashed border-slate-300 dark:border-slate-800 opacity-60"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300"
                  }`}
                >
                  {/* Left: Info */}
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <div className="flex flex-col gap-1 items-center shrink-0">
                      <button
                        onClick={() => handleMove(index, "up")}
                        disabled={index === 0}
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        title="Subir orden"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        onClick={() => handleMove(index, "down")}
                        disabled={index === levels.length - 1}
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        title="Bajar orden"
                      >
                        <ArrowDown size={13} />
                      </button>
                    </div>

                    <div className={`p-3 rounded-2xl border ${scheme.badgeCls} shrink-0`}>
                      <IconComp size={20} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {lvl.badge}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          id: <strong>{lvl.id}</strong>
                        </span>
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300/30">
                          {count} compromisos
                        </span>
                        {lvl.active === false && (
                          <span className="text-[10px] font-black uppercase text-amber-600 px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200">
                            Inactivo
                          </span>
                        )}
                      </div>
                      <h4 className="mt-1 text-sm font-black text-slate-900 dark:text-white truncate">
                        {lvl.shortName} <span className="text-xs font-normal text-slate-400">({lvl.name})</span>
                      </h4>
                      {lvl.description && (
                        <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{lvl.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(lvl.id, lvl.active ?? true)}
                      className={`p-2 rounded-xl border text-xs font-bold transition ${
                        lvl.active === false
                          ? "border-slate-300 text-slate-400 hover:text-slate-600"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                      title={lvl.active === false ? "Activar nivel" : "Desactivar nivel (ocultar de la vista pública)"}
                    >
                      {lvl.active === false ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(lvl)}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
                      title="Editar propiedades del nivel"
                    >
                      <Edit2 size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteRequest(lvl)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition"
                      title="Eliminar este nivel"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={handleRestoreDefaults}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition"
            title="Restaurar los 4 niveles oficiales predeterminados del Acuerdo Sucre"
          >
            <RotateCcw size={14} />
            <span>Restaurar Oficiales (4)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black text-xs hover:opacity-90 transition shadow-sm"
          >
            Listo / Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
