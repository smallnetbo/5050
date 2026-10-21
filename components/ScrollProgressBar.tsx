"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * ScrollProgressBar: Barra de lectura global con degradado tricolor y resplandor sutil
 * que acompaña la navegación en tiempo real.
 */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] pointer-events-none overflow-hidden">
      <motion.div
        style={{ scaleX, transformOrigin: "0%" }}
        className="h-full w-full bg-gradient-to-r from-[#dd3146] via-[#fcc74f] to-[#3ac167] shadow-[0_0_12px_rgba(58,193,103,0.8)]"
      />
    </div>
  );
}
