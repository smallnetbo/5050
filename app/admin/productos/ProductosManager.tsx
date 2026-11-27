"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  BookOpen,
  Compass,
  Copy,
  Star,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Sliders,
  MapPin,
  Share2,
  ChevronDown,
  ChevronUp,
  Loader2,
  X,
} from "lucide-react";
import {
  SiteModuleConfigDTO,
  RevistaEditionDTO,
  RevistaChapterDTO,
  RutaVivaSedeDTO,
  RutaVivaCardDTO,
} from "@/lib/productos-service";
import { DocumentItem, MediaItem, DepartmentData } from "@/lib/agenda-data";
import {
  toggleModuleConfigAction,
  toggleEditionVisibilityAction,
  setFeaturedEditionAction,
  duplicateRevistaEditionAction,
  upsertRevistaEditionAction,
  deleteRevistaEditionAction,
  toggleChapterVisibilityAction,
  upsertRevistaChapterAction,
  deleteRevistaChapterAction,
  toggleSedeVisibilityAction,
  upsertRutaVivaSedeAction,
  deleteRutaVivaSedeAction,
  toggleCardVisibilityAction,
  upsertRutaVivaCardAction,
} from "@/lib/actions/productos.actions";
import { ModalPortal } from "@/components/ModalPortal";

interface Props {
  initialModules: SiteModuleConfigDTO[];
  initialEditions: RevistaEditionDTO[];
  initialSedes: RutaVivaSedeDTO[];
  initialCards: RutaVivaCardDTO[];
  documents: DocumentItem[];
  mediaItems: MediaItem[];
  departments: DepartmentData[];
}

