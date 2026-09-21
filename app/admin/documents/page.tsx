import { getLandingData } from "@/lib/data-service";
import { DocumentsClientManager } from "./DocumentsClientManager";
import { FileText } from "lucide-react";

export default async function AdminDocumentsPage() {
  const data = await getLandingData();

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <span className="rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 text-xs font-black uppercase">
          Repositorio Documental CMS
        </span>
        <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <FileText className="text-emerald-500" size={32} />
          <span>Gestión de DocumentHub & Descargas</span>
        </h1>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          Suba, edite y elimine los acuerdos, anteproyectos de ley, decretos y actas en formato PDF que se presentan en el <code className="text-emerald-500">DocumentHub.tsx</code> del portal público.
        </p>
      </div>

      <DocumentsClientManager initialDocuments={data.documents} />
    </div>
  );
}
