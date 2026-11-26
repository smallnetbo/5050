import { getLandingData } from "@/lib/data-service";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { RutaVivaClient } from "@/components/ruta-viva/RutaVivaClient";
import { DEFAULT_PAGE_SECTIONS, PageSectionItem } from "@/lib/sections-config";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Ruta Viva 50/50 — Mapa Territorial, Audiovisual y Kit Redes | Agenda 50/50",
  description:
    "Experiencia multimedia territorial de la Agenda 50/50: mapa interactivo de sedes, línea de tiempo audiovisual y placas descargables para redes y prensa.",
};

export default async function RutaVivaPage() {
  const landingData = await getLandingData();
  const allSections: PageSectionItem[] = landingData.sections || DEFAULT_PAGE_SECTIONS;

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#FAF8F3] dark:bg-[#101620] text-slate-900 dark:text-slate-100 antialiased transition-colors duration-300">
        <Header sections={allSections} />
        <main>
          <RutaVivaClient
            departments={landingData.departments}
            milestones={landingData.milestones}
            mediaItems={landingData.mediaItems}
            documents={landingData.documents}
            boardCommitments={landingData.boardCommitments}
          />
        </main>
        <Footer sections={allSections} />
      </div>
    </ThemeProvider>
  );
}
