"use client";

import { ShieldCheck, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1B2533] text-white pt-16 pb-8 border-t border-[#C59B27]/30">
      <div className="container-page">
        <div className="grid gap-10 md:grid-cols-12 pb-12 border-b border-white/10">
          {/* Col 1: Identity & Description */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-2xl bg-gradient-to-br from-[#C59B27] via-[#D4AF37] to-[#A37D1A] text-slate-950 font-black text-lg shadow-md">
                50
              </div>
              <span className="font-black text-xl tracking-tight text-white">
                AGENDA <span className="text-[#C59B27]">50/50</span>
              </span>
            </div>

            <p className="text-xs leading-relaxed text-slate-300 max-w-md font-medium">
              Plataforma Oficial de Transparencia Activa y Monitoreo del Acuerdo N° 001/2026 (Sucre, 5 de agosto de 2026). Ministerio de Economía y Finanzas Públicas · Gobernaciones, Municipios, AIOC y Gran Chaco.
            </p>

            <div className="flex items-center gap-2 text-xs font-bold text-[#38A169]">
              <ShieldCheck size={16} />
              <span>Garantía de Datos Abiertos y Accesibilidad WCAG 2.1 AA</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-200/80">Navegación del Portal</h4>
            <ul className="space-y-2 text-xs font-bold text-slate-300">
              <li><a href="#acuerdo" className="hover:text-[#C59B27] transition">El Acuerdo de Sucre</a></li>
              <li><a href="#pilares" className="hover:text-[#C59B27] transition">Los 10+ Pilares Temáticos</a></li>
              <li><a href="#monitor" className="hover:text-[#C59B27] transition">Monitor 50/50 y Simulador</a></li>
              <li><a href="#ruta" className="hover:text-[#C59B27] transition">Cronograma y Ley 154</a></li>
              <li><a href="#descargas" className="hover:text-[#C59B27] transition">Centro de Descargas (PDF)</a></li>
            </ul>
          </div>

          {/* Col 3: Institutional Links & Contact */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-200/80">Contacto e Instituciones</h4>
            <div className="text-xs space-y-2 text-slate-300 font-medium">
              <p><b>Ministerio de Economía y Finanzas Públicas</b></p>
              <p>Estado Plurinacional de Bolivia</p>
              <p className="flex items-center gap-2 text-[#38A169] font-bold"><Mail size={14} /> contacto@economia.gob.bo</p>
              <p className="text-amber-300 font-black text-sm pt-2">#SiempreBolivia</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-400">
          <p>© 2026 Agenda 50/50 · Ministerio de Economía y Finanzas Públicas · Bolivia.</p>
          <div className="flex gap-4">
            <a href="#faq" className="hover:text-amber-200">Preguntas Frecuentes</a>
            <a href="#descargas" className="hover:text-amber-200">Aviso de Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
}