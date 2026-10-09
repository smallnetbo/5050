"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DocumentItem } from "@/lib/agenda-data";
import { DocumentModalForm } from "./DocumentModalForm";
import { deleteDocumentAction } from "@/lib/actions/documents.actions";
import { DocumentCategory, DEFAULT_DOCUMENT_CATEGORIES } from "@/components/DocumentHub";
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Download,
  Search,
  Eye,
  Award,
  Loader2,
  AlertTriangle,
  ExternalLink,
  X,
  Calendar,
  ShieldCheck,
  ClipboardList,
  Presentation,
  Paperclip,
  Scale,
  FolderOpen,
  SlidersHorizontal,
  RotateCcw,
  Tag,
  Check,
  CheckCircle2,
} from "lucide-react";

const LOCAL_STORAGE_KEY = "agenda5050_document_categories";

interface Props {
  initialDocuments: DocumentItem[];
}

export function DocumentsClientManager({ initialDocuments }: Props) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [readingDoc, setReadingDoc] = useState<DocumentItem | null>(null);

  // Estado dinámico para el CRUD de categoriesList
  const [categoriesList, setCategoriesList] = useState<DocumentCategory[]>(DEFAULT_DOCUMENT_CATEGORIES);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DocumentCategory | null>(null);
  const [categoryFormLabel, setCategoryFormLabel] = useState("");
  const [categoryFormId, setCategoryFormId] = useState("");
  const [categoryFormError, setCategoryFormError] = useState<string | null>(null);
  const [categoryFormSuccess, setCategoryFormSuccess] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<DocumentCategory | null>(null);

  // Cargar categorías guardadas en localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCategoriesList(parsed);
          }
        }
      } catch (err) {
        console.error("Error al cargar categorías en admin:", err);
      }
    }
  }, []);

  // Persistir cambios en localStorage
  const persistCategories = (newList: DocumentCategory[]) => {
    setCategoriesList(newList);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newList));
      } catch (err) {
        console.error("Error al guardar categorías en admin:", err);
      }
    }
  };

  // Guardar (Crear o Actualizar) Categoría
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryFormError(null);
    setCategoryFormSuccess(null);

    const trimmedLabel = categoryFormLabel.trim();
    if (!trimmedLabel) {
      setCategoryFormError("El nombre de la categoría es obligatorio.");
      return;
    }

    const trimmedId = categoryFormId.trim() || trimmedLabel;

    if (editingCategory) {
      if (editingCategory.id === "all" && trimmedId !== "all") {
        setCategoryFormError("No se puede modificar el identificador de la categoría de sistema 'all'.");
        return;
      }

      const duplicate = categoriesList.some(
        (c) =>
          c.id !== editingCategory.id &&
          (c.id.toLowerCase() === trimmedId.toLowerCase() ||
            c.label.toLowerCase() === trimmedLabel.toLowerCase())
      );
      if (duplicate) {
        setCategoryFormError("Ya existe otra categoría con ese nombre o identificador.");
        return;
      }

      const updated = categoriesList.map((c) =>
        c.id === editingCategory.id ? { ...c, id: trimmedId, label: trimmedLabel } : c
      );
      persistCategories(updated);

      if (activeCategory === editingCategory.id) {
        setActiveCategory(trimmedId);
      }

      setCategoryFormSuccess(`Categoría "${trimmedLabel}" actualizada correctamente.`);
      setEditingCategory(null);
      setCategoryFormLabel("");
      setCategoryFormId("");
    } else {
      const exists = categoriesList.some(
        (c) =>
          c.id.toLowerCase() === trimmedId.toLowerCase() ||
          c.label.toLowerCase() === trimmedLabel.toLowerCase()
      );
      if (exists) {
        setCategoryFormError("Ya existe una categoría con ese nombre o identificador.");
        return;
      }

      const newCategory: DocumentCategory = {
        id: trimmedId,
        label: trimmedLabel,
      };

      const updated = [...categoriesList, newCategory];
      persistCategories(updated);
      setCategoryFormSuccess(`Categoría "${trimmedLabel}" creada con éxito.`);
      setCategoryFormLabel("");
      setCategoryFormId("");
    }
  };

  const handleStartEdit = (cat: DocumentCategory) => {
    setEditingCategory(cat);
    setCategoryFormLabel(cat.label);
    setCategoryFormId(cat.id);
    setCategoryFormError(null);
    setCategoryFormSuccess(null);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setCategoryFormLabel("");
    setCategoryFormId("");
    setCategoryFormError(null);
    setCategoryFormSuccess(null);
  };

  const handleConfirmDelete = (cat: DocumentCategory) => {
    if (cat.id === "all" || cat.isSystem) {
      setCategoryFormError("No se puede eliminar la categoría principal de sistema.");
      return;
    }

    const updated = categoriesList.filter((c) => c.id !== cat.id);
    persistCategories(updated);

    if (activeCategory === cat.id) {
      setActiveCategory("all");
    }

    if (editingCategory?.id === cat.id) {
      handleCancelEdit();
    }

    setCategoryToDelete(null);
    setCategoryFormSuccess(`Categoría "${cat.label}" eliminada con éxito.`);
  };

  const handleResetDefaults = () => {
    persistCategories(DEFAULT_DOCUMENT_CATEGORIES);
    setActiveCategory("all");
    handleCancelEdit();
    setCategoryToDelete(null);
    setCategoryFormSuccess("Categorías restauradas a los valores por defecto.");
  };

  const getCategoryDocCount = (catId: string) => {
    const catObj = categoriesList.find((c) => c.id === catId);
    return initialDocuments.filter((d) => {
      const docCat = (d.category || "").toLowerCase();
      return (
        docCat.includes(catId.toLowerCase()) ||
        (catObj && docCat.includes(catObj.label.toLowerCase()))
      );
    }).length;
  };

  const filteredDocs = initialDocuments.filter((doc) => {
    const currentCatObj = categoriesList.find((c) => c.id === activeCategory);
    const matchesCategory =
      activeCategory === "all"
        ? true
        : activeCategory === "featured"
        ? doc.featured
        : doc.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
          (currentCatObj && doc.category.toLowerCase().includes(currentCatObj.label.toLowerCase()));

    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.department && doc.department.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleCreateNew = () => {
    setSelectedDoc(null);
    setIsFormOpen(true);
  };

  const handleEdit = (doc: DocumentItem) => {
    setSelectedDoc(doc);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await deleteDocumentAction(deletingId);
      setDeletingId(null);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = (category || "").toLowerCase();
    if (cat.includes("acuerdo")) return ShieldCheck;
    if (cat.includes("acta")) return ClipboardList;
    if (cat.includes("presenta")) return Presentation;
    if (cat.includes("anexo")) return Paperclip;
    if (cat.includes("ley")) return Scale;
    return FileText;
  };

  const getCategoryBadge = (category: string) => {
    const cat = (category || "").toLowerCase();
    if (cat.includes("acuerdo")) return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-500/20";
    if (cat.includes("acta")) return "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-500/20";
    if (cat.includes("presenta")) return "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border-purple-500/20";
    if (cat.includes("anexo")) return "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-500/20";
    if (cat.includes("ley")) return "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-500/20";
    return "bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-500/20";
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Search, Category Tabs & Add Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition ${
              activeCategory === "all"
                ? "bg-emerald-500 text-[#0F2942] shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Todos ({initialDocuments.length})
          </button>
          <button
            onClick={() => setActiveCategory("featured")}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-black transition ${
              activeCategory === "featured"
                ? "bg-amber-400 text-[#0F2942] shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Award size={13} /> Destacados ({initialDocuments.filter((d) => d.featured).length})
          </button>
          {categoriesList
            .filter((c) => c.id !== "all")
            .map((cat) => {
              const count = getCategoryDocCount(cat.id);
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition ${
                    isSelected
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
        </div>

        {/* Right Action & Search */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Buscar documento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Botón Gestionar Categorías */}
          <button
            onClick={() => {
              setCategoryFormError(null);
              setCategoryFormSuccess(null);
              setIsCategoryModalOpen(true);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs transition shadow-xs shrink-0 active:scale-95"
            title="Administrar categorías de documentos (Crear, Editar, Eliminar)"
          >
            <SlidersHorizontal size={15} className="text-emerald-500" />
            <span>Gestionar Categorías</span>
          </button>

          <button
            onClick={handleCreateNew}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-[#0F2942] font-black text-xs transition shadow-md shrink-0 active:scale-95"
          >
            <Plus size={16} />
            <span>Subir Documento</span>
          </button>
        </div>
      </div>

      {/* Professional List View of Documents */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 rounded-3xl text-center space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
            <FolderOpen size={24} />
          </div>
          <h3 className="text-sm font-black text-slate-700 dark:text-slate-300">
            No se encontraron documentos en esta categoría o búsqueda.
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Haga clic en &quot;Subir Documento&quot; para adjuntar un nuevo archivo PDF al repositorio.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDocs.map((doc) => {
            const IconComp = getCategoryIcon(doc.category);
            const badgeCls = getCategoryBadge(doc.category);
            const safeUrl = doc.fileUrl || "/Acuerdo-001-2026-Agenda-50-50.pdf";

            return (
              <div
                key={doc.id}
                className={`bg-white dark:bg-slate-900 border rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  doc.featured
                    ? "border-emerald-500/40 ring-1 ring-emerald-500/20"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                {/* Left: Icon & Meta */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                    <IconComp size={22} />
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase ${badgeCls}`}>
                        {doc.category}
                      </span>

                      {doc.featured && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-amber-700 dark:text-amber-300 bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded-full">
                          <Award size={11} /> Documento Oficial
                        </span>
                      )}

                      <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        <Calendar size={11} /> {doc.date}
                      </span>

                      <span className="text-[11px] font-bold text-slate-400">
                        • {doc.fileSize}
                      </span>
                    </div>

                    <h3 className="font-black text-slate-900 dark:text-white text-base leading-snug">
                      {doc.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {doc.description}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 shrink-0">
                  <button
                    onClick={() => setReadingDoc(doc)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
                    title="Previsualizar PDF"
                  >
                    <Eye size={14} className="text-emerald-500" />
                    <span>Ver</span>
                  </button>

                  <a
                    href={safeUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-black transition"
                    title="Descargar PDF"
                  >
                    <Download size={14} />
                    <span>Descargar</span>
                  </a>

                  <button
                    onClick={() => handleEdit(doc)}
                    className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Editar documento"
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    onClick={() => setDeletingId(doc.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Eliminar documento"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Form Edit / Create */}
      {isFormOpen && (
        <DocumentModalForm
          document={selectedDoc}
          availableCategories={categoriesList}
          onClose={() => setIsFormOpen(false)}
          onSaved={() => {
            setIsFormOpen(false);
            router.refresh();
          }}
        />
      )}

      {/* Modal Confirm Delete */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#151D2A] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="p-3 rounded-2xl bg-rose-500/10">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  ¿Eliminar documento?
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Esta acción eliminará el archivo PDF del repositorio permanentemente.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition disabled:opacity-50"
              >
                {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Confirmar Eliminación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview PDF Modal in Admin */}
      {readingDoc && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-md p-3 sm:p-6 animate-in fade-in">
          <div className="w-full h-full flex flex-col rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 px-2.5 py-1 text-xs font-black uppercase">
                  Previsualización Admin
                </span>
                <h3 className="text-sm font-black text-slate-900 dark:text-white truncate max-w-md">
                  {readingDoc.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={readingDoc.fileUrl || "/Acuerdo-001-2026-Agenda-50-50.pdf"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ExternalLink size={13} />
                  <span>Abrir</span>
                </a>
                <button
                  onClick={() => setReadingDoc(null)}
                  className="rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 p-2 text-slate-700 dark:text-slate-200"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 w-full h-full bg-slate-950">
              <iframe
                src={`${readingDoc.fileUrl || "/Acuerdo-001-2026-Agenda-50-50.pdf"}#toolbar=1`}
                className="w-full h-full border-none"
                title={`Visor PDF Admin: ${readingDoc.title}`}
              />
            </div>
          </div>
        </div>
      )}
      {/* Modal de Gestión CRUD para categoriesList */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-[#0B111A] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Header del Modal */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Tag size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Gestor de Categorías (CRUD)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Administre los filtros y opciones de clasificación de <code className="text-emerald-500">categoriesList</code>
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  handleCancelEdit();
                }}
                className="rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 p-2 text-slate-700 dark:text-slate-200 transition"
                title="Cerrar ventana"
              >
                <X size={18} />
              </button>
            </div>

            {/* Contenido con Scroll */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Notificaciones */}
              {categoryFormError && (
                <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                  <AlertTriangle size={16} className="shrink-0" />
                  <span>{categoryFormError}</span>
                </div>
              )}

              {categoryFormSuccess && (
                <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>{categoryFormSuccess}</span>
                </div>
              )}

              {/* Formulario Create / Update */}
              <form
                onSubmit={handleSaveCategory}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-4 sm:p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wide">
                    {editingCategory ? (
                      <>
                        <Pencil size={13} className="text-amber-500" />
                        <span>Editar Categoría: {editingCategory.label}</span>
                      </>
                    ) : (
                      <>
                        <Plus size={14} className="text-emerald-500" />
                        <span>Agregar Nueva Categoría</span>
                      </>
                    )}
                  </span>
                  {editingCategory && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline"
                    >
                      Cancelar edición
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nombre Visible *
                    </label>
                    <input
                      type="text"
                      required
                      value={categoryFormLabel}
                      onChange={(e) => setCategoryFormLabel(e.target.value)}
                      placeholder="Ej: Resoluciones, Informes, etc."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B111A] text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Identificador / ID (Filtro)
                    </label>
                    <input
                      type="text"
                      value={categoryFormId}
                      onChange={(e) => setCategoryFormId(e.target.value)}
                      disabled={editingCategory?.id === "all"}
                      placeholder="Opcional (se autogenera del nombre)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B111A] text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  {editingCategory ? (
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition active:scale-95"
                    >
                      <Check size={14} />
                      <span>Actualizar Categoría</span>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#0F2942] text-xs font-black transition active:scale-95 shadow-xs"
                    >
                      <Plus size={14} />
                      <span>Añadir Categoría</span>
                    </button>
                  )}
                </div>
              </form>

              {/* Confirmación para Eliminar Categoría */}
              {categoryToDelete && (
                <div className="rounded-2xl border border-rose-300 dark:border-rose-900 bg-rose-50/80 dark:bg-rose-950/40 p-4 space-y-3 animate-in fade-in">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" size={18} />
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-rose-900 dark:text-rose-200">
                        ¿Eliminar la categoría &quot;{categoryToDelete.label}&quot;?
                      </p>
                      <p className="text-rose-700 dark:text-rose-300">
                        Esta categoría cuenta con {getCategoryDocCount(categoryToDelete.id)} documento(s) asociado(s). La eliminación solo removerá el botón de filtro; los documentos no se borrarán.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setCategoryToDelete(null)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConfirmDelete(categoryToDelete)}
                      className="px-3 py-1.5 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition"
                    >
                      Sí, Eliminar
                    </button>
                  </div>
                </div>
              )}

              {/* Listado de Categorías (Read & Acciones) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                    Categorías Registradas ({categoriesList.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                    title="Restaurar a las categorías originales del sistema"
                  >
                    <RotateCcw size={12} />
                    <span>Restaurar Predeterminadas</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                  {categoriesList.map((cat) => {
                    const count = getCategoryDocCount(cat.id);
                    const isSystem = cat.id === "all" || cat.isSystem;
                    const IconComp = getCategoryIcon(cat.id);

                    return (
                      <div
                        key={cat.id}
                        className="flex items-center justify-between p-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-8 w-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                            <IconComp size={15} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                                {cat.label}
                              </span>
                              {isSystem && (
                                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                  Sistema
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ID: {cat.id} • {count} documento(s)
                            </span>
                          </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleStartEdit(cat)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                            title="Editar esta categoría"
                          >
                            <Pencil size={13} />
                          </button>

                          {!isSystem && (
                            <button
                              onClick={() => {
                                setCategoryFormError(null);
                                setCategoryToDelete(cat);
                              }}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition"
                              title="Eliminar esta categoría"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex justify-between items-center shrink-0">
              <span className="text-[11px] text-slate-500 font-medium">
                Cambios sincronizados con el portal público y el administrador.
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  handleCancelEdit();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition active:scale-95"
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
