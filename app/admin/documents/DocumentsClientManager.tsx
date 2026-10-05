"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DocumentItem } from "@/lib/agenda-data";
import { DocumentModalForm } from "./DocumentModalForm";
import { deleteDocumentAction } from "@/lib/actions/documents.actions";
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
} from "lucide-react";

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

  const categories = [
    "Acuerdo",
    "Acta",
    "Presentación",
    "Anexo",
    "Proyecto de Ley",
    "Decreto",
  ];

  const filteredDocs = initialDocuments.filter((doc) => {
    const matchesCategory =
      activeCategory === "all"
        ? true
        : activeCategory === "featured"
        ? doc.featured
        : doc.category.toLowerCase().includes(activeCategory.toLowerCase());

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
          {categories.map((cat) => {
            const count = initialDocuments.filter((d) =>
              d.category.toLowerCase().includes(cat.toLowerCase())
            ).length;
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                  isSelected
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Right Action & Search */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Buscar documento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            onClick={handleCreateNew}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-[#0F2942] font-black text-xs transition shadow-md shrink-0"
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
    </div>
  );
}
