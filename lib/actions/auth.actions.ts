"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createAdminSession, destroyAdminSession, getAdminSessionEmail, verifyAdminSession } from "@/lib/auth";

/**
 * Garantiza la existencia de la cuenta de administrador en la base de datos si estuviera vacía.
 */
async function ensureAdminExists() {
  try {
    const count = await prisma.adminUser.count();
    if (count === 0) {
      const passwordHash = bcrypt.hashSync("Admin50502026!", 10);
      await prisma.adminUser.create({
        data: {
          email: "admin@agenda5050.gob.bo",
          name: "Administrador CMS",
          passwordHash: passwordHash,
          role: "admin",
        },
      });
    }
  } catch (error) {
    console.error("Error comprobando usuario administrador:", error);
  }
}

/**
 * Iniciar Sesión en el Panel CMS
 */
export async function loginAction(formData: FormData) {
  const emailInput = (formData.get("email") as string || "").trim().toLowerCase();
  const passwordInput = formData.get("password") as string || "";

  if (!emailInput || !passwordInput) {
    return { success: false, error: "Por favor, ingrese su correo y contraseña." };
  }

  await ensureAdminExists();

  try {
    const user = await prisma.adminUser.findUnique({
      where: { email: emailInput },
    });

    if (!user) {
      return { success: false, error: "Credenciales de acceso incorrectas." };
    }

    const isValidPassword = bcrypt.compareSync(passwordInput, user.passwordHash);
    if (!isValidPassword) {
      return { success: false, error: "Credenciales de acceso incorrectas." };
    }

    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await createAdminSession(user.email);

    return {
      success: true,
      user: {
        email: user.email,
        name: user.name,
      },
    };
  } catch (error: any) {
    console.error("Error en loginAction:", error);
    return { success: false, error: "Error al intentar iniciar sesión. Verifique sus datos." };
  }
}

/**
 * Solicitar código de recuperación de contraseña
 */
export async function requestPasswordResetAction(formData: FormData) {
  const emailInput = (formData.get("email") as string || "").trim().toLowerCase();

  if (!emailInput) {
    return { success: false, error: "Por favor, ingrese su correo electrónico registrado." };
  }

  try {
    const user = await prisma.adminUser.findUnique({
      where: { email: emailInput },
    });

    if (!user) {
      return {
        success: false,
        error: "No se encontró ninguna cuenta registrada con este correo electrónico.",
      };
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 30 * 60 * 1000); // Válido 30 minutos

    await prisma.adminUser.update({
      where: { id: user.id },
      data: {
        resetToken: resetCode,
        resetTokenExpiry: expiry,
      },
    });

    return {
      success: true,
      email: user.email,
      message: "Se ha enviado la instrucción y el código de verificación para restablecer su contraseña.",
    };
  } catch (error: any) {
    console.error("Error en requestPasswordResetAction:", error);
    return { success: false, error: "Error al procesar la solicitud de recuperación." };
  }
}

/**
 * Restablecer contraseña con código de verificación
 */
export async function resetPasswordWithTokenAction(formData: FormData) {
  const emailInput = (formData.get("email") as string || "").trim().toLowerCase();
  const codeInput = (formData.get("code") as string || "").trim();
  const newPassword = formData.get("newPassword") as string || "";
  const confirmPassword = formData.get("confirmPassword") as string || "";

  if (!emailInput || !codeInput || !newPassword) {
    return { success: false, error: "Por favor complete todos los campos obligatorios." };
  }

  if (newPassword.length < 6) {
    return { success: false, error: "La contraseña debe tener al menos 6 caracteres." };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: "Las contraseñas ingresadas no coinciden." };
  }

  try {
    const user = await prisma.adminUser.findUnique({
      where: { email: emailInput },
    });

    if (!user || !user.resetToken || !user.resetTokenExpiry) {
      return { success: false, error: "Código de verificación inválido o vencido." };
    }

    const isTokenValid = user.resetToken === codeInput && new Date(user.resetTokenExpiry) > new Date();
    if (!isTokenValid) {
      return { success: false, error: "El código de verificación es incorrecto o ha expirado." };
    }

    const newPasswordHash = bcrypt.hashSync(newPassword, 10);

    await prisma.adminUser.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return {
      success: true,
      message: "Contraseña actualizada exitosamente. Inicie sesión con su nueva clave.",
    };
  } catch (error: any) {
    console.error("Error en resetPasswordWithTokenAction:", error);
    return { success: false, error: "Error al restablecer la contraseña." };
  }
}

