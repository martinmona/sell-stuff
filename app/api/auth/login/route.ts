import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { verifyCredentials } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    console.log("Intento de login para usuario:", username)

    // Verificar credenciales
    const user = await verifyCredentials(username, password)

    if (!user) {
      console.log("Credenciales inválidas para:", username)
      return NextResponse.json({ message: "Usuario o contraseña incorrectos" }, { status: 401 })
    }

    console.log("Login exitoso para:", username)

    // Establecer cookie de autenticación
    const cookieStore = cookies()

    // Usar .set con todas las opciones explícitas
    cookieStore.set({
      name: "auth_token",
      value: "authenticated",
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 día
      sameSite: "lax",
    })

    return NextResponse.json({ success: true, message: "Login exitoso" })
  } catch (error) {
    console.error("Error de login:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
