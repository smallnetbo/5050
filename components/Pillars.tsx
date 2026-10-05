"use client";

import { useState } from "react";
import {
  ArrowRight,
  X,
  Scale,
  LockOpen,
  Briefcase,
  Landmark,
  PieChart,
  TrendingUp,
  Building2,
  Globe,
  ShieldCheck,
  Coins,
  CheckCircle2,
  FileText,
  Download,
  AlertCircle,
  Clock,
  Layers,
  FileSpreadsheet,
  Users,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import {
  pillars as defaultPillars001,
  pillarsAcuerdo002 as defaultPillars002,
  Pillar,
} from "@/lib/agenda-data";

interface PillarsProps {
  pillars?: Pillar[];
  pillars002?: Pillar[];
}

// Diccionario didáctico con el desglose exacto de cada acción del Acuerdo 002/2026
const acuerdo002ActionDetails: Record<string, { label: string; desc: string }> = {
  "Priorización del sector salud": {
    label: "Priorización del sector salud",
    desc: "Abordar de manera prioritaria la sostenibilidad operativa, infraestructura, equipamiento y financiamiento del sistema de salud en los municipios, promoviendo la articulación intergubernativa para asegurar una atención oportuna e integral a la población.",
  },
  "Competencias y cargas financieras": {
    label: "Competencias y cargas financieras",
    desc: "Revisar el ejercicio efectivo de las competencias entre los niveles de gobierno, identificando duplicidades, vacíos, restricciones, cargas financieras y responsabilidades cuyo financiamiento requiere análisis conforme al régimen competencial y financiero vigente.",
  },
  "Servicios públicos e impacto urbano": {
    label: "Servicios públicos e impacto urbano",
    desc: "Identificar las cargas financieras inmediatas y las brechas operativas vinculadas a servicios esenciales en el municipio: seguridad ciudadana, educación, gestión de residuos sólidos, infraestructura, movilidad urbana y desarrollo económico local.",
  },
  "Gestión metropolitana y conurbación": {
    label: "Gestión metropolitana y conurbación",
    desc: "Consolidar esquemas flexibles de gobernanza e infraestructura compartida para los municipios que forman parte de áreas metropolitanas o procesos de conurbación urbana acelerada.",
  },
  "Simplificación y reporte único": {
    label: "Simplificación y reporte único",
    desc: "Simplificar y articular procedimientos administrativos, promoviendo la interoperabilidad de sistemas y consolidando el principio de reporte único de los GAM hacia el nivel central del Estado.",
  },
  "Transparencia, gestión de datos y rendición de cuentas": {
    label: "Transparencia, gestión de datos y rendición de cuentas",
    desc: "Implementar herramientas de gobierno abierto, indicadores de transparencia y vincular a las alcaldías con el Centro de Datos Autonómicos (CEDIA) y los portales de seguimiento de la Agenda 50/50.",
  },
  "Simplificación de la gestión pública": {
    label: "Simplificación de la gestión pública (Reforma Ley N° 1178 SAFCO)",
    desc: "Evaluar la actualización de la Ley N° 1178 (SAFCO) y de sus subsistemas para simplificar procedimientos administrativos que generan cargas burocráticas y retrasan la inversión pública municipal.",
  },
  "Revisión de normativa restrictiva": {
    label: "Revisión de normativa restrictiva",
    desc: "Identificar la legislación nacional que restrinja o afecte el ejercicio competencial de los GAM o que condicione el destino del gasto local de manera arbitraria.",
  },
  "Cartas orgánicas": {
    label: "Dinamización de Cartas Orgánicas Municipales",
    desc: "Facilitar medidas normativas e institucionales que dinamicen la elaboración, aprobación y entrada en vigencia de las Cartas Orgánicas Municipales pendientes.",
  },
  "Dominio tributario adaptativo": {
    label: "Dominio tributario adaptativo",
    desc: "Evaluar el marco de ingresos propios y herramientas tributarias de adopción progresiva y voluntaria, adaptadas a la capacidad administrativa y recaudatoria de cada GAM.",
  },
  "Relacionamiento internacional y cooperación": {
    label: "Nueva Ley de Relacionamiento Internacional (Sustitución Ley N° 699)",
    desc: "Impulsar una nueva ley que reemplace a la restrictiva Ley N° 699, facilitando cooperación técnica directa, hermanamiento ciudad a ciudad, donaciones, financiamiento externo y endeudamiento de largo plazo mediante mesa técnica especializada.",
  },
  "Inversión y alianzas público-privadas (APP)": {
    label: "Inversión y alianzas público-privadas (APP)",
    desc: "Proponer legislación nacional moderna para viabilizar la participación municipal en esquemas de APP e inversión productiva, bajo criterios de viabilidad técnica y sostenibilidad fiscal.",
  },
  "Gestión laboral municipal": {
    label: "Régimen laboral municipal y contingencias",
    desc: "Revisar el marco normativo aplicable a las relaciones laborales en las alcaldías para solucionar la alta conflictividad y las contingencias por demandas que paralizan cuentas municipales.",
  },
  "Análisis de fuentes": {
    label: "Análisis integral de fuentes y auditoría a Coparticipación",
    desc: "Evaluar la estructura integral de ingresos (transferencias, tributos propios, crédito y concurrencia) y realizar una auditoría técnica profunda a las transferencias de Coparticipación Tributaria de los últimos años.",
  },
  "Distribución fiscal equitativa": {
    label: "Distribución fiscal equitativa con criterios multidimensionales",
    desc: "Estudiar criterios de transferencia fiscal que no solo midan población, sino capacidad fiscal del GAM, esfuerzo recaudatorio, dinamismo económico, Necesidades Básicas Insatisfechas (NBI), IDH y costos reales de servicios urbanos.",
  },
  "Financiamiento innovador modular": {
    label: "Financiamiento innovador modular",
    desc: "Diseñar instrumentos de financiamiento estructurado, emisión de bonos municipales y movilización de capitales como módulos optativos según el perfil crediticio de cada alcaldía.",
  },
  "Gestión presupuestaria eficiente": {
    label: "Gestión presupuestaria sin autorizaciones previas",
    desc: "Sustituir las autorizaciones previas del nivel central por obligaciones de reporte transparente e información fiscal oportuna.",
  },
  "Alivio y readecuación financiera diferenciada": {
    label: "Alivio financiero y readecuación diferenciada (PRFT)",
    desc: "Formular esquemas de respuesta diferenciada, reprogramación de obligaciones y saneamiento fiscal mediante el Programa de Readecuación Financiera Territorial (PRFT).",
  },
  "FPIEEH (Ley N° 767)": {
    label: "Fondo de Hidrocarburos FPIEEH (Ley N° 767 - Plazo 15 días)",
    desc: "Respuesta técnica inmediata de los Ministerios de Hidrocarburos y Economía sobre: a) suspensión del 12% del FPIEEH para la gestión 2027; b) devolución de los recursos de 2025; y c) aplicación progresiva en los años siguientes.",
  },
};

export function Pillars({
  pillars: propPillars001,
  pillars002: propPillars002,
}: PillarsProps = {}) {
  const [activeAgreement, setActiveAgreement] = useState<"001" | "002">("001");
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("Todos");
  const [selectedPillar, setSelectedPillar] = useState<Pillar | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string>("fpieeh");

  const pillars001 =
    propPillars001 && propPillars001.length > 0
      ? propPillars001
      : defaultPillars001;

  const pillars002 =
    propPillars002 && propPillars002.length > 0
      ? propPillars002
      : defaultPillars002;

  const currentList = activeAgreement === "001" ? pillars001 : pillars002;

  const agreementConfig = {
    "001": {
      id: "001",
      name: "Acuerdo N° 001/2026",
      shortLabel: "Gobernaciones",
      title: "Los Pilares Temáticos del Acuerdo N° 001/2026",
      subtitle:
        "El Acuerdo N° 001/2026 prioriza estas materias para fortalecer las autonomías y garantizar la equidad fiscal.",
      categories: ["Todos", "Fiscal", "Competencial", "Institucional", "Normativo"],
      pdfUrl: "/Acuerdo-001-2026-Agenda-50-50.pdf",
      footerNote: "Acuerdo N° 001/2026 de Sucre (5 de agosto de 2026)",
      countLabel: "10 Ejes Departamentales",
    },
    "002": {
      id: "002",
      name: "Acuerdo N° 002/2026",
      shortLabel: "GAM Capitales y El Alto",
      title: "Los Pilares Temáticos del Acuerdo N° 002/2026",
      subtitle:
        "El trabajo técnico entre el Gobierno Nacional y los GAM de Capitales y El Alto se articulará en torno a tres ejes estratégicos.",
      categories: ["Todos", "Institucional", "Normativo", "Fiscal"],
      pdfUrl: "/Acuerdo-002-2026-Agenda-50-50.pdf",
      footerNote: "Acuerdo N° 002/2026 · GAM de Capitales, El Alto y AMB (La Paz, 29 de septiembre de 2026)",
      countLabel: "3 Ejes Estratégicos (19 Acciones)",
    },
  };

  const currentConfig = agreementConfig[activeAgreement];

  const filteredPillars =
    activeCategoryTab === "Todos"
      ? currentList
      : currentList.filter(
          (p) => p.category.toLowerCase() === activeCategoryTab.toLowerCase()
        );

  const getPillarIcon = (name: string) => {
    switch (name) {
      case "Scale":
        return <Scale size={24} />;
      case "LockOpen":
        return <LockOpen size={24} />;
      case "Briefcase":
        return <Briefcase size={24} />;
      case "Landmark":
        return <Landmark size={24} />;
      case "PieChart":
        return <PieChart size={24} />;
      case "TrendingUp":
        return <TrendingUp size={24} />;
      case "Building2":
        return <Building2 size={24} />;
      case "Globe":
        return <Globe size={24} />;
      case "ShieldCheck":
        return <ShieldCheck size={24} />;
      case "Coins":
        return <Coins size={24} />;
      default:
        return <Scale size={24} />;
    }
  };

  const handleSelectAgreement = (agreementId: "001" | "002") => {
    setActiveAgreement(agreementId);
    setActiveCategoryTab("Todos");
    setSelectedPillar(null);
  };

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? "" : id);
  };

  return (
    <section
      id="pilares"
      className="bg-white dark:bg-[#101620] py-20 transition-colors duration-300"
    >
      <div className="container-page">
        {/* Superior Header: Badge y Selector de Pestañas de Acuerdos */}
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-block rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 px-3 py-1.5 text-xs font-black uppercase text-emerald-800 dark:text-emerald-400 tracking-wide">
                Acuerdos
              </span>
            </div>

            {/* Pestañas de Acuerdos (Acuerdo 001 vs Acuerdo 002) */}
            <div
              role="tablist"
              aria-label="Pestañas de Acuerdos de la Agenda 50/50"
              className="flex p-1.5 bg-slate-100 dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-inner max-w-full overflow-x-auto"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeAgreement === "001"}
                onClick={() => handleSelectAgreement("001")}
                className={`flex items-center gap-2.5 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 whitespace-nowrap ${
                  activeAgreement === "001"
                    ? "bg-[#0F2942] text-white dark:bg-emerald-500 dark:text-[#0F2942] shadow-md"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
                }`}
              >
                <Landmark size={16} />
                <span>Acuerdo N° 001/2026</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    activeAgreement === "001"
                      ? "bg-white/20 text-white dark:bg-[#0F2942]/20 dark:text-[#0F2942]"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  Gobernaciones
                </span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeAgreement === "002"}
                onClick={() => handleSelectAgreement("002")}
                className={`flex items-center gap-2.5 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 whitespace-nowrap ${
                  activeAgreement === "002"
                    ? "bg-[#0F2942] text-white dark:bg-emerald-500 dark:text-[#0F2942] shadow-md"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
                }`}
              >
                <Building2 size={16} />
                <span>Acuerdo N° 002/2026</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    activeAgreement === "002"
                      ? "bg-white/20 text-white dark:bg-[#0F2942]/20 dark:text-[#0F2942]"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  Municipios
                </span>
              </button>
            </div>
          </div>

          {/* Banner de Contexto Histórico exclusivo para Acuerdo 002 */}
          {activeAgreement === "002" && (
            <div className="rounded-3xl border border-amber-300/40 dark:border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-sky-500/10 p-6 md:p-8 backdrop-blur-sm shadow-xs">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase text-amber-700 dark:text-amber-300 tracking-wider">
                    <span className="flex items-center gap-1.5 bg-amber-100 dark:bg-amber-950/80 px-2.5 py-1 rounded-md border border-amber-300/50">
                      <Clock size={13} /> 29 de septiembre de 2026 · La Paz
                    </span>
                    <span className="flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-300/50 text-emerald-800 dark:text-emerald-300">
                      <Users size={13} /> 9 Capitales + El Alto + AMB
                    </span>
                    <span className="flex items-center gap-1.5 bg-sky-100 dark:bg-sky-950/80 px-2.5 py-1 rounded-md border border-sky-300/50 text-sky-800 dark:text-sky-300">
                      <Sparkles size={13} /> Censo 2024 & Conurbación
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
                    Pacto Histórico Municipal por la Desburocratización y la Sostenibilidad Urbana
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    A diferencia del esquema tradicional de fórmula única, el <b>Acuerdo N° 002/2026</b> reconoce la heterogeneidad territorial de Bolivia: adopta un <b>enfoque diferenciado y progresivo</b> para responder a las demandas de alta concentración poblacional, servicios urbanos esenciales y metropolización.
                  </p>
                </div>

                <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5">
                  <a
                    href="/Acuerdo-002-2026-Agenda-50-50.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0F2942] dark:bg-emerald-500 hover:bg-slate-800 dark:hover:bg-emerald-400 text-white dark:text-[#0F2942] px-5 py-3 text-xs font-black shadow-md transition"
                  >
                    <Download size={15} />
                    <span>Descargar PDF Oficial (11.7 MB)</span>
                  </a>

                  <a
                    href="#desglose-didactico"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 px-5 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
                  >
                    <BookOpen size={15} className="text-emerald-500" />
                    <span>Explorar Guía Didáctica</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Encabezado Dinámico de la Sección y Filtros por Categoría */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {currentConfig.title}
              </h2>
              <p className="mt-2 text-base text-slate-600 dark:text-slate-300 font-medium">
                {currentConfig.subtitle}
              </p>
            </div>

            {/* Filtros por Categoría y Enlace a PDF Oficial */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap gap-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1.5 border border-slate-200 dark:border-slate-700">
                {currentConfig.categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategoryTab(cat)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-extrabold transition-all ${
                      activeCategoryTab.toLowerCase() === cat.toLowerCase()
                        ? "bg-[#0F2942] text-white dark:bg-emerald-500 dark:text-[#0F2942] shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <a
                href={currentConfig.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-extrabold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/70 transition shadow-xs"
                title={`Descargar ${currentConfig.name} en formato PDF`}
              >
                <Download size={14} className="text-emerald-500" />
                <span>PDF Oficial</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bento Grid Mosaico de Tarjetas */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPillars.map((p) => {
            const sequentialNumber =
              currentList.findIndex((item) => item.id === p.id) + 1;

            return (
              <button
                key={p.id}
                onClick={() => setSelectedPillar(p)}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-[#151D2A] p-7 text-left transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:bg-white dark:hover:bg-slate-800/80 hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0F2942] dark:bg-emerald-500/20 text-emerald-400 border border-transparent dark:border-emerald-500/30 group-hover:bg-emerald-600 dark:group-hover:bg-emerald-500 group-hover:text-white dark:group-hover:text-[#0F2942] transition-colors shadow-xs">
                        {getPillarIcon(p.iconName)}
                      </div>
                      <span className="rounded-full bg-slate-200/70 dark:bg-slate-800 px-3 py-1 text-[11px] font-black uppercase text-slate-700 dark:text-slate-300">
                        {p.category}
                      </span>
                    </div>
                    <span className="text-xs font-black text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      Eje #{String(sequentialNumber).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-medium line-clamp-3">
                    {p.summary}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>Ver acciones acordadas ({p.actions.length})</span>
                  <ArrowRight size={16} />
                </div>
              </button>
            );
          })}
        </div>

        {/* SECCIÓN DIDÁCTICA EXCLUSIVA DEL ACUERDO 002 */}
        {activeAgreement === "002" && (
          <div id="desglose-didactico" className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800 space-y-8 animate-in fade-in">
            {/* Cabecera del desglose didáctico */}
            <div className="max-w-3xl space-y-2">
              <span className="inline-block rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 px-3 py-1.5 text-xs font-black uppercase text-emerald-800 dark:text-emerald-400 tracking-wide">
                Guía Didáctica de Implementación
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Desglose Estructural del Acuerdo N° 002/2026
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Conoce las medidas inmediatas, los compromisos de las mesas técnicas y los 4 anexos oficiales suscritos con las ciudades capitales y El Alto.
              </p>
            </div>

            {/* Tarjeta de Medida Urgente: FPIEEH Ley 767 */}
            <div className="rounded-3xl border-2 border-amber-400/60 dark:border-amber-500/40 bg-gradient-to-br from-amber-50/90 via-white to-amber-100/50 dark:from-[#1A1813] dark:via-[#151D2A] dark:to-[#1E1C16] p-6 sm:p-8 shadow-lg">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-amber-200 dark:border-amber-500/20">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-500 text-white shadow-md">
                    <AlertCircle size={26} />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      Medida Inmediata Prioritaria
                    </span>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white">
                      Fondo de Hidrocarburos FPIEEH (Ley N° 767)
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/30 rounded-2xl px-4 py-2 text-xs font-black text-amber-800 dark:text-amber-300">
                  <Clock size={16} className="text-amber-600 dark:text-amber-400 animate-pulse" />
                  <span>Plazo Mandatorio: 15 Días Calendario</span>
                </div>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-3">
                <div className="rounded-2xl bg-white/80 dark:bg-slate-800/80 p-5 border border-slate-200/80 dark:border-slate-700">
                  <div className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wide">Alternativa A</div>
                  <h5 className="mt-2 text-sm font-black text-slate-900 dark:text-white">Suspensión del 12% para 2027</h5>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                    Suspender la retención del 12% del Impuesto Directo a los Hidrocarburos (IDH) a los Gobiernos Autónomos Municipales para liberar liquidez inmediata.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/80 dark:bg-slate-800/80 p-5 border border-slate-200/80 dark:border-slate-700">
                  <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Alternativa B</div>
                  <h5 className="mt-2 text-sm font-black text-slate-900 dark:text-white">Devolución de Recursos 2025</h5>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                    Evaluar la devolución de los recursos correspondientes a la retención efectuada durante la gestión fiscal 2025 a favor de las cuentas municipales.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/80 dark:bg-slate-800/80 p-5 border border-slate-200/80 dark:border-slate-700">
                  <div className="text-xs font-black text-sky-600 dark:text-sky-400 uppercase tracking-wide">Alternativa C</div>
                  <h5 className="mt-2 text-sm font-black text-slate-900 dark:text-white">Aplicación Progresiva Futura</h5>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                    Establecer un cronograma plurianual de desahogo financiero y ajuste normativo para las siguientes gestiones en acuerdo con el Ministerio de Economía.
                  </p>
                </div>
              </div>
            </div>

            {/* Módulos en Acordeón Interactivo */}
            <div className="space-y-4">
              {/* Acordeón 1: Metodología y Mesas Técnicas */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#151D2A] overflow-hidden transition-all">
                <button
                  type="button"
                  onClick={() => toggleAccordion("metodologia")}
                  className="w-full flex items-center justify-between p-6 sm:p-7 text-left hover:bg-slate-100/60 dark:hover:bg-slate-800/50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Layers size={22} />
                    </div>
                    <div>
                      <span className="text-[11px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                        Estructura Operativa
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                        Mesas Técnicas Continuas y Gobierno de Datos Abiertos
                      </h4>
                    </div>
                  </div>
                  {activeAccordion === "metodologia" ? (
                    <ChevronUp size={20} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={20} className="text-slate-400" />
                  )}
                </button>

                {activeAccordion === "metodologia" && (
                  <div className="p-6 sm:p-7 pt-0 border-t border-slate-200/60 dark:border-slate-800/80 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-4">
                    <p className="leading-relaxed font-medium">
                      El proceso de co-construcción se sustenta en información objetiva, suficiente y compartida entre ambos niveles de gobierno:
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white dark:bg-slate-800/60 p-4 border border-slate-200/80 dark:border-slate-700">
                        <p className="font-black text-slate-900 dark:text-white">Aportes del Gobierno Nacional:</p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Disponibilización transparente de datos sobre finanzas públicas, transferencias, techos presupuestarios y recaudación en tiempo real.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white dark:bg-slate-800/60 p-4 border border-slate-200/80 dark:border-slate-700">
                        <p className="font-black text-slate-900 dark:text-white">Aportes de las Alcaldías:</p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Información socioeconómica del municipio, costos de prestación de servicios esenciales (salud, basura, alumbrado) e indicadores de gestión.
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                      Los productos técnicos se elevarán al Consejo de Coordinación Técnica de la Agenda 50/50 para consolidar el Gran Acuerdo Nacional para las Autonomías.
                    </p>
                  </div>
                )}
              </div>

              {/* Acordeón 2: Paquete de Reformas Normativas */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#151D2A] overflow-hidden transition-all">
                <button
                  type="button"
                  onClick={() => toggleAccordion("reformas")}
                  className="w-full flex items-center justify-between p-6 sm:p-7 text-left hover:bg-slate-100/60 dark:hover:bg-slate-800/50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                      <Scale size={22} />
                    </div>
                    <div>
                      <span className="text-[11px] font-black uppercase text-sky-600 dark:text-sky-400 tracking-wider">
                        Marco Legal Priorizado
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                        Modernización de la Ley SAFCO, Alianzas Público-Privadas y Ley Laboral
                      </h4>
                    </div>
                  </div>
                  {activeAccordion === "reformas" ? (
                    <ChevronUp size={20} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={20} className="text-slate-400" />
                  )}
                </button>

                {activeAccordion === "reformas" && (
                  <div className="p-6 sm:p-7 pt-0 border-t border-slate-200/60 dark:border-slate-800/80 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
                        <span className="font-black text-slate-900 dark:text-white block">Reforma Ley N° 1178 (SAFCO)</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                          Agilización de contrataciones e inversión municipal para evitar la parálisis por trabas administrativas.
                        </span>
                      </div>
                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
                        <span className="font-black text-slate-900 dark:text-white block">Sustitución Ley N° 699</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                          Apertura a cooperación directa ciudad a ciudad, créditos multilaterales y donaciones sin intermediación asfixiante.
                        </span>
                      </div>
                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
                        <span className="font-black text-slate-900 dark:text-white block">Ley Nacional de APP</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                          Seguridad jurídica para asociar capitales privados a obras municipales (transporte, residuos, infraestructura).
                        </span>
                      </div>
                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
                        <span className="font-black text-slate-900 dark:text-white block">Régimen Laboral Municipal</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                          Solución integral a juicios y contingencias laborales que comprometen el patrimonio de las alcaldías.
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Acordeón 3: Criterios para el Nuevo Pacto Fiscal */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#151D2A] overflow-hidden transition-all">
                <button
                  type="button"
                  onClick={() => toggleAccordion("pacto-fiscal")}
                  className="w-full flex items-center justify-between p-6 sm:p-7 text-left hover:bg-slate-100/60 dark:hover:bg-slate-800/50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <Coins size={22} />
                    </div>
                    <div>
                      <span className="text-[11px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                        Sostenibilidad Financiera
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                        Criterios Multidimensionales de Distribución y PRFT
                      </h4>
                    </div>
                  </div>
                  {activeAccordion === "pacto-fiscal" ? (
                    <ChevronUp size={20} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={20} className="text-slate-400" />
                  )}
                </button>

                {activeAccordion === "pacto-fiscal" && (
                  <div className="p-6 sm:p-7 pt-0 border-t border-slate-200/60 dark:border-slate-800/80 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-4">
                    <p className="leading-relaxed font-medium">
                      El nuevo modelo fiscal supera la simple asignación por habitante. Las partes acordaron incorporar los siguientes factores ponderados:
                    </p>
                    <ul className="grid gap-2.5 sm:grid-cols-2">
                      <li className="flex items-start gap-2 bg-white dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/70 dark:border-slate-700">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span><b>Capacidad fiscal y esfuerzo recaudatorio:</b> Incentivos a la eficiencia impositiva local.</span>
                      </li>
                      <li className="flex items-start gap-2 bg-white dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/70 dark:border-slate-700">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span><b>Necesidades Básicas Insatisfechas (NBI) e IDH:</b> Criterios de equidad y compensación social.</span>
                      </li>
                      <li className="flex items-start gap-2 bg-white dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/70 dark:border-slate-700">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span><b>Costos reales de servicios urbanos:</b> Reconocimiento del costo de operar en grandes conurbaciones.</span>
                      </li>
                      <li className="flex items-start gap-2 bg-white dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/70 dark:border-slate-700">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span><b>Auditoría a la Coparticipación Tributaria:</b> Verificación técnica de los montos transferidos en los últimos años.</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Acordeón 4: Los 4 Anexos Técnicos de la AMB */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#151D2A] overflow-hidden transition-all">
                <button
                  type="button"
                  onClick={() => toggleAccordion("anexos")}
                  className="w-full flex items-center justify-between p-6 sm:p-7 text-left hover:bg-slate-100/60 dark:hover:bg-slate-800/50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      <FileSpreadsheet size={22} />
                    </div>
                    <div>
                      <span className="text-[11px] font-black uppercase text-purple-600 dark:text-purple-400 tracking-wider">
                        Documentación Vinculante
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                        Los 4 Anexos Técnicos Oficiales de la AMB
                      </h4>
                    </div>
                  </div>
                  {activeAccordion === "anexos" ? (
                    <ChevronUp size={20} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={20} className="text-slate-400" />
                  )}
                </button>

                {activeAccordion === "anexos" && (
                  <div className="p-6 sm:p-7 pt-0 border-t border-slate-200/60 dark:border-slate-800/80 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-4">
                    <p className="leading-relaxed font-medium">
                      El diagnóstico presentado por la Asociación de Municipalidades de Bolivia (AMB) incluye cuatro instrumentos técnicos de cumplimiento obligatorio:
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
                        <span className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase">Anexo A</span>
                        <h5 className="font-black text-slate-900 dark:text-white mt-1">Propuesta Metodológica de la Agenda 50/50</h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Cronograma y ruta metodológica de mesas de trabajo entre técnicos del MEFP y los GAM.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
                        <span className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase">Anexo B</span>
                        <h5 className="font-black text-slate-900 dark:text-white mt-1">Propuesta de Normativa Priorizada</h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Catálogo de leyes, decretos y resoluciones a ser modificados o derogados de forma urgente.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
                        <span className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase">Anexo C</span>
                        <h5 className="font-black text-slate-900 dark:text-white mt-1">Análisis de Condicionalidad del Gasto</h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Diagnóstico detallado de las cargas financieras nacionales impuestas a los presupuestos municipales.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
                        <span className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase">Anexo D</span>
                        <h5 className="font-black text-slate-900 dark:text-white mt-1">Matriz de Reforma del Régimen Laboral</h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Propuesta de reordenamiento de relaciones laborales aplicable a las entidades municipales.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Banner de Descarga del Documento Original Escaneado */}
            <div className="rounded-3xl bg-[#0F2942] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
                  <FileText size={14} /> Documento Oficial Completo Firmado
                </div>
                <h4 className="text-xl sm:text-2xl font-black">
                  Acuerdo N° 002/2026 · Agenda 50/50
                </h4>
                <p className="text-xs text-slate-300 max-w-xl">
                  Descarga la versión íntegra en PDF (11.7 MB) con las firmas del Presidente del Estado, Ministros de Estado y las Alcaldesas y Alcaldes de Sucre, La Paz, Cochabamba, Oruro, Potosí, Tarija, Santa Cruz, Trinidad, Cobija y El Alto.
                </p>
              </div>

              <a
                href="/Acuerdo-002-2026-Agenda-50-50.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#0F2942] font-black px-6 py-3.5 text-xs sm:text-sm shadow-lg transition"
              >
                <Download size={18} />
                <span>Descargar PDF Oficial</span>
              </a>
            </div>
          </div>
        )}

        {/* Modal Detallado de Eje / Acciones Acordadas */}
        {selectedPillar && (
          <div
            className="fixed inset-0 z-[100] grid place-items-center bg-[#0F2942]/70 dark:bg-black/80 backdrop-blur-md p-4 animate-in fade-in"
            onClick={() => setSelectedPillar(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[32px] bg-white dark:bg-[#151D2A] p-8 shadow-2xl border border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 px-2.5 py-1 text-xs font-black uppercase text-emerald-800 dark:text-emerald-400">
                      Eje #
                      {String(
                        currentList.findIndex(
                          (item) => item.id === selectedPillar.id
                        ) + 1
                      ).padStart(2, "0")}{" "}
                      · {selectedPillar.category}
                    </span>
                  </div>
                  <h3 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                    {selectedPillar.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedPillar(null)}
                  className="rounded-full bg-slate-100 dark:bg-slate-800 p-2.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                  aria-label="Cerrar modal"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                    Resumen de la Medida
                  </h4>
                  <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                    {selectedPillar.summary}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                    Acciones Acordadas ({selectedPillar.actions.length} Compromisos Concretos)
                  </h4>
                  <ul className="mt-3 space-y-3">
                    {selectedPillar.actions.map((act, i) => {
                      const detail = activeAgreement === "002" ? acuerdo002ActionDetails[act] : null;

                      return (
                        <li
                          key={i}
                          className="flex flex-col gap-1 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200 font-medium bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800"
                        >
                          <div className="flex items-start gap-2.5">
                            <CheckCircle2
                              size={18}
                              className="text-emerald-500 shrink-0 mt-0.5"
                            />
                            <div>
                              <span className="font-extrabold text-slate-900 dark:text-white">
                                {detail ? detail.label : act}
                              </span>
                              {detail && (
                                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                                  {detail.desc}
                                </p>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">
                  {currentConfig.footerNote}
                </span>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <a
                    href={currentConfig.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    <Download size={14} className="text-emerald-500" />
                    <span>Descargar PDF</span>
                  </a>

                  <button
                    onClick={() => setSelectedPillar(null)}
                    className="rounded-xl bg-[#0F2942] dark:bg-emerald-500 hover:bg-slate-800 dark:hover:bg-emerald-400 text-white dark:text-[#0F2942] px-5 py-2.5 text-xs font-extrabold transition"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}