/**
 * Obtener perfil del administrador autenticado
 */
export async function getAdminProfileAction() {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return { success: false, error: "No autorizado." };
  }

  const sessionEmail = await getAdminSessionEmail();
  if (!sessionEmail) {
    return { success: false, error: "Sesión inválida." };
  }

  try {
    const user = await prisma.adminUser.findUnique({
      where: { email: sessionEmail },
    });

    if (!user) {
      return { success: false, error: "Usuario no encontrado." };
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
        createdAt: user.createdAt.toISOString(),
      },
    };
  } catch (error) {
    return { success: false, error: "Error al cargar la información del perfil." };
  }
}

/**
 * Cambiar contraseña desde el perfil
 */
export async function changePasswordAction(formData: FormData) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return { success: false, error: "Sesión no autorizada." };
  }

  const sessionEmail = await getAdminSessionEmail();
  if (!sessionEmail) {
    return { success: false, error: "Sesión inválida." };
  }

  const currentPassword = formData.get("currentPassword") as string || "";
  const newPassword = formData.get("newPassword") as string || "";
  const confirmPassword = formData.get("confirmPassword") as string || "";

  if (!currentPassword || !newPassword) {
    return { success: false, error: "Complete la contraseña actual y la nueva." };
  }

  if (newPassword.length < 6) {
    return { success: false, error: "La nueva contraseña debe tener al menos 6 caracteres." };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: "Las nuevas contraseñas no coinciden." };
  }

  try {
    const user = await prisma.adminUser.findUnique({
      where: { email: sessionEmail },
    });

    if (!user) {
      return { success: false, error: "Usuario administrador no encontrado." };
    }

    const isValidCurrent = bcrypt.compareSync(currentPassword, user.passwordHash);
    if (!isValidCurrent) {
      return { success: false, error: "La contraseña actual ingresada es incorrecta." };
    }

    const newHash = bcrypt.hashSync(newPassword, 10);
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    return { success: true, message: "Su contraseña ha sido cambiada exitosamente." };
  } catch (error: any) {
    return { success: false, error: "Error al cambiar la contraseña." };
  }
}

/**
 * Actualizar datos de perfil
 */
export async function updateAdminProfileAction(formData: FormData) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return { success: false, error: "No autorizado." };
  }

  const sessionEmail = await getAdminSessionEmail();
  if (!sessionEmail) {
    return { success: false, error: "Sesión inválida." };
  }

  const name = (formData.get("name") as string || "").trim();
  const email = (formData.get("email") as string || "").trim().toLowerCase();

  if (!name || !email) {
    return { success: false, error: "El nombre y el correo son obligatorios." };
  }

  try {
    const user = await prisma.adminUser.findUnique({
      where: { email: sessionEmail },
    });

    if (!user) {
      return { success: false, error: "Usuario no encontrado." };
    }

    await prisma.adminUser.update({
      where: { id: user.id },
      data: { name, email },
    });

    await createAdminSession(email);

    return { success: true, message: "Perfil actualizado correctamente." };
  } catch (error: any) {
    return { success: false, error: "Error al actualizar el perfil." };
  }
}

/**
 * Cerrar Sesión
 */
export async function logoutAction() {
  await destroyAdminSession();
  return { success: true };
}
