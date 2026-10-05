"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";
import { defaultMonitorConfig, defaultMonitorMetrics } from "@/lib/agenda-data";

export interface MonitorConfigInput {
  sectionBadge: string;
  sectionTitle: string;
  sectionSubtitle: string;
  showCountdown: boolean;
  countdownBadge: string;
  countdownTitle: string;
  countdownDescription: string;
  countdownResponsible?: string;
  countdownTargetDate: string;
}

export interface MonitorMetricInput {
  id?: number;
  order?: number;
  title: string;
  value: string;
  description: string;
  responsible?: string;
  deliverable?: string;
  deadlineDate?: string;
  badge?: string;
  category?: string;
  iconName: string;
  colorScheme: string;
  active?: boolean;
}

export async function updateMonitorConfigAction(data: MonitorConfigInput) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado." };

  try {
    await (prisma as any).monitorConfig.upsert({
      where: { id: "global" },
      update: {
        sectionBadge: data.sectionBadge,
        sectionTitle: data.sectionTitle,
        sectionSubtitle: data.sectionSubtitle,
        showCountdown: data.showCountdown,
        countdownBadge: data.countdownBadge,
        countdownTitle: data.countdownTitle,
        countdownDescription: data.countdownDescription,
        countdownResponsible: data.countdownResponsible || "MEFP + 9 GAD",
        countdownTargetDate: data.countdownTargetDate,
      },
      create: {
        id: "global",
        sectionBadge: data.sectionBadge,
        sectionTitle: data.sectionTitle,
        sectionSubtitle: data.sectionSubtitle,
        showCountdown: data.showCountdown,
        countdownBadge: data.countdownBadge,
        countdownTitle: data.countdownTitle,
        countdownDescription: data.countdownDescription,
        countdownResponsible: data.countdownResponsible || "MEFP + 9 GAD",
        countdownTargetDate: data.countdownTargetDate,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/monitor");

    return { success: true, message: "Configuración del Monitor guardada con éxito." };
  } catch (error: any) {
    console.error("Error guardando MonitorConfig:", error);
    return { success: false, error: error?.message || "Error al guardar la configuración." };
  }
}

export async function upsertMonitorMetricAction(data: MonitorMetricInput) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado." };

  try {
    if (data.id && data.id > 0) {
      // Update
      await (prisma as any).monitorMetric.update({
        where: { id: data.id },
        data: {
          title: data.title.trim(),
          value: data.value.trim(),
          description: data.description.trim(),
          responsible: (data.responsible || "").trim(),
          deliverable: (data.deliverable || data.description || "").trim(),
          deadlineDate: (data.deadlineDate || "").trim(),
          badge: (data.badge || "Métrica Oficial").trim(),
          category: (data.category || "General").trim(),
          iconName: data.iconName || "Clock",
          colorScheme: data.colorScheme || "emerald",
          active: data.active ?? true,
          ...(data.order !== undefined ? { order: data.order } : {}),
        },
      });
    } else {
      // Create
      const count = await (prisma as any).monitorMetric.count();
      await (prisma as any).monitorMetric.create({
        data: {
          title: data.title.trim(),
          value: data.value.trim(),
          description: data.description.trim(),
          responsible: (data.responsible || "").trim(),
          deliverable: (data.deliverable || data.description || "").trim(),
          deadlineDate: (data.deadlineDate || "").trim(),
          badge: (data.badge || "Métrica Oficial").trim(),
          category: (data.category || "General").trim(),
          iconName: data.iconName || "Clock",
          colorScheme: data.colorScheme || "emerald",
          active: data.active ?? true,
          order: data.order ?? count + 1,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/monitor");

    return { success: true, message: "Hito / Indicador guardado exitosamente." };
  } catch (error: any) {
    console.error("Error guardando MonitorMetric:", error);
    return { success: false, error: error?.message || "Error al procesar el indicador." };
  }
}

export async function deleteMonitorMetricAction(id: number) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado." };

  try {
    await (prisma as any).monitorMetric.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin/monitor");

    return { success: true, message: "Hito eliminado correctamente." };
  } catch (error: any) {
    console.error("Error eliminando MonitorMetric:", error);
    return { success: false, error: "No se pudo eliminar el indicador." };
  }
}

export async function toggleMonitorMetricAction(id: number, active: boolean) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado." };

  try {
    await (prisma as any).monitorMetric.update({
      where: { id },
      data: { active },
    });

    revalidatePath("/");
    revalidatePath("/admin/monitor");

    return { success: true, message: `Hito ${active ? "activado" : "desactivado"}.` };
  } catch (error: any) {
    console.error("Error toggling MonitorMetric:", error);
    return { success: false, error: "Error al actualizar estado." };
  }
}

export async function reorderMonitorMetricsAction(orderedIds: number[]) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado." };

  try {
    await Promise.all(
      orderedIds.map((id, index) =>
        (prisma as any).monitorMetric.update({
          where: { id },
          data: { order: index + 1 },
        })
      )
    );

    revalidatePath("/");
    revalidatePath("/admin/monitor");

    return { success: true, message: "Orden de hitos actualizado." };
  } catch (error: any) {
    console.error("Error reordenando métricas:", error);
    return { success: false, error: "Error al guardar el nuevo orden." };
  }
}

export async function seedMonitorAction() {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: "No autorizado." };

  try {
    // 1. Config
    await (prisma as any).monitorConfig.upsert({
      where: { id: "global" },
      update: { ...defaultMonitorConfig },
      create: { id: "global", ...defaultMonitorConfig },
    });

    // 2. Metrics
    await (prisma as any).monitorMetric.deleteMany();
    for (const metric of defaultMonitorMetrics) {
      await (prisma as any).monitorMetric.create({
        data: {
          order: metric.order,
          title: metric.title,
          value: metric.value,
          description: metric.description,
          responsible: metric.responsible || "",
          deliverable: metric.deliverable || metric.description || "",
          deadlineDate: metric.deadlineDate || "",
          badge: metric.badge,
          category: metric.category,
          iconName: metric.iconName,
          colorScheme: metric.colorScheme,
          active: metric.active,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/monitor");

    return { success: true, message: "Hitos oficiales del Monitor restaurados con éxito." };
  } catch (error: any) {
    console.error("Error en seedMonitorAction:", error);
    return { success: false, error: "Error al restaurar los datos del Monitor." };
  }
}
