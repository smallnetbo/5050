"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Send, CheckCircle2, MessageSquare, ShieldCheck } from "lucide-react";
import { faqList } from "@/lib/agenda-data";

export function CitizenFeedback() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [proposalSent, setProposalSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "La Paz",
    organization: "",
    proposal: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.proposal) {
      setProposalSent(true);
      setTimeout(() => {
        setFormData({ name: "", email: "", department: "La Paz", organization: "", proposal: "" });
      }, 3000);
    }
  };

  return (
    <section id="faq" className="bg-white py-20 border-t border-slate-200">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Left Column: Interactive FAQ Accordion */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-black uppercase text-emerald-800">
                Pedagogía & Transparencia Ciudadana
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Preguntas Frecuentes sobre la Agenda 50/50
              </h2>
              <p className="mt-2 text-base text-slate-600 font-medium">
                Resolvemos las principales dudas sobre el pacto fiscal, el presupuesto y los derechos de las regiones.
              </p>
            </div>

            <div className="space-y-3">
              {faqList.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden transition"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex justify-between items-center p-5 text-left font-black text-slate-900 text-base"
                    >
                      <span className="flex items-center gap-3">
                        <HelpCircle className="text-emerald-600 shrink-0" size={20} />
                        {faq.question}
                      </span>
                      {isOpen ? <ChevronUp className="text-slate-400 shrink-0" size={20} /> : <ChevronDown className="text-slate-400 shrink-0" size={20} />}
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-0 text-sm leading-relaxed text-slate-600 font-medium border-t border-slate-200/60 mt-1">
                        <p className="pt-3">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Proposal Submission Form */}
          <div className="lg:col-span-5">
            <div className="rounded-[34px] border border-slate-200 bg-slate-50 p-8 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-600 mb-2">
                <MessageSquare size={16} /> Co-construcción Ciudadana
              </div>
              <h3 className="text-2xl font-black text-slate-900">Buzón de Propuestas y Aportes</h3>
              <p className="text-xs text-slate-600 font-medium mt-1 mb-6">
                Envía tus sugerencias o propuestas institucionales para ser evaluadas por las Mesas Técnicas.
              </p>

              {proposalSent ? (
                <div className="rounded-2xl bg-emerald-500 text-white p-6 text-center space-y-2 animate-in fade-in">
                  <CheckCircle2 size={40} className="mx-auto" />
                  <h4 className="text-lg font-black">¡Propuesta Recibida Exitosamente!</h4>
                  <p className="text-xs text-emerald-100 font-medium">
                    Tu aporte ha sido derivado a la Secretaría Técnica del Consejo Nacional de Autonomías.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. María Flores"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico</label>
                      <input
                        type="email"
                        required
                        placeholder="correo@ejemplo.bo"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Departamento</label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="La Paz">La Paz</option>
                        <option value="Santa Cruz">Santa Cruz</option>
                        <option value="Cochabamba">Cochabamba</option>
                        <option value="Chuquisaca">Chuquisaca</option>
                        <option value="Tarija">Tarija</option>
                        <option value="Potosí">Potosí</option>
                        <option value="Oruro">Oruro</option>
                        <option value="Beni">Beni</option>
                        <option value="Pando">Pando</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Propuesta / Observación</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Escribe aquí tus sugerencias sobre tributación, servicios o competencias..."
                      value={formData.proposal}
                      onChange={(e) => setFormData({ ...formData, proposal: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#0F2942] hover:bg-slate-800 text-white py-3.5 text-xs font-black transition shadow-md"
                  >
                    <Send size={16} /> Enviar Propuesta a la Mesa Técnica
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
