import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { getProductById, updateProduct, addProductImage } from "@/lib/products"
import { executeQuery } from "@/lib/db"
import { revalidatePath } from "next/cache"

interface RouteParams {
  params: {
    id: string
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    // Verificar autenticación
    const authenticated = await isAuthenticated()

    if (!authenticated) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const productId = Number.parseInt(params.id)

    if (isNaN(productId)) {
      return NextResponse.json({ message: "ID de producto inválido" }, { status: 400 })
    }

    // Verificar que el producto existe
    const product = await getProductById(productId)

    if (!product) {
      return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 })
    }

    const formData = await request.formData()
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const reserved = formData.get("reserved") === "true"
    const imagesJson = formData.get("images") as string
    const mainImageIndex = Number.parseInt((formData.get("mainImageIndex") as string) || "0")

    console.log("Datos recibidos para actualización:", {
      productId,
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

    // Actualizar producto
    await updateProduct(productId, {
      name,
      description,
      price,
      reserved,
    })

    // Eliminar imágenes antiguas
    await executeQuery("DELETE FROM images WHERE product_id = $1", [productId])

    // Añadir imágenes nuevas
    for (let i = 0; i < images.length; i++) {
      await addProductImage(productId, images[i], i === mainImageIndex)
    }

    // Revalidar la página principal y la página de productos
    revalidatePath("/")
    revalidatePath(`/producto/${productId}`)
    revalidatePath("/admin")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al actualizar producto:", error)
    // Asegurarse de devolver siempre un JSON válido
    return NextResponse.json({ message: "Error interno del servidor", error: String(error) }, { status: 500 })
  }
}

// Añadir método GET para obtener un producto específico
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const productId = Number.parseInt(params.id)

    if (isNaN(productId)) {
      return NextResponse.json({ message: "ID de producto inválido" }, { status: 400 })
    }

    const product = await getProductById(productId)

    if (!product) {
      return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error al obtener producto:", error)
    return NextResponse.json({ message: "Error interno del servidor", error: String(error) }, { status: 500 })
  }
}
