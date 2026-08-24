import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Monitor } from "@/components/Monitor";
import { Pillars } from "@/components/Pillars";
import { Timeline } from "@/components/Timeline";
import { Territorial } from "@/components/Territorial";
import { MultimediaHub } from "@/components/MultimediaHub";
import { PressNews } from "@/components/PressNews";
import { DocumentHub } from "@/components/DocumentHub";
import { CitizenFeedback } from "@/components/CitizenFeedback";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata = {
  title: "Agenda 50/50 (Acuerdo Sucre 2026)",
  description: "Plataforma oficial de transparencia activa, pedagogía ciudadana y monitoreo en tiempo real de la Agenda 50/50 (Acuerdo N° 001/2026 de Sucre).",
};

export default function Home() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-[#101620] font-sans text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-300">
        <Header />
        <main>
          <Hero />
          <Monitor />
          <Pillars />
          <Timeline />
          <Territorial />
          <MultimediaHub />
          <PressNews />
          <DocumentHub />
          <CitizenFeedback />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}