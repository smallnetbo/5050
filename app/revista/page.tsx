import { getLandingData } from "@/lib/data-service";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { RevistaClient } from "@/components/revista/RevistaClient";
import { DEFAULT_PAGE_SECTIONS, PageSectionItem } from "@/lib/sections-config";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Revista Digital 50/50 — Edición N° 01 | Agenda 50/50",
  description:
    "Crónica interactiva del avance de la Agenda 50/50: del Acuerdo de Sucre a las leyes promulgadas, el Gran Chaco, municipios y autonomías indígenas.",
};

export default async function RevistaPage() {
  const landingData = await getLandingData();
  const allSections: PageSectionItem[] = landingData.sections || DEFAULT_PAGE_SECTIONS;

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#FAF8F3] dark:bg-[#101620] text-slate-900 dark:text-slate-100 antialiased transition-colors duration-300">
        <Header sections={allSections} />
        <main>
          <RevistaClient
            milestones={landingData.milestones}
            commitments={landingData.boardCommitments}
            documents={landingData.documents}
            conceptSteps={landingData.conceptSteps}
          />
        </main>
        <Footer sections={allSections} />
      </div>
    </ThemeProvider>
  );
}
