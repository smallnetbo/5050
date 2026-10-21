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

export const revalidate = 0;
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Agenda 50/50 (Acuerdo Sucre 2026)",
  description: "Plataforma oficial de transparencia activa, pedagogía ciudadana y monitoreo en tiempo real de la Agenda 50/50 (Acuerdo N° 001/2026 de Sucre).",
};

export default async function Home() {
  const landingData = await getLandingData();

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-[#101620] font-sans text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-300">
        <ScrollProgressBar />
        <ScrollNavigator />
        <Header />
        <main>
          <ScrollSection isFirst>
            <Hero />
          </ScrollSection>

          <ScrollSection>
            <Concepts conceptSteps={landingData.conceptSteps} />
          </ScrollSection>

          <ScrollSection>
            <Monitor config={landingData.monitorConfig} metrics={landingData.monitorMetrics} />
          </ScrollSection>

          <ScrollSection>
            <DocumentHub documents={landingData.documents} />
          </ScrollSection>

          <ScrollSection>
            <LevelCommitments commitments={landingData.commitments} levels={landingData.commitmentLevels} />
          </ScrollSection>

          <ScrollSection>
            <Timeline milestones={landingData.milestones} />
          </ScrollSection>

          <ScrollSection>
            <MultimediaHub mediaItems={landingData.mediaItems} />
          </ScrollSection>

          {/* MÓDULO EXCLUIDO: Se mantiene 100% independiente y sin modificaciones */}
          <ScrollSection>
            <InteractiveNewsGallery3 />
          </ScrollSection>

          <ScrollSection isLast>
            <CitizenFeedback />
          </ScrollSection>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}