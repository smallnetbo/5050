"use client";

import { useEffect, useState, useTransition } from "react";
import {
  getProposalsAction,
  updateProposalStatusAction,
  deleteProposalAction,
  getFeedbackSettingsAction,
  updateFeedbackSettingsAction,
} from "@/lib/actions/proposals.actions";
import {
  MessageSquare,
  Mail,
  Save,
  Search,
  CheckCircle2,
  Trash2,
  FileText,
  Loader2,
  ShieldAlert,
  Building,
  MapPin,
  Calendar,
  X,
  AlertTriangle,
  Server,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Proposal {
  id: string;
  name: string;
  email: string;
  department: string;
  organization: string | null;
  proposal: string;
  status: string;
  notes: string | null;
  createdAt: string;
}

export function ProposalsClientManager() {
  const [isPendingSettings, startTransitionSettings] = useTransition();
  const [isPendingStatus, startTransitionStatus] = useTransition();

  // Settings State
  const [feedbackEmail, setFeedbackEmail] = useState("propuestas@agenda5050.gob.bo");
  const [feedbackTitle, setFeedbackTitle] = useState("Buzón de Propuestas y Aportes");
  const [feedbackSubtitle, setFeedbackSubtitle] = useState("Envía tus sugerencias o propuestas institucionales para ser evaluadas por las Mesas Técnicas.");
  
  // SMTP Config State
  const [showSmtpConfig, setShowSmtpConfig] = useState(false);
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [smtpSecure, setSmtpSecure] = useState(false);
  const [smtpFrom, setSmtpFrom] = useState("");

  const [settingsMsg, setSettingsMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Proposals State
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [selectedStatus, setSelectedStatus] = useState<string>("Todos");
  const [selectedDept, setSelectedDept] = useState<string>("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal / Detail State
  const [activeProposal, setActiveProposal] = useState<Proposal | null>(null);
  const [editingNotes, setEditingNotes] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Load Settings & Proposals
  async function loadData() {
    setIsLoading(true);
    const [settingsRes, proposalsRes] = await Promise.all([
      getFeedbackSettingsAction(),
      getProposalsAction(),
    ]);

    if (settingsRes.success && settingsRes.settings) {
      setFeedbackEmail(settingsRes.settings.feedbackEmail || "propuestas@agenda5050.gob.bo");
      setFeedbackTitle(settingsRes.settings.feedbackTitle || "Buzón de Propuestas y Aportes");
      setFeedbackSubtitle(settingsRes.settings.feedbackSubtitle || "Envía tus sugerencias o propuestas institucionales para ser evaluadas por las Mesas Técnicas.");
      setSmtpHost(settingsRes.settings.smtpHost || "");
      setSmtpPort(String(settingsRes.settings.smtpPort || 587));
      setSmtpUser(settingsRes.settings.smtpUser || "");
      setSmtpPass(settingsRes.settings.smtpPass || "");
      setSmtpSecure(!!settingsRes.settings.smtpSecure);
      setSmtpFrom(settingsRes.settings.smtpFrom || "");
    }

    if (proposalsRes.success && proposalsRes.proposals) {
      setProposals(proposalsRes.proposals as Proposal[]);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSettingsMsg(null);
    const form = new FormData(e.currentTarget);

    startTransitionSettings(async () => {
      const res = await updateFeedbackSettingsAction(form);
      if (res.success) {
        setSettingsMsg({ type: "success", text: res.message || "Configuración guardada correctamente." });
      } else {
        setSettingsMsg({ type: "error", text: res.error || "No se pudo actualizar la configuración." });
      }
    });
  };

  // Change Status
  const handleStatusChange = (id: string, newStatus: string, notes?: string) => {
    startTransitionStatus(async () => {
      const res = await updateProposalStatusAction(id, newStatus, notes);
      if (res.success) {
        setProposals((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: newStatus, notes: notes !== undefined ? notes : p.notes } : p))
        );
        if (activeProposal && activeProposal.id === id) {
          setActiveProposal({ ...activeProposal, status: newStatus, notes: notes !== undefined ? notes : activeProposal.notes });
        }
      }
    });
  };

  // Delete Proposal
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    const res = await deleteProposalAction(deleteId);
    if (res.success) {
      setProposals((prev) => prev.filter((p) => p.id !== deleteId));
      if (activeProposal?.id === deleteId) setActiveProposal(null);
    }
    setDeleteId(null);
  };

  // Filtering
  const filteredProposals = proposals.filter((p) => {
    const matchesStatus = selectedStatus === "Todos" || p.status === selectedStatus;
    const matchesDept = selectedDept === "Todos" || p.department === selectedDept;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.proposal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.organization && p.organization.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesDept && matchesSearch;
  });

  const countPending = proposals.filter((p) => p.status === "Pendiente").length;

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="bg-[#0F2942] rounded-[32px] p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase text-emerald-400 tracking-wider bg-emerald-500/20 px-3 py-1 rounded-xl border border-emerald-400/30">
              <MessageSquare size={13} /> Co-construcción Ciudadana
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">Buzón & Correo de Destino</h1>
            <p className="text-xs text-slate-300 font-semibold mt-1">
              Administración de propuestas recibidas y configuración de envío por correo electrónico.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700/60 text-center">
              <span className="block text-[10px] font-black text-slate-400 uppercase">Total Propuestas</span>
              <span className="text-xl font-black text-emerald-400">{proposals.length}</span>
            </div>
            <div className="bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700/60 text-center">
              <span className="block text-[10px] font-black text-slate-400 uppercase">Pendientes</span>
              <span className="text-xl font-black text-amber-400">{countPending}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- SECTION 1: CONFIGURACION DE CORREO Y SMTP ---------------- */}
      <div className="bg-white dark:bg-slate-900 rounded-[28px] p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Mail size={20} />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                Correo de Destino y Servidor de Salida (SMTP)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Define la dirección de correo institucional y credenciales SMTP opcionales para entrega directa.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowSmtpConfig(!showSmtpConfig)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition"
          >
            <Server size={14} className="text-emerald-500" />
            <span>{showSmtpConfig ? "Ocultar SMTP" : "Configurar Servidor SMTP (Avanzado)"}</span>
            {showSmtpConfig ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {settingsMsg && (
          <div
            className={`p-4 rounded-2xl text-xs font-bold flex items-start gap-2.5 ${
              settingsMsg.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
                : "bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400"
            }`}
          >
            {settingsMsg.type === "success" ? (
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            )}
            <span>{settingsMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                Correo Electrónico de Destino *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 text-slate-400" size={16} />
                <input
                  type="email"
                  name="feedbackEmail"
                  value={feedbackEmail}
                  onChange={(e) => setFeedbackEmail(e.target.value)}
                  required
                  placeholder="propuestas@agenda5050.gob.bo"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 py-2.5 pl-10 pr-4 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                Título del Buzón (Público)
              </label>
              <input
                type="text"
                name="feedbackTitle"
                value={feedbackTitle}
                onChange={(e) => setFeedbackTitle(e.target.value)}
                placeholder="Buzón de Propuestas y Aportes"
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 py-2.5 px-4 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                Subtítulo / Instrucciones
              </label>
              <input
                type="text"
                name="feedbackSubtitle"
                value={feedbackSubtitle}
                onChange={(e) => setFeedbackSubtitle(e.target.value)}
                placeholder="Envía tus sugerencias..."
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 py-2.5 px-4 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* ----------------- OPTIONAL SMTP CONFIGURATION ----------------- */}
          {showSmtpConfig && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs font-black text-slate-800 dark:text-slate-200">
                <Server size={16} className="text-emerald-500" />
                <span>Credenciales de Servidor SMTP para Envío Directo de Correos</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Si su entidad utiliza un servidor de correo institucional (ej. Office 365, Gmail, Zimbra, cPanel SMTP), ingrese sus credenciales para garantizar la entrega inmediata a la bandeja de entrada.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Servidor SMTP (Host)
                  </label>
                  <input
                    type="text"
                    name="smtpHost"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    placeholder="mail.agenda5050.gob.bo o smtp.office365.com"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Puerto SMTP
                  </label>
                  <input
                    type="number"
                    name="smtpPort"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    placeholder="587 o 465"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Correo Remitente (From)
                  </label>
                  <input
                    type="text"
                    name="smtpFrom"
                    value={smtpFrom}
                    onChange={(e) => setSmtpFrom(e.target.value)}
                    placeholder='"Agenda 50/50" <notificaciones@agenda5050.gob.bo>'
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Usuario SMTP
                  </label>
                  <input
                    type="text"
                    name="smtpUser"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    placeholder="usuario@agenda5050.gob.bo"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Contraseña SMTP
                  </label>
                  <input
                    type="password"
                    name="smtpPass"
                    value={smtpPass}
                    onChange={(e) => setSmtpPass(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-semibold"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="smtpSecure"
                    name="smtpSecure"
                    value="true"
                    checked={smtpSecure}
                    onChange={(e) => setSmtpSecure(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="smtpSecure" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Usar conexión SSL/TLS (Puerto 465)
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPendingSettings}
              className="flex items-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#0F2942] font-black px-5 py-2.5 text-xs shadow-md transition disabled:opacity-50"
            >
              {isPendingSettings ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Save size={16} />
                  <span>Guardar Configuración de Correo</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ---------------- SECTION 2: BUZÓN DE PROPUESTAS RECIBIDAS ---------------- */}
      <div className="bg-white dark:bg-slate-900 rounded-[28px] p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Buzón de Propuestas Recibidas
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Revisión, filtrado y gestión de aportes de la ciudadanía y entidades.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Buscar por nombre, correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider mr-1">Estado:</span>
            {["Todos", "Pendiente", "Revisado", "Derivado", "Archivado"].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedStatus === st
                    ? "bg-[#0F2942] text-white dark:bg-emerald-500 dark:text-[#0F2942]"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Depto:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="Todos">Todos los departamentos</option>
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

        {/* Table / List of Proposals */}
        {isLoading ? (
          <div className="py-12 text-center text-slate-400 text-xs font-bold flex flex-col items-center gap-2">
            <Loader2 size={24} className="animate-spin text-emerald-500" />
            <span>Cargando propuestas ciudadanas...</span>
          </div>
        ) : filteredProposals.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs font-medium bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            No se encontraron propuestas registradas con los filtros seleccionados.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProposals.map((p) => {
              const statusColor =
                p.status === "Pendiente"
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400"
                  : p.status === "Revisado"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400"
                  : p.status === "Derivado"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400"
                  : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400";

              return (
                <div
                  key={p.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 p-5 space-y-4 hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-sm font-black text-slate-900 dark:text-white block">
                          {p.name}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">
                          {p.email}
                        </span>
                      </div>

                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${statusColor}`}>
                        {p.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-emerald-500" />
                        {p.department}
                      </span>
                      {p.organization && (
                        <span className="flex items-center gap-1">
                          <Building size={13} className="text-blue-500" />
                          {p.organization}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar size={13} />
                        {new Date(p.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium line-clamp-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      "{p.proposal}"
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setActiveProposal(p);
                        setEditingNotes(p.notes || "");
                      }}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 flex items-center gap-1"
                    >
                      <FileText size={14} /> Ver Detalle & Notas
                    </button>

                    <button
                      onClick={() => setDeleteId(p.id)}
                      className="text-rose-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      title="Eliminar propuesta"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ---------------- MODAL DETAIL & NOTES ---------------- */}
      {activeProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[28px] p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-500 tracking-wider block">
                  Detalle de Propuesta
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {activeProposal.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveProposal(null)}
                className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                <div>
                  <span className="block font-bold text-slate-400 text-[10px]">CORREO:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{activeProposal.email}</span>
                </div>
                <div>
                  <span className="block font-bold text-slate-400 text-[10px]">DEPARTAMENTO:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{activeProposal.department}</span>
                </div>
                {activeProposal.organization && (
                  <div className="col-span-2">
                    <span className="block font-bold text-slate-400 text-[10px]">ORGANIZACIÓN:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{activeProposal.organization}</span>
                  </div>
                )}
              </div>

              <div>
                <span className="block font-bold text-slate-500 mb-1">PROPUESTA COMPLETA:</span>
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium leading-relaxed max-h-48 overflow-y-auto">
                  {activeProposal.proposal}
                </div>
              </div>

              {/* Status Change Selector */}
              <div>
                <span className="block font-bold text-slate-500 mb-1">CAMBIAR ESTADO:</span>
                <div className="flex flex-wrap gap-2">
                  {["Pendiente", "Revisado", "Derivado", "Archivado"].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(activeProposal.id, st, editingNotes)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                        activeProposal.status === st
                          ? "bg-emerald-500 text-[#0F2942]"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes Input */}
              <div>
                <label className="block font-bold text-slate-500 mb-1">NOTAS INTERNAS DE MESA TÉCNICA:</label>
                <textarea
                  rows={3}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Escriba observaciones o dictamen de la propuesta..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  handleStatusChange(activeProposal.id, activeProposal.status, editingNotes);
                  setActiveProposal(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-[#0F2942] font-black text-xs hover:bg-emerald-400 transition"
              >
                Guardar Notas & Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- CONFIRM DELETE MODAL ---------------- */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[28px] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">¿Eliminar Propuesta?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Esta acción no se puede deshacer. La propuesta será eliminada permanentemente del buzón.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
