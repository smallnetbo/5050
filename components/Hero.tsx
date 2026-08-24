"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Map, Play, ShieldCheck, CheckCircle2, Building, X, ArrowRight } from "lucide-react";
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
    <section id="acuerdo" className="relative min-h-[85vh] flex flex-col justify-between bg-[#F9F8F5] dark:bg-[#750A23] text-[#1B2533] dark:text-white transition-colors duration-500 overflow-hidden">
      {/* Background Subtle Radial Glow & Canvas Texture */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-amber-100/30 via-red-50/20 to-emerald-50/20 dark:from-red-950/40 dark:via-amber-950/30 dark:to-transparent rounded-full blur-3xl pointer-events-none transition-colors duration-500"></div>

      {/* Main Cover Content */}
      <div className="container-page relative z-10 my-auto py-12 lg:py-20">
        {/* Central Logo & Brand Typography Block matching the image */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-10 text-center md:text-left">

          {/* Animated Isologo Symbol & Interactive Video Cover Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center gap-3 flex-shrink-0 cursor-pointer group"
            onClick={() => setVideoModalOpen(true)}
            title="Hacer clic para ver video oficial"
          >
            <AnimatedIsologo className="w-56 h-56 sm:w-72 sm:h-72 lg:w-96 lg:h-96 transition-transform duration-500 group-hover:scale-105" />
            
            {/* Centered Play Button below the logo */}
            <div className="flex items-center gap-2 rounded-full bg-[#84131D]/90 dark:bg-[#C9232F]/90 text-white px-5 py-2.5 text-xs font-black shadow-xl backdrop-blur-md group-hover:scale-105 transition-all border border-amber-400/40 mt-1">
              <Play size={16} className="fill-current text-amber-300 ml-0.5 animate-pulse" />
              <span>Ver Video Oficial</span>
            </div>
          </motion.div>

          {/* Vertical Red Divider Line */}
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
            className="hidden md:block h-36 lg:h-52 w-1.5 bg-[#84131D] dark:bg-white rounded-full flex-shrink-0 transition-colors duration-500"
          ></motion.div>

          {/* Brand Title & Tagline */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
            className="flex flex-col justify-center max-w-xl font-geometria"
          >
            <span className="block font-geometria font-medium tracking-[0.2em] text-[#84131D] dark:text-white text-2xl sm:text-3xl lg:text-[2.6rem] uppercase leading-tight transition-colors duration-500">
              AGENDA
            </span>

            {/* 50/50 Brand Logo with barra.svg */}
            <div className="flex items-center justify-center md:justify-start text-[#84131D] dark:text-white text-6xl sm:text-7xl lg:text-9xl font-geometria font-bold tracking-tighter leading-none my-0.5 transition-colors duration-500">
              <span className="font-geometria font-bold">50</span>
              <img
                src="/assets/barra.svg"
                alt="|"
                className="h-[0.72em] w-auto inline-block self-center mx-1 sm:mx-1.5 select-none transition-all duration-500 dark:brightness-0 dark:invert"
              />
              <span className="font-geometria font-bold">50</span>
            </div>

            {/* UNA NUEVA BOLIVIA Tagline */}
            <p className="font-geometria font-bold tracking-[0.42em] text-[#84131D] dark:text-white text-xs sm:text-sm lg:text-base uppercase pt-0.5 transition-colors duration-500">
              UNA NUEVA BOLIVIA
            </p>
          </motion.div>
        </div>

      </div>

      {/* Official Bolivia Flag Tricolor Stripe at the Bottom (Red - Yellow - Green) */}
      <div className="relative w-full h-3.5 flex">
        <div className="w-1/3 h-full bg-[#C9232F]"></div>
        <div className="w-1/3 h-full bg-[#FACA38]"></div>
        <div className="w-1/3 h-full bg-[#3BA83E]"></div>
      </div>

      {/* Video Modal Player */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg rounded-3xl bg-[#1B2533] p-4 border border-[#C59B27]/40 shadow-2xl relative flex flex-col items-center">
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute -top-3 -right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#C9232F] text-white font-bold shadow-lg hover:bg-red-700 transition"
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