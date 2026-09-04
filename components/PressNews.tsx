"use client";

import { useState, useEffect } from "react";
import {
  Newspaper,
  Calendar,
  Download,
  Tag,
  ExternalLink,
  AlertCircle,
  Radio,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { getAgenda5050News, AgendaNewsArticle } from "@/lib/news-service";

export function PressNews() {
  const [news, setNews] = useState<AgendaNewsArticle[]>([]);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);

  const PAGE_SIZE = 12;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function fetchLiveNews() {
      try {
        const response = await getAgenda5050News(currentPage, PAGE_SIZE, selectedDeptFilter);
        if (isMounted) {
          setNews(response.articles);
          setTotalPages(response.totalPages);
          setTotalArticles(response.total);
          setIsFallback(response.isFallback);
        }
      } catch (err) {
        console.error("Error al cargar noticias:", err);
        if (isMounted) setIsFallback(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchLiveNews();
    return () => {
      isMounted = false;
    };
  }, [currentPage, selectedDeptFilter]);

  const defaultDepartments = [
    "Todos",
    "Nacional",
    "Santa Cruz",
    "La Paz",
    "Tarija",
    "Cochabamba",
    "Chuquisaca",
  ];

  const handleDeptChange = (dept: string) => {
    if (dept !== selectedDeptFilter) {
      setSelectedDeptFilter(dept);
      setCurrentPage(1);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      document.getElementById("prensa")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Helper para generar los números de página visibles
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <section
      id="prensa"
      className="bg-white dark:bg-[#101620] py-20 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300"
    >
      <div className="container-page">
        {/* Encabezado de Sección */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 text-xs font-black uppercase text-[#3ac167] dark:text-emerald-300 border border-emerald-500/20">
              <Radio size={13} className="animate-pulse" />
              <span>Monitoreo en Medios y Comunicados 50/50</span>
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Noticias y Cobertura en Medios
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-300 font-medium max-w-2xl">
              Artículos, declaraciones y cobertura periodística sobre los avances del pacto fiscal y la Agenda 50/50 recopilados en tiempo real.
            </p>
          </div>

          {/* Filtros por Departamento */}
          <div className="flex flex-wrap gap-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1.5 border border-slate-200 dark:border-slate-700">
            {defaultDepartments.map((dept) => (
              <button
                key={dept}
                onClick={() => handleDeptChange(dept)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-extrabold transition-all ${
                  selectedDeptFilter === dept
                    ? "bg-[#1B2533] dark:bg-[#dd3146] text-white shadow-xs scale-105"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Barra Informativa de Estado de Noticias */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#3ac167] animate-ping" />
            <span>
              Mostrando página <b>{currentPage}</b> de <b>{totalPages}</b>
            </span>
            <span>·</span>
            <span><b>{totalArticles}</b> artículos detectados con temática 50-50</span>
          </div>

          {selectedDeptFilter !== "Todos" && (
            <div className="text-[#3ac167] font-extrabold">
              Filtrado por: {selectedDeptFilter}
            </div>
          )}
        </div>

        {/* Banner de Fallback si seamovil.com está en mantenimiento */}
        {isFallback && (
          <div className="mb-8 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 flex items-center gap-3 text-xs text-amber-800 dark:text-amber-200">
            <AlertCircle size={18} className="shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              El servicio de sincronización en vivo de noticias está en actualización de índices. Mostrando comunicados oficiales de contingencia.
            </span>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-84 rounded-3xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Grid de Noticias Reales 50/50 */}
        {!loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {news.map((article) => {
              const formattedDate = article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString("es-BO", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "Reciente";

              return (
                <article
                  key={article.id}
                  className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
                >
                  <div>
                    {/* Contenedor de Imagen o Placeholder con Branding */}
                    <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      {article.imageUrl ? (
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1B2533] via-[#243347] to-[#1B2533] text-[#c79d47] p-6 text-center">
                          <Newspaper size={38} className="mb-2 opacity-80" />
                          <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                            {article.source}
                          </span>
                        </div>
                      )}

                      {/* Badge del Medio Emisor */}
                      <span className="absolute top-3 left-3 rounded-full bg-[#1B2533]/90 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase text-[#3ac167] border border-white/10 shadow-sm">
                        {article.source}
                      </span>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs font-extrabold text-slate-400 dark:text-slate-500 mb-2">
                        <Calendar size={13} /> {formattedDate}
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug group-hover:text-[#dd3146] dark:group-hover:text-[#fcc74f] transition-colors line-clamp-3">
                        {article.title}
                      </h3>

                      {article.summary && (
                        <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-medium line-clamp-3">
                          {article.summary}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Pie de Tarjeta con Etiquetas y Enlace a la Noticia */}
                  <div className="px-6 pb-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs font-bold">
                    <span className="text-[#3ac167] font-extrabold flex items-center gap-1">
                      <Tag size={12} /> {article.department}
                    </span>

                    <a
                      href={article.url}
                      target={article.url.startsWith("http") ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition flex items-center gap-1.5"
                      aria-label={`Leer nota completa: ${article.title}`}
                    >
                      <span>Leer Cobertura</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Controles de Paginación */}
        {totalPages > 1 && (
          <div className="mb-16 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            {/* Botón Anterior */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || loading}
                className="hidden sm:flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                title="Primera Página"
              >
                <ChevronsLeft size={16} />
              </button>

              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="flex items-center gap-1.5 px-4 h-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-extrabold text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition shadow-xs"
              >
                <ChevronLeft size={16} />
                <span>Anterior</span>
              </button>
            </div>

            {/* Números de Página */}
            <div className="flex items-center gap-1 flex-wrap justify-center">
              {getPageNumbers().map((p, idx) => {
                if (p === "...") {
                  return (
                    <span
                      key={`dots-${idx}`}
                      className="px-2 text-xs font-bold text-slate-400 select-none"
                    >
                      ...
                    </span>
                  );
                }

                const pageNum = Number(p);
                const isActive = pageNum === currentPage;

                return (
                  <button
                    key={`page-${pageNum}`}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={loading}
                    className={`h-10 min-w-[40px] px-2 rounded-2xl text-xs font-black transition-all ${
                      isActive
                        ? "bg-[#dd3146] text-white shadow-md scale-105"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Botón Siguiente */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="flex items-center gap-1.5 px-4 h-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-extrabold text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition shadow-xs"
              >
                <span>Siguiente</span>
                <ChevronRight size={16} />
              </button>

              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || loading}
                className="hidden sm:flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                title="Última Página"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Banner Kit de Prensa Institucional */}
        <div className="rounded-[32px] bg-gradient-to-br from-[#1B2533] via-[#223042] to-[#1B2533] p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-[#c79d47]/30">
          <div className="space-y-2">
            <span className="rounded-md bg-[#3ac167] text-slate-950 px-2.5 py-1 text-xs font-black uppercase">
              Recursos para Periodistas & Medios
            </span>
            <h3 className="text-2xl font-black text-white">Kit de Prensa Oficial (Agenda 50/50)</h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Descarga logotipos oficiales vectoriales, fotografías en alta resolución del Acuerdo en Sucre y comunicados en formato editable.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="#descargas"
              className="flex items-center gap-2 rounded-2xl bg-[#3ac167] hover:bg-[#2ea354] text-slate-950 font-black px-5 py-3 text-xs shadow-md transition"
            >
              <Download size={16} /> Descargar Kit de Prensa (ZIP)
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
