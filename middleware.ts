import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Obtener la cookie de autenticación
  const authCookie = request.cookies.get("auth_token")

  // Verificar si la ruta es de administración
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
  const isLoginRoute = request.nextUrl.pathname === "/admin/login"

  console.log("Middleware ejecutándose para:", request.nextUrl.pathname)
  console.log("Cookie de autenticación:", authCookie ? "presente" : "ausente")

  // Si es una ruta de administración (excepto login) y no hay cookie, redirigir a login
  if (isAdminRoute && !isLoginRoute && !authCookie) {
    console.log("Redirigiendo a login desde:", request.nextUrl.pathname)
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  // Si es la ruta de login y hay cookie, redirigir al panel de administración
  if (isLoginRoute && authCookie) {
    console.log("Redirigiendo a admin desde login")
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
