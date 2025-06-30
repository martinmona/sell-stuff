import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { getProductById, updateProductReservation } from "@/lib/products"
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

    // Obtener el nuevo estado de reserva (invertir el actual)
    const newReservedState = !product.reserved

    // Actualizar el estado de reserva
    await updateProductReservation(productId, newReservedState)

    // Revalidar la página principal y la página de productos
    revalidatePath("/")
    revalidatePath(`/producto/${productId}`)
    revalidatePath("/admin")

    return NextResponse.json({ success: true, reserved: newReservedState })
  } catch (error) {
    console.error("Error al actualizar estado de reserva:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
