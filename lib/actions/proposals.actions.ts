"use server";

import { prisma } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { sendProposalNotificationEmail } from "@/lib/mailer";

/**
 * Enviar una nueva propuesta desde la sección pública "Co-construcción Ciudadana"
 */
export async function submitCitizenProposalAction(formData: FormData) {
  const name = (formData.get("name") as string || "").trim();
  const email = (formData.get("email") as string || "").trim().toLowerCase();
  const department = (formData.get("department") as string || "").trim();
  const organization = (formData.get("organization") as string || "").trim();
  const proposal = (formData.get("proposal") as string || "").trim();

  if (!name || !email || !proposal) {
    return { success: false, error: "Por favor complete los campos obligatorios (Nombre, Correo y Propuesta)." };
  }

  try {
    // 1. Guardar siempre la propuesta de forma segura en la BD de la aplicación
    const newProposal = await prisma.citizenProposal.create({
      data: {
        name,
        email,
        department: department || "Nacional",
        organization: organization || null,
        proposal,
        status: "Pendiente",
      },
    });

    // 2. Obtener la configuración del correo de destino de la sección
    let config = await prisma.siteConfig.findUnique({ where: { id: "global" } });
    const targetEmail = config?.feedbackEmail || "propuestas@agenda5050.gob.bo";

    // 3. Enviar la notificación por correo electrónico real
    const emailRes = await sendProposalNotificationEmail({
      toEmail: targetEmail,
      name,
      email,
      department: department || "Nacional",
      organization: organization || null,
      proposal,
    });

    console.log(`[Co-construcción Ciudadana] Propuesta #${newProposal.id} guardada. Envío de correo a ${targetEmail}:`, emailRes.success ? "ÉXITO" : `ADVERTENCIA (${emailRes.error})`);

    revalidatePath("/admin/proposals");
    revalidatePath("/");

    return {
      success: true,
      emailSent: emailRes.success,
      message: emailRes.success
        ? `¡Propuesta registrada exitosamente y enviada al correo ${targetEmail}!`
        : `¡Propuesta registrada en el Buzón CMS! (Notificación pendiente por configuración SMTP).`,
    };
  } catch (error: any) {
    console.error("Error al guardar propuesta ciudadana:", error);
    return { success: false, error: "No se pudo registrar la propuesta. Intente nuevamente." };
  }
}

/**
 * Obtener la lista completa de propuestas recibidas (Panel CMS)
 */
export async function getProposalsAction() {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return { success: false, error: "No autorizado.", proposals: [] };
  }

  try {
    const proposals = await prisma.citizenProposal.findMany({
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      proposals: proposals.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Error al obtener propuestas:", error);
    return { success: false, error: "Error al cargar el buzón de propuestas.", proposals: [] };
  }
}

/**
 * Actualizar el estado de una propuesta (Pendiente | Revisado | Derivado | Archivado) y notas
 */
export async function updateProposalStatusAction(id: string, status: string, notes?: string) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return { success: false, error: "No autorizado." };
  }

  try {
    await prisma.citizenProposal.update({
      where: { id },
      data: {
        status,
        notes: notes !== undefined ? notes : undefined,
      },
    });

    revalidatePath("/admin/proposals");
    return { success: true, message: "Estado de la propuesta actualizado." };
  } catch (error) {
    return { success: false, error: "Error al actualizar la propuesta." };
  }
}

/**
 * Eliminar una propuesta por ID
 */
export async function deleteProposalAction(id: string) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return { success: false, error: "No autorizado." };
  }

  try {
    await prisma.citizenProposal.delete({
      where: { id },
    });

    revalidatePath("/admin/proposals");
    return { success: true, message: "Propuesta eliminada correctamente." };
  } catch (error) {
    return { success: false, error: "Error al eliminar la propuesta." };
  }
}

/**
 * Obtener configuración del buzón de propuestas y credenciales SMTP
 */
