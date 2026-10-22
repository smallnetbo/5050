import { getPageSections } from "@/lib/sections-service";
import { AdminLayoutClient } from "./AdminLayoutClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const sections = await getPageSections();
  return <AdminLayoutClient sections={sections}>{children}</AdminLayoutClient>;
}
