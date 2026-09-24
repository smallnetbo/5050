"use client";

import { ShieldCheck, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1B2533] text-white pt-16 pb-8 border-t border-[#c79d47]/30">
      <div className="container-page">
        <div className="grid gap-10 md:grid-cols-12 pb-12 border-b border-white/10">
          {/* Col 1: Identity & Description */}
          <div className="md:col-span-5 space-y-4">
            <a href="#" className="flex items-center">
              <img
                src="/assets/isologo.svg"
                alt="Agenda 50/50"
                className="h-10 w-auto brightness-0 invert"
              />
            </a>

            <p className="text-xs leading-relaxed text-slate-300 max-w-md font-medium">
              Plataforma de Transparencia Activa y Monitoreo del Acuerdo N° 001/2026 (Sucre, 5 de agosto de 2026). Gobernaciones, Municipios, AIOC y Gran Chaco.
            </p>

            <div className="flex items-center gap-2 text-xs font-bold text-[#3ac167]">
              <ShieldCheck size={16} />
              <span>Garantía de Datos Abiertos y Accesibilidad WCAG 2.1 AA</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-200/80">Navegación del Portal</h4>
            <ul className="space-y-2 text-xs font-bold text-slate-300">
              <li><a href="#acuerdo" className="hover:text-[#c79d47] transition">Inicio</a></li>
              <li><a href="#conceptos" className="hover:text-[#c79d47] transition">Conceptos</a></li>
              <li><a href="#monitor" className="hover:text-[#c79d47] transition">Monitor 50/50</a></li>
              <li><a href="#prensa" className="hover:text-[#c79d47] transition">Prensa</a></li>
              <li><a href="#pilares" className="hover:text-[#c79d47] transition">Pilares</a></li>
              <li><a href="#ruta" className="hover:text-[#c79d47] transition">Ruta</a></li>
              <li><a href="#multimedia" className="hover:text-[#c79d47] transition">Multimedia</a></li>
              <li><a href="#descargas" className="hover:text-[#c79d47] transition">Documentos</a></li>
              <li><a href="#faq" className="hover:text-[#c79d47] transition">FAQ</a></li>
            </ul>
          </div>

          {/* Col 3: Institutional Links & Contact */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-200/80">Contacto e Instituciones</h4>
            <div className="text-xs space-y-2 text-slate-300 font-medium">
              <p><b>Entidades</b></p>
              <p>Estado Plurinacional de Bolivia</p>
              <p className="flex items-center gap-2 text-[#3ac167] font-bold"><Mail size={14} /> correo</p>
              <p className="text-[#fcc74f] font-black text-sm pt-2">#SiempreBolivia</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-400">
          <p>© 2026 Agenda 50/50 · Bolivia.</p>
          <div className="flex gap-4">
            <a href="#faq" className="hover:text-amber-200">Preguntas Frecuentes</a>
            <a href="#descargas" className="hover:text-amber-200">Aviso de Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
}