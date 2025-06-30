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

    const blob = await put(file.name, file, {
      access: "public",
    })

    console.log("Imagen subida con éxito a Vercel Blob:", blob.url)

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Error al subir archivo:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
