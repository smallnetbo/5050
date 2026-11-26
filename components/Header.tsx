"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, FileText, MapPin, BarChart3, HelpCircle, Download, Newspaper, Video, Sparkles, Sun, Moon, Mail, BookOpen, Compass, ExternalLink, Loader2 } from "lucide-react";
import { documentsList, departmentsData } from "@/lib/agenda-data";
import { commitmentsData } from "@/lib/commitments-data";
import { useTheme } from "./ThemeProvider";
import { ModalPortal } from "./ModalPortal";

import { DEFAULT_PAGE_SECTIONS, PageSectionItem } from "@/lib/sections-config";

interface HeaderProps {
  sections?: PageSectionItem[];
}

interface PdfSearchHit {
  id: string;
  documentId: string;
  title: string;
  category: string;
  date: string;
  fileUrl: string;
  pageNumber: number;
  snippet: string;
  matchUrl: string;
}

function highlightQuery(text: string, query: string) {
  const cleanQ = query.trim();
  if (!cleanQ) return text;
  const escaped = cleanQ.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, idx) =>
    regex.test(part) ? (
      <mark key={idx} className="bg-amber-200 text-slate-900 rounded px-0.5 font-bold">
        {part}
      </mark>
    ) : (
      <span key={idx}>{part}</span>
    )
  );
}

