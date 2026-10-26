import { getLandingData } from "@/lib/data-service";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Concepts } from "@/components/Concepts";
import { Monitor } from "@/components/Monitor";
import { LevelCommitments } from "@/components/LevelCommitments";
import { Timeline } from "@/components/Timeline";
import { MultimediaHub } from "@/components/MultimediaHub";
import { InteractiveNewsGallery3 } from "@/components/InteractiveNewsGallery3";
import { DocumentHub } from "@/components/DocumentHub";
import { CitizenFeedback } from "@/components/CitizenFeedback";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ScrollSection } from "@/components/ScrollSection";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { ScrollNavigator } from "@/components/ScrollNavigator";
import { DEFAULT_PAGE_SECTIONS, PageSectionItem, SectionId } from "@/lib/sections-config";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Agenda 50/50",
  description: "Plataforma oficial de la Agenda 50/50",
};

export default async function Home() {
  const landingData = await getLandingData();
  const allSections: PageSectionItem[] = landingData.sections || DEFAULT_PAGE_SECTIONS;
  const activeSections = allSections.filter((s) => s.enabled);

  const renderSectionComponent = (id: SectionId) => {
    switch (id) {
      case "Hero":
        return <Hero />;
      case "Concepts":
        return <Concepts conceptSteps={landingData.conceptSteps} />;
      case "Monitor":
        return <Monitor config={landingData.monitorConfig} metrics={landingData.monitorMetrics} />;
      case "DocumentHub":
        return (
          <DocumentHub
            documents={landingData.documents}
            initialCategories={landingData.documentCategories}
          />
        );
      case "LevelCommitments":
        return (
          <LevelCommitments
            commitments={landingData.commitments}
            levels={landingData.commitmentLevels}
          />
        );
      case "Timeline":
        return <Timeline milestones={landingData.milestones} />;
      case "MultimediaHub":
        return <MultimediaHub mediaItems={landingData.mediaItems} />;
      case "InteractiveNewsGallery3":
        return <InteractiveNewsGallery3 />;
      case "CitizenFeedback":
        return <CitizenFeedback />;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-[#101620] font-sans text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-300">
        <ScrollProgressBar />
        <ScrollNavigator sections={allSections} />
        <Header sections={allSections} />
        <main>
          {activeSections.map((section, index) => {
            const isFirst = index === 0;
            const isLast = index === activeSections.length - 1;
            return (
              <ScrollSection key={section.id} isFirst={isFirst} isLast={isLast}>
                {renderSectionComponent(section.id)}
              </ScrollSection>
            );
          })}
        </main>
        <Footer sections={allSections} />
      </div>
    </ThemeProvider>
  );
}