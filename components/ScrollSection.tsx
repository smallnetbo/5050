"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";

interface ScrollSectionProps {
  children: React.ReactNode;
  className?: string;
  isFirst?: boolean;
  isLast?: boolean;
}

/**
 * ScrollSection: Envoltorio para secciones que anima bidireccionalmente
 * tanto los elementos anteriores como los posteriores al navegar con el scroll.
 */
export function ScrollSection({
  children,
  className = "",
  isFirst = false,
  isLast = false,
}: ScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // 1. Animación de entrada (Posteriores entrando desde abajo)
  // De 0 (cuando el borde superior toca el fondo de la ventana) a 1 (cuando sube al 65% de la ventana)
  const { scrollYProgress: enterProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start 65%"],
  });

  // 2. Animación de salida (Anteriores saliendo por arriba hacia el pasado)
  // De 0 (cuando el borde inferior toca el 35% superior de la ventana) a 1 (cuando sale completamente por arriba)
  const { scrollYProgress: exitProgress } = useScroll({
    target: containerRef,
    offset: ["end 35%", "end start"],
  });

  // Resortes suaves para física orgánica y fluida a 60/120 fps
  const smoothEnter = useSpring(enterProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.15,
  });

  const smoothExit = useSpring(exitProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.15,
  });

  // Opacidad calculada bidireccionalmente
  const opacity = useTransform(
    [smoothEnter, smoothExit],
    ([enter, exit]: number[]) => {
      if (shouldReduceMotion) return 1;
      const e = enter ?? 0;
      const x = exit ?? 0;

      if (isFirst) {
        // La primera sección (Hero) inicia con 100% de visibilidad y sólo se atenúa al scrollear hacia abajo
        return Math.max(0.4, 1 - x * 0.6);
      }
      if (isLast) {
        // La última sección entra con suavidad y no se oculta al final
        return Math.min(1, 0.2 + e * 0.8);
      }

      // Secciones intermedias: entra de 0.2 -> 1.0, y al salir hacia arriba se atenúa sutilmente a 0.45
      const entranceVal = 0.2 + e * 0.8;
      const exitDeduction = x * 0.55;
      return Math.max(0.4, entranceVal - exitDeduction);
    }
  );

  // Escala suave (profundidad cinematográfica sutil)
  const scale = useTransform(
    [smoothEnter, smoothExit],
    ([enter, exit]: number[]) => {
      if (shouldReduceMotion) return 1;
      const e = enter ?? 0;
      const x = exit ?? 0;

      if (isFirst) {
        return 1 - x * 0.035; // 1 -> 0.965 al salir hacia arriba
      }
      if (isLast) {
        return 0.965 + e * 0.035; // 0.965 -> 1 al entrar desde abajo
      }

      const enterScale = 0.965 + e * 0.035;
      const exitScale = x * 0.035;
      return enterScale - exitScale;
    }
  );

  // Desplazamiento Y cinético bidireccional
  const y = useTransform(
    [smoothEnter, smoothExit],
    ([enter, exit]: number[]) => {
      if (shouldReduceMotion) return 0;
      const e = enter ?? 0;
      const x = exit ?? 0;

      if (isFirst) {
        return -(x * 32); // Se desplaza suavemente hacia arriba al salir
      }
      if (isLast) {
        return 42 * (1 - e); // Entra desde +42px a 0px
      }

      const enterY = 42 * (1 - e); // Viene de abajo (+42px)
      const exitY = -(x * 32);     // Sube hacia arriba (-32px)
      return enterY + exitY;
    }
  );

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <motion.div
        style={{
          opacity,
          scale,
          y,
          transformOrigin: "center 30%",
          willChange: "transform, opacity",
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
