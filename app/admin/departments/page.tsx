import { getLandingData } from "@/lib/data-service";
import { Map, CheckCircle2 } from "lucide-react";

export default async function AdminDepartmentsPage() {
  const data = await getLandingData();

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <span className="rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 px-2.5 py-1 text-xs font-black uppercase">
          Monitoreo Territorial
        </span>
        <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Datos por Departamento (Monitor.tsx)
        </h1>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          Información territorial de adhesión, gobernadores e impacto presupuestario estimado.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-xs space-y-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {dept.id} · {dept.name}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600">
                <CheckCircle2 size={14} /> Adherido
              </span>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Gobernador</p>
              <p className="text-xs font-black text-slate-800 dark:text-slate-200">{dept.governor}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Impacto Estimado 50/50</p>
              <p className="text-xs font-black text-emerald-600">{dept.target5050Impact}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Proyectos Clave</p>
              <ul className="mt-1 space-y-1">
                {dept.keyProjects.slice(0, 2).map((proj, idx) => (
                  <li key={idx} className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    • {proj}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
