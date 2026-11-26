"use client";

import { useState, useMemo } from "react";
import { Download, Copy, Check, Smartphone, Square, Share2 } from "lucide-react";
import { Milestone, DocumentItem } from "@/lib/agenda-data";
import { BoardCommitmentItem } from "@/lib/board-commitments-data";
import { buildSocialPlates, SocialPlate } from "@/lib/ruta-viva-data";

interface SocialKitStudioProps {
  commitments: BoardCommitmentItem[];
  milestones: Milestone[];
  documents: DocumentItem[];
}

type PlateFormat = "9:16" | "1:1";

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(" ");
  let line = "";
  let currY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line.trim(), x, currY);
      line = words[i] + " ";
      currY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line.trim()) {
    ctx.fillText(line.trim(), x, currY);
    currY += lineHeight;
  }
  return currY;
}

function renderPlateToPng(plate: SocialPlate, format: PlateFormat) {
  const width = 1080;
  const height = format === "9:16" ? 1920 : 1080;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const accentHex =
    plate.accent === "red" ? "#dd3146" : plate.accent === "gold" ? "#c79d47" : "#3ac167";

  // Fondo Navy institucional
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, "#101620");
  grad.addColorStop(1, "#1B2533");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Franja tricolor superior
  ctx.fillStyle = "#dd3146";
  ctx.fillRect(0, 0, width / 3, 14);
  ctx.fillStyle = "#fcc74f";
  ctx.fillRect(width / 3, 0, width / 3, 14);
  ctx.fillStyle = "#3ac167";
  ctx.fillRect((width / 3) * 2, 0, width / 3, 14);

  const pad = 80;
  let y = format === "9:16" ? 130 : 88;

  // Badge de marca
  ctx.fillStyle = accentHex;
  ctx.font = "900 26px sans-serif";
  ctx.fillText(`AGENDA 50/50 · ${plate.category.toUpperCase()}`, pad, y);
  y += format === "9:16" ? 70 : 54;

  // Título principal
  ctx.fillStyle = "#ffffff";
  ctx.font = format === "9:16" ? "900 64px sans-serif" : "900 48px sans-serif";
  y = wrapCanvasText(ctx, plate.title, pad, y, width - pad * 2, format === "9:16" ? 76 : 56);
  y += 16;

  // Subtítulo
  ctx.fillStyle = "#cbd5e1";
  ctx.font = format === "9:16" ? "600 32px sans-serif" : "600 25px sans-serif";
  y = wrapCanvasText(ctx, plate.subtitle, pad, y, width - pad * 2, format === "9:16" ? 42 : 34);
  y += format === "9:16" ? 60 : 34;

  // Tarjeta KPI destacada
  const kpiH = format === "9:16" ? 260 : 175;
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(pad, y, width - pad * 2, kpiH, 28);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = accentHex;
  ctx.font = format === "9:16" ? "900 112px sans-serif" : "900 76px sans-serif";
  ctx.fillText(plate.heroStat, pad + 42, y + (format === "9:16" ? 130 : 92));

  ctx.fillStyle = "#f8fafc";
  ctx.font = format === "9:16" ? "700 32px sans-serif" : "700 24px sans-serif";
  wrapCanvasText(
    ctx,
    plate.heroStatLabel,
    pad + 42,
    y + (format === "9:16" ? 185 : 136),
    width - pad * 2 - 84,
    36
  );

  y += kpiH + (format === "9:16" ? 65 : 38);

  // Lista de puntos clave
  ctx.fillStyle = "#ffffff";
  ctx.font = format === "9:16" ? "600 34px sans-serif" : "600 25px sans-serif";
  for (const bullet of plate.bullets) {
    ctx.fillStyle = accentHex;
    ctx.beginPath();
    ctx.arc(pad + 12, y - 10, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#e2e8f0";
    y = wrapCanvasText(
      ctx,
      bullet,
      pad + 40,
      y,
      width - pad * 2 - 40,
      format === "9:16" ? 46 : 34
    );
    y += format === "9:16" ? 30 : 14;
  }

  // Footer institucional
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(pad, height - 110, width - pad * 2, 2);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "700 24px sans-serif";
  ctx.fillText(plate.footerNote, pad, height - 62);
  ctx.fillStyle = "#fcc74f";
  ctx.fillText("agenda50-50.sea.gob.bo", width - pad - 310, height - 62);

  const link = document.createElement("a");
  link.download = `placa-5050-${plate.id}-${format === "9:16" ? "vertical" : "cuadrada"}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export function SocialKitStudio({
  commitments,
  milestones,
  documents,
}: SocialKitStudioProps) {
  const [format, setFormat] = useState<PlateFormat>("9:16");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const plates = useMemo(
    () => buildSocialPlates(commitments, milestones, documents),
    [commitments, milestones, documents]
  );

  const handleCopy = async (plate: SocialPlate) => {
    try {
      await navigator.clipboard.writeText(plate.copyScript);
      setCopiedId(plate.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback silencioso
    }
  };

  const getAccentClasses = (accent: SocialPlate["accent"]) => {
    if (accent === "red") return "text-[#dd3146] border-[#dd3146]/40";
    if (accent === "gold") return "text-[#fcc74f] border-[#c79d47]/40";
    return "text-[#3ac167] border-[#3ac167]/40";
  };

  return (
    <div className="space-y-6">
      {/* Selector global de formato */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white dark:bg-[#17202C] p-4 border border-amber-900/10 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
          <Share2 size={15} className="text-[#c79d47]" />
          <span>Elige el formato de exportación en alta resolución (1080px):</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFormat("9:16")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-black transition cursor-pointer ${
              format === "9:16"
                ? "bg-[#1B2533] text-white dark:bg-[#c79d47] dark:text-[#101620]"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <Smartphone size={14} /> Vertical 9:16 (TikTok / Reels / WhatsApp)
          </button>
          <button
            onClick={() => setFormat("1:1")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-black transition cursor-pointer ${
              format === "1:1"
                ? "bg-[#1B2533] text-white dark:bg-[#c79d47] dark:text-[#101620]"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <Square size={14} /> Cuadrado 1:1 (Instagram / Prensa)
          </button>
        </div>
      </div>

      {/* Grilla de 4 Plantillas */}
      <div className="grid gap-6 md:grid-cols-2">
        {plates.map((plate) => {
          const isCopied = copiedId === plate.id;
          const accentCls = getAccentClasses(plate.accent);

          return (
            <div
              key={plate.id}
              className="rounded-3xl border border-amber-900/15 dark:border-slate-800 bg-white dark:bg-[#17202C] p-5 shadow-soft flex flex-col justify-between gap-4"
            >
              {/* Vista previa de la placa */}
              <div
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#101620] to-[#1B2533] text-white p-6 flex flex-col justify-between transition-all ${
                  format === "9:16" ? "min-h-[380px]" : "min-h-[290px]"
                }`}
              >
                {/* Franja tricolor */}
                <div className="absolute top-0 left-0 right-0 h-1.5 flex">
                  <div className="w-1/3 bg-[#dd3146]" />
                  <div className="w-1/3 bg-[#fcc74f]" />
                  <div className="w-1/3 bg-[#3ac167]" />
                </div>

                <div className="space-y-2 pt-1">
                  <div className={`text-[11px] font-black uppercase tracking-wider ${accentCls.split(" ")[0]}`}>
                    {plate.category} · {format}
                  </div>
                  <h4 className="text-xl font-black leading-tight">{plate.title}</h4>
                  <p className="text-xs text-slate-300">{plate.subtitle}</p>
                </div>

                <div className={`my-4 rounded-2xl bg-white/5 border p-4 ${accentCls}`}>
                  <div className={`text-3xl font-black ${accentCls.split(" ")[0]}`}>
                    {plate.heroStat}
                  </div>
                  <div className="text-xs font-bold text-slate-200 mt-0.5">
                    {plate.heroStatLabel}
                  </div>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-200">
                  {plate.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#fcc74f] shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-bold text-slate-400">
                  <span>{plate.footerNote}</span>
                  <span className="text-[#fcc74f]">agenda50-50.sea.gob.bo</span>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => renderPlateToPng(plate, format)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3ac167] hover:bg-[#2ea354] text-white px-4 py-2.5 text-xs font-black transition shadow-emerald cursor-pointer"
                >
                  <Download size={14} /> Descargar PNG ({format === "9:16" ? "1080×1920" : "1080×1080"})
                </button>
                <button
                  onClick={() => handleCopy(plate)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-900/15 dark:border-slate-700 bg-[#FAF8F3] dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 px-4 py-2.5 text-xs font-black text-[#1B2533] dark:text-white transition cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check size={14} className="text-[#3ac167]" /> ¡Copiado!
                    </>
                  ) : (
                    <>
                      <Copy size={14} className="text-[#c79d47]" /> Copiar guion
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
