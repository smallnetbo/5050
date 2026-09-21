import nodemailer, { Transporter } from "nodemailer";
import { prisma } from "@/lib/db";

interface ProposalEmailParams {
  toEmail: string;
  name: string;
  email: string;
  department: string;
  organization?: string | null;
  proposal: string;
}

export async function sendProposalNotificationEmail(params: ProposalEmailParams) {
  try {
    // 1. Obtener configuración SMTP desde la BD o Variables de Entorno
    const config = await prisma.siteConfig.findUnique({ where: { id: "global" } });

    const smtpHost = config?.smtpHost || process.env.SMTP_HOST;
    const smtpPort = config?.smtpPort || Number(process.env.SMTP_PORT) || 587;
    const smtpUser = config?.smtpUser || process.env.SMTP_USER;
    const smtpPass = config?.smtpPass || process.env.SMTP_PASS;
    const smtpSecure = config?.smtpSecure ?? (process.env.SMTP_SECURE === "true");
    const smtpFrom = config?.smtpFrom || process.env.SMTP_FROM || `"Agenda 50/50" <no-reply@agenda5050.gob.bo>`;

    let transporter: Transporter;

    if (smtpHost && smtpUser && smtpPass) {
      // Usar Servidor SMTP configurado
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
    } else {
      // Fallback a Sendmail del servidor Linux (cPanel / aaPanel / local)
      transporter = nodemailer.createTransport({
        sendmail: true,
        newline: "unix",
        path: "/usr/sbin/sendmail",
      });
    }

    // Plantilla HTML Profesional de Notificación de Propuesta
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="background-color: #0F2942; color: #ffffff; padding: 20px; border-radius: 12px; text-align: center;">
          <h2 style="margin: 0; font-size: 20px;">Agenda 50/50</h2>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #10B981;">Buzón de Co-construcción Ciudadana</p>
        </div>

        <div style="padding: 20px 0;">
          <h3 style="color: #0F2942; font-size: 16px; margin-top: 0;">Se ha recibido una nueva propuesta</h3>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 15px 0;">
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #64748b; width: 30%;">Remitente:</td>
              <td style="padding: 8px; color: #0f172a; font-weight: bold;">${params.name}</td>
            </tr>
            <tr style="background-color: #f8fafc;">
              <td style="padding: 8px; font-weight: bold; color: #64748b;">Correo Remitente:</td>
              <td style="padding: 8px; color: #0f172a;">${params.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #64748b;">Departamento:</td>
              <td style="padding: 8px; color: #10B981; font-weight: bold;">${params.department}</td>
            </tr>
            ${
              params.organization
                ? `<tr style="background-color: #f8fafc;">
                    <td style="padding: 8px; font-weight: bold; color: #64748b;">Organización:</td>
                    <td style="padding: 8px; color: #0f172a;">${params.organization}</td>
                  </tr>`
                : ""
            }
          </table>

          <div style="background-color: #f1f5f9; padding: 15px; border-radius: 12px; border-left: 4px solid #10B981; margin-top: 15px;">
            <p style="margin: 0 0 5px 0; font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase;">Propuesta / Observación:</p>
            <p style="margin: 0; font-size: 13px; color: #1e293b; line-height: 1.6;">${params.proposal.replace(/\n/g, "<br/>")}</p>
          </div>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center; font-size: 11px; color: #94a3b8;">
          <p style="margin: 0;">Esta notificación fue enviada automáticamente desde el portal de la Agenda 50/50.</p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: smtpFrom,
      to: params.toEmail,
      subject: `[Agenda 50/50] Nueva Propuesta Ciudadana: ${params.name} (${params.department})`,
      html: htmlBody,
    });

    console.log(`[Correo Enviado] Notificación de propuesta a ${params.toEmail}. ID: ${info.messageId}`);
    return { success: true, info };
  } catch (error: any) {
    console.error("Error al enviar correo de propuesta:", error);
    return { success: false, error: error?.message || "No se pudo entregar el correo electrónico." };
  }
}
