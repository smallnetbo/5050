import { ProposalsClientManager } from "./ProposalsClientManager";

export const metadata = {
  title: "Co-construcción Ciudadana - Panel CMS",
  description: "Administración de propuestas ciudadanas y configuración del correo de destino.",
};

export default function AdminProposalsPage() {
  return <ProposalsClientManager />;
}
