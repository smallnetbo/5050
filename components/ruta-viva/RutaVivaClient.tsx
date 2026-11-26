"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Film,
  Share2,
  ArrowLeft,
  BookOpen,
  Compass,
} from "lucide-react";
import { DepartmentData, Milestone, MediaItem, DocumentItem } from "@/lib/agenda-data";
import { BoardCommitmentItem } from "@/lib/board-commitments-data";
import { BoliviaTerritorialMap } from "./BoliviaTerritorialMap";
import { AudiovisualTimeline } from "./AudiovisualTimeline";
import { SocialKitStudio } from "./SocialKitStudio";
import { ExecutiveTraceability } from "@/components/commitments/ExecutiveTraceability";

interface RutaVivaClientProps {
  departments: DepartmentData[];
  milestones: Milestone[];
  mediaItems: MediaItem[];
  documents: DocumentItem[];
  boardCommitments: BoardCommitmentItem[];
}

export function RutaVivaClient({
  departments,
  milestones,
  mediaItems,
  documents,
  boardCommitments,
}: RutaVivaClientProps) {
  return (
    <div className="min-h-screen bg-[#FAF8F3] dark:bg-[#101620] text-[#1B2533] dark:text-slate-100 transition-colors duration-300">
      {/* Sub-barra sticky de navegación por módulos */}
      <div className="sticky top-16 z-40 border-b border-amber-900/10 dark:border-slate-800 bg-[#FAF8F3]/90 dark:bg-[#101620]/90 backdrop-blur-md">
        <div className="container-page flex items-center justify-between gap-4 py-2.5 overflow-x-auto custom-scrollbar">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-600 dark:text-slate-300 hover:text-[#3ac167] shrink-0"
          >
            <ArrowLeft size={14} /> Portal Principal
          </Link>

          <nav className="flex items-center gap-2">
            <a
              href="#mapa-territorial"
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:bg-amber-100/60 dark:hover:bg-slate-800"
            >
              <MapPin size={13} className="text-[#dd3146]" /> 1. Mapa Territorial
            </a>
            <a
              href="#linea-audiovisual"
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:bg-amber-100/60 dark:hover:bg-slate-800"
            >
              <Film size={13} className="text-[#3ac167]" /> 2. Línea Audiovisual
            </a>
            <a
              href="#kit-redes"
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:bg-amber-100/60 dark:hover:bg-slate-800"
            >
              <Share2 size={13} className="text-[#c79d47]" /> 3. Kit Redes y Prensa
            </a>
          </nav>

          <Link
            href="/revista"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1B2533] hover:bg-slate-800 dark:bg-[#c79d47] dark:text-[#101620] px-3 py-1.5 text-xs font-black text-white shrink-0 transition"
          >
            <BookOpen size={13} /> Revista 50/50
          </Link>
        </div>
      </div>

      {/* Hero Portada Ruta Viva */}
      <section className="relative overflow-hidden border-b border-amber-900/10 dark:border-slate-800 py-12 sm:py-16">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="container-page relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-400/40 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
              <Compass size={14} /> Experiencia Multimedia Territorial · Ruta Viva 50/50
            </div>
            <h1 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight text-[#1B2533] dark:text-white leading-[1.1]">
              Bolivia en Movimiento:{" "}
              <span className="green-gradient-text">Ruta Viva 50/50</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              Recorre las 6 sedes territoriales de los acuerdos, explora los {milestones.length} hitos
              audiovisuales sincronizados y descarga placas en alta resolución (9:16 y 1:1) listas para
              TikTok, Reels, WhatsApp y prensa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Franja Tricolor */}
      <div className="w-full h-2 flex">
        <div className="w-1/3 bg-[#dd3146]" />
        <div className="w-1/3 bg-[#fcc74f]" />
        <div className="w-1/3 bg-[#3ac167]" />
      </div>

      {/* 3 Módulos Integrados */}
      <div className="container-page py-12 space-y-20">
        <section id="mapa-territorial" className="scroll-mt-32 space-y-6">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#dd3146]">
              Módulo 01 · Mapa Interactivo Territorial
            </span>
            <h2 className="mt-1 text-3xl font-black">
              Las 6 sedes clave y los 9 departamentos del pacto
            </h2>
          </div>
          <BoliviaTerritorialMap departments={departments} />
        </section>

        <section
          id="linea-audiovisual"
          className="scroll-mt-32 space-y-6 pt-10 border-t border-amber-900/10 dark:border-slate-800"
        >
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#3ac167]">
              Módulo 02 · Línea de Tiempo Audiovisual Sincronizada
            </span>
            <h2 className="mt-1 text-3xl font-black">
              {milestones.length} hitos conectados con video, fotografía y PDF oficial
            </h2>
          </div>
          <AudiovisualTimeline
            milestones={milestones}
            mediaItems={mediaItems}
            documents={documents}
          />
        </section>

        <section
          id="semaforizacion-trazabilidad"
          className="scroll-mt-32 space-y-6 pt-10 border-t border-amber-900/10 dark:border-slate-800"
        >
          <ExecutiveTraceability
            commitments={boardCommitments}
            documents={documents}
            mode="standalone"
          />
        </section>

        <section
          id="kit-redes"
          className="scroll-mt-32 space-y-6 pt-10 border-t border-amber-900/10 dark:border-slate-800"
        >
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#c79d47]">
              Módulo 03 · Estudio / Kit de Cápsulas para Redes y Prensa
            </span>
            <h2 className="mt-1 text-3xl font-black">
              Placas dinámicas listas para TikTok, Instagram, WhatsApp y prensa
            </h2>
          </div>
          <SocialKitStudio
            commitments={boardCommitments}
            milestones={milestones}
            documents={documents}
          />
        </section>
      </div>
    </div>
  );
}