export function ProductosManager({
  initialModules,
  initialEditions,
  initialSedes,
  initialCards,
  documents,
  mediaItems,
  departments,
}: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<"visibility" | "revista" | "rutaviva">("visibility");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [expandedEditionId, setExpandedEditionId] = useState<string | null>(
    initialEditions[0]?.id || null
  );

  // Modales Edición / Capítulo / Sede / Placa
  const [editionModal, setEditionModal] = useState<Partial<RevistaEditionDTO> | null>(null);
  const [chapterModal, setChapterModal] = useState<
    (Partial<RevistaChapterDTO> & { editionId: string }) | null
  >(null);
  const [sedeModal, setSedeModal] = useState<Partial<RutaVivaSedeDTO> | null>(null);
  const [cardModal, setCardModal] = useState<Partial<RutaVivaCardDTO> | null>(null);

  const runAction = async (key: string, fn: () => Promise<{ success: boolean; error?: string }>) => {
    setBusyId(key);
    try {
      const res = await fn();
      if (!res.success && res.error) {
        alert(res.error);
      }
      router.refresh();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Cabecera */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 text-xs font-black uppercase">
            Autogestión de Productos Editoriales
          </span>
          <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Revista 50/50 &amp; Ruta Viva
          </h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Activa o desactiva la visibilidad pública, prepara futuras ediciones en borrador y
            administra sedes territoriales y cápsulas sin tocar código.
          </p>
        </div>
      </div>

      {/* 3 Pestañas Principales */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setTab("visibility")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition cursor-pointer ${
            tab === "visibility"
              ? "bg-[#0F2942] text-white dark:bg-emerald-500 dark:text-[#0F2942]"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
          }`}
        >
          <Sliders size={15} /> 1. Visibilidad de Módulos
        </button>
        <button
          onClick={() => setTab("revista")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition cursor-pointer ${
            tab === "revista"
              ? "bg-[#0F2942] text-white dark:bg-emerald-500 dark:text-[#0F2942]"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
          }`}
        >
          <BookOpen size={15} /> 2. Revista 50/50 ({initialEditions.length} Ediciones)
        </button>
        <button
          onClick={() => setTab("rutaviva")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition cursor-pointer ${
            tab === "rutaviva"
              ? "bg-[#0F2942] text-white dark:bg-emerald-500 dark:text-[#0F2942]"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
          }`}
        >
          <Compass size={15} /> 3. Ruta Viva ({initialSedes.length} Sedes · {initialCards.length} Placas)
        </button>
      </div>

      {/* PESTAÑA 1: VISIBILIDAD DE MÓDULOS */}
      {tab === "visibility" && (
        <div className="grid gap-4 md:grid-cols-2">
          {initialModules.map((mod) => {
            const hasNavbarControl = mod.key === "revista" || mod.key === "ruta-viva";
            return (
              <div
                key={mod.key}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 flex flex-col justify-between gap-4 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                      {mod.key}
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                      {mod.label}
                    </h3>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                      mod.enabled
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                    }`}
                  >
                    {mod.enabled ? "Activo" : "Oculto al público"}
                  </span>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="flex items-center justify-between text-xs font-bold cursor-pointer">
                    <span>Visibilidad pública</span>
                    <button
                      type="button"
                      disabled={busyId === `${mod.key}-enabled`}
                      onClick={() =>
                        runAction(`${mod.key}-enabled`, () =>
                          toggleModuleConfigAction(mod.key, "enabled", !mod.enabled)
                        )
                      }
                      className={`w-11 h-6 rounded-full transition relative cursor-pointer ${
                        mod.enabled ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    >
                      <span
                        className={`block w-4 h-4 rounded-full bg-white transition-transform translate-y-0 ${
                          mod.enabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </label>

                  {hasNavbarControl && (
                    <label className="flex items-center justify-between text-xs font-bold cursor-pointer">
                      <span>Mostrar enlace en barra de navegación</span>
                      <button
                        type="button"
                        disabled={busyId === `${mod.key}-nav`}
                        onClick={() =>
                          runAction(`${mod.key}-nav`, () =>
                            toggleModuleConfigAction(mod.key, "showInNavbar", !mod.showInNavbar)
                          )
                        }
                        className={`w-11 h-6 rounded-full transition relative cursor-pointer ${
                          mod.showInNavbar ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-700"
                        }`}
                      >
                        <span
                          className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                            mod.showInNavbar ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </label>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PESTAÑA 2: REVISTA 50/50 (EDICIONES Y CAPÍTULOS) */}
      {tab === "revista" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() =>
                setEditionModal({
                  editionNumber: initialEditions.length + 1,
                  title: "",
                  subtitle: "",
                  periodLabel: "",
                  isVisible: false,
                })
              }
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 text-xs font-black cursor-pointer"
            >
              <Plus size={15} /> Nueva Edición
            </button>
          </div>

          {initialEditions.map((ed) => {
            const isExpanded = expandedEditionId === ed.id;
            return (
              <div
                key={ed.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 space-y-4 shadow-xs"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-black uppercase">
                        Edición N° {ed.editionNumber} · {ed.slug}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                          ed.isVisible
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                        }`}
                      >
                        {ed.isVisible ? "Publicado" : "Borrador"}
                      </span>
                      {ed.isFeatured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 text-[10px] font-black">
                          <Star size={10} /> Edición Principal
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {ed.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {ed.periodLabel} · {ed.chapters.length} capítulos
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() =>
                        runAction(`vis-${ed.id}`, () =>
                          toggleEditionVisibilityAction(ed.id, !ed.isVisible)
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      {ed.isVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                      {ed.isVisible ? "Pasar a Borrador" : "Publicar"}
                    </button>

                    {!ed.isFeatured && (
                      <button
                        onClick={() =>
                          runAction(`feat-${ed.id}`, () => setFeaturedEditionAction(ed.id))
                        }
                        className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/15 text-amber-800 dark:text-amber-300 px-3 py-1.5 text-xs font-bold cursor-pointer"
                      >
                        <Star size={13} /> Marcar Principal
                      </button>
                    )}

                    <button
                      onClick={() =>
                        runAction(`dup-${ed.id}`, () => duplicateRevistaEditionAction(ed.id))
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 text-xs font-bold cursor-pointer"
                    >
                      <Copy size={13} /> Duplicar edición
                    </button>

                    <Link
                      href={`/revista/${ed.slug}?preview=1`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-bold"
                    >
                      <ExternalLink size={13} /> Vista previa
                    </Link>

                    <button
                      onClick={() => setEditionModal(ed)}
                      className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      title="Editar edición"
                    >
                      <Pencil size={14} />
                    </button>

                    {initialEditions.length > 1 && !ed.isFeatured && (
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar "${ed.title}"?`)) {
                            runAction(`del-${ed.id}`, () => deleteRevistaEditionAction(ed.id));
                          }
                        }}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                        title="Eliminar edición"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}

                    <button
                      onClick={() => setExpandedEditionId(isExpanded ? null : ed.id)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                  </div>
                </div>

                {/* Lista de Capítulos de la Edición */}
                {isExpanded && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-slate-400">
                        Capítulos de esta edición
                      </span>
                      <button
                        onClick={() =>
                          setChapterModal({
                            editionId: ed.id,
                            order: ed.chapters.length,
                            kicker: "",
                            title: "",
                            summary: "",
                            content: "",
                            isVisible: true,
                          })
                        }
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-3 py-1 text-xs font-black cursor-pointer"
                      >
                        <Plus size={13} /> Añadir Capítulo
                      </button>
                    </div>

                    {ed.chapters.map((ch) => (
                      <div
                        key={ch.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-200/70 dark:border-slate-700/60"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                            <span>#{ch.order}</span>
                            <span>• {ch.kicker}</span>
                            {!ch.isVisible && (
                              <span className="text-rose-500 font-black uppercase">• Oculto</span>
                            )}
                          </div>
                          <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                            {ch.title}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              runAction(`chv-${ch.id}`, () =>
                                toggleChapterVisibilityAction(ch.id, !ch.isVisible)
                              )
                            }
                            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 cursor-pointer"
                            title={ch.isVisible ? "Ocultar capítulo" : "Mostrar capítulo"}
                          >
                            {ch.isVisible ? <Eye size={14} /> : <EyeOff size={14} className="text-rose-500" />}
                          </button>
                          <button
                            onClick={() => setChapterModal(ch)}
                            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 cursor-pointer"
                            title="Editar capítulo"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar capítulo "${ch.title}"?`)) {
                                runAction(`chd-${ch.id}`, () => deleteRevistaChapterAction(ch.id));
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                            title="Eliminar capítulo"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* PESTAÑA 3: RUTA VIVA (SEDES Y KIT) */}
      {tab === "rutaviva" && (
        <div className="space-y-8">
          {/* Sedes Territoriales */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black flex items-center gap-2">
                <MapPin size={18} className="text-rose-500" /> Sedes Territoriales del Mapa
              </h2>
              <button
                onClick={() =>
                  setSedeModal({
                    city: "",
                    department: "LP",
                    lat: -16.5,
                    lng: -68.15,
                    title: "",
                    dateLabel: "",
                    actors: "",
                    summary: "",
                    keyFigures: [],
                    accent: "emerald",
                    order: initialSedes.length + 1,
                    isVisible: true,
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 text-white px-3.5 py-2 text-xs font-black cursor-pointer"
              >
                <Plus size={14} /> Nueva Sede
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {initialSedes.map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                      <span className="font-black text-slate-900 dark:text-white">{s.city}</span>
                      <span>({s.department})</span>
                      <span>• {s.dateLabel}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1 line-clamp-1">
                      {s.title}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1">
                      lat: {s.lat}, lng: {s.lng}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() =>
                        runAction(`sv-${s.id}`, () =>
                          toggleSedeVisibilityAction(s.id, !s.isVisible)
                        )
                      }
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      {s.isVisible ? <Eye size={14} /> : <EyeOff size={14} className="text-rose-500" />}
                    </button>
                    <button
                      onClick={() => setSedeModal(s)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar sede "${s.city}"?`)) {
                          runAction(`sd-${s.id}`, () => deleteRutaVivaSedeAction(s.id));
                        }
                      }}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tarjetas del Kit de Redes y Prensa */}
          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-black flex items-center gap-2">
              <Share2 size={18} className="text-amber-500" /> Tarjetas del Kit de Redes y Prensa
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {initialCards.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase text-amber-600">
                      {c.category} · {c.heroStat}
                    </span>
                    <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                      {c.title}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{c.copyText}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() =>
                        runAction(`cv-${c.id}`, () =>
                          toggleCardVisibilityAction(c.id, !c.isVisible)
                        )
                      }
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      {c.isVisible ? <Eye size={14} /> : <EyeOff size={14} className="text-rose-500" />}
                    </button>
                    <button
                      onClick={() => setCardModal(c)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDICIÓN */}
      {editionModal && (
        <ModalPortal>
          <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await runAction("save-ed", () =>
                  upsertRevistaEditionAction({
                    id: editionModal.id,
                    editionNumber: Number(editionModal.editionNumber || 1),
                    slug: editionModal.slug,
                    title: editionModal.title || "",
                    subtitle: editionModal.subtitle || "",
                    periodLabel: editionModal.periodLabel || "",
                    publishedAt: editionModal.publishedAt || "",
                    isVisible: Boolean(editionModal.isVisible),
                  })
                );
                setEditionModal(null);
              }}
              className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-700"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-black text-lg">
                  {editionModal.id ? "Editar Edición" : "Nueva Edición"}
                </h3>
                <button type="button" onClick={() => setEditionModal(null)}>
                  <X size={18} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  required
                  placeholder="N° Edición"
                  value={editionModal.editionNumber || 1}
                  onChange={(e) =>
                    setEditionModal({ ...editionModal, editionNumber: Number(e.target.value) })
                  }
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs font-bold"
                />
                <input
                  type="text"
                  placeholder="Periodo (ej. Dic 2026)"
                  required
                  value={editionModal.periodLabel || ""}
                  onChange={(e) =>
                    setEditionModal({ ...editionModal, periodLabel: e.target.value })
                  }
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs font-bold"
                />
              </div>
              <input
                type="text"
                required
                placeholder="Título de la edición"
                value={editionModal.title || ""}
                onChange={(e) => setEditionModal({ ...editionModal, title: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs font-bold"
              />
              <textarea
                rows={3}
                required
                placeholder="Subtítulo editorial"
                value={editionModal.subtitle || ""}
                onChange={(e) => setEditionModal({ ...editionModal, subtitle: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs"
              />
              <label className="flex items-center gap-2 text-xs font-bold">
                <input
                  type="checkbox"
                  checked={Boolean(editionModal.isVisible)}
                  onChange={(e) =>
                    setEditionModal({ ...editionModal, isVisible: e.target.checked })
                  }
                />
                Publicado (visible al público)
              </label>
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  disabled={busyId === "save-ed"}
                  className="rounded-xl bg-emerald-500 text-white px-4 py-2 text-xs font-black cursor-pointer"
                >
                  {busyId === "save-ed" ? <Loader2 size={14} className="animate-spin" /> : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </ModalPortal>
      )}

      {/* MODAL CAPÍTULO */}
      {chapterModal && (
        <ModalPortal>
          <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await runAction("save-ch", () =>
                  upsertRevistaChapterAction({
                    id: chapterModal.id,
                    editionId: chapterModal.editionId,
                    slug: chapterModal.slug,
                    order: Number(chapterModal.order || 0),
                    kicker: chapterModal.kicker || "",
                    title: chapterModal.title || "",
                    summary: chapterModal.summary || "",
                    content: chapterModal.content || "",
                    quoteText: chapterModal.quoteText || "",
                    quoteSource: chapterModal.quoteSource || "",
                    linkedActor: chapterModal.linkedActor || "",
                    linkedDocumentId: chapterModal.linkedDocumentId || "",
                    linkedMediaId: chapterModal.linkedMediaId || "",
                    isVisible: chapterModal.isVisible !== false,
                  })
                );
                setChapterModal(null);
              }}
              className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 p-6 space-y-3 shadow-2xl border border-slate-200 dark:border-slate-700"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-black text-lg">
                  {chapterModal.id ? "Editar Capítulo" : "Nuevo Capítulo"}
                </h3>
                <button type="button" onClick={() => setChapterModal(null)}>
                  <X size={18} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  placeholder="Orden"
                  value={chapterModal.order ?? 0}
                  onChange={(e) =>
                    setChapterModal({ ...chapterModal, order: Number(e.target.value) })
                  }
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs font-bold"
                />
                <input
                  type="text"
                  required
                  placeholder="Kicker (ej. Capítulo 01)"
                  value={chapterModal.kicker || ""}
                  onChange={(e) => setChapterModal({ ...chapterModal, kicker: e.target.value })}
                  className="col-span-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs font-bold"
                />
              </div>
              <input
                type="text"
                required
                placeholder="Título del capítulo"
                value={chapterModal.title || ""}
                onChange={(e) => setChapterModal({ ...chapterModal, title: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs font-bold"
              />
              <textarea
                rows={2}
                required
                placeholder="Resumen introductorio"
                value={chapterModal.summary || ""}
                onChange={(e) => setChapterModal({ ...chapterModal, summary: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs"
              />
              <textarea
                rows={3}
                required
                placeholder="Contenido principal"
                value={chapterModal.content || ""}
                onChange={(e) => setChapterModal({ ...chapterModal, content: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={chapterModal.linkedDocumentId || ""}
                  onChange={(e) =>
                    setChapterModal({ ...chapterModal, linkedDocumentId: e.target.value })
                  }
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                >
                  <option value="">-- Vincular PDF oficial --</option>
                  {documents.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title.slice(0, 45)}
                    </option>
                  ))}
                </select>
                <select
                  value={chapterModal.linkedMediaId || ""}
                  onChange={(e) =>
                    setChapterModal({ ...chapterModal, linkedMediaId: e.target.value })
                  }
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                >
                  <option value="">-- Vincular Video --</option>
                  {mediaItems
                    .filter((m) => m.type === "videos")
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title.slice(0, 45)}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-500 text-white px-4 py-2 text-xs font-black cursor-pointer"
                >
                  Guardar Capítulo
                </button>
              </div>
            </form>
          </div>
        </ModalPortal>
      )}

      {/* MODAL SEDE */}
      {sedeModal && (
        <ModalPortal>
          <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await runAction("save-sede", () =>
                  upsertRutaVivaSedeAction({
                    id: sedeModal.id,
                    slug: sedeModal.slug,
                    city: sedeModal.city || "",
                    department: sedeModal.department || "LP",
                    lat: Number(sedeModal.lat || -16.5),
                    lng: Number(sedeModal.lng || -68.15),
                    title: sedeModal.title || "",
                    dateLabel: sedeModal.dateLabel || "",
                    actors: sedeModal.actors || "",
                    summary: sedeModal.summary || "",
                    keyFigures: sedeModal.keyFigures || [],
                    linkedDocumentId: sedeModal.linkedDocumentId || "",
                    linkedChapterSlug: sedeModal.linkedChapterSlug || "",
                    accent: sedeModal.accent || "emerald",
                    order: Number(sedeModal.order || 1),
                    isVisible: sedeModal.isVisible !== false,
                  })
                );
                setSedeModal(null);
              }}
              className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 p-6 space-y-3 shadow-2xl border border-slate-200 dark:border-slate-700"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-black text-lg">
                  {sedeModal.id ? `Editar Sede: ${sedeModal.city}` : "Nueva Sede Territorial"}
                </h3>
                <button type="button" onClick={() => setSedeModal(null)}>
                  <X size={18} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Ciudad"
                  value={sedeModal.city || ""}
                  onChange={(e) => setSedeModal({ ...sedeModal, city: e.target.value })}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs font-bold"
                />
                <select
                  value={sedeModal.department || "LP"}
                  onChange={(e) => setSedeModal({ ...sedeModal, department: e.target.value })}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.id})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="0.0001"
                  required
                  placeholder="Latitud (ej. -19.0196)"
                  value={sedeModal.lat ?? ""}
                  onChange={(e) => setSedeModal({ ...sedeModal, lat: Number(e.target.value) })}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs font-mono"
                />
                <input
                  type="number"
                  step="0.0001"
                  required
                  placeholder="Longitud (ej. -65.2627)"
                  value={sedeModal.lng ?? ""}
                  onChange={(e) => setSedeModal({ ...sedeModal, lng: Number(e.target.value) })}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs font-mono"
                />
              </div>
              <input
                type="text"
                required
                placeholder="Título del acuerdo / reunión"
                value={sedeModal.title || ""}
                onChange={(e) => setSedeModal({ ...sedeModal, title: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs font-bold"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Fecha"
                  value={sedeModal.dateLabel || ""}
                  onChange={(e) => setSedeModal({ ...sedeModal, dateLabel: e.target.value })}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  required
                  placeholder="Actores"
                  value={sedeModal.actors || ""}
                  onChange={(e) => setSedeModal({ ...sedeModal, actors: e.target.value })}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs"
                />
              </div>
              <textarea
                rows={3}
                required
                placeholder="Resumen"
                value={sedeModal.summary || ""}
                onChange={(e) => setSedeModal({ ...sedeModal, summary: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs"
              />
              <input
                type="text"
                placeholder="Cifras clave separadas por coma"
                value={(sedeModal.keyFigures || []).join(", ")}
                onChange={(e) =>
                  setSedeModal({
                    ...sedeModal,
                    keyFigures: e.target.value.split(",").map((x) => x.trim()),
                  })
                }
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-500 text-white px-4 py-2 text-xs font-black cursor-pointer"
                >
                  Guardar Sede
                </button>
              </div>
            </form>
          </div>
        </ModalPortal>
      )}

      {/* MODAL PLACA KIT REDES */}
      {cardModal && (
        <ModalPortal>
          <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await runAction("save-card", () =>
                  upsertRutaVivaCardAction({
                    id: cardModal.id,
                    title: cardModal.title || "",
                    category: cardModal.category || "",
                    subtitle: cardModal.subtitle || "",
                    heroStat: cardModal.heroStat || "",
                    heroStatLabel: cardModal.heroStatLabel || "",
                    bullets: cardModal.bullets || [],
                    footerNote: cardModal.footerNote || "",
                    copyText: cardModal.copyText || "",
                    templateType: cardModal.templateType || "emerald",
                    order: Number(cardModal.order || 1),
                    isVisible: cardModal.isVisible !== false,
                  })
                );
                setCardModal(null);
              }}
              className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-6 space-y-3 shadow-2xl border border-slate-200 dark:border-slate-700"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-black text-lg">Editar Placa del Kit</h3>
                <button type="button" onClick={() => setCardModal(null)}>
                  <X size={18} />
                </button>
              </div>
              <input
                type="text"
                required
                placeholder="Título"
                value={cardModal.title || ""}
                onChange={(e) => setCardModal({ ...cardModal, title: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs font-bold"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Dato KPI (ej. 56)"
                  value={cardModal.heroStat || ""}
                  onChange={(e) => setCardModal({ ...cardModal, heroStat: e.target.value })}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs font-black"
                />
                <input
                  type="text"
                  required
                  placeholder="Etiqueta KPI"
                  value={cardModal.heroStatLabel || ""}
                  onChange={(e) => setCardModal({ ...cardModal, heroStatLabel: e.target.value })}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs"
                />
              </div>
              <textarea
                rows={4}
                required
                placeholder="Guion / Texto copiable para redes"
                value={cardModal.copyText || ""}
                onChange={(e) => setCardModal({ ...cardModal, copyText: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-500 text-white px-4 py-2 text-xs font-black cursor-pointer"
                >
                  Guardar Placa
                </button>
              </div>
            </form>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
