"use client";

import { useState } from "react";
import { MediaItem } from "@/lib/agenda-data";
import { upsertMediaItemAction } from "@/lib/actions/multimedia.actions";
import { uploadFileWithProgress, formatBytes } from "@/lib/client-upload";
import {
  X,
  Upload,
  Video,
  Tv,
  Users,
  Newspaper,
  Loader2,
  FileVideo,
  Image as ImageIcon,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface Props {
  item?: MediaItem | null;
  onClose: () => void;
  onSaved: () => void;
}

export function MultimediaForm({ item, onClose, onSaved }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados de progreso de subida
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadPhase, setUploadPhase] = useState("Guardando...");
  const [uploadBytes, setUploadBytes] = useState<{ loaded: number; total: number } | null>(null);

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

  const extractYouTubeId = (input: string) => {
    if (!input) return null;
    const match = input.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    return match ? match[1] : null;
  };

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    const ytId = extractYouTubeId(newUrl);
    if (ytId) {
      if (!embedUrl || embedUrl.includes("youtube.com")) setEmbedUrl(`https://www.youtube.com/embed/${ytId}`);
      if (!coverUrl) setCoverUrl(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`);
      if (!platform) setPlatform("YouTube");
      if (!duration && type === "videos") {
        setDuration(newUrl.includes("/shorts/") ? "YouTube Short" : "YouTube");
      }
    }
  };

  const handleEmbedUrlChange = (newEmbed: string) => {
    setEmbedUrl(newEmbed);
    const ytId = extractYouTubeId(newEmbed);
    if (ytId) {
      if (!coverUrl) setCoverUrl(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`);
      if (!platform) setPlatform("YouTube");
      if (!duration && type === "videos") setDuration("YouTube");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUploadProgress(0);
    setUploadBytes(null);

    try {
      let finalMediaUrl = mediaUrl;
      let finalCoverUrl = coverUrl;
      let finalEmbedUrl = embedUrl;
      let finalPlatform = platform;

      const ytId = extractYouTubeId(finalEmbedUrl || url || finalMediaUrl);
      if (ytId) {
        if (!finalEmbedUrl) finalEmbedUrl = `https://www.youtube.com/embed/${ytId}`;
        if (!finalCoverUrl && (!coverFile || coverFile.size === 0)) {
          finalCoverUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
        }
        if (!finalPlatform) finalPlatform = "YouTube";
      }

      // 1. Subida con indicador de progreso real del archivo de video
      if (videoFile && videoFile.size > 0) {
        setUploadPhase(`Subiendo archivo de video (${formatBytes(videoFile.size)})...`);
        finalMediaUrl = await uploadFileWithProgress(videoFile, "multimedia", (p) => {
          setUploadProgress(p.percent);
          setUploadBytes({ loaded: p.loaded, total: p.total });
          setUploadPhase(`Subiendo video (${p.percent}%)...`);
        });
      }

      // 2. Subida con progreso de la imagen de portada si fue seleccionada
      if (coverFile && coverFile.size > 0) {
        setUploadPhase(`Subiendo imagen de portada (${formatBytes(coverFile.size)})...`);
        finalCoverUrl = await uploadFileWithProgress(coverFile, "multimedia", (p) => {
          setUploadProgress(p.percent);
          setUploadBytes({ loaded: p.loaded, total: p.total });
          setUploadPhase(`Subiendo portada (${p.percent}%)...`);
        });
      }

      // 3. Registro y guardado en la base de datos
      setUploadPhase("Finalizando y guardando registro...");
      setUploadProgress(100);

      const formData = new FormData();
      if (item?.id) formData.append("id", item.id);
      formData.append("title", title);
      formData.append("type", type);
      formData.append("category", category);
      formData.append("date", date);
      formData.append("platform", finalPlatform);
      formData.append("duration", duration);
      formData.append("description", description);
      formData.append("mediaUrl", finalMediaUrl);
      formData.append("embedUrl", finalEmbedUrl);
      formData.append("url", url);
      formData.append("coverUrl", finalCoverUrl);
      formData.append("order", order.toString());

      const res = await upsertMediaItemAction(formData);

      if (res.success) {
        onSaved();
      } else {
        setError(res.error || "Error al guardar el elemento multimedia.");
      }
    } catch (err: any) {
      console.error("Error en MultimediaForm handleSubmit:", err);
      setError(err.message || "Error inesperado al procesar el archivo.");
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
            disabled={loading}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Selector de Tipo */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(
              [
                { id: "videos", label: "Videos", icon: Video },
                { id: "webinars", label: "Webinars", icon: Tv },
                { id: "reuniones", label: "Reuniones", icon: Users },
                { id: "medios", label: "Medios", icon: Newspaper },
              ] as const
            ).map((t) => {
              const Icon = t.icon;
              const isSelected = type === t.id;
              return (
                <button
                  type="button"
                  key={t.id}
                  disabled={loading}
                  onClick={() => setType(t.id)}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border text-xs font-bold transition ${
                    isSelected
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                  } disabled:opacity-50`}
                >
                  <Icon size={16} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Título */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Título Principal *
            </label>
            <input
              type="text"
              required
              disabled={loading}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Diálogos al Café: Análisis Agenda 50/50"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B111A] text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:opacity-50"
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
                disabled={loading}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ej: Explicador Oficial"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B111A] text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {type === "videos" ? "Duración / Formato" : "Fecha / Emisión"}
              </label>
              <input
                type="text"
                disabled={loading}
                value={type === "videos" ? duration : date}
                onChange={(e) =>
                  type === "videos" ? setDuration(e.target.value) : setDate(e.target.value)
                }
                placeholder={type === "videos" ? "Ej: Cápsula Informativa" : "Ej: Transmisión en Vivo"}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B111A] text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Plataforma / Canal
              </label>
              <input
                type="text"
                disabled={loading}
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                placeholder="Ej: Facebook Live, Dailymotion"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B111A] text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:opacity-50"
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
              disabled={loading}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve resumen del contenido..."
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B111A] text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          {/* URL de Video / Archivo MP4 */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-white/5 space-y-3">
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <FileVideo size={16} className="text-emerald-500" />
              1. Enlace / Archivo de Video MP4
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  URL del Video (MP4 / Local)
                </label>
                <input
                  type="text"
                  disabled={loading}
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="/videos/Agenda5050.mp4"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B111A] text-slate-900 dark:text-white text-xs disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  O subir archivo MP4 local
                </label>
                <input
                  type="file"
                  accept="video/mp4,video/*"
                  disabled={loading}
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Vista previa del archivo de video seleccionado */}
            {videoFile && (
              <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <FileVideo size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {videoFile.name}
                    </p>
                    <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      Tamaño: {formatBytes(videoFile.size)} · Listo para transferir
                    </p>
                  </div>
                </div>
                {!loading && (
                  <button
                    type="button"
                    onClick={() => setVideoFile(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition shrink-0"
                    title="Quitar archivo"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* URL Embed & URL Externa */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-white/5 space-y-3">
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              2. Enlaces Externos / Embed (Facebook, Dailymotion, YouTube)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  URL Embed (iframe src / YouTube embed)
                </label>
                <input
                  type="text"
                  disabled={loading}
                  value={embedUrl}
                  onChange={(e) => handleEmbedUrlChange(e.target.value)}
                  placeholder="https://www.youtube.com/embed/... o https://facebook.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B111A] text-slate-900 dark:text-white text-xs disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Enlace Web Externo (YouTube / Shorts / Redes)
                </label>
                <input
                  type="text"
                  disabled={loading}
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://www.youtube.com/shorts/IjaFB-aPOVw"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B111A] text-slate-900 dark:text-white text-xs disabled:opacity-50"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              💡 Soporta enlaces directos a <b>YouTube Shorts</b> y videos normales. Se autocompleta la miniatura, el reproductor embed y la plataforma.
            </p>
          </div>

          {/* Portada / Thumbnail */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-white/5 space-y-3">
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon size={16} className="text-emerald-500" />
              3. Imagen de Portada (Thumbnail)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  URL de Imagen de Portada
                </label>
                <input
                  type="text"
                  disabled={loading}
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="/assets/video_que_es_5050_cover.jpg"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B111A] text-slate-900 dark:text-white text-xs disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  O subir imagen (JPG/PNG)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  disabled={loading}
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Vista previa de imagen seleccionada */}
            {coverFile && (
              <div className="p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between text-xs">
                <span className="truncate text-slate-700 dark:text-slate-300 font-medium">
                  Portada: <b>{coverFile.name}</b> ({formatBytes(coverFile.size)})
                </span>
                {!loading && (
                  <button
                    type="button"
                    onClick={() => setCoverFile(null)}
                    className="text-slate-400 hover:text-rose-500 ml-2"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Orden de Visualización */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Orden de Prioridad
            </label>
            <input
              type="number"
              disabled={loading}
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
              className="w-32 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B111A] text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          {/* INDICADOR DE CARGA / PROGRESO ACTIVO */}
          {loading && (
            <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-50/80 dark:bg-emerald-950/40 shadow-sm space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Loader2 size={18} className="animate-spin" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 dark:text-white">
                      {uploadPhase}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {uploadBytes && uploadBytes.total > 0
                        ? `${formatBytes(uploadBytes.loaded)} transferidos de ${formatBytes(uploadBytes.total)}`
                        : "Procesando información en el servidor..."}
                    </p>
                  </div>
                </div>
                {uploadProgress > 0 && (
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 px-3 py-1 rounded-xl border border-emerald-500/20 shadow-xs">
                    {uploadProgress}%
                  </span>
                )}
              </div>

              {/* Barra de Progreso Dinámica */}
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 h-full rounded-full transition-all duration-300 ease-out shadow-sm"
                  style={{ width: `${Math.max(uploadProgress, 5)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                <span className="flex items-center gap-1.5 font-medium text-amber-700 dark:text-amber-400">
                  <AlertCircle size={13} /> Por favor, no cierre esta ventana mientras se completa la subida.
                </span>
                {uploadProgress === 100 && (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle2 size={13} /> Procesado
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Botones de Acción */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-[#0F2942] font-black text-xs transition shadow-md disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>
                    {uploadProgress > 0 && uploadProgress < 100
                      ? `Subiendo (${uploadProgress}%)...`
                      : "Guardando..."}
                  </span>
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
