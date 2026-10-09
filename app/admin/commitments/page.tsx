import { getLandingData } from "@/lib/data-service";
import { CommitmentsManager } from "./CommitmentsManager";
import { ClipboardList } from "lucide-react";

export default async function AdminCommitmentsPage() {
  const data = await getLandingData();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <span className="rounded-md bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 px-2.5 py-1 text-xs font-black uppercase">
          Matriz de Cumplimiento CMS
        </span>
        <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <ClipboardList className="text-indigo-500" size={32} />
          <span>Gestión de Compromisos por Nivel</span>
        </h1>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          Administre, edite estados, asigne responsables, entregables y plazos para los 4 niveles de gobierno (NCE, GAD, GAM y Conjuntos) de la Agenda 50/50.
        </p>
      </div>

      <CommitmentsManager
        initialCommitments={data.commitments}
        initialLevels={data.commitmentLevels}
      />
    </div>
  );
}
