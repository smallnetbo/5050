import Link from "next/link";
import { getLandingData } from "@/lib/data-service";
import { Clock, FileText, Sliders, Map, Sparkles, ArrowRight, Video } from "lucide-react";

export default async function AdminDashboardPage() {
  const data = await getLandingData();

  const stats = [
    { title: "Recursos Multimedia", count: data.mediaItems.length, href: "/admin/multimedia", icon: Video, color: "bg-rose-500" },
    { title: "Hitos Registrados", count: data.milestones.length, href: "/admin/timeline", icon: Clock, color: "bg-blue-500" },
    { title: "Documentos Abiertos", count: data.documents.length, href: "/admin/documents", icon: FileText, color: "bg-emerald-500" },
    { title: "Pilares Autonómicos", count: data.pillars.length, href: "/admin/pillars", icon: Sliders, color: "bg-purple-500" },
    { title: "Departamentos", count: data.departments.length, href: "/admin/departments", icon: Map, color: "bg-amber-500" },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <span className="rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 text-xs font-black uppercase">
          Panel CMS Integrado
        </span>
        <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Gestión de Contenido Dinámico
        </h1>
        <p className="mt-1 text-sm text-slate-500 font-medium">
          Edite y gestione la información de la landing page pública con revalidación instantánea bajo demanda.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.title}
              href={s.href}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{s.title}</span>
                <div className={`p-2.5 rounded-2xl text-white ${s.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="mt-6 flex items-baseline justify-between">
                <span className="text-3xl font-black text-slate-900 dark:text-white">{s.count}</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  Editar <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Info Box */}
      <div className="bg-gradient-to-r from-[#0F2942] to-[#1E3A8A] text-white p-8 rounded-[32px] shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <Sparkles className="text-emerald-400" size={18} />
            <span className="text-xs font-black text-emerald-400 uppercase">Aviso de Exclusión y Seguridad</span>
          </div>
          <h2 className="text-2xl font-black">Módulo Noticioso Independiente</h2>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            El componente <code className="bg-white/10 px-2 py-0.5 rounded text-emerald-300 font-bold">InteractiveNewsGallery3.tsx</code> opera de forma totalmente independiente mediante su API directa. Las modificaciones realizadas en esta plataforma sólo afectan a las secciones administrativas configurables.
          </p>
        </div>
      </div>
    </div>
  );
}
