"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SectionItem {
  id: string;
  label: string;
}

const SECTIONS: SectionItem[] = [
  { id: "acuerdo", label: "Inicio / Acuerdo" },
  { id: "conceptos", label: "Conceptos Clave" },
  { id: "monitor", label: "Monitor 50/50" },
  { id: "descargas", label: "Documentos Oficiales" },
  { id: "compromisos", label: "Compromisos" },
  { id: "ruta", label: "Ruta de Implementación" },
  { id: "multimedia", label: "Multimedia" },
  { id: "prensa", label: "Prensa y Noticias" },
  { id: "co-construccion", label: "Buzón Ciudadano" },
];

/**
 * ScrollNavigator: Indicador flotante y minimalista de secciones activas en desktop.
 * Resalta en tiempo real la sección en lectura y permite salto suave entre ellas.
 */
export function ScrollNavigator() {
  const [activeId, setActiveId] = useState<string>("acuerdo");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible && visible.target.id) {
          setActiveId(visible.target.id);
        }
      },
      {
        rootMargin: "-25% 0px -40% 0px",
        threshold: 0,
      }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      aria-label="Navegador de Secciones"
      className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-3 pointer-events-auto"
    >
      <div className="flex flex-col items-center gap-2.5 p-2 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-lg transition-colors">
        {SECTIONS.map((section) => {
          const isActive = activeId === section.id;
          const isHovered = hoveredId === section.id;

          return (
            <div
              key={section.id}
              className="relative flex items-center justify-end"
              onMouseEnter={() => setHoveredId(section.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Tooltip on hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: 8, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-7 px-3 py-1.5 rounded-lg bg-slate-900/90 dark:bg-slate-100/90 text-white dark:text-slate-900 text-xs font-bold whitespace-nowrap shadow-md pointer-events-none"
                  >
                    {section.label}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dot indicator */}
              <button
                type="button"
                onClick={() => scrollTo(section.id)}
                aria-label={`Ir a ${section.label}`}
                className="group relative flex items-center justify-center p-1"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    isActive
                      ? "h-4 w-4 bg-[#3ac167] shadow-[0_0_10px_#3ac167] ring-2 ring-[#3ac167]/30"
                      : "h-2 w-2 bg-slate-400/60 dark:bg-slate-500/60 group-hover:bg-[#dd3146] group-hover:scale-125"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
