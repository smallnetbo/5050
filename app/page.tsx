import { getLandingData } from "@/lib/data-service";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Concepts } from "@/components/Concepts";
import { Monitor } from "@/components/Monitor";
import { Pillars } from "@/components/Pillars";
import { Timeline } from "@/components/Timeline";
import { MultimediaHub } from "@/components/MultimediaHub";
import { InteractiveNewsGallery3 } from "@/components/InteractiveNewsGallery3";
import { DocumentHub } from "@/components/DocumentHub";
import { CitizenFeedback } from "@/components/CitizenFeedback";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

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
        <Header />
        <main>
          <Hero />
          <Concepts conceptSteps={landingData.conceptSteps} />
          <Monitor />
          
          {/* MÓDULO EXCLUIDO: Se mantiene 100% independiente y sin modificaciones */}
          <InteractiveNewsGallery3 />

          <Pillars pillars={landingData.pillars} />
          <Timeline milestones={landingData.milestones} />
          <MultimediaHub mediaItems={landingData.mediaItems} />
          <DocumentHub documents={landingData.documents} />
          <CitizenFeedback />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}