export function Header({ sections }: HeaderProps = {}) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [pdfHits, setPdfHits] = useState<PdfSearchHit[]>([]);
  const [isSearchingPdfs, setIsSearchingPdfs] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const q = searchQuery.trim();
    if (!searchOpen || q.length < 2) {
      setPdfHits([]);
      setIsSearchingPdfs(false);
      return;
    }

    let cancelled = false;
    setIsSearchingPdfs(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (!cancelled && data?.ok) {
          setPdfHits(data.pdfHits || []);
        }
      } catch {
        if (!cancelled) setPdfHits([]);
      } finally {
        if (!cancelled) setIsSearchingPdfs(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery, searchOpen]);
  const pathname = usePathname();
  const resolveHref = (href: string) => (pathname !== "/" && href.startsWith("#") ? `/${href}` : href);

  const activeSections = (sections && sections.length > 0 ? sections : DEFAULT_PAGE_SECTIONS).filter(
    (s) => s.enabled
  );

  const navLinks = activeSections.map((s) => ({
    label: s.navLabel,
    href: resolveHref(s.href),
    isMail: s.isMail,
  }));


  // Search auto-complete items
  const filteredCommitments = commitmentsData.filter(c =>
    c.commitment.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.deliverable.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.responsible.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);
  const filteredDocs = documentsList.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredDeps = departmentsData.filter(dep => dep.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-amber-900/10 dark:border-amber-500/20 bg-[#FAF8F3]/95 dark:bg-[#101620]/95 backdrop-blur-xl shadow-xs transition-colors duration-300">

        <div className="container-page flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <img
              src="/assets/isologo.svg"
              alt="Agenda 50/50"
              className="h-10 sm:h-12 w-auto transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-extrabold text-slate-700 dark:text-slate-200">
            {navLinks.map((link) => {
              if (link.isMail) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    aria-label="Co-construcción Ciudadana (Buzón de Propuestas)"
                    title="Buzón de Co-construcción Ciudadana"
                    className="p-1.5 text-slate-700 dark:text-slate-200 hover:text-[#3ac167] dark:hover:text-[#c79d47] hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center group relative border border-transparent hover:border-emerald-200/50 dark:hover:border-slate-700"
                  >
                    <Mail size={18} className="transition-transform group-hover:scale-110 text-emerald-600 dark:text-emerald-400" />
                    <span className="sr-only">Co-construcción Ciudadana</span>
                  </a>
                );
              }
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="hover:text-[#3ac167] dark:hover:text-[#c79d47] transition-colors py-1 relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#c79d47] transition-all duration-300 group-hover:w-full"></span>
                </a>
              );
            })}
            <Link
              href="/revista"
              className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 transition-colors border ${
                pathname === "/revista"
                  ? "bg-[#1B2533] text-white border-[#1B2533] dark:bg-[#c79d47] dark:text-[#101620] dark:border-[#c79d47]"
                  : "bg-amber-50/90 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border-amber-300/60 dark:border-amber-700/50 hover:bg-amber-100 dark:hover:bg-amber-900/50"
              }`}
            >
              <BookOpen size={13} />
              <span>Revista 50/50</span>
            </Link>
            <Link
              href="/ruta-viva"
              className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 transition-colors border ${
                pathname === "/ruta-viva"
                  ? "bg-[#3ac167] text-white border-[#3ac167]"
                  : "bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
              }`}
            >
              <Compass size={13} />
              <span>Ruta Viva</span>
            </Link>
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
                <span className="flex items-center gap-2.5">
                  {link.isMail ? (
                    <>
                      <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                        <Mail size={16} />
                      </span>
                      <span>Co-construcción Ciudadana</span>
                    </>
                  ) : (
                    <span>{link.label}</span>
                  )}
                </span>
                <span className="text-slate-400">→</span>
              </a>
            ))}
            <div className="pt-2 space-y-2 border-t border-slate-100">
              <Link
                href="/revista"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#1B2533] hover:bg-slate-800 text-white py-3 font-extrabold text-sm shadow-md"
              >
                <BookOpen size={16} className="text-[#fcc74f]" /> Revista Digital 50/50
              </Link>
              <Link
                href="/ruta-viva"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white py-3 font-extrabold text-sm shadow-md"
              >
                <Compass size={16} className="text-[#fcc74f]" /> Ruta Viva 50/50
              </Link>
              <a
                href={resolveHref("#descargas")}
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
        <ModalPortal>
        <div className="fixed inset-0 z-[200] grid place-items-center bg-[#0F2942]/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
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
                  {/* Inside PDFs (OCR / Fulltext Search) */}
                  {(isSearchingPdfs || pdfHits.length > 0) && (
                    <div>
                      <h4 className="text-xs font-black uppercase text-amber-700 tracking-wider mb-2 flex items-center gap-1.5">
                        <FileText size={14} /> Dentro de Documentos (PDF) ({pdfHits.length})
                        {isSearchingPdfs && <Loader2 size={12} className="animate-spin text-amber-600" />}
                      </h4>
                      <div className="space-y-1.5">
                        {pdfHits.map((hit) => (
                          <a
                            key={hit.id}
                            href={hit.matchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setSearchOpen(false)}
                            className="block rounded-xl border border-amber-200/70 bg-amber-50/50 p-3 hover:bg-amber-50 hover:border-amber-300 transition"
                          >
                            <div className="flex items-center justify-between gap-2 text-xs font-bold text-slate-900">
                              <span className="truncate">{hit.title}</span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="rounded-md bg-[#1B2533] text-white px-2 py-0.5 text-[10px] font-black">
                                  Pág. {hit.pageNumber}
                                </span>
                                <span className="text-[10px] text-slate-400">{hit.date}</span>
                                <ExternalLink size={11} className="text-amber-700" />
                              </div>
                            </div>
                            <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                              {highlightQuery(hit.snippet, searchQuery)}
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Filtered Commitments */}
                  {filteredCommitments.length > 0 && (
                    <div>
                      <h4 className="text-xs font-black uppercase text-indigo-600 tracking-wider mb-2 flex items-center gap-1.5">
                        <BarChart3 size={14} /> Compromisos por Nivel ({filteredCommitments.length})
                      </h4>
                      <div className="space-y-1.5">
                        {filteredCommitments.map((c) => (
                          <a
                            key={c.id}
                            href="#compromisos"
                            onClick={() => setSearchOpen(false)}
                            className="block rounded-xl border border-slate-100 bg-slate-50 p-3 hover:bg-indigo-50 hover:border-indigo-200 transition"
                          >
                            <div className="flex items-center justify-between text-xs font-black text-slate-900">
                              <span>{c.levelName}</span>
                              <span className="text-[10px] text-slate-400 font-bold">{c.responsible}</span>
                            </div>
                            <div className="text-xs text-slate-600 line-clamp-1 mt-0.5">{c.commitment}</div>
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

                  {filteredCommitments.length === 0 && filteredDocs.length === 0 && filteredDeps.length === 0 && pdfHits.length === 0 && !isSearchingPdfs && (
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
        </ModalPortal>
      )}
    </>
  );
}