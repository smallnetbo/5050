import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

interface ModulePreparingProps {
  title: string;
}

export function ModulePreparing({ title }: ModulePreparingProps) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full rounded-3xl border border-amber-900/15 dark:border-slate-800 bg-white dark:bg-[#17202C] p-8 sm:p-10 text-center shadow-soft space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100/80 dark:bg-amber-950/50 text-[#c79d47]">
          <Clock size={28} />
        </div>
        <div className="space-y-2">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#c79d47]">
            Servicio Estatal de Autonomías · Agenda 50/50
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1B2533] dark:text-white">
            Edición en preparación
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            El módulo <strong>{title}</strong> se encuentra actualmente en actualización editorial.
            Vuelve pronto o explora el portal principal de la Agenda 50/50.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl bg-[#1B2533] hover:bg-slate-800 dark:bg-[#c79d47] dark:text-[#101620] text-white px-6 py-3 text-sm font-black transition"
        >
          <ArrowLeft size={16} /> Volver al Portal Principal
        </Link>
      </div>
    </div>
  );
}
