"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageCarouselProps {
  images: string[]
  productName: string
}

export function ImageCarousel({ images, productName }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loadedImages, setLoadedImages] = useState<string[]>([])

  // Efecto para cargar las imágenes y añadir un timestamp para evitar la caché
  useEffect(() => {
    // Añadir timestamp a las URLs para evitar la caché
    const timestamp = new Date().getTime()
    const imagesWithTimestamp = images.map((img) => `${img}${img.includes("?") ? "&" : "?"}t=${timestamp}`)
    setLoadedImages(imagesWithTimestamp)
  }, [images])

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? loadedImages.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const isLastSlide = currentIndex === loadedImages.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex)
  }

  // Si no hay imágenes, mostrar un placeholder
  if (!loadedImages || loadedImages.length === 0) {
    return (
      <div className="relative w-full max-w-3xl mx-auto">
        <div className="aspect-square relative overflow-hidden rounded-lg">
          <Image
            src="/generic-product-display.png"
            alt={`${productName} - Sin imagen`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="aspect-square relative overflow-hidden rounded-lg">
        <Image
          src={loadedImages[currentIndex] || "/placeholder.svg"}
          alt={`${productName} - Imagen ${currentIndex + 1}`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />

        {/* Botones de navegación */}
        {loadedImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background/90 rounded-full"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Anterior</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background/90 rounded-full"
              onClick={goToNext}
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Siguiente</span>
            </Button>
          </>
        )}
      </div>

      {/* Indicadores de imágenes */}
      {loadedImages.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {loadedImages.map((_, slideIndex) => (
            <button
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className={`w-3 h-3 rounded-full ${currentIndex === slideIndex ? "bg-primary" : "bg-muted"}`}
              aria-label={`Ir a imagen ${slideIndex + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
