import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const cookieStore = cookies()

    // Eliminar la cookie de autenticación
    cookieStore.delete({
      name: "auth_token",
      path: "/",
    })

    return NextResponse.json({ success: true, message: "Sesión cerrada correctamente" })
  } catch (error) {
    console.error("Error al cerrar sesión:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
