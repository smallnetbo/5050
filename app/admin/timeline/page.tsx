import { getLandingData } from "@/lib/data-service";
import { MilestoneForm } from "./MilestoneForm";
import { Milestone } from "@/lib/agenda-data";
import { Clock, Plus, Edit2, Calendar, CheckCircle2 } from "lucide-react";

export default async function AdminTimelinePage() {
  const data = await getLandingData();

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-2.5 py-1 text-xs font-black uppercase">
            Gestor de Cronograma
          </span>
          <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Hitos & Hoja de Ruta
          </h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Administre los hitos clave presentados en el componente <code className="text-emerald-500">Timeline.tsx</code> de la página principal.
          </p>
        </div>
      </div>

      {/* Form Area */}
      <div>
        <MilestoneForm />
      </div>

      {/* List of existing milestones */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Clock size={18} className="text-emerald-500" />
          <span>Hitos Activos ({data.milestones.length})</span>
        </h2>

        <div className="grid gap-4">
          {data.milestones.map((m: Milestone) => (
            <div
              key={m.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    m.status === "Cumplido" ? "bg-emerald-100 text-emerald-800" :
                    m.status === "En proceso" ? "bg-amber-100 text-amber-800" :
                    "bg-slate-100 text-slate-800"
                  }`}>
                    {m.status}
                  </span>
                  <span className="text-xs font-extrabold text-slate-400 flex items-center gap-1">
                    <Calendar size={12} /> {m.date}
                  </span>
                </div>
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium line-clamp-2">
                  {m.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
