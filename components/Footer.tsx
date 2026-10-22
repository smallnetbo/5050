"use client";

import { ShieldCheck, Mail } from "lucide-react";
import { DEFAULT_PAGE_SECTIONS, PageSectionItem } from "@/lib/sections-config";

interface FooterProps {
  sections?: PageSectionItem[];
}

export function Footer({ sections }: FooterProps = {}) {
  const activeSections = (sections && sections.length > 0 ? sections : DEFAULT_PAGE_SECTIONS).filter(
    (s) => s.enabled
  );
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
              Plataforma de Transparencia Activa, Seguimiento y Monitoreo de los Acuerdos de la Agenda 50/50. Gobernaciones, Municipios, AIOC y Gran Chaco.
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
              {activeSections.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    className="hover:text-[#c79d47] transition flex items-center gap-1.5"
                  >
                    {s.isMail && <Mail size={12} className="text-emerald-400" />}
                    <span>{s.footerLabel}</span>
                  </a>
                </li>
              ))}
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
            <a href="#co-construccion" className="hover:text-amber-200">Co-construcción Ciudadana</a>
            <a href="#descargas" className="hover:text-amber-200">Aviso de Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
}