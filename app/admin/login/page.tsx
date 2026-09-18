"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/lib/actions/auth.actions";
import { Lock, Mail, ShieldAlert, ArrowRight, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await loginAction(formData);
      if (result.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(result.error || "Credenciales inválidas.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0F2942] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl border border-white/20 relative z-10">
        <div className="text-center space-y-2 mb-8">
          <span className="inline-block rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-widest uppercase px-3 py-1">
            Panel de Administración
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Agenda 50/50
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Ingrese sus credenciales autorizadas para gestionar el contenido.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold flex items-center gap-3">
            <ShieldAlert size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
              Correo Electrónico / Usuario
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 text-slate-400" size={18} />
              <input
                type="text"
                name="email"
                defaultValue="admin@agenda5050.gob.bo"
                required
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 text-slate-400" size={18} />
              <input
                type="password"
                name="password"
                defaultValue="Admin50502026!"
                required
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#0F2942] font-black py-3.5 text-xs shadow-lg transition"
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

        <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-800/50 pt-4">
          <p className="text-[10px] font-semibold text-slate-400">
            Credencial por defecto demo: <code className="text-emerald-400">Admin50502026!</code>
          </p>
        </div>
      </div>
    </div>
  );
}
