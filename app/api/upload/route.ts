import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    // Verificar autenticación
    const authenticated = await isAuthenticated()

    if (!authenticated) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ message: "No se ha proporcionado ningún archivo" }, { status: 400 })
    }

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ message: "El archivo debe ser una imagen" }, { status: 400 })
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ message: "La imagen no debe superar los 5MB" }, { status: 400 })
    }

    // Generar un ID único para la imagen
    const uniqueId = uuidv4()
    const fileType = file.type.split("/")[1] // jpg, png, etc.

    // Crear una URL de placeholder más específica según el tipo de archivo
    let url = `/placeholder.svg?height=400&width=400&query=producto-${fileType}-${uniqueId.substring(0, 8)}`

    // Añadir información sobre el archivo original
    const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    url += `&name=${fileName}`

    console.log("Imagen subida con éxito:", url)

    return NextResponse.json({ url })
  } catch (error) {
    console.error("Error al subir archivo:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
