"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getAllAgenda5050News, AgendaNewsArticle } from "@/lib/news-service";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Clock,
  ExternalLink,
  Filter,
  MapPin,
  RefreshCw,
  Radio,
  Search,
  Tag,
  ArrowUpDown,
  X,
} from "lucide-react";

// Imágenes de respaldo cuando una noticia no trae imagen propia o la original falla al cargar
const FALLBACK_NEWS_IMAGES = [
  "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=700&auto=format&fit=crop&q=80",
];

// Ancho de tarjeta + separación: controla tanto el layout (Tailwind) como el cálculo de scroll
const CARD_WIDTH = 300;
const CARD_GAP = 20;
const STEP = CARD_WIDTH + CARD_GAP;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

interface ChronoArticle extends AgendaNewsArticle {
  timestamp: number;
  formattedDateStr: string;
}

function CardThumb({
  src,
  fallbackSrc,
  alt,
  className,
}: {
  src: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasFallenBack, setHasFallenBack] = useState(false);

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      onError={() => {
        if (!hasFallenBack) {
          setHasFallenBack(true);
          setImgSrc(fallbackSrc);
        }
      }}
    />
  );
}

function TimelineCard({
  article,
  isActive,
  onSelect,
}: {
  article: ChronoArticle;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <div className="flex shrink-0 flex-col snap-start" style={{ width: CARD_WIDTH }}>
      {/* Nodo y segmento de riel */}
      <div className="mb-3 flex items-center">
        <div className="h-px flex-1 bg-slate-800" />
        <span
          className={`mx-1.5 h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-[#070B12] transition-colors ${
            isActive ? "bg-amber-400" : "bg-emerald-500"
          }`}
        />
        <div className="h-px flex-1 bg-slate-800" />
      </div>

      <button
        onClick={onSelect}
        className={`group flex flex-1 flex-col overflow-hidden rounded-2xl border bg-slate-900/60 text-left transition-all duration-200 cursor-pointer ${
          isActive
            ? "border-amber-400/70 shadow-lg shadow-amber-500/10 -translate-y-1"
            : "border-slate-800 hover:border-emerald-500/50 hover:-translate-y-0.5"
        }`}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-800">
          <CardThumb
            src={article.imageUrl || FALLBACK_NEWS_IMAGES[0]}
            fallbackSrc={FALLBACK_NEWS_IMAGES[Number(article.id) % FALLBACK_NEWS_IMAGES.length || 0]}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span className="absolute left-2.5 top-2.5 rounded-lg bg-slate-950/85 backdrop-blur-sm px-2 py-1 text-[10px] font-bold text-emerald-400">
            {article.formattedDateStr}
          </span>
          <span className="absolute right-2.5 top-2.5 rounded-lg bg-slate-950/85 backdrop-blur-sm px-2 py-1 text-[10px] font-bold text-amber-300">
            {article.department || "Nacional"}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <span className="text-[11px] font-semibold text-slate-500">{article.source || "Prensa"}</span>
          <h3 className="text-sm font-bold leading-snug text-white line-clamp-3">{article.title}</h3>
        </div>
      </button>
    </div>
  );
}

