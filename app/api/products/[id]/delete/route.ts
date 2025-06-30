import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { getProductById, deleteProduct } from "@/lib/products"
import { revalidatePath } from "next/cache"

export async function POST(request: Request, { params }: { params: { id: string } }) {
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

    // Eliminar producto (las imágenes se eliminarán en cascada)
    await deleteProduct(productId)

    // Revalidar la página principal y la página de productos
    revalidatePath("/")
    revalidatePath("/producto/[id]")
    revalidatePath("/admin")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar producto:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}

// También podemos agregar un método GET para manejar accesos directos
export async function GET() {
  return new Response("Esta es una API, no una página. Utiliza el método POST para eliminar un producto.", {
    status: 400,
  })
}
