import { getLandingData } from "@/lib/data-service";
import { getModuleConfigs, getRevistaEditions } from "@/lib/productos-service";
import { verifyAdminSession } from "@/lib/auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ModulePreparing } from "@/components/ModulePreparing";
import { RevistaClient } from "@/components/revista/RevistaClient";
import { DEFAULT_PAGE_SECTIONS, PageSectionItem } from "@/lib/sections-config";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Revista Digital 50/50 | Agenda 50/50",
  description:
    "Crónica interactiva del avance de la Agenda 50/50: del Acuerdo de Sucre a las leyes promulgadas, el Gran Chaco, municipios y autonomías indígenas.",
};

export default async function RevistaPage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  const sp = await searchParams;
  const isAdmin = await verifyAdminSession();
  const wantsPreview = sp?.preview === "1" && isAdmin;

  const [landingData, moduleConfigs, editions] = await Promise.all([
    getLandingData(),
    getModuleConfigs(),
    getRevistaEditions(wantsPreview),
  ]);

  const allSections: PageSectionItem[] = landingData.sections || DEFAULT_PAGE_SECTIONS;
  const revistaModule = moduleConfigs.find((m) => m.key === "revista");
  const moduleEnabled = revistaModule ? revistaModule.enabled : true;

  if (!moduleEnabled && !isAdmin) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-[#FAF8F3] dark:bg-[#101620] text-slate-900 dark:text-slate-100">
          <Header sections={allSections} moduleConfigs={moduleConfigs} />
          <ModulePreparing title="Revista Digital 50/50" />
          <Footer sections={allSections} />
        </div>
      </ThemeProvider>
    );
  }

  const activeEdition =
    editions.find((e) => e.isFeatured) || editions[0] || null;

  if (!activeEdition) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-[#FAF8F3] dark:bg-[#101620] text-slate-900 dark:text-slate-100">
          <Header sections={allSections} moduleConfigs={moduleConfigs} />
          <ModulePreparing title="Revista Digital 50/50" />
          <Footer sections={allSections} />
        </div>
      </ThemeProvider>
    );
  }

  const isPreviewMode = (wantsPreview || !moduleEnabled || !activeEdition.isVisible) && isAdmin;

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#FAF8F3] dark:bg-[#101620] text-slate-900 dark:text-slate-100 antialiased transition-colors duration-300">
        <Header sections={allSections} moduleConfigs={moduleConfigs} />
        <main>
          <RevistaClient
            milestones={landingData.milestones}
            commitments={landingData.boardCommitments}
            documents={landingData.documents}
            conceptSteps={landingData.conceptSteps}
            mediaItems={landingData.mediaItems}
            activeEdition={activeEdition}
            editionsList={editions}
            isPreviewMode={isPreviewMode}
          />
        </main>
        <Footer sections={allSections} />
      </div>
    </ThemeProvider>
  );
}
