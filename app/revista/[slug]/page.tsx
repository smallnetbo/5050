import { notFound } from "next/navigation";
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

export default async function RevistaEditionSlugPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const isAdmin = await verifyAdminSession();
  const canSeeHidden = isAdmin && (sp?.preview === "1" || true);

  const [landingData, moduleConfigs, allEditions] = await Promise.all([
    getLandingData(),
    getModuleConfigs(),
    getRevistaEditions(canSeeHidden),
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

  const activeEdition = allEditions.find((e) => e.slug === slug);
  if (!activeEdition || (!activeEdition.isVisible && !isAdmin)) {
    notFound();
  }

  const visibleEditions = allEditions.filter((e) => e.isVisible || isAdmin);
  const isPreviewMode = (!moduleEnabled || !activeEdition.isVisible || sp?.preview === "1") && isAdmin;

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
            editionsList={visibleEditions}
            isPreviewMode={isPreviewMode}
          />
        </main>
        <Footer sections={allSections} />
      </div>
    </ThemeProvider>
  );
}
