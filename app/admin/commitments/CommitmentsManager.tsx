"use client";

import { useState, useEffect, useMemo } from "react";
import { CommitmentItem, CommitmentLevel, commitmentLevels } from "@/lib/commitments-data";
import {
  CommitmentInput,
  upsertCommitmentAction,
  deleteCommitmentAction,
  toggleCommitmentAction,
  reorderCommitmentsAction,
  seedCommitmentsAction,
} from "@/lib/actions/commitments.actions";
import { CommitmentModal } from "./CommitmentModal";
import { CommitmentLevelsModal, LEVEL_ICONS_MAP } from "./CommitmentLevelsModal";
import {
  Landmark,
  Building2,
  Building,
  Layers,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Eye,
  EyeOff,
  Check,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  FolderOpen,
  SlidersHorizontal,
} from "lucide-react";

interface CommitmentsManagerProps {
  initialCommitments: CommitmentItem[];
  initialLevels?: CommitmentLevel[];
}

const iconMap: Record<string, React.ElementType> = LEVEL_ICONS_MAP;


export function CommitmentsManager({ initialCommitments, initialLevels }: CommitmentsManagerProps) {
  const [commitments, setCommitments] = useState<CommitmentItem[]>(initialCommitments);
  const [levels, setLevels] = useState<CommitmentLevel[]>(
    initialLevels && initialLevels.length > 0 ? initialLevels : commitmentLevels
  );
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLevelsModalOpen, setIsLevelsModalOpen] = useState(false);
  const [editingCommitment, setEditingCommitment] = useState<CommitmentInput | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setCommitments(initialCommitments);
  }, [initialCommitments]);

  useEffect(() => {
    if (initialLevels && initialLevels.length > 0) {
      setLevels(initialLevels);
    }
  }, [initialLevels]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredItems = useMemo(() => {
    return commitments.filter((item) => {
      const matchesLevel = selectedLevel === "all" || item.levelId === selectedLevel;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.commitment.toLowerCase().includes(q) ||
        item.deliverable.toLowerCase().includes(q) ||
        item.responsible.toLowerCase().includes(q) ||
        (item.category && item.category.toLowerCase().includes(q));

      let matchesStatus = true;
      if (statusFilter === "deadline") {
        matchesStatus = Boolean(item.deadlineDate || item.status.includes("/"));
      } else if (statusFilter === "completed") {
        matchesStatus =
          item.status.toLowerCase().includes("cumplido") ||
          item.status.toLowerCase().includes("entregado");
      } else if (statusFilter === "in_progress") {
        matchesStatus =
          item.status.toLowerCase().includes("curso") ||
          item.status.toLowerCase().includes("continuo") ||
          item.status.toLowerCase().includes("permanente");
      } else if (statusFilter === "no_deadline") {
        matchesStatus = item.status.toLowerCase().includes("sin plazo");
      }

      return matchesLevel && matchesSearch && matchesStatus;
    });
  }, [commitments, selectedLevel, searchQuery, statusFilter]);

  const handleOpenCreate = () => {
    setEditingCommitment(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: CommitmentItem) => {
    setEditingCommitment({
      id: item.id,
      levelId: item.levelId,
      levelName: item.levelName,
      commitment: item.commitment,
      deliverable: item.deliverable,
      responsible: item.responsible,
      status: item.status,
      deadlineDate: item.deadlineDate,
      category: item.category,
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleSaveCommitment = async (data: CommitmentInput) => {
    const res = await upsertCommitmentAction(data);
    if (res.success) {
      showToast(res.message || "Compromiso guardado.");
      window.location.reload();
    } else {
      throw new Error(res.error || "No se pudo guardar el compromiso.");
    }
  };

  const handleDeleteCommitment = async (id: string, name: string) => {
    if (!confirm(`¿Está seguro de eliminar el compromiso "${name}"?`)) return;

    const res = await deleteCommitmentAction(id);
    if (res.success) {
      setCommitments((prev) => prev.filter((c) => c.id !== id));
      showToast("Compromiso eliminado con éxito.");
    } else {
      alert(res.error || "Error al eliminar el compromiso.");
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    const res = await toggleCommitmentAction(id, !currentActive);
    if (res.success) {
      showToast(res.message || "Estado actualizado.");
      window.location.reload();
    } else {
      alert(res.error || "Error al actualizar estado.");
    }
  };

  const handleMove = async (indexInFiltered: number, direction: "up" | "down") => {
    const targetFilteredIndex = direction === "up" ? indexInFiltered - 1 : indexInFiltered + 1;
    if (targetFilteredIndex < 0 || targetFilteredIndex >= filteredItems.length) return;

    const currentItem = filteredItems[indexInFiltered];
    const targetItem = filteredItems[targetFilteredIndex];

    const currentGlobalIndex = commitments.findIndex((c) => c.id === currentItem.id);
    const targetGlobalIndex = commitments.findIndex((c) => c.id === targetItem.id);

    if (currentGlobalIndex === -1 || targetGlobalIndex === -1) return;

    const updated = [...commitments];
    const temp = updated[currentGlobalIndex];
    updated[currentGlobalIndex] = updated[targetGlobalIndex];
    updated[targetGlobalIndex] = temp;

    setCommitments(updated);

    const orderedIds = updated.map((c) => c.id);
    const res = await reorderCommitmentsAction(orderedIds);
    if (res.success) {
      showToast("Orden de compromisos actualizado.");
    } else {
      showToast("Error al guardar el nuevo orden.");
    }
  };

  const handleRestoreDefaults = async () => {
    if (
      !confirm(
        "¿Desea restaurar la totalidad de los 63 compromisos oficiales del Acuerdo Sucre desde el documento oficial?"
      )
    ) {
      return;
    }

    const res = await seedCommitmentsAction();
    if (res.success) {
      showToast(res.message || "Compromisos restaurados.");
      window.location.reload();
    } else {
      alert(res.error || "Error al restaurar.");
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("cumplido") || s.includes("entregado")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40">
          <CheckCircle2 size={11} /> {status}
        </span>
      );
    }
    if (status.includes("/")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/50">
          <Clock size={11} className="text-amber-600" /> {status}
        </span>
      );
    }
    if (s.includes("continuo") || s.includes("permanente") || s.includes("curso")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300/40">
          <Sparkles size={11} /> {status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl animate-in fade-in slide-in-from-bottom-5">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xs">
        <div>
          <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 px-2.5 py-1 text-xs font-black uppercase">
            Gestor de Matriz de Entregables
          </span>
          <h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Compromisos por Nivel ({commitments.length} Registros)
          </h2>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Administre los compromisos, plazos oficiales y remitentes técnicos de cada nivel de gobierno.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsLevelsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-black transition shadow-2xs"
            title="Administrar los niveles de gobierno (Crear, Editar, Eliminar, Reordenar)"
          >
            <SlidersHorizontal size={15} className="text-indigo-600 dark:text-indigo-400" />
            <span>Gestionar Niveles ({levels.length})</span>
          </button>

          <button
            type="button"
            onClick={handleRestoreDefaults}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition"
            title="Restaurar los 63 compromisos oficiales del Acuerdo Sucre"
          >
            <RotateCcw size={15} />
            <span>Restaurar Oficiales (63)</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#0F2942] text-xs font-black transition shadow-md"
          >
            <Plus size={16} />
            <span>Nuevo Compromiso</span>
          </button>
        </div>
      </div>

      {/* Level Tabs (Navegación Interactiva por Nivel con CRUD) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
        <button
          onClick={() => setSelectedLevel("all")}
          className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[80px] ${
            selectedLevel === "all"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md font-black"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center justify-between text-[10px] uppercase font-bold opacity-75">
            <span>Todos</span>
            <span>{commitments.length}</span>
          </div>
          <div className="mt-1.5 text-xs font-black leading-snug">Todos los Niveles</div>
        </button>

        {levels.filter((lvl) => lvl.active !== false).map((lvl) => {
          const Icon = iconMap[lvl.iconName] || Landmark;
          const isSelected = selectedLevel === lvl.id;
          const lvlCount = commitments.filter((c) => c.levelId === lvl.id).length;

          return (
            <button
              key={lvl.id}
              onClick={() => setSelectedLevel(lvl.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all group relative flex flex-col justify-between min-h-[80px] ${
                isSelected
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md font-black"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] uppercase font-bold opacity-75">
                <span className="truncate max-w-[70px]">{lvl.badge}</span>
                <div className="flex items-center gap-1">
                  <span>{lvlCount}</span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLevelsModalOpen(true);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition cursor-pointer"
                    title={`Editar nivel "${lvl.shortName}"`}
                  >
                    <Edit2 size={10} />
                  </span>
                </div>
              </div>
              <div className="mt-1.5 flex items-start gap-1.5 text-xs font-black leading-snug">
                <Icon size={13} className="shrink-0 mt-0.5" />
                <span className="line-clamp-2 leading-tight break-words">{lvl.shortName}</span>
              </div>
            </button>
          );
        })}

        {/* Quick Button to Open Levels CRUD directly from tabs */}
        <button
          type="button"
          onClick={() => setIsLevelsModalOpen(true)}
          className="p-3.5 rounded-2xl border border-dashed border-indigo-300 dark:border-indigo-800/80 bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-100/60 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 flex flex-col items-center justify-center gap-1 text-center transition group cursor-pointer"
          title="Administrar Niveles de Gobierno (Crear, Editar, Eliminar, Reordenar)"
        >
          <div className="flex items-center gap-1.5 text-xs font-black">
            <SlidersHorizontal size={13} className="group-hover:rotate-45 transition duration-200" />
            <span>Gestionar</span>
          </div>
          <span className="text-[10px] text-indigo-500/80 font-bold uppercase tracking-wider">
            Niveles ({levels.length})
          </span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Buscar por compromiso, entregable o entidad responsable..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Filter size={15} className="text-slate-400 hidden sm:inline" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Todos los plazos ({commitments.length})</option>
            <option value="deadline">Con fecha límite estipulada</option>
            <option value="completed">Cumplidos / Entregados</option>
            <option value="in_progress">En curso / Continuo</option>
            <option value="no_deadline">Sin plazo fijo</option>
          </select>

          <span className="text-xs font-bold text-slate-500 shrink-0">
            ({filteredItems.length} visibles)
          </span>
        </div>
      </div>

      {/* Interactive Table View */}
      {filteredItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <div className="h-12 w-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
            <FolderOpen size={24} />
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            No se encontraron compromisos
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Ajuste los filtros de búsqueda o haga clic en &quot;Nuevo Compromiso&quot; para registrar uno nuevo.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">
                  <th className="py-4 px-3 w-12 text-center">Orden</th>
                  <th className="py-4 px-4 w-44">Compromiso</th>
                  <th className="py-4 px-4">¿Qué debe entregar realmente?</th>
                  <th className="py-4 px-4 w-44">Quién</th>
                  <th className="py-4 px-4 text-center w-36">Estado</th>
                  <th className="py-4 px-4 text-right w-24">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredItems.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {/* Reorder Buttons */}
                    <td className="py-4 px-3 align-top text-center">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          onClick={() => handleMove(idx, "up")}
                          disabled={idx === 0}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-20"
                          title="Subir"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <span className="text-[10px] font-bold text-slate-400">#{idx + 1}</span>
                        <button
                          onClick={() => handleMove(idx, "down")}
                          disabled={idx === filteredItems.length - 1}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-20"
                          title="Bajar"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>
                    </td>

                    {/* Compromiso */}
                    <td className="py-4 px-4 align-top">
                      <div className="font-black text-slate-900 dark:text-white text-sm">
                        {item.commitment}
                      </div>
                      <div className="flex flex-wrap items-center gap-1 mt-1">
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {item.levelId.toUpperCase()}
                        </span>
                        {item.category && (
                          <span className="text-[10px] text-slate-400 font-semibold">
                            • {item.category}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Entregable */}
                    <td className="py-4 px-4 align-top">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        {item.deliverable}
                      </p>
                    </td>

                    {/* Quién */}
                    <td className="py-4 px-4 align-top">
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg inline-block text-[11px]">
                        {item.responsible}
                      </span>
                    </td>

                    {/* Estado */}
                    <td className="py-4 px-4 align-top text-center whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>

                    {/* Acciones */}
                    <td className="py-4 px-4 align-top text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
                          title="Editar compromiso"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteCommitment(item.id, item.commitment)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition"
                          title="Eliminar compromiso"
                        >
                          <Trash2 size={13} />
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

      {/* Modal Crear / Editar Compromiso */}
      <CommitmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCommitment}
        initialData={editingCommitment}
        defaultLevelId={selectedLevel !== "all" ? (selectedLevel as any) : "nce"}
        levels={levels}
      />

      {/* Modal CRUD Niveles de Gobierno */}
      <CommitmentLevelsModal
        isOpen={isLevelsModalOpen}
        onClose={() => setIsLevelsModalOpen(false)}
        levels={levels}
        commitments={commitments}
        onLevelsUpdated={() => {
          window.location.reload();
        }}
      />
    </div>
  );
}
