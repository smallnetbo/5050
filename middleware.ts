import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "agenda-5050-super-secret-key-sucre-2026"
);

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Si es la ruta de login, dejar pasar
  if (path === "/admin/login") {
    return NextResponse.next();
  }

  // Si la ruta comienza con /admin, verificar token JWT en cookie
  if (path.startsWith("/admin")) {
    const token = request.cookies.get("agenda5050_admin_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (err) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
