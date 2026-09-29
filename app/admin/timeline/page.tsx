import { getLandingData } from "@/lib/data-service";
import { TimelineManager } from "./TimelineManager";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function AdminTimelinePage() {
  const data = await getLandingData();

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 px-2.5 py-1 text-xs font-black uppercase">
            Gestor de Cronograma
          </span>
          <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Hitos & Hoja de Ruta ({data.milestones.length} Hitos)
          </h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Administre, reordene y actualice en tiempo real los hitos clave del componente <code className="text-emerald-500 font-bold">Timeline.tsx</code>.
          </p>
        </div>
      </div>

      <TimelineManager initialMilestones={data.milestones} />
    </div>
  );
}
