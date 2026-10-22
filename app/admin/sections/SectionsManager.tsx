"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Activity,
  FileText,
  ClipboardList,
  Clock,
  Video,
  Newspaper,
  MessageSquare,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Layers,
  ArrowRight,
  Info,
} from "lucide-react";
import { PageSectionItem, SectionId } from "@/lib/sections-config";
import { saveSectionsConfigAction, resetSectionsConfigAction } from "@/lib/actions/sections.actions";

interface SectionsManagerProps {
  initialSections: PageSectionItem[];
}

export function SectionsManager({ initialSections }: SectionsManagerProps) {
  const router = useRouter();
  const [sections, setSections] = useState<PageSectionItem[]>(initialSections);
  const [isPending, startTransition] = useTransition();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // Mapeo de iconos
  const getIcon = (name: string, size = 18) => {
    switch (name) {
      case "Sparkles":
        return <Sparkles size={size} />;
      case "HelpCircle":
        return <HelpCircle size={size} />;
      case "Activity":
        return <Activity size={size} />;
      case "FileText":
        return <FileText size={size} />;
      case "ClipboardList":
        return <ClipboardList size={size} />;
      case "Clock":
        return <Clock size={size} />;
      case "Video":
        return <Video size={size} />;
      case "Newspaper":
        return <Newspaper size={size} />;
      case "MessageSquare":
        return <MessageSquare size={size} />;
      default:
        return <Layers size={size} />;
    }
  };

  // Mover sección arriba o abajo
  const moveSection = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const updated = [...sections];
    const [movedItem] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, movedItem);

    // Reasignar órdenes secuenciales
    const normalized = updated.map((item, idx) => ({ ...item, order: idx }));
    setSections(normalized);
    setHasChanges(true);
    setMessage(null);
  };

  // Alternar visibilidad (habilitado / deshabilitado)
  const toggleVisibility = (id: SectionId) => {
    setSections((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
    setHasChanges(true);
    setMessage(null);
  };

  // Handlers para Drag & Drop nativo
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...sections];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);

    const normalized = updated.map((item, idx) => ({ ...item, order: idx }));
    setSections(normalized);
    setDraggedIndex(null);
    setDragOverIndex(null);
    setHasChanges(true);
    setMessage(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Guardar cambios en el servidor
  const handleSave = () => {
    startTransition(async () => {
      setMessage(null);
      const payload = sections.map((s, index) => ({
        id: s.id,
        order: index,
        enabled: s.enabled,
      }));

      const res = await saveSectionsConfigAction(payload);
      if (res.success) {
        setMessage({ type: "success", text: res.message || "Configuración guardada exitosamente." });
        setHasChanges(false);
        router.refresh();
      } else {
        setMessage({ type: "error", text: res.error || "No se pudo guardar la configuración." });
      }
    });
  };

  // Restablecer al orden por defecto
  const handleReset = () => {
    if (!confirm("¿Desea restablecer el orden y visibilidad original de las 9 secciones?")) {
      return;
    }

    startTransition(async () => {
      setMessage(null);
      const res = await resetSectionsConfigAction();
      if (res.success) {
        setMessage({ type: "success", text: res.message || "Secciones restablecidas." });
        setHasChanges(false);
        router.refresh();
      } else {
        setMessage({ type: "error", text: res.error || "Error al restablecer." });
      }
    });
  };

  const activeCount = sections.filter((s) => s.enabled).length;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 text-xs font-black uppercase">
              Estructura del Portal
            </span>
            <span className="text-xs font-bold text-slate-500">
              {activeCount} de {sections.length} secciones visibles
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Layers className="text-emerald-500" />
            Gestión de Secciones y Orden
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
            Arrastra (drag & drop) o utiliza las flechas para reordenar las secciones de la Landing Page. También puedes ocultar o mostrar cada sección. Los cambios se reflejarán instantáneamente en la portada, menú superior, footer, sidebar del admin y Dashboard.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition disabled:opacity-50"
            title="Restablecer al orden original predeterminado"
          >
            <RotateCcw size={15} />
            <span className="hidden sm:inline">Restablecer</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-black shadow-md transition ${
              hasChanges
                ? "bg-emerald-600 hover:bg-emerald-500 ring-2 ring-emerald-400/50 animate-pulse"
                : "bg-emerald-600 hover:bg-emerald-500"
            } disabled:opacity-50`}
          >
            <Save size={16} />
            <span>{isPending ? "Guardando..." : "Guardar Cambios"}</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {message && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold ${
            message.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50"
              : "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {hasChanges && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 font-bold">
          <div className="flex items-center gap-2">
            <Info size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Tienes modificaciones de orden o visibilidad pendientes de guardar.</span>
          </div>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[11px] font-black transition"
          >
            Guardar Ahora
          </button>
        </div>
      )}

      {/* Sections Reordering List */}
      <div className="space-y-3">
        {sections.map((section, index) => {
          const isDragging = draggedIndex === index;
          const isOver = dragOverIndex === index;

          return (
            <div
              key={section.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={() => handleDrop(index)}
              onDragEnd={handleDragEnd}
              className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border transition-all duration-200 ${
                isDragging
                  ? "opacity-40 scale-[0.98] border-dashed border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
                  : isOver
                  ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/10 shadow-lg -translate-y-0.5"
                  : section.enabled
                  ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs"
                  : "bg-slate-50/80 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-60"
              }`}
            >
              {/* Left Column: Drag Handle, Number Badge, Icon, and Titles */}
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Drag Handle */}
                <div
                  className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Arrastrar para mover posición"
                >
                  <GripVertical size={20} />
                </div>

                {/* Position Index Badge */}
                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-black text-slate-700 dark:text-slate-300 shrink-0">
                  {index + 1}
                </div>

                {/* Section Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 ${section.color}`}
                >
                  {getIcon(section.iconName)}
                </div>

                {/* Section Details */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">
                      {section.name}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {section.href}
                    </span>
                    {!section.enabled && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40">
                        Oculto
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {section.description}
                  </p>
                </div>
              </div>

              {/* Right Column: Up/Down Arrows, Visibility Toggle & CMS Link */}
              <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                {/* Up / Down Buttons (Great for accessibility & mobile) */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => moveSection(index, "up")}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-20 disabled:hover:bg-transparent transition cursor-pointer"
                    title="Mover arriba"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSection(index, "down")}
                    disabled={index === sections.length - 1}
                    className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-20 disabled:hover:bg-transparent transition cursor-pointer"
                    title="Mover abajo"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>

                {/* Show / Hide Toggle Button */}
                <button
                  type="button"
                  onClick={() => toggleVisibility(section.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    section.enabled
                      ? "bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                  }`}
                  title={section.enabled ? "Ocultar de la landing" : "Mostrar en la landing"}
                >
                  {section.enabled ? <Eye size={15} /> : <EyeOff size={15} />}
                  <span className="hidden sm:inline">
                    {section.enabled ? "Visible" : "Oculto"}
                  </span>
                </button>

                {/* CMS Link */}
                <Link
                  href={section.adminHref}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
                  title="Ir al módulo para editar contenido"
                >
                  <span>Editar Datos</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Live Preview of Menus */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-emerald-500" size={18} />
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Vista Previa del Orden en los Menús del Portal
            </h3>
          </div>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <span>Ver sitio público</span>
            <ExternalLink size={13} />
          </Link>
        </div>

        {/* Header Preview */}
        <div>
          <span className="text-[11px] font-extrabold uppercase text-slate-400">
            Menú Superior (Header)
          </span>
          <div className="mt-2 flex flex-wrap gap-2 items-center p-3 rounded-2xl bg-slate-50 dark:bg-[#101620] border border-slate-200 dark:border-slate-800">
            {sections
              .filter((s) => s.enabled)
              .map((s, idx) => (
                <div
                  key={s.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-2xs"
                >
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-black">
                    {idx + 1}.
                  </span>
                  <span>{s.navLabel}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Footer Preview */}
        <div>
          <span className="text-[11px] font-extrabold uppercase text-slate-400">
            Pie de Página (Footer · Navegación del Portal)
          </span>
          <div className="mt-2 flex flex-wrap gap-2 items-center p-3 rounded-2xl bg-slate-50 dark:bg-[#101620] border border-slate-200 dark:border-slate-800">
            {sections
              .filter((s) => s.enabled)
              .map((s, idx) => (
                <div
                  key={s.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-2xs"
                >
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-black">
                    {idx + 1}.
                  </span>
                  <span>{s.footerLabel}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
