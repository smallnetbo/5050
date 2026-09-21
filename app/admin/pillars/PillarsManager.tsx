"use client";

import { useState, useEffect } from "react";
import { Pillar } from "@/lib/agenda-data";
import { PillarForm } from "./PillarForm";
import { reorderPillarsAction } from "@/lib/actions/pillars.actions";

interface PillarsManagerProps {
  initialPillars: Pillar[];
}

export function PillarsManager({ initialPillars }: PillarsManagerProps) {
  const [pillars, setPillars] = useState<Pillar[]>(initialPillars);
  const [isReordering, setIsReordering] = useState(false);
  const [reorderStatus, setReorderStatus] = useState<string | null>(null);

  useEffect(() => {
    setPillars(initialPillars);
  }, [initialPillars]);

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pillars.length) return;

    const updated = [...pillars];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setPillars(updated);
    setIsReordering(true);
    setReorderStatus("Actualizando el orden en la base de datos...");

    const orderedIds = updated.map((p) => p.id);
    const res = await reorderPillarsAction(orderedIds);

    setIsReordering(false);
    if (res.success) {
      setReorderStatus("✓ El orden y la numeración se han actualizado correctamente.");
      setTimeout(() => setReorderStatus(null), 3000);
    } else {
      setReorderStatus("❌ Error al actualizar el orden de los pilares.");
    }
  };

  return (
    <div className="space-y-6">
      {reorderStatus && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-black border border-emerald-200 dark:border-emerald-800/80 animate-in fade-in">
          {reorderStatus}
        </div>
      )}

      {/* New Pillar Form */}
      <div className="space-y-3">
        <h2 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
          ✦ Agregar Nuevo Pilar
        </h2>
        <PillarForm isNew={true} />
      </div>

      {/* Pillars List with Interactive Reorder Buttons */}
      <div className="space-y-3 pt-4">
        <h2 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
          ✦ Pilares Registrados ({pillars.length} Ejes) — Use las flechas ▲ / ▼ para reordenar
        </h2>

        <div className="grid gap-4">
          {pillars.map((pillar, index) => (
            <PillarForm
              key={pillar.id}
              initialData={pillar}
              displayIndex={index + 1}
              isFirst={index === 0}
              isLast={index === pillars.length - 1}
              onMoveUp={() => handleMove(index, "up")}
              onMoveDown={() => handleMove(index, "down")}
              disabled={isReordering}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
