"use client";

import { useState } from "react";
import { MediaItem } from "@/lib/agenda-data";
import { upsertMediaItemAction } from "@/lib/actions/multimedia.actions";
import { X, Upload, Video, Tv, Users, Newspaper, Loader2 } from "lucide-react";

interface Props {
  item?: MediaItem | null;
  onClose: () => void;
  onSaved: () => void;
}

export function MultimediaForm({ item, onClose, onSaved }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [type, setType] = useState<"videos" | "webinars" | "reuniones" | "medios">(
    item?.type || "videos"
  );
  const [title, setTitle] = useState(item?.title || "");
  const [category, setCategory] = useState(item?.category || "");
  const [date, setDate] = useState(item?.date || "");
  const [platform, setPlatform] = useState(item?.platform || "");
  const [duration, setDuration] = useState(item?.duration || "");
  const [description, setDescription] = useState(item?.description || "");
  const [mediaUrl, setMediaUrl] = useState(item?.mediaUrl || "");
  const [embedUrl, setEmbedUrl] = useState(item?.embedUrl || "");
  const [url, setUrl] = useState(item?.url || "");
  const [coverUrl, setCoverUrl] = useState(item?.coverUrl || "");
  const [order, setOrder] = useState(item?.order ?? 0);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (item?.id) formData.append("id", item.id);
      formData.append("title", title);
      formData.append("type", type);
      formData.append("category", category);
      formData.append("date", date);
      formData.append("platform", platform);
      formData.append("duration", duration);
      formData.append("description", description);
      formData.append("mediaUrl", mediaUrl);
      formData.append("embedUrl", embedUrl);
      formData.append("url", url);
      formData.append("coverUrl", coverUrl);
      formData.append("order", order.toString());

      if (videoFile) formData.append("videoFile", videoFile);
      if (coverFile) formData.append("coverFile", coverFile);

      const res = await upsertMediaItemAction(formData);

      if (res.success) {
        onSaved();
      } else {
        setError(res.error || "Error al guardar el elemento multimedia.");
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
              {type === "videos" && <Video size={18} />}
              {type === "webinars" && <Tv size={18} />}
              {type === "reuniones" && <Users size={18} />}
              {type === "medios" && <Newspaper size={18} />}
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                {item ? "Editar Recurso Multimedia" : "Nuevo Recurso Multimedia"}
              </h2>
              <p className="text-xs text-slate-500">
                Complete los detalles del video, webinar o reportaje.
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
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold">
              {error}
            </div>
          )}

          {/* Tipo de Recurso */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Tipo de Recurso Multimedia *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "videos", label: "Videos", icon: Video },
                { id: "webinars", label: "Webinars", icon: Tv },
                { id: "reuniones", label: "Reuniones", icon: Users },
                { id: "medios", label: "Medios", icon: Newspaper },
              ].map((t) => {
                const Icon = t.icon;
                const isSel = type === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id as any)}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-black transition ${
                      isSel
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Título Principal *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Diálogos al Café: Análisis Agenda 50/50"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B111A] text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Categoría & Fecha / Duración */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Categoría
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ej: Explicador Oficial"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B111A] text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {type === "videos" ? "Duración / Formato" : "Fecha / Emisión"}
              </label>
              <input
                type="text"
                value={type === "videos" ? duration : date}
                onChange={(e) =>
                  type === "videos" ? setDuration(e.target.value) : setDate(e.target.value)
                }
                placeholder={type === "videos" ? "Ej: Cápsula Informativa" : "Ej: Transmisión en Vivo"}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B111A] text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Plataforma / Canal
              </label>
              <input
                type="text"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                placeholder="Ej: Facebook Live, Dailymotion"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B111A] text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Descripción Corta
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve resumen del contenido..."
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B111A] text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* URL de Video / Archivo MP4 */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-white/5 space-y-3">
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              1. Enlace / Archivo de Video MP4
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  URL del Video (MP4 / Local)
                </label>
                <input
                  type="text"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="/videos/Agenda5050.mp4"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B111A] text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  O subir archivo MP4 local
                </label>
                <input
                  type="file"
                  accept="video/mp4,video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20"
                />
              </div>
            </div>
          </div>

          {/* URL Embed & URL Externa */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-white/5 space-y-3">
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              2. Enlaces Externos / Embed (Facebook, Dailymotion, YouTube)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  URL Embed (iframe src)
                </label>
                <input
                  type="text"
                  value={embedUrl}
                  onChange={(e) => setEmbedUrl(e.target.value)}
                  placeholder="https://www.facebook.com/plugins/video.php?..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B111A] text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Enlace Web Externo
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://facebook.com/videos/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B111A] text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Portada / Thumbnail */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-white/5 space-y-3">
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              3. Imagen de Portada (Thumbnail)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  URL de Imagen de Portada
                </label>
                <input
                  type="text"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="/assets/video_que_es_5050_cover.jpg"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B111A] text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  O subir imagen (JPG/PNG)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20"
                />
              </div>
            </div>
          </div>

          {/* Orden de Visualización */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Orden de Prioridad
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
              className="w-32 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B111A] text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
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
                  <Loader2 size={16} className="animate-spin" /> Guardando...
                </>
              ) : (
                <>
                  <Upload size={16} /> {item ? "Actualizar Recurso" : "Guardar Recurso"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
