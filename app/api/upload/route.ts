import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { put } from "@vercel/blob"

export async function POST(request: Request) {
  try {
    const authenticated = await isAuthenticated()

    if (!authenticated) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ message: "No se ha proporcionado ningún archivo" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ message: "El archivo debe ser una imagen" }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ message: "La imagen es demasiado grande. Máximo 10MB." }, { status: 413 })
    }

    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    })

    console.log("Imagen subida con éxito a Vercel Blob:", blob.url)

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Error al subir archivo:", error)
    
    if (error instanceof Error) {
      if (error.message.includes("This blob already exists")) {
        return NextResponse.json({ message: "Ya existe un archivo con este nombre. Intenta de nuevo." }, { status: 409 })
      }
      if (error.message.includes("size limit")) {
        return NextResponse.json({ message: "El archivo es demasiado grande para el servicio de almacenamiento." }, { status: 413 })
      }
    }
    
    return NextResponse.json({ message: "Error interno del servidor al subir la imagen" }, { status: 500 })
  }
}