export function InteractiveNewsGallery3() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollRafRef = useRef<number | null>(null);
  const deptMenuRef = useRef<HTMLDivElement>(null);

  const [allArticles, setAllArticles] = useState<ChronoArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("Todos");
  const [deptMenuOpen, setDeptMenuOpen] = useState(false);
  const [isAscending, setIsAscending] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState<ChronoArticle | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Close department dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (deptMenuRef.current && !deptMenuRef.current.contains(event.target as Node)) {
        setDeptMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Obtiene y procesa las noticias cronológicas
  useEffect(() => {
    let isMounted = true;

    async function loadChronologicalNews() {
      try {
        const rawList = await getAllAgenda5050News("Todos");
        if (!isMounted) return;

        const processed: ChronoArticle[] = (rawList || []).map((item, idx) => {
          const dateObj = item.publishedAt ? new Date(item.publishedAt) : new Date();
          const timestamp = isNaN(dateObj.getTime()) ? Date.now() - idx * 86400000 : dateObj.getTime();
          const formattedDateStr = !isNaN(dateObj.getTime())
            ? dateObj.toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "numeric" })
            : "Fecha reciente";

          return {
            ...item,
            timestamp,
            formattedDateStr,
            imageUrl: item.imageUrl || FALLBACK_NEWS_IMAGES[idx % FALLBACK_NEWS_IMAGES.length],
          };
        });

        setAllArticles(processed);
        if (processed.length === 0) setLoadError(true);
      } catch (err) {
        console.error("Error al cargar noticias para la línea de tiempo:", err);
        if (isMounted) setLoadError(true);
      }
    }

    loadChronologicalNews();
    return () => {
      isMounted = false;
    };
  }, []);

  // Debounce search query
  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedQuery(searchQuery.trim().toLowerCase()), 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Compute article counts per department for dropdown menu
  const departmentCounts = useMemo(() => {
    const counts: Record<string, number> = { Todos: allArticles.length };
    allArticles.forEach((art) => {
      const dept = art.department || "Nacional";
      counts[dept] = (counts[dept] || 0) + 1;
    });
    return counts;
  }, [allArticles]);

  const departmentsList = [
    "Todos",
    "Nacional",
    "Santa Cruz",
    "La Paz",
    "Tarija",
    "Cochabamba",
    "Chuquisaca",
    "Potosí",
    "Oruro",
    "Beni",
    "Pando",
  ].filter((dept) => dept === "Todos" || (departmentCounts[dept] && departmentCounts[dept] > 0));

  const displayArticles = useMemo(() => {
    let result = [...allArticles];

    if (debouncedQuery !== "") {
      result = result.filter(
        (art) =>
          art.title.toLowerCase().includes(debouncedQuery) ||
          (art.summary && art.summary.toLowerCase().includes(debouncedQuery)) ||
          art.source.toLowerCase().includes(debouncedQuery) ||
          art.department.toLowerCase().includes(debouncedQuery)
      );
    }

    if (selectedDepartment !== "Todos") {
      result = result.filter((art) => art.department === selectedDepartment);
    }

    result.sort((a, b) => (isAscending ? a.timestamp - b.timestamp : b.timestamp - a.timestamp));
    return result;
  }, [allArticles, debouncedQuery, selectedDepartment, isAscending]);

  useEffect(() => {
    const el = scrollRef.current;
    setCurrentIndex(0);
    if (!el) return;
    el.scrollTo({ left: 0, behavior: "auto" });
    setCanScrollLeft(false);
    requestAnimationFrame(() => setCanScrollRight(el.scrollWidth > el.clientWidth + 4));
  }, [displayArticles]);

  useEffect(() => {
    const onResize = () => {
      const el = scrollRef.current;
      if (!el) return;
      setCanScrollRight(el.scrollWidth > el.clientWidth + el.scrollLeft + 4);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleScroll = useCallback(() => {
    if (scrollRafRef.current) return;
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = null;
      const el = scrollRef.current;
      if (!el) return;
      const idx = clamp(Math.round(el.scrollLeft / STEP), 0, Math.max(displayArticles.length - 1, 0));
      setCurrentIndex((prev) => (prev === idx ? prev : idx));
      setCanScrollLeft(el.scrollLeft > 4);
      setCanScrollRight(el.scrollWidth > el.clientWidth + el.scrollLeft + 4);
    });
  }, [displayArticles.length]);

  const handleJumpToStep = useCallback(
    (idx: number) => {
      const el = scrollRef.current;
      if (!el || idx < 0 || idx >= displayArticles.length) return;
      el.scrollTo({ left: idx * STEP, behavior: "smooth" });
      setCurrentIndex(idx);
    },
    [displayArticles.length]
  );

  const onRailKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      handleJumpToStep(currentIndex + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      handleJumpToStep(currentIndex - 1);
    } else if ((e.key === "Enter" || e.key === " ") && displayArticles[currentIndex]) {
      e.preventDefault();
      setSelectedArticle(displayArticles[currentIndex]);
    }
  };

  useEffect(() => {
    if (!selectedArticle) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedArticle(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedArticle]);

  const activeArticle = displayArticles[currentIndex];
  const progressPct = displayArticles.length > 1 ? (currentIndex / (displayArticles.length - 1)) * 100 : 0;
  const isInitialLoading = allArticles.length === 0 && !loadError;

  return (
    <section
      id="galeria-noticias"
      className="relative bg-slate-950 text-white py-16 border-t border-b border-slate-800 overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] bg-gradient-to-br from-emerald-500/10 via-amber-500/5 to-transparent blur-[140px] rounded-full pointer-events-none" />

      <div className="container-page relative z-10">
        {/* Encabezado con Stacking Context z-40 para desplegable flotante */}
        <div className="text-center max-w-3xl mx-auto mb-8 relative z-40">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-400 mb-3">
            <Radio size={14} className="animate-pulse" />
            <span>Cobertura periodística actualizada en tiempo real</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">Últimas Noticias</h2>

          <p className="mt-3 text-sm sm:text-base text-slate-400 font-medium max-w-2xl mx-auto">
            Línea de tiempo cronológica de la cobertura de la Agenda 50/50.
          </p>

          {/* Nueva Barra de Control Limpia con z-40 */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5 bg-slate-900/80 border border-slate-800 p-2 rounded-2xl max-w-2xl mx-auto shadow-xl backdrop-blur-md relative z-40">
            {/* Buscador */}
            <div className="relative w-full sm:flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
              <input
                type="text"
                placeholder="Buscar palabra clave, medio o ciudad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  aria-label="Limpiar búsqueda"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Menú Desplegable de Departamentos con z-50 */}
            <div className="relative z-50 w-full sm:w-auto" ref={deptMenuRef}>
              <button
                onClick={() => setDeptMenuOpen(!deptMenuOpen)}
                className="flex items-center justify-between gap-2 w-full sm:w-auto bg-slate-950/80 border border-slate-800 hover:border-emerald-500/60 text-xs font-bold text-slate-200 px-3.5 py-2 rounded-xl transition cursor-pointer"
                aria-expanded={deptMenuOpen}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin size={14} className="text-amber-400 shrink-0" />
                  <span className="truncate">
                    {selectedDepartment === "Todos" ? "Todos los Departamentos" : selectedDepartment}
                  </span>
                </div>
                <span className="rounded-md bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 text-[10px] font-black">
                  {departmentCounts[selectedDepartment] || displayArticles.length}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform ${deptMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Menú Flotante Glassmorphic con z-[100] */}
              {deptMenuOpen && (
                <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-60 z-[100] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 border-b border-slate-800 mb-1">
                    Filtrar por Región
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-0.5 scrollbar-thin">
                    {departmentsList.map((dept) => {
                      const isSelected = selectedDepartment === dept;
                      const count = departmentCounts[dept] || 0;
                      return (
                        <button
                          key={dept}
                          onClick={() => {
                            setSelectedDepartment(dept);
                            setDeptMenuOpen(false);
                          }}
                          className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                            isSelected
                              ? "bg-emerald-500 text-slate-950 font-black"
                              : "text-slate-300 hover:bg-slate-800 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isSelected && <Check size={14} className="shrink-0" />}
                            <span>{dept}</span>
                          </div>
                          <span
                            className={`text-[10px] font-extrabold rounded-md px-1.5 py-0.5 ${
                              isSelected ? "bg-slate-950/20 text-slate-950" : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Botón de Sentido Cronológico */}
            <button
              onClick={() => setIsAscending(!isAscending)}
              className="flex items-center justify-center gap-1.5 bg-slate-950/80 border border-slate-800 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 px-3 py-2 rounded-xl text-xs font-bold transition w-full sm:w-auto shrink-0 cursor-pointer"
              title="Cambiar sentido cronológico"
            >
              <ArrowUpDown size={14} />
              <span>{isAscending ? "Antiguas primero" : "Recientes primero"}</span>
            </button>
          </div>

          {/* Feedback de Búsqueda */}
          {searchQuery && (
            <div className="mt-3 text-xs font-extrabold text-emerald-400">
              {displayArticles.length} {displayArticles.length === 1 ? "noticia encontrada" : "noticias encontradas"}{" "}
              para "<span className="text-white">{searchQuery}</span>"
            </div>
          )}
        </div>

        {/* Panel de la línea de tiempo con z-10 */}
        <div className="relative z-10 rounded-3xl border border-slate-800 bg-[#070B12] shadow-2xl p-5 sm:p-8">
          {loadError && allArticles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <RefreshCw size={32} className="text-slate-600 mb-3" />
              <h3 className="text-lg font-black text-white">No se pudo cargar la cobertura</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Revisa tu conexión e inténtalo nuevamente en unos minutos.
              </p>
            </div>
          )}

          {isInitialLoading && (
            <div className="flex gap-5 overflow-hidden">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="shrink-0 animate-pulse" style={{ width: CARD_WIDTH }}>
                  <div className="mb-3 h-px w-full bg-slate-800" />
                  <div className="aspect-[16/10] w-full rounded-2xl bg-slate-800/70" />
                  <div className="mt-3 h-3 w-2/3 rounded bg-slate-800/70" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-slate-800/70" />
                </div>
              ))}
            </div>
          )}

          {!isInitialLoading && !loadError && displayArticles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search size={40} className="text-slate-600 mb-3" />
              <h3 className="text-lg font-black text-white">No se encontraron noticias</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                No hay coincidencias para "<span className="text-amber-300">{searchQuery}</span>" en el departamento
                seleccionado.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDepartment("Todos");
                }}
                className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500 text-slate-950 font-black px-4 py-2 text-xs hover:bg-emerald-400 transition shadow-md cursor-pointer"
              >
                <RefreshCw size={14} /> Restablecer filtros
              </button>
            </div>
          )}

          {!isInitialLoading && displayArticles.length > 0 && (
            <>
              {/* Barra de control: hito activo + navegación */}
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2 text-sm">
                  <Clock size={16} className="shrink-0 text-emerald-400" />
                  <span className="shrink-0 font-bold text-slate-200">
                    Hito {currentIndex + 1} de {displayArticles.length}
                  </span>
                  <span className="h-3.5 w-px shrink-0 bg-slate-700" />
                  <span className="truncate font-medium text-slate-400">
                    {activeArticle?.formattedDateStr} — {activeArticle?.department}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => handleJumpToStep(currentIndex - 1)}
                    disabled={!canScrollLeft}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-white transition hover:border-emerald-500 hover:bg-emerald-500/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="Hito anterior"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => handleJumpToStep(currentIndex + 1)}
                    disabled={!canScrollRight}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-white transition hover:border-emerald-500 hover:bg-emerald-500/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="Siguiente hito"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Carrusel horizontal con desvanecidos en los bordes */}
              <div className="relative">
                {canScrollLeft && (
                  <div className="pointer-events-none absolute -left-5 sm:-left-8 top-0 z-10 h-full w-10 bg-gradient-to-r from-[#070B12] to-transparent" />
                )}
                {canScrollRight && (
                  <div className="pointer-events-none absolute -right-5 sm:-right-8 top-0 z-10 h-full w-10 bg-gradient-to-l from-[#070B12] to-transparent" />
                )}

                <div
                  ref={scrollRef}
                  onScroll={handleScroll}
                  onKeyDown={onRailKeyDown}
                  tabIndex={0}
                  role="region"
                  aria-label={
                    activeArticle
                      ? `Línea de tiempo de noticias. Hito ${currentIndex + 1} de ${displayArticles.length}: ${activeArticle.title}`
                      : "Línea de tiempo de noticias"
                  }
                  className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 rounded-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {displayArticles.map((art, idx) => (
                    <TimelineCard
                      key={art.id}
                      article={art}
                      isActive={idx === currentIndex}
                      onSelect={() => {
                        setSelectedArticle(art);
                        setCurrentIndex(idx);
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Barra de progreso del recorrido */}
              <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-[width] duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de la noticia seleccionada */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in"
          onClick={() => setSelectedArticle(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="noticia-titulo"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-white relative"
          >
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 rounded-full bg-slate-800 p-2 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>

            {selectedArticle.imageUrl && (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-4 bg-slate-800">
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <span className="absolute top-3 left-3 rounded-full bg-slate-950/90 backdrop-blur-md px-3 py-1 text-[10px] font-black text-[#3ac167] border border-white/10">
                  {selectedArticle.source}
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 text-xs font-bold text-slate-400 mb-2">
              <span className="flex items-center gap-1 text-emerald-400">
                <Tag size={13} /> {selectedArticle.department}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={13} /> {selectedArticle.formattedDateStr}
              </span>
            </div>

            <h3 id="noticia-titulo" className="text-xl font-black leading-snug text-white mb-3">
              {selectedArticle.title}
            </h3>

            {selectedArticle.summary && (
              <p className="text-sm text-slate-300 font-medium leading-relaxed mb-6">{selectedArticle.summary}</p>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-400 font-semibold">Fuente: {selectedArticle.source}</span>

              <a
                href={selectedArticle.url}
                target={selectedArticle.url.startsWith("http") ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-[#3ac167] hover:bg-[#2ea354] text-slate-950 font-black px-4 py-2.5 text-xs transition shadow-md"
              >
                <span>Leer cobertura periodística</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
