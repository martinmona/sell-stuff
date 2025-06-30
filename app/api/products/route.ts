import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { createProduct, addProductImage } from "@/lib/products"
import { revalidatePath } from "next/cache"

export async function POST(request: Request) {
  try {
    // Verificar autenticación
    const authenticated = await isAuthenticated()

    if (!authenticated) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const formData = await request.formData()
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const reserved = formData.get("reserved") === "true"
    const imagesJson = formData.get("images") as string
    const mainImageIndex = Number.parseInt((formData.get("mainImageIndex") as string) || "0")

    console.log("Datos recibidos:", {
      name,
      description,
      price,
      reserved,
      imagesJson,
      mainImageIndex,
    })

    // Validar datos
    if (!name || isNaN(price) || price <= 0) {
      return NextResponse.json({ message: "Datos incompletos o inválidos" }, { status: 400 })
    }

    let images: string[] = []
    try {
      images = JSON.parse(imagesJson || "[]")
    } catch (e) {
      console.error("Error al parsear imágenes:", e)
      return NextResponse.json({ message: "Formato de imágenes inválido" }, { status: 400 })
    }

    console.log("Imágenes parseadas:", images)

    // Crear producto
    const productId = await createProduct({
      name,
      description,
      price,
      reserved,
    })

    console.log("Producto creado con ID:", productId)

    // Añadir imágenes
    for (let i = 0; i < images.length; i++) {
      await addProductImage(productId, images[i], i === mainImageIndex)
      console.log(`Imagen ${i} añadida:`, images[i], i === mainImageIndex ? "(principal)" : "")
    }

    // Revalidar la página principal y la página de productos
    revalidatePath("/")
    revalidatePath("/producto/[id]")
    revalidatePath("/admin")

    return NextResponse.json({ id: productId, success: true })
  } catch (error) {
    console.error("Error al crear producto:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