export async function getFeedbackSettingsAction() {
  try {
    let config = await prisma.siteConfig.findUnique({ where: { id: "global" } });
    if (!config) {
      config = await prisma.siteConfig.create({
        data: {
          id: "global",
          feedbackEmail: "propuestas@agenda5050.gob.bo",
          feedbackTitle: "Buzón de Propuestas y Aportes",
          feedbackSubtitle: "Envía tus sugerencias o propuestas institucionales para ser evaluadas por las Mesas Técnicas.",
        },
      });
    }

    return {
      success: true,
      settings: {
        feedbackEmail: config.feedbackEmail || "propuestas@agenda5050.gob.bo",
        feedbackTitle: config.feedbackTitle || "Buzón de Propuestas y Aportes",
        feedbackSubtitle: config.feedbackSubtitle || "Envía tus sugerencias o propuestas institucionales para ser evaluadas por las Mesas Técnicas.",
        smtpHost: config.smtpHost || "",
        smtpPort: config.smtpPort || 587,
        smtpUser: config.smtpUser || "",
        smtpPass: config.smtpPass || "",
        smtpSecure: config.smtpSecure || false,
        smtpFrom: config.smtpFrom || "",
      },
    };
  } catch (error) {
    return {
      success: false,
      settings: {
        feedbackEmail: "propuestas@agenda5050.gob.bo",
        feedbackTitle: "Buzón de Propuestas y Aportes",
        feedbackSubtitle: "Envía tus sugerencias o propuestas institucionales para ser evaluadas por las Mesas Técnicas.",
        smtpHost: "",
        smtpPort: 587,
        smtpUser: "",
        smtpPass: "",
        smtpSecure: false,
        smtpFrom: "",
      },
    };
  }
}

/**
 * Actualizar la configuración del correo de destino y servidor SMTP desde el CMS
 */
export async function updateFeedbackSettingsAction(formData: FormData) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return { success: false, error: "No autorizado." };
  }

  const feedbackEmail = (formData.get("feedbackEmail") as string || "").trim().toLowerCase();
  const feedbackTitle = (formData.get("feedbackTitle") as string || "").trim();
  const feedbackSubtitle = (formData.get("feedbackSubtitle") as string || "").trim();

  // SMTP config
  const smtpHost = (formData.get("smtpHost") as string || "").trim();
  const smtpPort = Number(formData.get("smtpPort")) || 587;
  const smtpUser = (formData.get("smtpUser") as string || "").trim();
  const smtpPass = (formData.get("smtpPass") as string || "").trim();
  const smtpSecure = formData.get("smtpSecure") === "true";
  const smtpFrom = (formData.get("smtpFrom") as string || "").trim();

  if (!feedbackEmail) {
    return { success: false, error: "El correo de destino es obligatorio." };
  }

  try {
    await prisma.siteConfig.upsert({
      where: { id: "global" },
      update: {
        feedbackEmail,
        feedbackTitle: feedbackTitle || undefined,
        feedbackSubtitle: feedbackSubtitle || undefined,
        smtpHost: smtpHost || null,
        smtpPort: smtpPort || 587,
        smtpUser: smtpUser || null,
        smtpPass: smtpPass || null,
        smtpSecure,
        smtpFrom: smtpFrom || null,
      },
      create: {
        id: "global",
        feedbackEmail,
        feedbackTitle,
        feedbackSubtitle,
        smtpHost: smtpHost || null,
        smtpPort: smtpPort || 587,
        smtpUser: smtpUser || null,
        smtpPass: smtpPass || null,
        smtpSecure,
        smtpFrom: smtpFrom || null,
      },
    });

    revalidatePath("/admin/proposals");
    revalidatePath("/");

    return { success: true, message: "Configuración de correo y servidor SMTP actualizada exitosamente." };
  } catch (error: any) {
    console.error("Error en updateFeedbackSettingsAction:", error);
    return { success: false, error: error?.message || "Error al guardar la configuración de correo." };
  }
}
