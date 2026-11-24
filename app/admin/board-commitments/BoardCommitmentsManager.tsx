"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Database,
  Loader2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import {
  BoardCommitmentItem,
  BoardLevelCode,
  BoardStatusCat,
  BOARD_LEVELS,
  BOARD_LEVEL_ORDER,
  BOARD_RUBRO_LABELS,
  BOARD_STATUS_LABELS,
} from "@/lib/board-commitments-data";
import {
  BoardCommitmentInput,
  upsertBoardCommitmentAction,
  deleteBoardCommitmentAction,
  toggleBoardCommitmentActiveAction,
  seedBoardCommitmentsAction,
} from "@/lib/actions/board-commitments.actions";
import { BoardCommitmentModal } from "./BoardCommitmentModal";
import { ModalPortal } from "@/components/ModalPortal";

interface BoardCommitmentsManagerProps {
  initialCommitments: BoardCommitmentItem[];
  isFromDb: boolean;
}

export function BoardCommitmentsManager({
  initialCommitments,
  isFromDb,
}: BoardCommitmentsManagerProps) {
  const router = useRouter();
  const [items, setItems] = useState<BoardCommitmentItem[]>(initialCommitments);
  const [inDb, setInDb] = useState(isFromDb);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState<"ALL" | BoardLevelCode>("ALL");
  const [filterCat, setFilterCat] = useState<"ALL" | BoardStatusCat>("ALL");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BoardCommitmentItem | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  const stats = useMemo(() => {
    const total = items.length || 1;
    const c = {
      cumplido: items.filter((i) => i.cat === "cumplido").length,
      proceso: items.filter((i) => i.cat === "proceso").length,
      programado: items.filter((i) => i.cat === "programado").length,
      sin_plazo: items.filter((i) => i.cat === "sin_plazo").length,
    };
    return {
      ...c,
      total: items.length,
      pctCumplido: (c.cumplido / total) * 100,
      pctProceso: (c.proceso / total) * 100,
      pctProgramado: (c.programado / total) * 100,
      pctSinPlazo: (c.sin_plazo / total) * 100,
    };
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const mLvl = filterLevel === "ALL" || item.nivel === filterLevel;
      const mCat = filterCat === "ALL" || item.cat === filterCat;
      const mQ =
        !q ||
        item.tematica.toLowerCase().includes(q) ||
        item.entregable.toLowerCase().includes(q) ||
        item.responsable.toLowerCase().includes(q) ||
        item.estado.toLowerCase().includes(q);
      return mLvl && mCat && mQ;
    });
  }, [items, search, filterLevel, filterCat]);

  const showToast = (type: "ok" | "err", msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    const res = await seedBoardCommitmentsAction();
    setIsSeeding(false);
    if (res.success) {
      setInDb(true);
      showToast("ok", res.message || "Compromisos importados.");
      router.refresh();
    } else {
      showToast("err", res.error || "Error al importar.");
    }
  };

  const handleSave = async (data: BoardCommitmentInput) => {
    if (!inDb && data.id) {
      showToast("err", "Primero importa los 56 compromisos base a la base de datos antes de editarlos.");
      return;
    }
    const res = await upsertBoardCommitmentAction(data);
    if (res.success && res.data) {
      const saved = res.data as BoardCommitmentItem;
      setItems((prev) => {
        const exists = prev.some((p) => p.id === saved.id);
        return exists ? prev.map((p) => (p.id === saved.id ? saved : p)) : [...prev, saved];
      });
      setModalOpen(false);
      setEditingItem(null);
      showToast("ok", res.message || "Guardado.");
      router.refresh();
    } else {
      showToast("err", res.error || "Error al guardar.");
    }
  };

  const handleToggleActive = async (item: BoardCommitmentItem) => {
    if (!inDb) {
      showToast("err", "Primero importa los 56 compromisos base a la base de datos.");
      return;
    }
    const nextActive = !(item.active ?? true);
    const res = await toggleBoardCommitmentActiveAction(item.id, nextActive);
    if (res.success) {
      setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, active: nextActive } : p)));
      router.refresh();
    } else {
      showToast("err", res.error || "Error al actualizar.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    const res = await deleteBoardCommitmentAction(deleteId);
    setIsDeleting(false);
    if (res.success) {
      setItems((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
      showToast("ok", res.message || "Eliminado.");
      router.refresh();
    } else {
      showToast("err", res.error || "Error al eliminar.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Aviso si aún no se importó a la BD */}
      {!inDb && (
        <div className="rounded-2xl border border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Database className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="text-sm font-black text-amber-900 dark:text-amber-200">
                Mostrando los 56 compromisos base en modo lectura
              </h3>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                Importa los registros iniciales a la base de datos para poder editarlos, ocultarlos o eliminarlos.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSeed}
            disabled={isSeeding}
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition disabled:opacity-50"
          >
            {isSeeding ? <Loader2 size={15} className="animate-spin" /> : <Database size={15} />}
            <span>Importar 56 Compromisos Base</span>
          </button>
        </div>
      )}

      {feedback && (
        <div
          className={`rounded-xl px-4 py-3 text-xs font-bold flex items-center gap-2 border ${
            feedback.type === "ok"
              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
              : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
          }`}
        >
          {feedback.type === "ok" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Métricas y barra */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.total}</p>
        </div>
        {(["cumplido", "proceso", "programado", "sin_plazo"] as BoardStatusCat[]).map((cat) => {
          const st = BOARD_STATUS_LABELS[cat];
          return (
            <div key={cat} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate">
                  {st.title}
                </span>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats[cat]}</p>
            </div>
          );
        })}
      </div>

      {/* Controles */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar temática, entregable o actor..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value as any)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200"
          >
            <option value="ALL">Todos los niveles</option>
            {BOARD_LEVEL_ORDER.map((c) => (
              <option key={c} value={c}>
                {BOARD_LEVELS[c].shortLabel}
              </option>
            ))}
          </select>

          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value as any)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200"
          >
            <option value="ALL">Todos los estados</option>
            {(Object.keys(BOARD_STATUS_LABELS) as BoardStatusCat[]).map((cat) => (
              <option key={cat} value={cat}>
                {BOARD_STATUS_LABELS[cat].title}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingItem(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#0F2942] text-xs font-black shadow-sm transition shrink-0"
        >
          <Plus size={16} />
          <span>Nuevo Compromiso</span>
        </button>
      </div>

      {/* Tabla */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-[11px] font-black uppercase text-slate-500">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Nivel</th>
                <th className="py-3 px-4">Temática & Entregable</th>
                <th className="py-3 px-4">Responsable</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No se encontraron compromisos con los filtros actuales.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const st = BOARD_STATUS_LABELS[item.cat];
                  const isActive = item.active !== false;
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition ${
                        !isActive ? "opacity-50" : ""
                      }`}
                    >
                      <td className="py-3 px-4 font-mono text-slate-400">{item.id}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200">
                          {BOARD_LEVELS[item.nivel]?.shortLabel || item.nivel}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-md">
                        <div className="font-bold text-slate-900 dark:text-white">{item.tematica}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                          {item.entregable}
                        </div>
                        <span className="inline-block mt-1 text-[10px] font-semibold text-slate-400">
                          {BOARD_RUBRO_LABELS[item.rubro]}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 max-w-[180px]">
                        {item.responsable}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${st.bg} ${st.text} ${st.border}`}>
                          {item.estado}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(item)}
                            title={isActive ? "Ocultar del portal" : "Mostrar en el portal"}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          >
                            {isActive ? <Eye size={15} /> : <EyeOff size={15} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingItem(item);
                              setModalOpen(true);
                            }}
                            title="Editar"
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
                          >
                            <Pencil size={15} />
                          </button>
                          {inDb && (
                            <button
                              type="button"
                              onClick={() => setDeleteId(item.id)}
                              title="Eliminar"
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear / Editar */}
      <BoardCommitmentModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
        initialData={editingItem}
      />

      {/* Modal Confirmar Eliminación */}
      {deleteId !== null && (
        <ModalPortal>
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-rose-500">
                <div className="p-3 rounded-2xl bg-rose-500/10">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    ¿Eliminar compromiso #{deleteId}?
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Esta acción eliminará el registro permanentemente.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
