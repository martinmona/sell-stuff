"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface ImageModalProps {
  images: string[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
  productName: string
}

export function ImageModal({ images, initialIndex, isOpen, onClose, productName }: ImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  // Actualizar el índice cuando cambie el índice inicial
  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex)
  }

  // Manejar teclas de navegación
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return
      
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault()
          goToPrevious()
          break
        case "ArrowRight":
          event.preventDefault()
          goToNext()
          break
        case "Escape":
          event.preventDefault()
          onClose()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, currentIndex])

  if (!images || images.length === 0) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-[95vw] h-[95vh] p-0 bg-black/95 border-none">
        <div className="relative w-full h-full flex flex-col min-h-[600px]">
          

          <div className="flex-1 relative flex items-center justify-center p-8">
            <div className="relative w-full h-full max-w-5xl">
              <Image
                src={images[currentIndex]}
                alt={`${productName} - Imagen ${currentIndex + 1}`}
                fill
                className="object-contain"
                sizes="95vw"
                priority
              />
            </div>

            {/* Botones de navegación */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full h-12 w-12"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-8 w-8" />
                  <span className="sr-only">Imagen anterior</span>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full h-12 w-12"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-8 w-8" />
                  <span className="sr-only">Imagen siguiente</span>
                </Button>
              </>
            )}
          </div>

          <div className="bg-black/50 p-4 flex flex-col items-center space-y-3">
            <div className="text-white/80 text-sm">
              {currentIndex + 1} de {images.length}
            </div>

            {images.length > 1 && images.length <= 10 && (
              <div className="flex justify-center space-x-2">
                {images.map((_, slideIndex) => (
                  <button
                    key={slideIndex}
                    onClick={() => goToSlide(slideIndex)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentIndex === slideIndex 
                        ? "bg-white" 
                        : "bg-white/40 hover:bg-white/60"
                    }`}
                    aria-label={`Ir a imagen ${slideIndex + 1}`}
                  />
                ))}
              </div>
            )}

            {images.length > 10 && (
              <div className="w-full max-w-xs bg-white/20 rounded-full h-1">
                <div 
                  className="bg-white h-1 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
