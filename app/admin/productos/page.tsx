import {
  getModuleConfigs,
  getRevistaEditions,
  getRutaVivaSedes,
  getRutaVivaCards,
} from "@/lib/productos-service";
import { getLandingData } from "@/lib/data-service";
import { ProductosManager } from "./ProductosManager";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Revista & Ruta Viva · Agenda 50/50 CMS",
  description: "Autogestión de visibilidad, ediciones de Revista 50/50 y sedes/kit de Ruta Viva.",
};

export default async function AdminProductosPage() {
  const [modules, editions, sedes, cards, landingData] = await Promise.all([
    getModuleConfigs(),
    getRevistaEditions(true),
    getRutaVivaSedes(true),
    getRutaVivaCards(true),
    getLandingData(),
  ]);

  return (
    <ProductosManager
      initialModules={modules}
      initialEditions={editions}
      initialSedes={sedes}
      initialCards={cards}
      documents={landingData.documents}
      mediaItems={landingData.mediaItems}
      departments={landingData.departments}
    />
  );
}
