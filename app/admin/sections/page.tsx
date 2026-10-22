import { getPageSections } from "@/lib/sections-service";
import { SectionsManager } from "./SectionsManager";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Gestión de Secciones · Agenda 50/50 CMS",
  description: "Reordenar, ocultar y configurar las secciones principales del portal.",
};

export default async function SectionsPage() {
  const sections = await getPageSections();

  return <SectionsManager initialSections={sections} />;
}
