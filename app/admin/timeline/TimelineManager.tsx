"use client";

import { useState, useEffect } from "react";
import { Milestone } from "@/lib/agenda-data";
import { MilestoneForm } from "./MilestoneForm";
import {
  reorderMilestonesAction,
  deleteMilestoneAction,
  seedMilestonesAction,
  MilestoneInput,
} from "@/lib/actions/timeline.actions";
import {
  Clock,
  Plus,
  Edit2,
  Calendar,
  CheckCircle2,
  Clock3,
  CircleDashed,
  ArrowUp,
  ArrowDown,
  Trash2,
  RotateCcw,
  FileText,
  Users,
  Layers,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";

interface TimelineManagerProps {
  initialMilestones: Milestone[];
}

export function TimelineManager({ initialMilestones }: TimelineManagerProps) {
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<MilestoneInput | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    setMilestones(initialMilestones);
  }, [initialMilestones]);

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Move up/down order
  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= milestones.length) return;

    const updated = [...milestones];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setMilestones(updated);
    setIsReordering(true);

    const orderedIds = updated.map((m) => m.id);
    const res = await reorderMilestonesAction(orderedIds);

    setIsReordering(false);
    if (res.success) {
      showStatus("✓ El orden de la hoja de ruta se ha actualizado.");
    } else {
      showStatus("❌ Error al guardar el orden de los hitos.");
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`¿Está seguro de eliminar el hito "${title}"?`)) return;

    const res = await deleteMilestoneAction(id);
    if (res.success) {
      setMilestones(milestones.filter((m) => m.id !== id));
      showStatus("✓ Hito eliminado correctamente.");
    } else {
      showStatus("❌ Error al eliminar el hito.");
    }
  };

  const handleSeed = async () => {
    if (!confirm("¿Desea restaurar/cargar los 7 hitos oficiales del Acuerdo Sucre N° 001/2026?")) return;

    const res = await seedMilestonesAction();
    if (res.success) {
      showStatus("✓ Hitos oficiales cargados con éxito.");
      window.location.reload();
    } else {
      showStatus("❌ Error al restaurar hitos.");
    }
  };

  // Status counts
  const cumplidosCount = milestones.filter((m) => m.status === "Cumplido").length;
  const enProcesoCount = milestones.filter((m) => m.status === "En proceso").length;
  const programadosCount = milestones.filter((m) => m.status === "Programado" || m.status === "Meta").length;

  return (
    <div className="space-y-6">
      {/* Top Action Bar & Summary Counters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#151D2A] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Status Counters */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
            <CheckCircle2 size={14} />
            <span>{cumplidosCount} Cumplidos</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
            <Clock3 size={14} />
            <span>{enProcesoCount} En Proceso</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <CircleDashed size={14} />
            <span>{programadosCount} Programados / Meta</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {milestones.length === 0 && (
            <button
              onClick={handleSeed}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black transition"
            >
              <RotateCcw size={14} /> Restablecer Hitos Defecto
            </button>
          )}

          <button
            onClick={() => {
              setEditingMilestone(null);
              const nextState = !showCreateForm;
              setShowCreateForm(nextState);
              if (nextState) {
                setTimeout(() => {
                  const input = document.getElementById("milestone-title-input") as HTMLInputElement | null;
                  if (input) {
                    input.focus();
                    input.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                }, 60);
              }
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black shadow-sm transition ${
              showCreateForm
                ? "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                : "bg-emerald-500 hover:bg-emerald-400 text-[#0F2942]"
            }`}
          >
            <Plus size={16} />
            <span>{showCreateForm ? "Cerrar Formulario" : "Nuevo Hito"}</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-slate-900 text-white dark:bg-emerald-950/80 dark:text-emerald-200 text-xs font-black border border-slate-700 dark:border-emerald-800/80 animate-in fade-in">
          {statusMessage}
        </div>
      )}

      {/* Creation / Edit Form Panel */}
      {(showCreateForm || editingMilestone) && (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          <MilestoneForm
            key={editingMilestone?.id ? `edit-${editingMilestone.id}` : "new"}
            initialData={editingMilestone}
            onSuccess={() => {
              setShowCreateForm(false);
              setEditingMilestone(null);
              showStatus("✓ Datos actualizados correctamente.");
              window.location.reload();
            }}
            onCancel={() => {
              setShowCreateForm(false);
              setEditingMilestone(null);
            }}
          />
        </div>
      )}

      {/* Milestones Card List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-2">
            <Layers size={14} />
            <span>Hitos Registrados ({milestones.length}) — Use las flechas para reordenar cronológicamente</span>
          </h2>
        </div>

        {milestones.length === 0 ? (
          <div className="bg-white dark:bg-[#151D2A] p-12 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3">
            <Clock className="mx-auto text-slate-400" size={32} />
            <h3 className="font-black text-slate-800 dark:text-slate-200">No hay hitos registrados</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Cree su primer hito o cargue los 7 hitos predeterminados del Acuerdo de Sucre.
            </p>
            <button
              onClick={handleSeed}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-[#0F2942] font-black text-xs"
            >
              <Sparkles size={14} /> Cargar Hitos Oficiales Sucre 2026
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {milestones.map((m, index) => {
              const isCompleted = m.status === "Cumplido";
              const inProgress = m.status === "En proceso";
              const isMeta = m.status === "Meta";

              return (
                <div
                  key={m.id}
                  className="bg-white dark:bg-[#151D2A] border border-slate-200 dark:border-slate-800/80 p-5 sm:p-6 rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 transition hover:border-slate-300 dark:hover:border-slate-700"
                >
                  {/* Left info with Image Thumbnail */}
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 flex-1 min-w-0">
                    {/* Circle Image Preview */}
                    <div className="shrink-0 flex items-center justify-center">
                      {m.image ? (
                        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden border-2 border-emerald-400 dark:border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.35)] ring-2 ring-emerald-500/20 bg-slate-900 shrink-0">
                          <img
                            src={m.image}
                            alt={m.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center text-slate-400 shrink-0">
                          <ImageIcon size={18} />
                          <span className="text-[9px] font-bold mt-0.5">Sin img</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                          Hito #{index + 1} (ID: {m.id})
                        </span>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isCompleted
                              ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400"
                              : inProgress
                              ? "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400"
                              : isMeta
                              ? "bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {m.status}
                        </span>

                        <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Calendar size={12} className="text-emerald-500" />
                          {m.date}
                        </span>
                      </div>

                      <h3 className="font-black text-slate-900 dark:text-white text-base sm:text-lg">
                        {m.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                        {m.detail}
                      </p>

                      {/* Participants & Docs summary if any */}
                      <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        {m.participants && m.participants.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Users size={13} className="text-emerald-500" />
                            <span>{m.participants.length} Actores: {m.participants.join(", ")}</span>
                          </div>
                        )}

                        {m.documents && m.documents.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <FileText size={13} className="text-blue-500" />
                            <span>{m.documents.length} Archivo(s) PDF adjunto(s)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right actions toolbar */}
                  <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-3 md:pt-0 md:pl-5 shrink-0 justify-end">
                    {/* Move Up */}
                    <button
                      onClick={() => handleMove(index, "up")}
                      disabled={index === 0 || isReordering}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-700 dark:text-slate-200 transition"
                      title="Mover arriba"
                    >
                      <ArrowUp size={16} />
                    </button>

                    {/* Move Down */}
                    <button
                      onClick={() => handleMove(index, "down")}
                      disabled={index === milestones.length - 1 || isReordering}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-700 dark:text-slate-200 transition"
                      title="Mover abajo"
                    >
                      <ArrowDown size={16} />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingMilestone({
                          id: m.id,
                          title: m.title,
                          dateText: m.date,
                          status: m.status as any,
                          detail: m.detail,
                          image: m.image,
                          order: m.order ?? index + 1,
                          participants: m.participants,
                          documents: m.documents,
                        });
                        setTimeout(() => {
                          const input = document.getElementById("milestone-title-input") as HTMLInputElement | null;
                          if (input) {
                            input.focus();
                            input.scrollIntoView({ behavior: "smooth", block: "center" });
                          }
                        }, 60);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs border border-emerald-200 dark:border-emerald-800/60 transition"
                    >
                      <Edit2 size={14} />
                      <span>Editar</span>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(m.id, m.title)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition"
                      title="Eliminar hito"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
