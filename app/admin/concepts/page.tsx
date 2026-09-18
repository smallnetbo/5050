import { getLandingData } from "@/lib/data-service";
import { ConceptForm } from "./ConceptForm";
import { HelpCircle } from "lucide-react";

export default async function AdminConceptsPage() {
  const data = await getLandingData();

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <span className="rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 text-xs font-black uppercase">
          Edición de Conceptos 50/50
        </span>
        <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Gestión del Acordeón (Monitor.tsx)
        </h1>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          Edite las 4 tarjetas explicativas del acordeón (¿Qué es?, ¿Qué cambiará?, ¿Cómo se hará?, ¿Qué busca?).
        </p>
      </div>

      <div className="grid gap-6">
        {data.conceptSteps.map((step) => (
          <ConceptForm key={step.num} initialData={step} />
        ))}
      </div>
    </div>
  );
}
