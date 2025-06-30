import { redirect } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { ProductForm } from "@/components/product-form"
import { isAuthenticated } from "@/lib/auth"

export default async function NewProductPage() {
  // Verificar autenticación
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    redirect("/admin/login")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container py-6 flex-1">
        <h1 className="text-3xl font-bold mb-6">Crear Nuevo Producto</h1>
        <ProductForm />
      </div>
    </div>
  )
}
