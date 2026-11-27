import { getLandingData } from "@/lib/data-service";
import {
  getModuleConfigs,
  getRutaVivaSedes,
  getRutaVivaCards,
} from "@/lib/productos-service";
import { verifyAdminSession } from "@/lib/auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ModulePreparing } from "@/components/ModulePreparing";
import { RutaVivaClient } from "@/components/ruta-viva/RutaVivaClient";
import { DEFAULT_PAGE_SECTIONS, PageSectionItem } from "@/lib/sections-config";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Ruta Viva 50/50 — Mapa Territorial, Audiovisual y Kit Redes | Agenda 50/50",
  description:
    "Experiencia multimedia territorial de la Agenda 50/50: mapa interactivo de sedes, línea de tiempo audiovisual y placas descargables para redes y prensa.",
};

export default async function RutaVivaPage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  const sp = await searchParams;
  const isAdmin = await verifyAdminSession();
  const wantsPreview = sp?.preview === "1" && isAdmin;

  const [landingData, moduleConfigs, sedes, cards] = await Promise.all([
    getLandingData(),
    getModuleConfigs(),
    getRutaVivaSedes(wantsPreview),
    getRutaVivaCards(wantsPreview),
  ]);

  const allSections: PageSectionItem[] = landingData.sections || DEFAULT_PAGE_SECTIONS;
  const rutaVivaModule = moduleConfigs.find((m) => m.key === "ruta-viva");
  const moduleEnabled = rutaVivaModule ? rutaVivaModule.enabled : true;

  if (!moduleEnabled && !isAdmin) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-[#FAF8F3] dark:bg-[#101620] text-slate-900 dark:text-slate-100">
          <Header sections={allSections} moduleConfigs={moduleConfigs} />
          <ModulePreparing title="Ruta Viva 50/50" />
          <Footer sections={allSections} />
        </div>
      </ThemeProvider>
    );
  }

  const isPreviewMode = (wantsPreview || !moduleEnabled) && isAdmin;

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#FAF8F3] dark:bg-[#101620] text-slate-900 dark:text-slate-100 antialiased transition-colors duration-300">
        <Header sections={allSections} moduleConfigs={moduleConfigs} />
        <main>
          <RutaVivaClient
            departments={landingData.departments}
            milestones={landingData.milestones}
            mediaItems={landingData.mediaItems}
            documents={landingData.documents}
            boardCommitments={landingData.boardCommitments}
            sedes={sedes}
            cards={cards}
            moduleConfigs={moduleConfigs}
            isPreviewMode={isPreviewMode}
          />
        </main>
        <Footer sections={allSections} />
      </div>
    </ThemeProvider>
  );
}
