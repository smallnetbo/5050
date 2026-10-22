"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { logoutAction } from "@/lib/actions/auth.actions";
import {
  LayoutDashboard,
  Layers,
  Sparkles,
  HelpCircle,
  Activity,
  FileText,
  ClipboardList,
  Clock,
  Video,
  Newspaper,
  MessageSquare,
  Sliders,
  Map,
  User,
  EyeOff,
  LogOut,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { PageSectionItem } from "@/lib/sections-config";

interface AdminLayoutClientProps {
  sections: PageSectionItem[];
  children: React.ReactNode;
}

export function AdminLayoutClient({ sections, children }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Si estamos en la página de login, no mostrar el sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await logoutAction();
    router.push("/admin/login");
    router.refresh();
  };

  // Mapear icono para cada sección
  const getSectionIcon = (iconName: string) => {
    switch (iconName) {
      case "Sparkles":
        return Sparkles;
      case "HelpCircle":
        return HelpCircle;
      case "Activity":
        return Activity;
      case "FileText":
        return FileText;
      case "ClipboardList":
        return ClipboardList;
      case "Clock":
        return Clock;
      case "Video":
        return Video;
      case "Newspaper":
        return Newspaper;
      case "MessageSquare":
        return MessageSquare;
      default:
        return Layers;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0B111A] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0F2942] text-white p-5 shrink-0 flex flex-col justify-between border-r border-slate-800">
        <div className="space-y-6">
          {/* Logo / Header */}
          <div className="flex flex-col gap-2">
            <div className="w-full bg-emerald-500/10 border border-emerald-400/30 rounded-2xl p-3 flex items-center justify-center">
              <Image
                src="/assets/isologo.svg"
                alt="Isologo Agenda 50/50"
                width={442}
                height={195}
                className="w-full h-auto object-contain max-h-12"
                priority
              />
            </div>
            <div className="text-center">
              <h2 className="text-sm font-black leading-tight text-white">Panel CMS</h2>
              <p className="text-[11px] text-slate-400 font-bold">Agenda 50/50</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-4">
            {/* 1. Vistas Principales del CMS */}
            <div className="space-y-1">
              <Link
                href="/admin"
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-black transition ${
                  pathname === "/admin"
                    ? "bg-emerald-500 text-[#0F2942] shadow-md"
                    : "text-slate-300 hover:bg-white/10"
                }`}
              >
                <LayoutDashboard size={17} />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/admin/sections"
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-black transition ${
                  pathname === "/admin/sections"
                    ? "bg-emerald-500 text-[#0F2942] shadow-md"
                    : "text-amber-300 hover:bg-amber-400/10 border border-amber-400/20"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers size={17} />
                  <span>Orden de Secciones</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-200 font-mono">
                  {sections.filter((s) => s.enabled).length}/9
                </span>
              </Link>
            </div>

            {/* 2. Secciones del Portal (Siguiendo el orden exacto configurado) */}
            <div className="space-y-1 pt-2 border-t border-slate-800/80">
              <span className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Secciones Landing</span>
                <span className="text-[9px] text-emerald-400 font-mono">Orden CMS</span>
              </span>

              <div className="space-y-1 pt-1">
                {sections.map((section, idx) => {
                  const Icon = getSectionIcon(section.iconName);
                  const isCurrentActive =
                    pathname === section.adminHref ||
                    (section.adminHref !== "/admin" && pathname.startsWith(section.adminHref));

                  return (
                    <Link
                      key={section.id}
                      href={section.adminHref}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black transition ${
                        isCurrentActive
                          ? "bg-emerald-500 text-[#0F2942] shadow-md"
                          : section.enabled
                          ? "text-slate-300 hover:bg-white/10"
                          : "text-slate-400/70 hover:bg-white/5 opacity-70"
                      }`}
                      title={
                        section.enabled
                          ? `${idx + 1}. ${section.adminLabel} (Visible)`
                          : `${idx + 1}. ${section.adminLabel} (Oculto en landing)`
                      }
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-[10px] font-mono font-bold text-slate-400 w-3">
                          {idx + 1}
                        </span>
                        <Icon size={16} className="shrink-0" />
                        <span className="truncate">{section.adminLabel}</span>
                      </div>

                      {!section.enabled && (
                        <span
                          className="shrink-0 p-1 text-rose-400"
                          title="Sección oculta en la landing"
                        >
                          <EyeOff size={13} />
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* 3. Módulos Adicionales */}
            <div className="space-y-1 pt-2 border-t border-slate-800/80">
              <span className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
                Otros Módulos
              </span>
              <div className="space-y-1 pt-1">
                <Link
                  href="/admin/pillars"
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-black transition ${
                    pathname === "/admin/pillars"
                      ? "bg-emerald-500 text-[#0F2942] shadow-md"
                      : "text-slate-300 hover:bg-white/10"
                  }`}
                >
                  <Sliders size={16} />
                  <span>Pilares Autonómicos</span>
                </Link>

                <Link
                  href="/admin/departments"
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-black transition ${
                    pathname === "/admin/departments"
                      ? "bg-emerald-500 text-[#0F2942] shadow-md"
                      : "text-slate-300 hover:bg-white/10"
                  }`}
                >
                  <Map size={16} />
                  <span>Monitor Regional</span>
                </Link>

                <Link
                  href="/admin/profile"
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-black transition ${
                    pathname === "/admin/profile"
                      ? "bg-emerald-500 text-[#0F2942] shadow-md"
                      : "text-slate-300 hover:bg-white/10"
                  }`}
                >
                  <User size={16} />
                  <span>Perfil & Seguridad</span>
                </Link>
              </div>
            </div>
          </nav>
        </div>

        {/* Footer Sidebar Options */}
        <div className="pt-4 border-t border-slate-800 space-y-2.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-400 transition"
          >
            <Globe size={16} />
            <span>Ver Sitio Público</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-black transition cursor-pointer"
          >
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101620] px-6 sm:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" size={20} />
            <span className="text-xs font-extrabold text-slate-600 dark:text-slate-300 hidden sm:inline">
              Sesión Administrador Activa
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/sections"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-black transition"
            >
              <Layers size={14} />
              <span>Gestionar Orden</span>
            </Link>

            <Link
              href="/admin/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
            >
              <User size={15} className="text-emerald-500" />
              <span>Mi Perfil</span>
            </Link>
          </div>
        </header>

        <main className="p-6 md:p-10 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
