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

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

function formatYmd(year: number, monthZeroBased: number, day: number): string {
  const m = String(monthZeroBased + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

interface ChronoArticle extends AgendaNewsArticle {
  timestamp: number;
  formattedDateStr: string;
  dateIso: string;
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
  hasDraggedRef,
}: {
  article: ChronoArticle;
  isActive: boolean;
  onSelect: () => void;
  hasDraggedRef: React.RefObject<boolean>;
}) {
  return (
    <div className="flex shrink-0 flex-col snap-start select-none" style={{ width: CARD_WIDTH }}>
      {/* Nodo y segmento de riel */}
      <div className="mb-3 flex items-center">
        <div className="h-px flex-1 bg-slate-300 dark:bg-slate-800" />
        <span
          className={`mx-1.5 h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-slate-100 dark:ring-[#070B12] transition-colors ${
            isActive ? "bg-amber-400" : "bg-emerald-500"
          }`}
        />
        <div className="h-px flex-1 bg-slate-300 dark:bg-slate-800" />
      </div>

      <a
        href={article.url}
        target={article.url && article.url.startsWith("http") ? "_blank" : "_self"}
        rel="noopener noreferrer"
        onClick={(e) => {
          if (hasDraggedRef.current) {
            e.preventDefault();
            return;
          }
          onSelect();
        }}
        title={article.summary || article.title}
        className={`group relative flex flex-1 flex-col overflow-hidden rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
          isActive
            ? "border-amber-400/90 dark:border-amber-400/70 shadow-lg shadow-amber-500/10 bg-white dark:bg-slate-900/60 -translate-y-1 ring-1 ring-amber-400/40"
            : "bg-white dark:bg-slate-900/60 border-slate-200/90 dark:border-slate-800 hover:border-emerald-500/60 dark:hover:border-emerald-500/50 hover:-translate-y-0.5 shadow-sm dark:shadow-none"
        }`}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
          <CardThumb
            src={article.imageUrl || FALLBACK_NEWS_IMAGES[0]}
            fallbackSrc={FALLBACK_NEWS_IMAGES[Number(article.id) % FALLBACK_NEWS_IMAGES.length || 0]}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none"
          />
          <span className="absolute left-2.5 top-2.5 rounded-lg bg-slate-950/85 backdrop-blur-sm px-2 py-1 text-[10px] font-bold text-emerald-400">
            {article.formattedDateStr}
          </span>
          <span className="absolute right-2.5 top-2.5 rounded-lg bg-slate-950/85 backdrop-blur-sm px-2 py-1 text-[10px] font-bold text-amber-300">
            {article.department || "Nacional"}
          </span>

          {/* Indicador sutil de enlace directo al pasar el cursor */}
          <span className="absolute bottom-2.5 right-2.5 rounded-lg bg-emerald-500 text-slate-950 px-2 py-1 text-[10px] font-extrabold opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1 shadow-md transform translate-y-1 group-hover:translate-y-0">
            <span>Abrir noticia</span>
            <ExternalLink size={11} />
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4 relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{article.source || "Prensa"}</span>
            <ExternalLink size={12} className="text-slate-400 group-hover:text-emerald-500 transition-colors opacity-0 group-hover:opacity-100" />
          </div>

          <h3 className="text-sm font-bold leading-snug text-slate-900 dark:text-white line-clamp-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {article.title}
          </h3>

          {/* Resumen sutil integrado en la tarjeta */}
          {article.summary && (
            <div className="mt-1 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <p className="text-[11px] font-medium leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                {article.summary}
              </p>
            </div>
          )}
        </div>
      </a>
    </div>
  );
}

export function InteractiveNewsGallery3() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollRafRef = useRef<number | null>(null);
  const deptMenuRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const datesScrollRef = useRef<HTMLDivElement>(null);

  const [allArticles, setAllArticles] = useState<ChronoArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("Todos");
  const [selectedDate, setSelectedDate] = useState("");
  const [deptMenuOpen, setDeptMenuOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(7); // default Agosto
  const [calendarYear, setCalendarYear] = useState(2026); // default 2026

  const [isAscending, setIsAscending] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Mouse Drag State for Main Cards Carousel
  const isCardsDraggingRef = useRef(false);
  const startCardsXRef = useRef(0);
  const startCardsScrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const [isCardsDragging, setIsCardsDragging] = useState(false);

  // Mouse Drag State for Bottom Dates Timeline Track
  const isDatesDraggingRef = useRef(false);
  const startDatesXRef = useRef(0);
  const startDatesScrollLeftRef = useRef(0);
  const [isDatesDragging, setIsDatesDragging] = useState(false);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (deptMenuRef.current && !deptMenuRef.current.contains(event.target as Node)) {
        setDeptMenuOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch and process chronological news articles
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

          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, "0");
          const day = String(dateObj.getDate()).padStart(2, "0");
          const dateIso = !isNaN(dateObj.getTime()) ? `${year}-${month}-${day}` : "";

          return {
            ...item,
            timestamp,
            formattedDateStr,
            dateIso,
            imageUrl: item.imageUrl || FALLBACK_NEWS_IMAGES[idx % FALLBACK_NEWS_IMAGES.length],
          };
        });

        setAllArticles(processed);
        if (processed.length === 0) {
          setLoadError(true);
        } else {
          // Ajustar automáticamente el mes y año del calendario a la noticia más reciente con fecha
          const latestWithDate = [...processed].sort((a, b) => b.timestamp - a.timestamp).find((art) => art.dateIso);
          if (latestWithDate && latestWithDate.dateIso) {
            const [y, m] = latestWithDate.dateIso.split("-").map(Number);
            if (y && m) {
              setCalendarYear(y);
              setCalendarMonth(m - 1);
            }
          }
        }
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

  // Map dates with milestones count
  const milestoneDatesMap = useMemo(() => {
    const map: Record<string, { count: number; dateStr: string }> = {};
    allArticles.forEach((art) => {
      if (!art.dateIso) return;
      if (!map[art.dateIso]) {
        map[art.dateIso] = { count: 0, dateStr: art.formattedDateStr };
      }
      map[art.dateIso].count += 1;
    });
    return map;
  }, [allArticles]);

  const activeMilestoneDates = useMemo(() => {
    return Object.entries(milestoneDatesMap)
      .map(([iso, data]) => ({ iso, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [milestoneDatesMap]);

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

    // Filter by text query
    if (debouncedQuery !== "") {
      result = result.filter(
        (art) =>
          art.title.toLowerCase().includes(debouncedQuery) ||
          (art.summary && art.summary.toLowerCase().includes(debouncedQuery)) ||
          art.source.toLowerCase().includes(debouncedQuery) ||
          art.department.toLowerCase().includes(debouncedQuery)
      );
    }

    // Filter by department
    if (selectedDepartment !== "Todos") {
      result = result.filter((art) => art.department === selectedDepartment);
    }

    // Filter by selected date
    if (selectedDate !== "") {
      result = result.filter((art) => art.dateIso === selectedDate);
    }

    result.sort((a, b) => (isAscending ? a.timestamp - b.timestamp : b.timestamp - a.timestamp));
    return result;
  }, [allArticles, debouncedQuery, selectedDepartment, selectedDate, isAscending]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || displayArticles.length === 0) return;
    const targetIdx = isAscending ? displayArticles.length - 1 : 0;
    setCurrentIndex(targetIdx);
    const timer = setTimeout(() => {
      if (el) {
        el.scrollTo({ left: targetIdx * STEP, behavior: "auto" });
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollWidth > el.clientWidth + el.scrollLeft + 4);
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [displayArticles, isAscending]);

  useEffect(() => {
    const onResize = () => {
      const el = scrollRef.current;
      if (!el) return;
      setCanScrollLeft(el.scrollLeft > 4);
      setCanScrollRight(el.scrollWidth > el.clientWidth + el.scrollLeft + 4);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Auto-scroll active date button into view inside datesScrollRef
  useEffect(() => {
    const container = datesScrollRef.current;
    if (!container) return;
    const activeChild = container.children[currentIndex] as HTMLElement | undefined;
    if (activeChild) {
      activeChild.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [currentIndex]);

  // Wheel horizontal scroll handler for dates track
  useEffect(() => {
    const el = datesScrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY * 1.5;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, [displayArticles]);

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

  // Mouse Drag Handlers for Main Cards Carousel
  const onCardsMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isCardsDraggingRef.current = true;
    hasDraggedRef.current = false;
    setIsCardsDragging(true);
    startCardsXRef.current = e.pageX - el.offsetLeft;
    startCardsScrollLeftRef.current = el.scrollLeft;
  };

  const onCardsMouseLeave = () => {
    isCardsDraggingRef.current = false;
    setIsCardsDragging(false);
  };

  const onCardsMouseUp = () => {
    isCardsDraggingRef.current = false;
    setIsCardsDragging(false);
  };

  const onCardsMouseMove = (e: React.MouseEvent) => {
    if (!isCardsDraggingRef.current) return;
    e.preventDefault();
    const el = scrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startCardsXRef.current) * 1.5;
    if (Math.abs(walk) > 5) {
      hasDraggedRef.current = true;
    }
    el.scrollLeft = startCardsScrollLeftRef.current - walk;
  };

  // Mouse Drag Handlers for Bottom Dates Timeline Track
  const onDatesMouseDown = (e: React.MouseEvent) => {
    const el = datesScrollRef.current;
    if (!el) return;
    isDatesDraggingRef.current = true;
    setIsDatesDragging(true);
    startDatesXRef.current = e.pageX - el.offsetLeft;
    startDatesScrollLeftRef.current = el.scrollLeft;
  };

  const onDatesMouseLeave = () => {
    isDatesDraggingRef.current = false;
    setIsDatesDragging(false);
  };

  const onDatesMouseUp = () => {
    isDatesDraggingRef.current = false;
    setIsDatesDragging(false);
  };

  const onDatesMouseMove = (e: React.MouseEvent) => {
    if (!isDatesDraggingRef.current) return;
    e.preventDefault();
    const el = datesScrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startDatesXRef.current) * 1.5;
    el.scrollLeft = startDatesScrollLeftRef.current - walk;
  };

  const handleDateTrackScroll = (offset: number) => {
    const el = datesScrollRef.current;
    if (el) {
      el.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const onRailKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      handleJumpToStep(currentIndex + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      handleJumpToStep(currentIndex - 1);
    } else if ((e.key === "Enter" || e.key === " ") && displayArticles[currentIndex]) {
      e.preventDefault();
      const art = displayArticles[currentIndex];
      if (art?.url) {
        window.open(art.url, art.url.startsWith("http") ? "_blank" : "_self", "noopener,noreferrer");
      }
    }
  };

  const activeArticle = displayArticles[currentIndex];
  const progressPct = displayArticles.length > 1 ? (currentIndex / (displayArticles.length - 1)) * 100 : 0;
  const isInitialLoading = allArticles.length === 0 && !loadError;

  return (
    <section
      id="prensa"
      className="relative bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white py-16 border-t border-b border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] bg-gradient-to-br from-emerald-500/10 via-amber-500/10 dark:via-amber-500/5 to-transparent blur-[140px] rounded-full pointer-events-none" />

      <div className="container-page relative z-10">
        {/* Encabezado con Stacking Context z-40 para desplegables flotantes */}
        <div className="text-center max-w-3xl mx-auto mb-8 relative z-40">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-400 mb-3 shadow-xs">
            <Radio size={14} className="animate-pulse" />
            <span>Cobertura periodística actualizada en tiempo real</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">Últimas Noticias</h2>

          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto">
            Línea de tiempo cronológica de la cobertura de la Agenda 50/50.
          </p>

          {/* Barra de Control Limpia con Buscador, Calendario de Hitos, Departamentos y Orden */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 p-2 rounded-2xl max-w-3xl mx-auto shadow-xl shadow-slate-200/40 dark:shadow-xl backdrop-blur-md relative z-40">
            {/* Buscador de Texto */}
            <div className="relative w-full sm:flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500 dark:text-emerald-400" />
              <input
                type="text"
                placeholder="Buscar palabra clave, medio o ciudad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                  aria-label="Limpiar búsqueda"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Selector por Fecha con Icono de Calendario y Popover de Hitos Pintados */}
            <div className="relative z-50 w-full sm:w-auto" ref={calendarRef}>
              <button
                onClick={() => setCalendarOpen(!calendarOpen)}
                className={`flex items-center justify-between gap-2 w-full sm:w-auto border text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer ${selectedDate
                  ? "bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-md shadow-emerald-500/20"
                  : "bg-slate-100 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 hover:border-emerald-500/60 text-slate-800 dark:text-slate-200"
                  }`}
                aria-expanded={calendarOpen}
                title="Abrir calendario de hitos con noticias destacadas"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Calendar size={14} className={selectedDate ? "text-slate-950" : "text-emerald-500 dark:text-emerald-400"} />
                  <span className="truncate">
                    {selectedDate ? selectedDate : "Calendario de Hitos"}
                  </span>
                </div>
                {selectedDate ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDate("");
                    }}
                    className="rounded-full bg-slate-950/20 p-0.5 hover:bg-slate-950/40 text-slate-950 ml-1"
                    title="Limpiar fecha"
                  >
                    <X size={12} />
                  </button>
                ) : (
                  <span className="rounded-md bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 text-[10px] font-black">
                    {Object.keys(milestoneDatesMap).length} fechas
                  </span>
                )}
              </button>

              {/* Popover del Calendario Flotante Glassmorphic con Hitos Pintados */}
              {calendarOpen && (
                <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-80 z-[100] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-4 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150 text-slate-900 dark:text-white">
                  {/* Cabecera del Mes y Año */}
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar size={15} className="text-emerald-500 dark:text-emerald-400" />
                      <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        {MONTH_NAMES[calendarMonth]} {calendarYear}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          if (calendarMonth === 0) {
                            setCalendarMonth(11);
                            setCalendarYear(calendarYear - 1);
                          } else {
                            setCalendarMonth(calendarMonth - 1);
                          }
                        }}
                        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                        title="Mes anterior"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (calendarMonth === 11) {
                            setCalendarMonth(0);
                            setCalendarYear(calendarYear + 1);
                          } else {
                            setCalendarMonth(calendarMonth + 1);
                          }
                        }}
                        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                        title="Mes siguiente"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Leyenda explicativa */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold mb-2 px-1">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                      Fechas destacadas con hitos
                    </span>
                    {selectedDate && (
                      <button
                        onClick={() => {
                          setSelectedDate("");
                          setCalendarOpen(false);
                        }}
                        className="text-amber-600 dark:text-amber-400 hover:underline font-bold cursor-pointer"
                      >
                        Ver todas
                      </button>
                    )}
                  </div>

                  {/* Días de la Semana */}
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1">
                    <span>Dom</span><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span>
                  </div>

                  {/* Matriz de Días del Mes */}
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {/* Espacios vacíos antes del día 1 */}
                    {Array.from({ length: new Date(calendarYear, calendarMonth, 1).getDay() }).map((_, i) => (
                      <div key={`blank-${i}`} className="h-8" />
                    ))}

                    {/* Días 1..N del mes */}
                    {Array.from({ length: new Date(calendarYear, calendarMonth + 1, 0).getDate() }).map((_, i) => {
                      const dayNum = i + 1;
                      const ymd = formatYmd(calendarYear, calendarMonth, dayNum);
                      const milestoneData = milestoneDatesMap[ymd];
                      const hasMilestone = Boolean(milestoneData);
                      const isSelected = selectedDate === ymd;

                      return (
                        <button
                          key={`day-${dayNum}`}
                          onClick={() => {
                            if (hasMilestone) {
                              setSelectedDate(ymd);
                              setCalendarOpen(false);
                            }
                          }}
                          disabled={!hasMilestone}
                          title={hasMilestone ? `${milestoneData.count} noticias el ${ymd}` : "Sin noticias"}
                          className={`relative h-8 rounded-xl text-xs font-extrabold flex items-center justify-center transition-all ${isSelected
                            ? "bg-amber-400 text-slate-950 ring-2 ring-amber-300 scale-105 shadow-md font-black"
                            : hasMilestone
                              ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500 hover:text-white dark:hover:text-slate-950 border border-emerald-300 dark:border-emerald-500/50 cursor-pointer scale-105 shadow-xs"
                              : "text-slate-300 dark:text-slate-600 opacity-40 cursor-not-allowed"
                            }`}
                        >
                          <span>{dayNum}</span>
                          {hasMilestone && !isSelected && (
                            <span className="absolute -top-1 -right-1 h-3.5 min-w-[14px] px-0.5 rounded-full bg-emerald-500 text-[9px] font-black text-slate-950 flex items-center justify-center shadow-xs">
                              {milestoneData.count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Lista de Fechas Destacadas */}
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                      <span>Fechas con Mayor Cobertura</span>
                      <span className="text-emerald-600 dark:text-emerald-400">{activeMilestoneDates.length} fechas</span>
                    </div>
                    <div className="max-h-28 overflow-y-auto space-y-1 scrollbar-thin pr-1">
                      {activeMilestoneDates.map((item) => (
                        <button
                          key={`preset-${item.iso}`}
                          onClick={() => {
                            setSelectedDate(item.iso);
                            const [y, m] = item.iso.split("-").map(Number);
                            if (y && m) {
                              setCalendarYear(y);
                              setCalendarMonth(m - 1);
                            }
                            setCalendarOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${selectedDate === item.iso
                            ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                            : "bg-slate-100 dark:bg-slate-950/60 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white text-slate-700 dark:text-slate-300"
                            }`}
                        >
                          <span>{item.dateStr}</span>
                          <span className="text-[10px] font-black rounded-md px-1.5 py-0.5 bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                            {item.count} {item.count === 1 ? "hito" : "hitos"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Menú Desplegable de Departamentos con z-50 */}
            <div className="relative z-50 w-full sm:w-auto" ref={deptMenuRef}>
              <button
                onClick={() => setDeptMenuOpen(!deptMenuOpen)}
                className="flex items-center justify-between gap-2 w-full sm:w-auto bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/60 text-xs font-bold text-slate-800 dark:text-slate-200 px-3.5 py-2 rounded-xl transition cursor-pointer"
                aria-expanded={deptMenuOpen}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin size={14} className="text-amber-500 dark:text-amber-400 shrink-0" />
                  <span className="truncate">
                    {selectedDepartment === "Todos" ? "Todos los Departamentos" : selectedDepartment}
                  </span>
                </div>
                <span className="rounded-md bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 text-[10px] font-black">
                  {departmentCounts[selectedDepartment] || displayArticles.length}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform ${deptMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Menú Flotante Glassmorphic con z-[100] */}
              {deptMenuOpen && (
                <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-60 z-[100] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-1.5 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150 text-slate-900 dark:text-white">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 mb-1">
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
                          className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${isSelected
                            ? "bg-emerald-500 text-slate-950 font-black"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            {isSelected && <Check size={14} className="shrink-0" />}
                            <span>{dept}</span>
                          </div>
                          <span
                            className={`text-[10px] font-extrabold rounded-md px-1.5 py-0.5 ${isSelected ? "bg-slate-950/20 text-slate-950" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
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
              className="flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-2 rounded-xl text-xs font-bold transition w-full sm:w-auto shrink-0 cursor-pointer"
              title="Cambiar sentido cronológico"
            >
              <ArrowUpDown size={14} />
              <span>{isAscending ? "Antiguas" : "Recientes"}</span>
            </button>
          </div>

          {/* Feedback de Búsqueda Activa */}
          {(searchQuery || selectedDate || selectedDepartment !== "Todos") && (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
              <span>
                {displayArticles.length} {displayArticles.length === 1 ? "noticia encontrada" : "noticias encontradas"}
              </span>
              {selectedDate && (
                <span className="rounded-md bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 border border-emerald-500/30">
                  Fecha: {selectedDate}
                </span>
              )}
              {selectedDepartment !== "Todos" && (
                <span className="rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-300 px-2 py-0.5 border border-amber-500/30">
                  Región: {selectedDepartment}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Panel de la línea de tiempo con z-10 */}
        <div className="relative z-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070B12] shadow-xl dark:shadow-2xl p-5 sm:p-8 transition-colors duration-300">
          {loadError && allArticles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <RefreshCw size={32} className="text-slate-400 dark:text-slate-600 mb-3" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white">No se pudo cargar la cobertura</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                Revisa tu conexión e inténtalo nuevamente en unos minutos.
              </p>
            </div>
          )}

          {isInitialLoading && (
            <div className="flex gap-5 overflow-hidden">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="shrink-0 animate-pulse" style={{ width: CARD_WIDTH }}>
                  <div className="mb-3 h-px w-full bg-slate-200 dark:bg-slate-800" />
                  <div className="aspect-[16/10] w-full rounded-2xl bg-slate-200 dark:bg-slate-800/70" />
                  <div className="mt-3 h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-800/70" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800/70" />
                </div>
              ))}
            </div>
          )}

          {!isInitialLoading && !loadError && displayArticles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search size={40} className="text-slate-400 dark:text-slate-600 mb-3" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white">No se encontraron noticias</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                No hay coincidencias para los filtros seleccionados
                {selectedDate ? ` en el día ${selectedDate}` : ""}.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDepartment("Todos");
                  setSelectedDate("");
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
                  <Clock size={16} className="shrink-0 text-emerald-500 dark:text-emerald-400" />
                  <span className="shrink-0 font-bold text-slate-800 dark:text-slate-200">
                    Noticia {currentIndex + 1} de {displayArticles.length}
                  </span>
                  <span className="h-3.5 w-px shrink-0 bg-slate-300 dark:bg-slate-700" />
                  <span className="truncate font-medium text-slate-500 dark:text-slate-400">
                    {activeArticle?.formattedDateStr} — {activeArticle?.department}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => handleJumpToStep(currentIndex - 1)}
                    disabled={!canScrollLeft}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white transition hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                    aria-label="Hito anterior"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => handleJumpToStep(currentIndex + 1)}
                    disabled={!canScrollRight}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white transition hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                    aria-label="Siguiente hito"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Carrusel horizontal con desvanecidos en los bordes y arrastre de manito */}
              <div className="relative">
                {canScrollLeft && (
                  <div className="pointer-events-none absolute -left-5 sm:-left-8 top-0 z-10 h-full w-10 bg-gradient-to-r from-white dark:from-[#070B12] to-transparent" />
                )}
                {canScrollRight && (
                  <div className="pointer-events-none absolute -right-5 sm:-right-8 top-0 z-10 h-full w-10 bg-gradient-to-l from-white dark:from-[#070B12] to-transparent" />
                )}

                <div
                  ref={scrollRef}
                  onScroll={handleScroll}
                  onKeyDown={onRailKeyDown}
                  onMouseDown={onCardsMouseDown}
                  onMouseLeave={onCardsMouseLeave}
                  onMouseUp={onCardsMouseUp}
                  onMouseMove={onCardsMouseMove}
                  tabIndex={0}
                  role="region"
                  aria-label={
                    activeArticle
                      ? `Línea de tiempo de noticias. Hito ${currentIndex + 1} de ${displayArticles.length}: ${activeArticle.title}`
                      : "Línea de tiempo de noticias"
                  }
                  className={`flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 rounded-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${isCardsDragging ? "cursor-grabbing" : "cursor-grab"
                    }`}
                >
                  {displayArticles.map((art, idx) => (
                    <TimelineCard
                      key={art.id}
                      article={art}
                      isActive={idx === currentIndex}
                      onSelect={() => {
                        setCurrentIndex(idx);
                      }}
                      hasDraggedRef={hasDraggedRef}
                    />
                  ))}
                </div>
              </div>

              {/* Barra de progreso del recorrido degradada e interactiva al clic */}
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  if (rect.width <= 0 || displayArticles.length <= 1) return;
                  const clickX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                  const targetIndex = Math.round(ratio * (displayArticles.length - 1));
                  handleJumpToStep(targetIndex);
                }}
                className="group relative mt-6 h-3 w-full cursor-pointer overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700/50 hover:border-emerald-500/60 transition-all shadow-inner"
                title="Haz clic en cualquier punto de la barra para saltar a esa fecha u hito"
                role="progressbar"
                aria-valuenow={Math.round(progressPct)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-400 transition-[width] duration-300 shadow-md shadow-emerald-500/30"
                  style={{ width: `${progressPct}%` }}
                />
                {/* Resplandor al pasar el cursor */}
                <div className="absolute inset-0 bg-white/20 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>

              {/* Fechas Cronológicas debajo de la barra de progreso (sin scrollbar, con flechas y manito) */}
              <div className="mt-4 flex items-center gap-2 bg-slate-100/90 dark:bg-slate-900/40 p-2 rounded-2xl border border-slate-200 dark:border-slate-800/60">
                {/* Flecha Izquierda para Fechas */}
                <button
                  onClick={() => handleDateTrackScroll(-220)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shadow-xs"
                  aria-label="Desplazar fechas a la izquierda"
                  title="Anteriores fechas"
                >
                  <ChevronLeft size={16} />
                </button>

                {/* Contenedor de Fechas con Arrastre 'manito' y Cero Scrollbar */}
                <div
                  ref={datesScrollRef}
                  onMouseDown={onDatesMouseDown}
                  onMouseLeave={onDatesMouseLeave}
                  onMouseUp={onDatesMouseUp}
                  onMouseMove={onDatesMouseMove}
                  className={`flex flex-1 items-center gap-2 overflow-x-auto py-1 scroll-smooth select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${isDatesDragging ? "cursor-grabbing" : "cursor-grab"
                    }`}
                >
                  {displayArticles.map((art, idx) => {
                    const isActive = idx === currentIndex;
                    return (
                      <button
                        key={`date-node-${art.id}-${idx}`}
                        onClick={() => handleJumpToStep(idx)}
                        className={`group flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-extrabold transition-all cursor-pointer border ${isActive
                          ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20 scale-105"
                          : "bg-white dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800/90"
                          }`}
                        aria-current={isActive}
                      >
                        <span
                          className={`h-2 w-2 rounded-full transition-colors ${isActive ? "bg-slate-950 animate-pulse" : "bg-emerald-500/60 group-hover:bg-emerald-500"
                            }`}
                        />
                        <span>{art.formattedDateStr}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Flecha Derecha para Fechas */}
                <button
                  onClick={() => handleDateTrackScroll(220)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shadow-xs"
                  aria-label="Desplazar fechas a la derecha"
                  title="Siguientes fechas"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
