import {CheckCircle2,GitBranch,LineChart,Users} from "lucide-react";
import {instruments,principles} from "@/lib/agenda-data";
const steps = [
  { n: "01", t: "Información compartida", Icon: Users },
  { n: "02", t: "Diagnóstico común", Icon: GitBranch },
  { n: "03", t: "Indicadores comparables", Icon: LineChart },
  { n: "04", t: "Seguimiento progresivo", Icon: CheckCircle2 },
];

export function Methodology(){
 return <section id="metodologia" className="bg-[#0F2942] py-20 text-white">
  <div className="container-page">
   <div className="max-w-3xl"><p className="text-sm font-black uppercase tracking-[.18em] text-emerald-300">¿Cómo llegar al 50/50?</p><h2 className="mt-2 text-4xl font-black">Una metodología común para medir avances.</h2><p className="mt-4 leading-8 text-white/65">El Acuerdo establece que la metodología deberá considerar indicadores objetivos, verificables y comparables para medir progresivamente competencias, sostenibilidad fiscal, gestión institucional y calidad de servicios públicos.</p></div>
   <div className="mt-12 grid gap-4 md:grid-cols-4">{steps.map(({ n, t, Icon }) => <div key={n} className="rounded-[26px] border border-white/10 bg-white/5 p-6"><Icon className="text-emerald-400"/><div className="mt-8 text-xs font-black text-white/40">{n}</div><div className="mt-1 font-black">{t}</div></div>)}</div>
   <div className="mt-12 grid gap-10 lg:grid-cols-2"><div><h3 className="text-xl font-black">Principios</h3><div className="mt-4 flex flex-wrap gap-2">{principles.map(p=><span key={p} className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold">{p}</span>)}</div></div><div><h3 className="text-xl font-black">Instrumentos de implementación</h3><div className="mt-4 grid grid-cols-2 gap-2">{instruments.map((p,i)=><div key={p} className="rounded-xl bg-white/10 p-3 text-sm text-white/75">{i+1}. {p}</div>)}</div></div></div>
  </div>
 </section>
}