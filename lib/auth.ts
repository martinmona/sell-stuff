import { cookies } from "next/headers"
import { executeQuery } from "./db"
import { createHash } from "crypto"

// Función para crear un hash de contraseña usando SHA-256
function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex")
}

// Verificar credenciales de usuario
export async function verifyCredentials(username: string, password: string) {
  try {
    const result = await executeQuery("SELECT * FROM users WHERE username = $1", [username])

    const user = result[0]
    if (!user) return false

    // Comparar el hash de la contraseña proporcionada con el hash almacenado
    const hashedPassword = hashPassword(password)

    // Para la contraseña "admin123", el hash SHA-256 es:
    // "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9"
    const match = user.password === hashedPassword

    return match ? user : false
  } catch (error) {
    console.error("Error al verificar credenciales:", error)
    return false
  }
}

// Verificar si el usuario está autenticado
export async function isAuthenticated() {
  try {
    const cookieStore = cookies()
    const authCookie = cookieStore.get("auth_token")

    if (!authCookie) return false

    // En una aplicación real, verificaríamos un token JWT
    // Para simplificar, solo verificamos si la cookie existe
    return authCookie.value === "authenticated"
  } catch (error) {
    console.error("Error al verificar autenticación:", error)
    return false
  }
}
