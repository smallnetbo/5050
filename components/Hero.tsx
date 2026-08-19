"use client";

import { useState } from "react";
import { FileText, Map, Clock, Play, ShieldCheck, CheckCircle2, Building, X } from "lucide-react";

export function Hero() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  return (
    <section id="acuerdo" className="relative overflow-hidden bg-[#1B2533] py-20 lg:py-28 text-white">
      {/* Background Gold & Green Ambient Glows */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-[#C59B27]/15 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-96 w-96 rounded-full bg-[#2D8A4E]/20 blur-3xl pointer-events-none"></div>

      <div className="container-page relative z-10">
        {/* Top Institutional Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#C59B27]/40 bg-[#C59B27]/10 px-4 py-1.5 backdrop-blur-md">
          <span className="flex h-2.5 w-2.5 rounded-full bg-[#C59B27] animate-pulse"></span>
          <span className="text-xs font-black uppercase tracking-widest text-amber-200">
            Acuerdo N° 001/2026 · Sucre, 5 de Agosto de 2026
          </span>
        </div>

        <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Main Title & Slogan from official poster */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="inline-block rounded-xl bg-gradient-to-r from-[#C59B27] to-[#D4AF37] text-slate-950 font-black text-3xl sm:text-4xl px-4 py-1 tracking-tight shadow-md">
                50 / 50
              </div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl leading-[1.15] text-white">
                UNA NUEVA RELACIÓN <br />
                <span className="text-[#38A169] drop-shadow-xs">
                  CON MÁS AUTONOMÍA PARA MÁS DESARROLLO
                </span>
              </h1>
              <div className="h-1 w-20 bg-[#C59B27] rounded-full mt-3"></div>
            </div>

            <p className="text-base sm:text-lg leading-relaxed text-slate-300 max-w-2xl font-medium">
              <strong className="text-amber-200">Más autonomía, Más capacidad de decisión.</strong> Estrategia de Estado para la distribución equitativa de ingresos, la autonomía tributaria, la sostenibilidad fiscal y la desconcentración efectiva del gasto entre el Nivel Central y las Regiones.
            </p>

            {/* Action CTAs */}
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="#descargas"
                className="flex items-center gap-2 rounded-2xl bg-[#2D8A4E] hover:bg-[#247340] text-white font-extrabold px-5 py-3.5 text-sm shadow-lg shadow-emerald-900/30 hover:shadow-emerald-900/40 transition-all transform hover:-translate-y-0.5"
              >
                <FileText size={18} />
                <span>Leer Acuerdo 001/2026</span>
              </a>

              <a
                href="#territorio"
                className="flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-extrabold px-5 py-3.5 text-sm transition-all"
              >
                <Map size={18} className="text-[#C59B27]" />
                <span>Explorar Datos Deptos</span>
              </a>

              <a
                href="#ruta"
                className="flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-extrabold px-5 py-3.5 text-sm transition-all"
              >
                <Clock size={18} className="text-amber-300" />
                <span>Ver Cronograma</span>
              </a>
            </div>

            {/* Key Fact Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-bold text-slate-300 border-t border-white/10">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#C59B27]" />
                <span>9 de 9 GAD Adheridos</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#38A169]" />
                <span>Meta 2027: Ley Coparticipación</span>
              </div>
              <div className="flex items-center gap-2">
                <Building size={16} className="text-amber-300" />
                <span>Municipios, AIOC & Gran Chaco</span>
              </div>
            </div>
          </div>

          {/* Right Video / Bento Feature Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-[32px] border border-[#C59B27]/30 bg-white/5 p-6 backdrop-blur-xl shadow-2xl overflow-hidden group">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 grid place-items-center border border-white/10">
                {/* Visual Backdrop Video Preview */}
                <video
                  src={encodeURI("/videos/La Agenda 50-50 impulsa propuestas para fortalecer las autonomías y construir un Estado más eficiente, con la participación de municipios y autoridades de todo el país.mp4")}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B2533] via-transparent to-transparent"></div>

                {/* Play Button Trigger */}
                <button
                  onClick={() => setVideoModalOpen(true)}
                  className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-[#C59B27] text-[#1B2533] shadow-xl hover:bg-amber-400 group-hover:scale-110 transition-transform cursor-pointer font-bold"
                  aria-label="Reproducir Resumen Audiovisual del Acuerdo"
                >
                  <Play size={28} className="fill-current ml-1" />
                </button>

                <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-end">
                  <div>
                    <span className="rounded-md bg-[#2D8A4E] px-2 py-0.5 text-[10px] font-black uppercase text-white">
                      Video Oficial 50/50
                    </span>
                    <h3 className="text-sm font-black text-white mt-1">Fortalecimiento de las Autonomías</h3>
                  </div>
                  <span className="text-xs font-bold text-amber-200 bg-[#1B2533]/90 px-2 py-1 rounded-md border border-[#C59B27]/30">
                    MP4 HD
                  </span>
                </div>
              </div>

              {/* Sub-card highlights */}
              <div className="mt-5 grid grid-cols-2 gap-3 text-left">
                <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Sede Histórica</div>
                  <div className="text-xs font-black text-amber-300 mt-0.5">Casa de la Libertad</div>
                </div>
                <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Plazo Ley 154</div>
                  <div className="text-xs font-black text-[#38A169] mt-0.5">90 Días Calendario</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal Player */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-[#1B2533]/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-4xl rounded-3xl bg-[#1B2533] p-4 border border-[#C59B27]/40 shadow-2xl relative">
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute -top-4 -right-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#C59B27] text-[#1B2533] font-bold shadow-lg hover:bg-amber-400 transition"
            >
              <X size={20} />
            </button>
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black grid place-items-center">
              <video
                src={encodeURI("/videos/La Agenda 50-50 impulsa propuestas para fortalecer las autonomías y construir un Estado más eficiente, con la participación de municipios y autoridades de todo el país.mp4")}
                controls
                autoPlay
                className="w-full h-full object-contain"
              ></video>
            </div>
            <div className="mt-4 flex justify-between items-center px-2">
              <div>
                <h3 className="text-lg font-black text-white">La Agenda 50-50 impulsa propuestas para fortalecer las autonomías</h3>
                <p className="text-xs text-amber-200/80">Construyendo un Estado más eficiente con la participación de municipios y autoridades de todo el país.</p>
              </div>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20"
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