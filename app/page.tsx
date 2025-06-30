import { Navbar } from "@/components/navbar"
import { ProductGrid } from "@/components/product-grid"
import { getProducts } from "@/lib/products"
// Cambiar el subtítulo y eliminar el botón de actualizar
export default async function Home() {
  const products = await getProducts()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2B2B2B]">No es lo que soñaste, pero está bueno igual</h1>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay productos disponibles actualmente.</p>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  )
}
