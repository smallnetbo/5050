import { getLandingData } from "@/lib/data-service";
import { MultimediaClientManager } from "./MultimediaClientManager";
import { Video } from "lucide-react";

export default async function AdminMultimediaPage() {
  const data = await getLandingData();

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <span className="rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 text-xs font-black uppercase">
          Centro Multimedia CMS
        </span>
        <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <Video className="text-emerald-500" size={32} />
          <span>Gestión de Recursos Audiovisuales</span>
        </h1>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          Administre los videos institucionales, webinars, transmisiones en vivo y enlaces de prensa que se muestran en el <code className="text-emerald-500">MultimediaHub.tsx</code> del portal público.
        </p>
      </div>

      <MultimediaClientManager initialItems={data.mediaItems} />
    </div>
  );
}
