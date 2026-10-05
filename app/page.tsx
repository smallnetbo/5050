import { getLandingData } from "@/lib/data-service";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CriticalCounters } from "@/components/CriticalCounters";
import { AcuerdosSection } from "@/components/AcuerdosSection";
import { CompromisosSection } from "@/components/CompromisosSection";
import { EstadoTimelineSection } from "@/components/EstadoTimelineSection";
import { InfoAndDocsSection } from "@/components/InfoAndDocsSection";
import { Concepts } from "@/components/Concepts";
import { Monitor } from "@/components/Monitor";
import { MultimediaHub } from "@/components/MultimediaHub";
import { InteractiveNewsGallery3 } from "@/components/InteractiveNewsGallery3";
import { CitizenFeedback } from "@/components/CitizenFeedback";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Agenda 50/50 — Portal Oficial de Seguimiento, Acuerdos y Compromisos",
  description:
    "Plataforma oficial de transparencia activa, pedagogía ciudadana y monitoreo en tiempo real de los Acuerdos 001 y 002 de la Agenda 50/50.",
};

export default async function Home() {
  const landingData = await getLandingData();

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-[#101620] font-sans text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-300">
        <Header />
        <main>
          {/* 1. SECCIÓN: INICIO (HOME) - Hero e Isólogo + Contadores de Plazos Críticos y Accesos directos a Acuerdos */}
          <Hero />
          <CriticalCounters />

          {/* 2. SECCIÓN: ACUERDOS - Detalle y Descarga de Acuerdo 001/2026 (GAD) y Acuerdo 002/2026 (GAM + AMB) */}
          <AcuerdosSection />

          {/* 3. SECCIÓN: COMPROMISOS POR NIVEL (Navegación interactiva por pestañas: NCE, GAD, GAM-AMB, Conjuntos) */}
          <CompromisosSection />

          {/* 4. SECCIÓN: ESTADO Y LÍNEA DE TIEMPO (Glosario de Estados con badges coloridos + Línea de Tiempo con hito FAM pendiente) */}
          <EstadoTimelineSection />

          {/* 5. SECCIÓN: INFORMACIÓN Y DOCUMENTOS (Quién Remite Qué + Carpeta de Acuerdos, Actas, PPTs y Anexos AMB) */}
          <InfoAndDocsSection />

          {/* Monitor Territorial 50/50 */}
          <Monitor />

          {/* MÓDULO EXCLUIDO: Se mantiene 100% independiente y sin modificaciones */}
          <InteractiveNewsGallery3 />

          {/* Multimedia y Centro de Prensa */}
          <MultimediaHub mediaItems={landingData.mediaItems} />

          {/* Pedagogía Ciudadana y Conceptos Clave */}
          <Concepts conceptSteps={landingData.conceptSteps} />

          {/* Buzón de Co-construcción Ciudadana */}
          <CitizenFeedback />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}