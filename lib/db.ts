import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Crear una conexión a la base de datos
const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql)

// Función para ejecutar consultas SQL directamente
export async function executeQuery(query: string, params: any[] = []) {
  try {
    // Usar sql.query para consultas parametrizadas
    return await sql.query(query, params)
  } catch (error) {
    console.error("Error en la consulta SQL:", query, params, error)
    throw error
  }
}
