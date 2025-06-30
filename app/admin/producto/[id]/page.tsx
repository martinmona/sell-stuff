import { redirect, notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { ProductForm } from "@/components/product-form"
import { isAuthenticated } from "@/lib/auth"
import { getProductById } from "@/lib/products"

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  // Verificar autenticación
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    redirect("/admin/login")
  }

  const productId = Number.parseInt(params.id)

  if (isNaN(productId)) {
    notFound()
  }

  const product = await getProductById(productId)

  if (!product) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container py-6 flex-1">
        <h1 className="text-3xl font-bold mb-6">Editar Producto</h1>
        <ProductForm product={product} />
      </div>
    </div>
  )
}
