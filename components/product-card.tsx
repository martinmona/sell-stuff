"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { ReservedBadge } from "@/components/reserved-badge"
import type { Product } from "@/lib/products"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Crear array de imágenes disponibles
  const productImages = []
  if (product.mainImage) {
    productImages.push(product.mainImage)
  }
  if (product.images && product.images.length > 0) {
    // Filtrar para evitar duplicados si mainImage ya está en images
    const additionalImages = product.images.filter(img => img !== product.mainImage)
    productImages.push(...additionalImages)
  }
  
  // Si no hay imágenes, usar placeholder
  if (productImages.length === 0) {
    productImages.push(`/placeholder.svg?height=300&width=300&query=producto-${product.id}`)
  }

  // Agregar timestamp para evitar caché
  const timestamp = new Date().getTime()
  const imagesWithTimestamp = productImages.map(img => 
    `${img}${img.includes("?") ? "&" : "?"}t=${timestamp}`
  )

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault() // Evitar que se navegue al producto
    e.stopPropagation()
    setCurrentImageIndex(prev => 
      prev === 0 ? imagesWithTimestamp.length - 1 : prev - 1
    )
  }

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault() // Evitar que se navegue al producto
    e.stopPropagation()
    setCurrentImageIndex(prev => 
      prev === imagesWithTimestamp.length - 1 ? 0 : prev + 1
    )
  }

  return (
    <Link href={`/producto/${product.id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md">
        <div className="aspect-square relative group">
          <Image
            src={imagesWithTimestamp[currentImageIndex]}
            alt={`${product.name} - Imagen ${currentImageIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
          
          {/* Botones de navegación de imágenes - solo se muestran si hay más de una imagen */}
          {imagesWithTimestamp.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-background/70 hover:bg-background/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"  
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-background/70 hover:bg-background/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8"
                onClick={goToNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {/* Indicador de imágenes */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {imagesWithTimestamp.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
          
          {product.reserved && (
            <div className="absolute top-2 right-2 z-10">
              <ReservedBadge reserved={product.reserved} />
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="font-bold">{formatPrice(product.price)}</p>
        </CardFooter>
      </Card>
    </Link>
  )
}
