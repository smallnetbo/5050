"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  loginAction,
  requestPasswordResetAction,
  resetPasswordWithTokenAction,
} from "@/lib/actions/auth.actions";
import {
  Lock,
  Mail,
  ShieldAlert,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

type Mode = "login" | "request_reset" | "confirm_reset";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Screen Mode
  const [mode, setMode] = useState<Mode>("login");

  // Form State (No default pre-filled credentials for maximum security)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Recovery State
  const [enteredCode, setEnteredCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Messages
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Login Submit
  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await loginAction(formData);
      if (result.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(result.error || "Credenciales de acceso inválidas.");
      }
    });
  };

  // Request Reset Code Submit
  const handleRequestResetSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await requestPasswordResetAction(formData);
      if (result.success) {
        setSuccessMsg(
          result.message || "Se ha procesado su solicitud. Ingrese el código de verificación recibido."
        );
        setMode("confirm_reset");
      } else {
        setError(result.error || "No se pudo procesar la solicitud de recuperación.");
      }
    });
  };

  // Reset Password Submit
  const handleResetPasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await resetPasswordWithTokenAction(formData);
      if (result.success) {
        setSuccessMsg(result.message || "Contraseña restablecida con éxito. Inicie sesión con su nueva clave.");
        setPassword(newPassword);
        setMode("login");
      } else {
        setError(result.error || "No se pudo restablecer la contraseña.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0F2942] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[32px] p-6 sm:p-8 shadow-2xl border border-white/20 relative z-10">
        
        {/* Header Badge & Title */}
        <div className="text-center space-y-2 mb-6 flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center p-2 mb-1">
            <Image
              src="/assets/isologo.svg"
              alt="Isologo Agenda 50/50"
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-black tracking-wider uppercase px-3 py-1 border border-emerald-500/20">
            <ShieldCheck size={13} />
            Panel de Administración
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Agenda 50/50
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            {mode === "login" && "Acceso exclusivo para personal autorizado."}
            {mode === "request_reset" && "Recuperación de contraseña."}
            {mode === "confirm_reset" && "Ingrese su código PIN y nueva contraseña."}
          </p>
        </div>

        {/* Global Notifications */}
        {error && (
          <div className="mb-5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold flex items-start gap-3 animate-in fade-in">
            <ShieldAlert size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-start gap-3 animate-in fade-in">
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ----------------- MODE 1: LOGIN FORM ----------------- */}
        {mode === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                Correo Electrónico / Usuario
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 text-slate-400" size={18} />
                <input
                  type="text"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="usuario@agenda5050.gob.bo"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
                  Contraseña
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setSuccessMsg(null);
                    setMode("request_reset");
                  }}
                  className="text-[11px] font-bold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 transition"
                >
                  ¿Olvidó su contraseña?
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-3 text-slate-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 py-2.5 pl-10 pr-10 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
                  title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-3 flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#0F2942] font-black py-3.5 text-xs shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {/* ----------------- MODE 2: REQUEST RESET FORM ----------------- */}
        {mode === "request_reset" && (
          <form onSubmit={handleRequestResetSubmit} className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-4">
              Ingrese su correo electrónico institucional para enviar la solicitud de recuperación.
            </p>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                Correo Electrónico Registrado
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 text-slate-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="usuario@agenda5050.gob.bo"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#0F2942] font-black py-3.5 text-xs shadow-lg transition disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <KeyRound size={16} />
                  <span>Enviar Código de Recuperación</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setError(null);
                setSuccessMsg(null);
                setMode("login");
              }}
              className="w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white py-2 transition"
            >
              <ArrowLeft size={16} />
              <span>Volver a Iniciar Sesión</span>
            </button>
          </form>
        )}

        {/* ----------------- MODE 3: CONFIRM RESET FORM ----------------- */}
        {mode === "confirm_reset" && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
            <input type="hidden" name="email" value={email} />

            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                Código PIN de Verificación
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 text-slate-400" size={18} />
                <input
                  type="text"
                  name="code"
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value)}
                  required
                  placeholder="Ingrese el código de 6 dígitos"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 py-2.5 pl-10 pr-4 text-xs font-black tracking-widest text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 text-slate-400" size={18} />
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Mínimo 6 caracteres"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 py-2.5 pl-10 pr-10 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 text-slate-400" size={18} />
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Repita la nueva contraseña"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#0F2942] font-black py-3.5 text-xs shadow-lg transition disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <span>Guardar Nueva Contraseña</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setError(null);
                setSuccessMsg(null);
                setMode("login");
              }}
              className="w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white py-2 transition"
            >
              <ArrowLeft size={16} />
              <span>Volver a Iniciar Sesión</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
