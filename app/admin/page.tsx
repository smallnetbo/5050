import Link from "next/link";
import { getLandingData } from "@/lib/data-service";
import { getPageSections } from "@/lib/sections-service";
import { prisma } from "@/lib/db";
import {
  Clock,
  FileText,
  Sliders,
  Map,
  Sparkles,
  ArrowRight,
  Video,
  Activity,
  ClipboardList,
  Layers,
  HelpCircle,
  Newspaper,
  MessageSquare,
  Eye,
  EyeOff,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [data, sections, proposalsCount] = await Promise.all([
    getLandingData(),
    getPageSections(),
    prisma.citizenProposal.count().catch(() => 0),
  ]);

  // Función para obtener metadatos y conteo según la sección
  const getSectionCardInfo = (id: string) => {
    switch (id) {
      case "Hero":
        return {
          title: "Hero & Portada",
          count: "Activo",
          href: "/admin/profile",
          icon: Sparkles,
          color: "bg-amber-500",
          actionText: "Configurar",
        };
      case "Concepts":
        return {
          title: "Conceptos 50/50",
          count: data.conceptSteps.length,
          href: "/admin/concepts",
          icon: HelpCircle,
          color: "bg-teal-600",
          actionText: "Gestionar",
        };
      case "Monitor":
        return {
          title: "Indicadores Monitor",
          count: data.monitorMetrics.length,
          href: "/admin/monitor",
          icon: Activity,
          color: "bg-emerald-600",
          actionText: "Monitorear",
        };
      case "DocumentHub":
        return {
          title: "Documentos Abiertos",
          count: data.documents.length,
          href: "/admin/documents",
          icon: FileText,
          color: "bg-emerald-500",
          actionText: "Archivos",
        };
      case "LevelCommitments":
        return {
          title: "Compromisos x Nivel",
          count: (data.commitments || []).length,
          href: "/admin/commitments",
          icon: ClipboardList,
          color: "bg-indigo-600",
          actionText: "Compromisos",
        };
      case "Timeline":
        return {
          title: "Hitos Registrados",
          count: data.milestones.length,
          href: "/admin/timeline",
          icon: Clock,
          color: "bg-blue-500",
          actionText: "Timeline",
        };
      case "MultimediaHub":
        return {
          title: "Recursos Multimedia",
          count: data.mediaItems.length,
          href: "/admin/multimedia",
          icon: Video,
          color: "bg-rose-500",
          actionText: "Multimedia",
        };
      case "InteractiveNewsGallery3":
        return {
          title: "Prensa y Noticias",
          count: "Módulo API",
          href: "/admin/sections#interactiveNewsGallery3",
          icon: Newspaper,
          color: "bg-purple-600",
          actionText: "Prensa",
        };
      case "CitizenFeedback":
        return {
          title: "Propuestas Ciudadanas",
          count: proposalsCount,
          href: "/admin/proposals",
          icon: MessageSquare,
          color: "bg-emerald-700",
          actionText: "Revisar",
        };
      default:
        return {
          title: id,
          count: "-",
          href: "/admin/sections",
          icon: Layers,
          color: "bg-slate-600",
          actionText: "Ver",
        };
    }
  };

  const activeCount = sections.filter((s) => s.enabled).length;

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Title & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 text-xs font-black uppercase">
            Panel CMS Integrado
          </span>
          <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Gestión y Control de la Plataforma
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
            Administre la estructura, orden y contenidos de la landing page con revalidación instantánea.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/sections"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md transition"
          >
            <Layers size={16} />
            <span>Reordenar Secciones</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <span>Sitio Público</span>
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      {/* Hero Widget: Estructura & Orden Activo */}
      <div className="bg-gradient-to-br from-[#0F2942] to-[#1A3A5A] text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Layers size={16} />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                Estructura Actual del Portal ({activeCount}/9 activas)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black leading-tight">
              Orden Secuencial de Secciones
            </h2>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              El portal público y el menú de navegación se generan dinámicamente según esta secuencia. Puedes reordenar (Drag & Drop) y ocultar/mostrar cualquier sección en tiempo real.
            </p>
          </div>

          <Link
            href="/admin/sections"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#0F2942] font-black text-xs shadow-lg transition shrink-0"
          >
            <span>Gestionar Orden (Drag & Drop)</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Mini Breadcrumbs / Flow of Sections */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-2">
          {sections.map((sec, idx) => (
            <div
              key={sec.id}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                sec.enabled
                  ? "bg-white/10 border-white/15 text-white"
                  : "bg-white/5 border-white/5 text-slate-400 opacity-60 line-through"
              }`}
            >
              <span className="text-[10px] font-mono text-emerald-400 font-black">
                {idx + 1}.
              </span>
              <span>{sec.shortTitle}</span>
              {!sec.enabled ? (
                <EyeOff size={12} className="text-rose-400" />
              ) : (
                <Eye size={12} className="text-emerald-400" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Grid of Sections (IN EXACT CONFIGURED ORDER) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>Módulos de la Landing Page</span>
            <span className="text-xs font-bold text-slate-400 font-mono">(Orden 1 al 9)</span>
          </h2>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {activeCount} Visibles
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((sec, index) => {
            const card = getSectionCardInfo(sec.id);
            const Icon = card.icon;

            return (
              <Link
                key={sec.id}
                href={card.href}
                className={`group bg-white dark:bg-slate-900 border p-5 rounded-3xl shadow-xs hover:shadow-md transition flex flex-col justify-between ${
                  sec.enabled
                    ? "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    : "border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40 opacity-70"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-black text-slate-700 dark:text-slate-300 flex items-center justify-center font-mono">
                        {index + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                        {card.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {!sec.enabled ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900/40">
                          <EyeOff size={11} /> Oculto
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/40">
                          <Eye size={11} /> Visible
                        </span>
                      )}

                      <div className={`p-2.5 rounded-2xl text-white ${card.color} shrink-0`}>
                        <Icon size={17} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {card.count}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {sec.href}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                  <span>{card.actionText}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Secondary Modules */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-base font-black text-slate-900 dark:text-white">
          Otros Módulos Institucionales
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/admin/pillars"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-xs hover:shadow-md transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl text-white bg-purple-600">
                <Sliders size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Pilares Autonómicos
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {data.pillars.length} pilares del pacto fiscal
                </p>
              </div>
            </div>
            <ArrowRight size={16} className="text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition" />
          </Link>

          <Link
            href="/admin/departments"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-xs hover:shadow-md transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl text-white bg-amber-500">
                <Map size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Monitor Regional
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {data.departments.length} departamentos de Bolivia
                </p>
              </div>
            </div>
            <ArrowRight size={16} className="text-slate-400 group-hover:text-amber-500 group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </div>
    </div>
  );
}
