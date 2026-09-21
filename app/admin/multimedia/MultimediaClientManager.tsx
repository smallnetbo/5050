"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MediaItem } from "@/lib/agenda-data";
import { MultimediaForm } from "./MultimediaForm";
import { deleteMediaItemAction } from "@/lib/actions/multimedia.actions";
import {
  Video,
  Tv,
  Users,
  Newspaper,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Play,
  Loader2,
  AlertTriangle,
} from "lucide-react";

interface Props {
  initialItems: MediaItem[];
}

export function MultimediaClientManager({ initialItems }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "videos" | "webinars" | "reuniones" | "medios">("all");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredItems = initialItems.filter((item) => {
    if (activeTab === "all") return true;
    return item.type === activeTab;
  });

  const handleCreateNew = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: MediaItem) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await deleteMediaItemAction(deletingId);
      setDeletingId(null);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Tabs & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Filters */}
        <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition ${
              activeTab === "all"
                ? "bg-emerald-500 text-[#0F2942] shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Todos ({initialItems.length})
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition ${
              activeTab === "videos"
                ? "bg-emerald-500 text-[#0F2942] shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Video size={14} /> Videos ({initialItems.filter((i) => i.type === "videos").length})
          </button>
          <button
            onClick={() => setActiveTab("webinars")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition ${
              activeTab === "webinars"
                ? "bg-emerald-500 text-[#0F2942] shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Tv size={14} /> Webinars ({initialItems.filter((i) => i.type === "webinars").length})
          </button>
          <button
            onClick={() => setActiveTab("reuniones")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition ${
              activeTab === "reuniones"
                ? "bg-emerald-500 text-[#0F2942] shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Users size={14} /> Reuniones ({initialItems.filter((i) => i.type === "reuniones").length})
          </button>
          <button
            onClick={() => setActiveTab("medios")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition ${
              activeTab === "medios"
                ? "bg-emerald-500 text-[#0F2942] shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Newspaper size={14} /> Medios ({initialItems.filter((i) => i.type === "medios").length})
          </button>
        </div>

        {/* Add Button */}
        <button
          onClick={handleCreateNew}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-[#0F2942] font-black text-xs transition shadow-md shrink-0"
        >
          <Plus size={16} />
          <span>Añadir Recurso</span>
        </button>
      </div>

      {/* Grid of Items */}
      {filteredItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 rounded-3xl text-center space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
            <Video size={24} />
          </div>
          <h3 className="text-sm font-black text-slate-700 dark:text-slate-300">
            No se encontraron recursos multimedia en esta categoría.
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Haga clic en &quot;Añadir Recurso&quot; para incorporar un nuevo video, webinar o enlace.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
            >
              {/* Media Preview / Thumbnail */}
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                <img
                  src={item.coverUrl || "/assets/multimedia_cover.jpg"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

                {/* Badge Type */}
                <span className="absolute top-3 left-3 rounded-lg bg-black/70 backdrop-blur-md px-2.5 py-1 text-[10px] font-black uppercase text-emerald-400 border border-white/10 flex items-center gap-1">
                  {item.type === "videos" && <Video size={12} />}
                  {item.type === "webinars" && <Tv size={12} />}
                  {item.type === "reuniones" && <Users size={12} />}
                  {item.type === "medios" && <Newspaper size={12} />}
                  {item.type}
                </span>

                {/* Duration / Platform tag */}
                {(item.duration || item.platform) && (
                  <span className="absolute bottom-3 right-3 rounded-lg bg-black/70 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-bold text-white border border-white/10">
                    {item.duration || item.platform}
                  </span>
                )}
              </div>

              {/* Info Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                      {item.category || item.type}
                    </span>
                    {item.date && (
                      <span className="text-[10px] font-bold text-slate-400">{item.date}</span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 font-medium">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.mediaUrl && (
                      <a
                        href={item.mediaUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-emerald-500 hover:underline flex items-center gap-1"
                        title="Ver Video MP4"
                      >
                        <Play size={13} /> Video
                      </a>
                    )}
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center gap-1"
                        title="Enlace Externo"
                      >
                        <ExternalLink size={13} /> Link
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 rounded-xl text-slate-500 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Editar"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeletingId(item.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Eliminar"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form Edit / Create */}
      {isFormOpen && (
        <MultimediaForm
          item={selectedItem}
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
                  ¿Eliminar recurso?
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Esta acción eliminará el elemento multimedia permanentemente.
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
