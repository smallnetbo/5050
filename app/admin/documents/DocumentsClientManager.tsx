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
  Sparkles,
  Loader2,
  AlertTriangle,
  Award,
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

  const filteredDocs = initialDocuments.filter((doc) => {
    const matchesCategory =
      activeCategory === "all"
        ? true
        : activeCategory === "featured"
        ? doc.featured
        : doc.category === activeCategory;

    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());

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

  const categories = ["Acuerdo", "Proyecto de Ley", "Decreto", "Presentación", "Acta"];

  return (
    <div className="space-y-6">
      {/* Top Bar: Search, Category Tabs & Add Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition ${
              activeCategory === "all"
                ? "bg-emerald-500 text-[#0F2942] shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Todos ({initialDocuments.length})
          </button>
          <button
            onClick={() => setActiveCategory("featured")}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-black transition ${
              activeCategory === "featured"
                ? "bg-amber-400 text-[#0F2942] shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Award size={14} /> Destacados ({initialDocuments.filter((d) => d.featured).length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition ${
                activeCategory === cat
                  ? "bg-emerald-500 text-[#0F2942] shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {cat} ({initialDocuments.filter((d) => d.category === cat).length})
            </button>
          ))}
        </div>

        {/* Right Action & Search */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Buscar documento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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

      {/* Grid of Documents */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 rounded-3xl text-center space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
            <FileText size={24} />
          </div>
          <h3 className="text-sm font-black text-slate-700 dark:text-slate-300">
            No se encontraron documentos en esta categoría o búsqueda.
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Haga clic en &quot;Subir Documento&quot; para adjuntar un nuevo archivo PDF.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between relative ${
                doc.featured
                  ? "border-amber-400/60 dark:border-amber-400/40 ring-1 ring-amber-400/20"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-[10px] font-black uppercase text-slate-700 dark:text-slate-300">
                    {doc.category}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{doc.date}</span>
                </div>

                {/* Featured Tag */}
                {doc.featured && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-md mb-2">
                    <Award size={12} /> Documento Insignia
                  </span>
                )}

                <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug">
                  {doc.title}
                </h3>
                <p className="mt-2 text-xs text-slate-500 font-medium line-clamp-3 leading-relaxed">
                  {doc.description}
                </p>
              </div>

              {/* Footer Links & Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">{doc.fileSize}</span>
                  {doc.fileUrl && (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-black text-emerald-500 hover:underline flex items-center gap-1"
                    >
                      <Download size={14} /> PDF
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(doc)}
                    className="p-2 rounded-xl text-slate-500 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Editar"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeletingId(doc.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Eliminar"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
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
    </div>
  );
}
