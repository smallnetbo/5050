import { getLandingData } from "@/lib/data-service";
import { DocumentForm } from "./DocumentForm";
import { FileText, Download, Sparkles } from "lucide-react";

export default async function AdminDocumentsPage() {
  const data = await getLandingData();

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <span className="rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 text-xs font-black uppercase">
          Repositorio Documental
        </span>
        <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          DocumentHub & Descargas
        </h1>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          Suba y administre los documentos PDF que se muestran en la sección <code className="text-emerald-500">DocumentHub.tsx</code>.
        </p>
      </div>

      <DocumentForm />

      {/* Document List */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <FileText size={18} className="text-emerald-500" />
          <span>Documentos Publicados ({data.documents.length})</span>
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {data.documents.map((doc: any) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-[10px] font-black uppercase text-slate-700 dark:text-slate-300">
                    {doc.category}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{doc.date}</span>
                </div>
                <h3 className="mt-3 font-black text-slate-900 dark:text-white text-base">
                  {doc.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500 font-medium line-clamp-2">
                  {doc.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="font-bold text-slate-400">{doc.fileSize}</span>
                {doc.fileUrl && (
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 font-black text-emerald-500 hover:underline"
                  >
                    <Download size={14} /> Ver PDF
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
