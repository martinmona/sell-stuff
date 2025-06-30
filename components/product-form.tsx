"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImageUpload } from "@/components/image-upload"
import { Checkbox } from "@/components/ui/checkbox"
import type { Product } from "@/lib/products"

interface ProductFormProps {
  product?: Product
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const [name, setName] = useState(product?.name || "")
  const [description, setDescription] = useState(product?.description || "")
  const [price, setPrice] = useState(product?.price?.toString() || "")
  const [reserved, setReserved] = useState(product?.reserved || false)
  const [images, setImages] = useState<string[]>(product?.images || [])
  const [mainImageIndex, setMainImageIndex] = useState(0)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Validaciones básicas
      if (!name.trim()) {
        setError("El nombre del producto es obligatorio")
        setLoading(false)
        return
      }

      if (!price || isNaN(Number(price)) || Number(price) <= 0) {
        setError("El precio debe ser un número mayor que cero")
        setLoading(false)
        return
      }

      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("reserved", reserved.toString())
      formData.append("images", JSON.stringify(images))
      formData.append("mainImageIndex", mainImageIndex.toString())

      const url = product ? `/api/products/${product.id}` : "/api/products"
      const method = product ? "PUT" : "POST"

      console.log("Enviando datos:", {
        url,
        method,
        name,
        description,
        price,
        reserved,
        images,
        mainImageIndex,
      })

      const response = await fetch(url, {
        method,
        body: formData,
      })

      // Verificar si la respuesta es JSON antes de intentar parsearla
      const contentType = response.headers.get("content-type")
      let data

      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        // Si no es JSON, obtener el texto de la respuesta
        const text = await response.text()
        console.error("Respuesta no JSON:", text)
        throw new Error(`Respuesta no válida del servidor: ${text.substring(0, 100)}...`)
      }

      if (response.ok) {
        console.log("Respuesta exitosa:", data)
        router.push("/admin")
        router.refresh()
      } else {
        console.error("Error en la respuesta:", data)
        setError(data.message || "Error al guardar el producto")
      }
    } catch (err) {
      console.error("Error al enviar el formulario:", err)
      setError(`Error al conectar con el servidor: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (url: string) => {
    console.log("Imagen subida:", url)
    setImages([...images, url])
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)

    // Ajustar el índice de la imagen principal si es necesario
    if (index === mainImageIndex) {
      setMainImageIndex(0)
    } else if (index < mainImageIndex) {
      setMainImageIndex(mainImageIndex - 1)
    }
  }

  const handleSetMainImage = (index: number) => {
    setMainImageIndex(index)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del producto</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="reserved" checked={reserved} onCheckedChange={(checked) => setReserved(checked === true)} />
              <Label htmlFor="reserved" className="font-medium cursor-pointer">
                Marcar como reservado
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>Imágenes del producto</Label>
              <ImageUpload onUpload={handleImageUpload} />

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Imagen ${index + 1}`}
                      className={`aspect-square object-cover rounded-md border-2 ${
                        index === mainImageIndex ? "border-primary" : "border-transparent"
                      }`}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-md">
                      <Button type="button" variant="secondary" size="sm" onClick={() => handleSetMainImage(index)}>
                        Principal
                      </Button>
                      <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveImage(index)}>
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : product ? "Actualizar producto" : "Crear producto"}
          </Button>
        </div>
      </div>
    </form>
  )
}
