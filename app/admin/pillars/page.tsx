import { getLandingData } from "@/lib/data-service";
import { Sliders, ShieldCheck } from "lucide-react";

export default async function AdminPillarsPage() {
  const data = await getLandingData();

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <span className="rounded-md bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 px-2.5 py-1 text-xs font-black uppercase">
          Estructura de la Reforma
        </span>
        <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Pilares Autonómicos (10 Ejes)
        </h1>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          Monitoree y gestione los 10 pilares del Acuerdo N° 001/2026 presentados en la sección <code className="text-emerald-500">Pillars.tsx</code>.
        </p>
      </div>

      <div className="grid gap-4">
        {data.pillars.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-0.5 text-[10px] font-black uppercase">
                  Pilar #{p.id} · {p.category}
                </span>
              </div>
              <h3 className="font-black text-slate-900 dark:text-white text-base">
                {p.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {p.summary}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
