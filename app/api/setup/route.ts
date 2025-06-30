import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { createHash } from "crypto"

// Función para crear un hash de contraseña usando SHA-256
function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex")
}

export async function GET() {
  try {
    // Hash de la contraseña "admin123"
    const hashedPassword = hashPassword("admin123")

    // Actualizar la contraseña del usuario admin
    await executeQuery(
      `
      UPDATE users 
      SET password = $1 
      WHERE username = 'admin'
    `,
      [hashedPassword],
    )

    // Si no existe el usuario admin, crearlo
    await executeQuery(
      `
      INSERT INTO users (username, password) 
      VALUES ('admin', $1)
      ON CONFLICT (username) DO NOTHING
    `,
      [hashedPassword],
    )

    return NextResponse.json({ success: true, message: "Configuración completada" })
  } catch (error) {
    console.error("Error en la configuración:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
