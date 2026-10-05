"use client";

import { useState, useEffect } from "react";
import { MonitorConfig, MonitorMetric } from "@/lib/agenda-data";
import {
  MonitorMetricInput,
  upsertMonitorMetricAction,
  deleteMonitorMetricAction,
  toggleMonitorMetricAction,
  reorderMonitorMetricsAction,
  seedMonitorAction,
} from "@/lib/actions/monitor.actions";
import { MetricModal } from "./MetricModal";
import { ConfigForm } from "./ConfigForm";
import {
  Clock,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Eye,
  EyeOff,
  Check,
  Calendar,
  Layers,
} from "lucide-react";

interface MonitorManagerProps {
  initialConfig: MonitorConfig;
  initialMetrics: MonitorMetric[];
}

export function MonitorManager({ initialConfig, initialMetrics }: MonitorManagerProps) {
  const [metrics, setMetrics] = useState<MonitorMetric[]>(initialMetrics);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<MonitorMetricInput | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setMetrics(initialMetrics);
  }, [initialMetrics]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenCreate = () => {
    setEditingMetric(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (metric: MonitorMetric) => {
    setEditingMetric(metric);
    setIsModalOpen(true);
  };

  const handleSaveMetric = async (data: MonitorMetricInput) => {
    const res = await upsertMonitorMetricAction(data);
    if (res.success) {
      showToast(res.message || "Hito guardado con éxito.");
      window.location.reload();
    } else {
      throw new Error(res.error || "No se pudo guardar el hito.");
    }
  };

  const handleDeleteMetric = async (id: number, title: string) => {
    if (!confirm(`¿Está seguro de eliminar el hito "${title}"?`)) return;

    const res = await deleteMonitorMetricAction(id);
    if (res.success) {
      setMetrics((prev) => prev.filter((m) => m.id !== id));
      showToast("Hito eliminado con éxito.");
    } else {
      alert(res.error || "Error al eliminar el hito.");
    }
  };

  const handleToggleActive = async (id: number, currentActive: boolean) => {
    const newActive = !currentActive;
    setMetrics((prev) =>
      prev.map((m) => (m.id === id ? { ...m, active: newActive } : m))
    );

    const res = await toggleMonitorMetricAction(id, newActive);
    if (res.success) {
      showToast(res.message || "Estado actualizado.");
    } else {
      setMetrics((prev) =>
        prev.map((m) => (m.id === id ? { ...m, active: currentActive } : m))
      );
      alert(res.error || "Error al actualizar estado.");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= metrics.length) return;

    const updated = [...metrics];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setMetrics(updated);

    const orderedIds = updated.map((m) => m.id);
    const res = await reorderMonitorMetricsAction(orderedIds);
    if (res.success) {
      showToast("Orden de los hitos actualizado.");
    } else {
      showToast("Error al guardar el nuevo orden.");
    }
  };

  const handleRestoreDefaults = async () => {
    if (
      !confirm(
        "¿Desea restaurar los hitos oficiales del Monitor según la captura del Acuerdo Sucre (FPIEEH y Ley 154)?"
      )
    ) {
      return;
    }

    const res = await seedMonitorAction();
    if (res.success) {
      showToast("✓ Hitos oficiales restaurados.");
      window.location.reload();
    } else {
      alert(res.error || "Error al restaurar.");
    }
  };

  const formatDateDisplay = (dateString?: string) => {
    if (!dateString) return "—";
    if (dateString.includes("/")) return dateString;
    try {
      const parts = dateString.split("T")[0].split("-");
      if (parts.length === 3) {
        const [year, month, day] = parts;
        return `${day}/${month}/${year}`;
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl animate-in fade-in slide-in-from-bottom-5">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Formulario de Configuración General & Banner */}
      <ConfigForm initialConfig={initialConfig} onSuccess={showToast} />

      {/* Indicadores Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xs">
        <div>
          <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 px-2.5 py-1 text-xs font-black uppercase">
            Lista de Hitos & Plazos
          </span>
          <h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Matriz de Compromisos ({metrics.length} Registrados)
          </h2>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Seguimiento de contadores: Quién debe cumplir, qué debe entregar, fecha límite y días restantes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleRestoreDefaults}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition"
            title="Restaurar hitos oficiales originales según la captura"
          >
            <RotateCcw size={15} />
            <span>Restaurar Oficiales</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#0F2942] text-xs font-black transition shadow-md"
          >
            <Plus size={16} />
            <span>Nuevo Hito</span>
          </button>
        </div>
      </div>

      {/* Table List View of Metrics/Hitos */}
      {metrics.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="h-16 w-16 mx-auto rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
            <Layers size={32} />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              No hay hitos registrados en la lista
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Agregue un nuevo hito o restaure los datos oficiales según la captura.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleRestoreDefaults}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold"
            >
              Restaurar Oficiales
            </button>
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-[#0F2942] text-xs font-black"
            >
              + Crear Hito
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">
                  <th className="py-4 px-4 w-12 text-center">Orden</th>
                  <th className="py-4 px-5 w-1/4">Contador</th>
                  <th className="py-4 px-5 w-1/5">Quién debe cumplir</th>
                  <th className="py-4 px-5">Qué debe entregar</th>
                  <th className="py-4 px-4 text-center w-28">Fecha límite</th>
                  <th className="py-4 px-4 text-center w-20">Días</th>
                  <th className="py-4 px-4 text-center w-24">Estado</th>
                  <th className="py-4 px-4 text-right w-28">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {metrics.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 ${
                      !item.active ? "opacity-50 bg-slate-50/30 dark:bg-slate-950/30" : ""
                    }`}
                  >
                    {/* Reorder Buttons */}
                    <td className="py-4 px-4 align-top text-center">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          onClick={() => handleMove(idx, "up")}
                          disabled={idx === 0}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-20"
                          title="Subir orden"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <span className="text-[10px] font-bold text-slate-400">#{idx + 1}</span>
                        <button
                          onClick={() => handleMove(idx, "down")}
                          disabled={idx === metrics.length - 1}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-20"
                          title="Bajar orden"
                        >
                          <ArrowDown size={13} />
                        </button>
                      </div>
                    </td>

                    {/* Contador */}
                    <td className="py-4 px-5 align-top">
                      <div className="font-black text-slate-900 dark:text-white text-sm">
                        {item.title}
                      </div>
                      {item.category && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-slate-500 uppercase">
                          {item.category}
                        </span>
                      )}
                    </td>

                    {/* Quién debe cumplir */}
                    <td className="py-4 px-5 align-top">
                      <div className="font-extrabold text-slate-800 dark:text-slate-200">
                        {item.responsible || "—"}
                      </div>
                    </td>

                    {/* Qué debe entregar */}
                    <td className="py-4 px-5 align-top">
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        {item.deliverable || item.description}
                      </p>
                    </td>

                    {/* Fecha límite */}
                    <td className="py-4 px-4 align-top text-center whitespace-nowrap">
                      <span className="font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                        {formatDateDisplay(item.deadlineDate)}
                      </span>
                    </td>

                    {/* Días */}
                    <td className="py-4 px-4 align-top text-center whitespace-nowrap">
                      <span className="font-black text-sm text-slate-900 dark:text-white">
                        {item.value?.replace(/[^0-9]/g, "") || item.value || "—"}
                      </span>
                    </td>

                    {/* Estado Active Toggle */}
                    <td className="py-4 px-4 align-top text-center">
                      <button
                        onClick={() => handleToggleActive(item.id, item.active)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black transition ${
                          item.active
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {item.active ? <Eye size={12} /> : <EyeOff size={12} />}
                        <span>{item.active ? "Visible" : "Oculto"}</span>
                      </button>
                    </td>

                    {/* Actions Edit / Delete */}
                    <td className="py-4 px-4 align-top text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
                          title="Editar hito"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteMetric(item.id, item.title)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition"
                          title="Eliminar hito"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal para Crear y Editar Indicadores */}
      <MetricModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMetric}
        initialData={editingMetric}
      />
    </div>
  );
}
