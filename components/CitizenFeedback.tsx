"use client";

import { useEffect, useState, useTransition } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Send, CheckCircle2, MessageSquare, Loader2, ShieldAlert } from "lucide-react";
import { faqList } from "@/lib/agenda-data";
import { submitCitizenProposalAction, getFeedbackSettingsAction } from "@/lib/actions/proposals.actions";

export function CitizenFeedback() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isPending, startTransition] = useTransition();

  const [settings, setSettings] = useState({
    feedbackTitle: "Buzón de Propuestas y Aportes",
    feedbackSubtitle: "Envía tus sugerencias o propuestas institucionales para ser evaluadas por las Mesas Técnicas.",
    feedbackEmail: "propuestas@agenda5050.gob.bo",
  });

  const [proposalSent, setProposalSent] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "La Paz",
    organization: "",
    proposal: "",
  });

  useEffect(() => {
    async function loadSettings() {
      const res = await getFeedbackSettingsAction();
      if (res.success && res.settings) {
        setSettings({
          feedbackTitle: res.settings.feedbackTitle || "Buzón de Propuestas y Aportes",
          feedbackSubtitle: res.settings.feedbackSubtitle || "Envía tus sugerencias o propuestas institucionales para ser evaluadas por las Mesas Técnicas.",
          feedbackEmail: res.settings.feedbackEmail || "propuestas@agenda5050.gob.bo",
        });
      }
    }
    loadSettings();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const form = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await submitCitizenProposalAction(form);
      if (res.success) {
        setProposalSent(true);
        setSuccessMsg(res.message || "¡Propuesta registrada con éxito!");
        setFormData({ name: "", email: "", department: "La Paz", organization: "", proposal: "" });
      } else {
        setErrorMsg(res.error || "No se pudo enviar la propuesta. Revisa tus datos.");
      }
    });
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
              <h3 className="text-2xl font-black text-slate-900">{settings.feedbackTitle}</h3>
              <p className="text-xs text-slate-600 font-medium mt-1 mb-6">
                {settings.feedbackSubtitle}
              </p>

              {errorMsg && (
                <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-2">
                  <ShieldAlert size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {proposalSent ? (
                <div className="rounded-2xl bg-emerald-500 text-white p-6 text-center space-y-3 animate-in fade-in">
                  <CheckCircle2 size={40} className="mx-auto" />
                  <h4 className="text-lg font-black">¡Propuesta Recibida Exitosamente!</h4>
                  <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                    {successMsg || "Tu propuesta ha sido guardada en el Buzón de Co-construcción y notificada a las Mesas Técnicas."}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setProposalSent(false);
                      setSuccessMsg(null);
                    }}
                    className="mt-2 inline-block px-4 py-2 rounded-xl bg-white text-[#0F2942] font-black text-xs hover:bg-slate-100 transition"
                  >
                    Enviar otra propuesta
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      name="name"
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
                        name="email"
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
                        name="department"
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
                    <label className="block text-xs font-bold text-slate-700 mb-1">Organización / Entidad (Opcional)</label>
                    <input
                      type="text"
                      name="organization"
                      placeholder="Ej. Universidad, Asociación..."
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Propuesta / Observación</label>
                    <textarea
                      name="proposal"
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
                    disabled={isPending}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#0F2942] hover:bg-slate-800 text-white py-3.5 text-xs font-black transition shadow-md disabled:opacity-50"
                  >
                    {isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <Send size={16} /> Enviar Propuesta a la Mesa Técnica
                      </>
                    )}
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
