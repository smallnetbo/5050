"use client";

import { useEffect, useState, useTransition } from "react";
import { Send, CheckCircle2, MessageSquare, Loader2, ShieldAlert, Mail, FileCheck2, ArrowRight } from "lucide-react";
import { submitCitizenProposalAction, getFeedbackSettingsAction } from "@/lib/actions/proposals.actions";

export function CitizenFeedback() {
  const [isPending, startTransition] = useTransition();

  const [settings, setSettings] = useState({
    feedbackTitle: "Buzón de Propuestas y Aportes",
    feedbackSubtitle: "Envía tus sugerencias o propuestas institucionales para ser evaluadas por las Mesas Técnicas de la Agenda 50/50.",
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
          feedbackSubtitle: res.settings.feedbackSubtitle || "Envía tus sugerencias o propuestas institucionales para ser evaluadas por las Mesas Técnicas de la Agenda 50/50.",
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
    <section id="co-construccion" className="relative bg-white dark:bg-[#101620] py-20 border-t border-slate-200 dark:border-slate-800/80 transition-colors duration-300 scroll-mt-10">
      {/* Anchor for backwards compatibility */}
      <div id="faq" className="absolute -top-16 left-0 opacity-0 pointer-events-none" aria-hidden="true" />

      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Left Column: Co-construcción Ciudadana Concept & Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 px-3 py-1.5 text-xs font-black uppercase text-emerald-800 dark:text-emerald-400 tracking-wide">
                <MessageSquare size={15} /> Co-construcción Ciudadana
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Co-construcción de la Agenda 50/50
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                Es un proceso de construcción colectiva donde las Entidades Territoriales Autónomas, el Órgano Ejecutivo Nacional, las instituciones y la sociedad civil son actores centrales. Su objetivo estratégico es la reforma estructural del Estado para alcanzar autonomías reales, efectivas y eficientes, equilibrando responsabilidades con recursos y considerando capacidades institucionales diferenciadas.
              </p>
            </div>

          </div>

          {/* Right Column: Proposal Submission Form */}
          <div className="lg:col-span-7">
            <div className="rounded-[34px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#151D2A] p-6 sm:p-9 shadow-sm transition-all duration-300">
              <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-600 dark:text-emerald-400">
                  <Mail size={16} /> Registro de Propuestas y Consultas
                </div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                  Agenda 50/50
                </span>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
                  <ShieldAlert size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {proposalSent ? (
                <div className="rounded-2xl bg-emerald-500 dark:bg-emerald-600 text-white p-8 text-center space-y-3 shadow-lg animate-in fade-in">
                  <CheckCircle2 size={44} className="mx-auto" />
                  <h4 className="text-xl font-black">¡Propuesta Recibida Exitosamente!</h4>
                  <p className="text-xs text-emerald-100 dark:text-emerald-50 font-medium leading-relaxed max-w-md mx-auto">
                    {successMsg || "Tu propuesta ha sido guardada en el Buzón de Co-construcción y notificada a las Mesas Técnicas."}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setProposalSent(false);
                      setSuccessMsg(null);
                    }}
                    className="mt-3 inline-block px-5 py-2.5 rounded-xl bg-white text-[#0F2942] font-black text-xs hover:bg-slate-100 transition shadow-sm"
                  >
                    Enviar otra propuesta
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Nombre Completo *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Ej. María Flores"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 p-3 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Correo Electrónico *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="correo@ejemplo.bo"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 p-3 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Departamento *</label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 p-3 text-xs font-semibold text-slate-900 dark:text-white focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Organización / Entidad (Opcional)</label>
                    <input
                      type="text"
                      name="organization"
                      placeholder="Ej. Universidad, Asociación, Colegio de Profesionales..."
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 p-3 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Propuesta / Observación *</label>
                    <textarea
                      name="proposal"
                      rows={5}
                      required
                      placeholder="Escribe aquí tus propuestas, consultas o aportes sobre tributación, servicios o competencias..."
                      value={formData.proposal}
                      onChange={(e) => setFormData({ ...formData, proposal: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 p-3 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#0F2942] hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-[#0F2942] py-4 text-xs font-black transition shadow-md disabled:opacity-50 cursor-pointer"
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
