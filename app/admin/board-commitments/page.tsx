import { prisma } from "@/lib/db";
import { DEFAULT_BOARD_COMMITMENTS, BoardCommitmentItem } from "@/lib/board-commitments-data";
import { BoardCommitmentsManager } from "./BoardCommitmentsManager";
import { LayoutGrid } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminBoardCommitmentsPage() {
  let dbItems: any[] = [];
  try {
    dbItems = await (prisma as any).boardCommitment.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });
  } catch {
    dbItems = [];
  }

  const isFromDb = dbItems.length > 0;
  const initialCommitments: BoardCommitmentItem[] = isFromDb
    ? dbItems.map((b) => ({
        id: b.id,
        nivel: b.nivel,
        rubro: b.rubro,
        tematica: b.tematica,
        entregable: b.entregable,
        responsable: b.responsable,
        estado: b.estado,
        cat: b.cat,
        order: b.order,
        active: Boolean(b.active),
      }))
    : DEFAULT_BOARD_COMMITMENTS;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <span className="rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-2.5 py-1 text-xs font-black uppercase">
          Tablero Interactivo 50/50
        </span>
        <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <LayoutGrid className="text-emerald-500" size={30} />
          <span>Gestión del Tablero de Compromisos por Nivel</span>
        </h1>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          Administra los compromisos de los niveles 2.1 a 2.7, sus rubros temáticos, responsables y estados de avance (Cumplido, En proceso, Programado, Sin plazo).
        </p>
      </div>

      <BoardCommitmentsManager
        initialCommitments={initialCommitments}
        isFromDb={isFromDb}
      />
    </div>
  );
}
