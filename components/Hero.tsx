"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { AnimatedIsologo } from "./AnimatedIsologo";
import { ModalPortal } from "./ModalPortal";

export function Hero() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoUrl = encodeURI(
    "https://agenda50-50.sea.gob.bo/uploads/multimedia/portales-para-conocer-y-acompa-ar-la-agenda-5050-1790958262441-1795447496248.mp4"
  );

  useEffect(() => {
    if (!videoModalOpen) return;

    // Reproducir video y bloquear scroll del fondo
    videoRef.current?.play().catch(() => { });
    document.body.style.overflow = "hidden";

    // Cerrar con la tecla Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setVideoModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [videoModalOpen]);

  return (
    <section
      id="acuerdo"
      className="relative h-[calc(100vh-4rem)] flex flex-col justify-between bg-[#FAF8F5] dark:bg-[#101620] text-[#1B2533] dark:text-white transition-colors duration-500 overflow-hidden"
    >
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#c79d47]/20 via-[#dd3146]/10 to-[#3ac167]/10 dark:from-[#dd3146]/15 dark:via-[#c79d47]/15 dark:to-transparent rounded-full blur-3xl pointer-events-none transition-colors duration-500" />

      {/* Main Cover Content */}
      <div className="container-page relative z-10 flex-1 my-auto py-6 sm:py-8 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-lg sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto flex flex-col items-center justify-center group cursor-pointer"
          onClick={() => setVideoModalOpen(true)}
          title="Hacer clic para ver el video oficial de la Agenda 50/50"
        >
          <AnimatedIsologo
            variant="full"
            className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </motion.div>
      </div>

      {/* Official Bolivia Flag Tricolor Stripe */}
      <div className="relative w-full h-3.5 flex shadow-sm shrink-0">
        <div className="w-1/3 h-full bg-[#dd3146]" />
        <div className="w-1/3 h-full bg-[#fcc74f]" />
        <div className="w-1/3 h-full bg-[#3ac167]" />
      </div>

      {/* Fullscreen Video Modal Player */}
      {videoModalOpen && (
        <ModalPortal>
          <div className="fixed inset-0 z-[200] w-screen h-screen bg-black flex flex-col animate-in fade-in">
            {/* Botón cerrar flotante */}
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-[#dd3146] text-white shadow-lg hover:bg-red-700 transition cursor-pointer"
              aria-label="Cerrar video"
            >
              <X size={22} />
            </button>

            {/* Contenedor del video a pantalla completa */}
            <div className="flex-1 w-full min-h-0 flex items-center justify-center bg-black">
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            {/* Barra inferior con título */}
            <div className="shrink-0 w-full bg-[#1B2533]/95 border-t border-[#c79d47]/30 px-4 py-3 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="text-sm sm:text-base font-black text-white leading-tight">
                  La Agenda 50-50 impulsa propuestas para fortalecer las autonomías
                </h3>
                <p className="text-[11px] sm:text-xs text-amber-200/80 mt-0.5">
                  Construyendo un Estado más eficiente con la participación de municipios y autoridades de todo el país.
                </p>
              </div>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20 self-end sm:self-auto shrink-0 cursor-pointer"
              >
                Cerrar Reproductor
              </button>
            </div>
          </div>
        </ModalPortal>
      )}
    </section>
  );
}