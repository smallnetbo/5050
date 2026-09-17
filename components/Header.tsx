"use client";

import { useState } from "react";
import { Search, Menu, X, FileText, MapPin, BarChart3, HelpCircle, Download, Newspaper, Video, Sparkles, Sun, Moon } from "lucide-react";
import { documentsList, pillars, departmentsData } from "@/lib/agenda-data";
import { useTheme } from "./ThemeProvider";

export function Header() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { label: "El Acuerdo", href: "#acuerdo" },
    { label: "Monitor 50/50", href: "#monitor" },
    { label: "Prensa", href: "#prensa" },
    { label: "Pilares", href: "#pilares" },
    { label: "Ruta", href: "#ruta" },
    { label: "Multimedia", href: "#multimedia" },
    { label: "Documentos", href: "#descargas" },
    { label: "FAQ", href: "#faq" },
  ];

  // Search auto-complete items
  const filteredPillars = pillars.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredDocs = documentsList.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredDeps = departmentsData.filter(dep => dep.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-amber-900/10 dark:border-amber-500/20 bg-[#FAF8F3]/95 dark:bg-[#101620]/95 backdrop-blur-xl shadow-xs transition-colors duration-300">

        <div className="container-page flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <a href="#" className="flex items-center group flex-shrink-0">
            <img
              src="/assets/isologo.svg"
              alt="Agenda 50/50"
              className="h-10 sm:h-12 w-auto transition-transform group-hover:scale-105"
            />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-extrabold text-slate-700 dark:text-slate-200">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-[#3ac167] dark:hover:text-[#c79d47] transition-colors py-1 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#c79d47] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Action Buttons: Global Search, Theme Toggle & Mobile Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-amber-900/10 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-amber-50/50 dark:hover:bg-slate-700 transition shadow-2xs"
              aria-label="Buscar en la plataforma"
            >
              <Search size={15} className="text-[#c79d47]" />
              <span className="hidden sm:inline">Buscar...</span>
              <kbd className="hidden sm:inline-block rounded bg-amber-50 dark:bg-slate-700 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-slate-600">⌘K</kbd>
            </button>

            {/* Dark / Light Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center p-2.5 rounded-xl border border-amber-900/10 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-amber-300 hover:bg-amber-50/50 dark:hover:bg-slate-700 transition shadow-2xs cursor-pointer"
              aria-label="Gestionar tema oscuro / claro"
              title={theme === "dark" ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
            >
              {theme === "dark" ? (
                <Sun size={16} className="text-[#fcc74f]" />
              ) : (
                <Moon size={16} className="text-slate-700" />
              )}
            </button>

            <a
              href="#descargas"
              className="hidden sm:flex items-center gap-1.5 rounded-xl bg-[#3ac167] hover:bg-[#2ea354] text-white px-3.5 py-2 text-xs font-extrabold transition shadow-sm hover:shadow"
            >
              <Download size={14} />
              <span>Ver Acuerdo</span>
            </a>

            <button
              onClick={() => setOpen(!open)}
              className="rounded-xl bg-[#1B2533] dark:bg-slate-800 p-2.5 text-white lg:hidden hover:bg-slate-800 transition"
              aria-label="Abrir Menú"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {open && (
          <nav className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl px-4 py-4 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-slate-800 hover:bg-slate-100 hover:text-[#3ac167] transition"
              >
                <span>{link.label}</span>
                <span className="text-slate-400">→</span>
              </a>
            ))}
            <div className="pt-3 border-t border-slate-100">
              <a
                href="#descargas"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#3ac167] hover:bg-[#2ea354] text-white py-3 font-extrabold text-sm shadow-md"
              >
                <Download size={16} /> Descargar Acuerdo Sucre 2026 (PDF)
              </a>
            </div>
          </nav>
        )}
      </header>

      {/* Global Intelligent Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-[#0F2942]/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-3 flex-1">
                <Search className="text-emerald-600" size={20} />
                <input
                  type="text"
                  placeholder="Buscar pilares, documentos, departamentos, leyes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none placeholder:text-slate-400"
                  autoFocus
                />
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="rounded-full p-1.5 hover:bg-slate-200 text-slate-500 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
              {searchQuery === "" ? (
                <div className="text-center py-8">
                  <Sparkles className="mx-auto text-emerald-500 mb-2" size={32} />
                  <p className="text-sm font-bold text-slate-700">Búsqueda Inteligente Agenda 50/50</p>
                  <p className="text-xs text-slate-500 mt-1">Escribe "Ley 154", "La Paz", "Alivio fiscal" o "Coparticipación"</p>
                </div>
              ) : (
                <>
                  {/* Filtered Pillars */}
                  {filteredPillars.length > 0 && (
                    <div>
                      <h4 className="text-xs font-black uppercase text-emerald-600 tracking-wider mb-2 flex items-center gap-1.5">
                        <BarChart3 size={14} /> Pilares Temáticos ({filteredPillars.length})
                      </h4>
                      <div className="space-y-1.5">
                        {filteredPillars.map((p) => (
                          <a
                            key={p.id}
                            href="#pilares"
                            onClick={() => setSearchOpen(false)}
                            className="block rounded-xl border border-slate-100 bg-slate-50 p-3 hover:bg-emerald-50 hover:border-emerald-200 transition"
                          >
                            <div className="text-xs font-black text-slate-900">{p.title}</div>
                            <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{p.summary}</div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Filtered Documents */}
                  {filteredDocs.length > 0 && (
                    <div>
                      <h4 className="text-xs font-black uppercase text-emerald-600 tracking-wider mb-2 flex items-center gap-1.5">
                        <FileText size={14} /> Repositorio Documental ({filteredDocs.length})
                      </h4>
                      <div className="space-y-1.5">
                        {filteredDocs.map((d) => (
                          <a
                            key={d.id}
                            href="#descargas"
                            onClick={() => setSearchOpen(false)}
                            className="block rounded-xl border border-slate-100 bg-slate-50 p-3 hover:bg-emerald-50 hover:border-emerald-200 transition"
                          >
                            <div className="flex justify-between text-xs font-bold text-slate-900">
                              <span>{d.title}</span>
                              <span className="text-slate-400">{d.fileSize}</span>
                            </div>
                            <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{d.description}</div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Filtered Departments */}
                  {filteredDeps.length > 0 && (
                    <div>
                      <h4 className="text-xs font-black uppercase text-emerald-600 tracking-wider mb-2 flex items-center gap-1.5">
                        <MapPin size={14} /> Departamentos ({filteredDeps.length})
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {filteredDeps.map((dep) => (
                          <a
                            key={dep.id}
                            href="#territorio"
                            onClick={() => setSearchOpen(false)}
                            className="block rounded-xl border border-slate-100 bg-slate-50 p-3 hover:bg-emerald-50 hover:border-emerald-200 transition"
                          >
                            <div className="text-xs font-black text-slate-900">{dep.name}</div>
                            <div className="text-[11px] font-semibold text-emerald-600 mt-0.5">{dep.target5050Impact}</div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredPillars.length === 0 && filteredDocs.length === 0 && filteredDeps.length === 0 && (
                    <div className="text-center py-6 text-slate-500 text-xs">
                      No se encontraron resultados para "<span className="font-bold text-slate-700">{searchQuery}</span>".
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 text-right">
              <button
                onClick={() => setSearchOpen(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Cerrar (Esc)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}