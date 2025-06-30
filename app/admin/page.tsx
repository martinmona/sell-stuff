import { redirect } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getProducts } from "@/lib/products"
import { isAuthenticated } from "@/lib/auth"
import { formatPrice } from "@/lib/utils"
import { Plus, Pencil } from "lucide-react"
import DeleteProductButton from "@/components/delete-product-button"
import ToggleReservationButton from "@/components/toggle-reservation-button"
import LogoutButton from "@/components/logout-button"
import { ReservedBadge } from "@/components/reserved-badge"

export default async function AdminPage() {
  // Verificar autenticación
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    redirect("/admin/login")
  }

  const products = await getProducts()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container py-6 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#2B2B2B]">Panel de Administración</h1>
          <div className="flex gap-4">
            <Link href="/admin/producto/nuevo">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Producto
              </Button>
            </Link>
            <LogoutButton />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Productos</CardTitle>
            <CardDescription>Gestiona los productos que aparecen en la tienda</CardDescription>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No hay productos disponibles actualmente.</p>
                <Link href="/admin/producto/nuevo">
                  <Button className="mt-4">Crear primer producto</Button>
                </Link>
              </div>
            ) : (
              <div className="border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-3 text-left">Imagen</th>
                      <th className="p-3 text-left">Nombre</th>
                      <th className="p-3 text-left hidden md:table-cell">Precio</th>
                      <th className="p-3 text-left hidden md:table-cell">Estado</th>
                      <th className="p-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b">
                        <td className="p-3">
                          <div className="w-12 h-12 relative rounded overflow-hidden">
                            <img
                              src={product.mainImage || "/placeholder.svg?height=100&width=100&query=producto"}
                              alt={product.name}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </td>
                        <td className="p-3 font-medium">
                          {product.name}
                          {product.reserved && (
                            <div className="md:hidden mt-1">
                              <ReservedBadge reserved={product.reserved} />
                            </div>
                          )}
                        </td>
                        <td className="p-3 hidden md:table-cell">{formatPrice(product.price)}</td>
                        <td className="p-3 hidden md:table-cell">
                          <ReservedBadge reserved={product.reserved} />
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2">
                            <ToggleReservationButton productId={product.id} initialReserved={product.reserved} />
                            <Link href={`/admin/producto/${product.id}`}>
                              <Button variant="outline" size="sm">
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only md:not-sr-only md:ml-2">Editar</span>
                              </Button>
                            </Link>
                            <DeleteProductButton productId={product.id} productName={product.name} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
