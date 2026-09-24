"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Map, ShieldCheck, CheckCircle2, Building, X, ArrowRight } from "lucide-react";
import { AnimatedIsologo } from "./AnimatedIsologo";

export function Hero() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoUrl = encodeURI(
    "/videos/La Agenda 50-50 impulsa propuestas para fortalecer las autonomías y construir un Estado más eficiente, con la participación de municipios y autoridades de todo el país.mp4"
  );

  useEffect(() => {
    if (videoModalOpen && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [videoModalOpen]);

  return (
    <section id="acuerdo" className="relative h-[calc(100vh-4rem)] flex flex-col justify-between bg-[#FAF8F5] dark:bg-[#101620] text-[#1B2533] dark:text-white transition-colors duration-500 overflow-hidden">
      {/* Background Subtle Radial Glow & Canvas Texture */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#c79d47]/20 via-[#dd3146]/10 to-[#3ac167]/10 dark:from-[#dd3146]/15 dark:via-[#c79d47]/15 dark:to-transparent rounded-full blur-3xl pointer-events-none transition-colors duration-500"></div>

      {/* Main Cover Content */}
      <div className="container-page relative z-10 flex-1 my-auto py-6 sm:py-8 flex flex-col items-center justify-center">
        {/* Animated Isologo: Full emblem + official typography in one cohesive graphic */}
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

      {/* Official Bolivia Flag Tricolor Stripe at the Bottom (Red - Yellow - Green) */}
      <div className="relative w-full h-3.5 flex shadow-sm shrink-0">
        <div className="w-1/3 h-full bg-[#dd3146]"></div>
        <div className="w-1/3 h-full bg-[#fcc74f]"></div>
        <div className="w-1/3 h-full bg-[#3ac167]"></div>
      </div>

      {/* Video Modal Player */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg rounded-3xl bg-[#1B2533] p-4 border border-[#c79d47]/40 shadow-2xl relative flex flex-col items-center">
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute -top-3 -right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#dd3146] text-white font-bold shadow-lg hover:bg-red-700 transition"
              aria-label="Cerrar video"
            >
              <X size={20} />
            </button>
            <div className="w-full max-h-[75vh] aspect-[9/16] rounded-2xl overflow-hidden bg-black flex items-center justify-center relative shadow-inner">
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              ></video>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 w-full px-2">
              <div>
                <h3 className="text-sm sm:text-base font-black text-white leading-tight">
                  La Agenda 50-50 impulsa propuestas para fortalecer las autonomías
                </h3>
                <p className="text-[11px] text-amber-200/80 mt-0.5">
                  Construyendo un Estado más eficiente con la participación de municipios y autoridades de todo el país.
                </p>
              </div>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="rounded-xl bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-white/20 self-end sm:self-auto shrink-0"
              >
                Cerrar Reproductor
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}