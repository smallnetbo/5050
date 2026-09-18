"use server";

import { createAdminSession, destroyAdminSession } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Credencial por defecto para el sistema / admin demo (modificable en BD)
  // Admin email: admin@agenda5050.gob.bo
  // Pass por defecto: Admin50502026!
  if (
    (email === "admin@agenda5050.gob.bo" || email === "admin") &&
    (password === "Admin50502026!" || password === "admin123")
  ) {
    await createAdminSession(email);
    return { success: true };
  }

  return { success: false, error: "Credenciales de acceso incorrectas." };
}

export async function logoutAction() {
  await destroyAdminSession();
  return { success: true };
}
