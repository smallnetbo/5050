"use client";

import { useEffect, useState, useTransition } from "react";
import {
  getAdminProfileAction,
  updateAdminProfileAction,
  changePasswordAction,
} from "@/lib/actions/auth.actions";
import {
  User,
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  Eye,
  EyeOff,
  Clock,
  Save,
} from "lucide-react";

export default function AdminProfilePage() {
  const [isPendingProfile, startTransitionProfile] = useTransition();
  const [isPendingPass, startTransitionPass] = useTransition();

  // User Profile State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [lastLoginAt, setLastLoginAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Alerts
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passMessage, setPassMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      const res = await getAdminProfileAction();
      if (res.success && res.user) {
        setName(res.user.name || "");
        setEmail(res.user.email || "");
        setLastLoginAt(res.user.lastLoginAt || null);
      }
      setIsLoading(false);
    }
    loadProfile();
  }, []);

  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileMessage(null);
    const formData = new FormData(e.currentTarget);

    startTransitionProfile(async () => {
      const res = await updateAdminProfileAction(formData);
      if (res.success) {
        setProfileMessage({ type: "success", text: res.message || "Perfil actualizado correctamente." });
      } else {
        setProfileMessage({ type: "error", text: res.error || "No se pudo actualizar el perfil." });
      }
    });
  };

  const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPassMessage(null);
    const formData = new FormData(e.currentTarget);

    startTransitionPass(async () => {
      const res = await changePasswordAction(formData);
      if (res.success) {
        setPassMessage({ type: "success", text: res.message || "Contraseña cambiada exitosamente." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPassMessage({ type: "error", text: res.error || "No se pudo cambiar la contraseña." });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-slate-500">
        <Loader2 size={32} className="animate-spin text-emerald-500" />
        <span className="text-xs font-bold">Cargando perfil de seguridad...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      {/* Header Banner */}
      <div className="bg-[#0F2942] rounded-[32px] p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <User size={32} />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-400 tracking-wider bg-emerald-500/20 px-2.5 py-0.5 rounded-md border border-emerald-400/30">
                <ShieldCheck size={12} /> Cuenta Administrador
              </span>
              <h1 className="text-2xl font-black mt-1">{name || "Administrador CMS"}</h1>
              <p className="text-xs text-slate-300 font-semibold">{email}</p>
            </div>
          </div>

          {lastLoginAt && (
            <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700/60 text-xs text-slate-300 font-medium">
              <Clock size={16} className="text-emerald-400" />
              <span>Último acceso: {new Date(lastLoginAt).toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1: Informacion del Perfil */}
        <div className="bg-white dark:bg-slate-900 rounded-[28px] p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">Datos de Perfil</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Nombre y correo institucional.</p>
            </div>
          </div>

          {profileMessage && (
            <div
              className={`p-4 rounded-2xl text-xs font-bold flex items-start gap-2.5 ${
                profileMessage.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
                  : "bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400"
              }`}
            >
              {profileMessage.type === "success" ? (
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              )}
              <span>{profileMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nombre Completo / Cargo
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 text-slate-400" size={16} />
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Correo Electrónico Notificaciones
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 text-slate-400" size={16} />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPendingProfile}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#0F2942] hover:bg-slate-800 text-white font-bold py-3 text-xs shadow-md transition disabled:opacity-50"
            >
              {isPendingProfile ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Save size={16} />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Card 2: Cambiar Contraseña */}
        <div className="bg-white dark:bg-slate-900 rounded-[28px] p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <KeyRound size={20} />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">Cambiar Contraseña</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Actualice sus credenciales de acceso.</p>
            </div>
          </div>

          {passMessage && (
            <div
              className={`p-4 rounded-2xl text-xs font-bold flex items-start gap-2.5 ${
                passMessage.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
                  : "bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400"
              }`}
            >
              {passMessage.type === "success" ? (
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              )}
              <span>{passMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Contraseña Actual
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 text-slate-400" size={16} />
                <input
                  type={showCurrentPass ? "text" : "password"}
                  name="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="Ingrese contraseña actual"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 py-2.5 pl-10 pr-10 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 text-slate-400" size={16} />
                <input
                  type={showNewPass ? "text" : "password"}
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Mínimo 6 caracteres"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 py-2.5 pl-10 pr-10 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 text-slate-400" size={16} />
                <input
                  type={showNewPass ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Repita la nueva contraseña"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPendingPass}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#0F2942] font-extrabold py-3 text-xs shadow-md transition disabled:opacity-50"
            >
              {isPendingPass ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <KeyRound size={16} />
                  <span>Actualizar Contraseña</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
