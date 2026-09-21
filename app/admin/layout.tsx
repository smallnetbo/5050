"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAction } from "@/lib/actions/auth.actions";
import {
  LayoutDashboard,
  Clock,
  FileText,
  Sliders,
  Map,
  HelpCircle,
  LogOut,
  Globe,
  ShieldCheck,
  Video,
  User,
  MessageSquare,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/proposals", label: "Co-construcción (Propuestas)", icon: MessageSquare },
  { href: "/admin/multimedia", label: "Centro Multimedia", icon: Video },
  { href: "/admin/concepts", label: "Conceptos 50/50", icon: HelpCircle },
  { href: "/admin/timeline", label: "Hitos / Timeline", icon: Clock },
  { href: "/admin/documents", label: "DocumentHub (PDFs)", icon: FileText },
  { href: "/admin/pillars", label: "Pilares Autonómicos", icon: Sliders },
  { href: "/admin/departments", label: "Monitor Regional", icon: Map },
  { href: "/admin/profile", label: "Perfil & Seguridad", icon: User },
];


export default function AdminLayout({ children }: { children: React.ReactNode }) {
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

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0B111A] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0F2942] text-white p-6 shrink-0 flex flex-col justify-between border-r border-slate-800">
        <div className="space-y-8">
          {/* Logo / Header */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-black">
              50/50
            </div>
            <div>
              <h2 className="text-base font-black leading-tight">Panel CMS</h2>
              <p className="text-[10px] text-slate-400 font-bold">Agenda 50/50</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black transition ${
                    isActive
                      ? "bg-emerald-500 text-[#0F2942] shadow-md"
                      : "text-slate-300 hover:bg-white/10"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar Options */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
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
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-black transition"
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

          <div className="flex items-center gap-4">
            <Link
              href="/admin/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
            >
              <User size={15} className="text-emerald-500" />
              <span>Mi Perfil & Seguridad</span>
            </Link>
            <div className="text-xs font-bold text-slate-400 hidden md:block border-l border-slate-200 dark:border-slate-800 pl-4">
              Acuerdo Sucre N° 001/2026
            </div>
          </div>
        </header>

        <main className="p-6 md:p-10 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
