"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import imageCompression from "browser-image-compression"

interface ImageUploadProps {
  onUpload: (url: string) => void
  onMultipleUpload?: (urls: string[]) => void
  multiple?: boolean
}

export function ImageUpload({ onUpload, onMultipleUpload, multiple = false }: ImageUploadProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [uploadProgress, setUploadProgress] = useState<{current: number, total: number} | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Convertir FileList a Array
    const fileArray = Array.from(files)

    // Validar que todos los archivos sean imágenes
    const invalidFiles = fileArray.filter(file => !file.type.startsWith("image/"))
    if (invalidFiles.length > 0) {
      setError(`Los siguientes archivos no son imágenes válidas: ${invalidFiles.map(f => f.name).join(", ")}`)
      setSuccess("")
      return
    }

    setError("")
    setSuccess("")
    setLoading(true)
    setUploadProgress({ current: 0, total: fileArray.length })

    const uploadedUrls: string[] = []
    const failedUploads: string[] = []

    try {
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i]
        setUploadProgress({ current: i + 1, total: fileArray.length })

        try {
          // Configuración de compresión
          const options = {
            maxSizeMB: 4,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            initialQuality: 0.8
          }

          console.log(`Comprimiendo imagen ${i + 1}/${fileArray.length}:`, file.name, `Tamaño original: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
          
          // Comprimir la imagen
          const compressedFile = await imageCompression(file, options)
          
          console.log("Imagen comprimida:", compressedFile.name, `Tamaño final: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`)

          const formData = new FormData()
          formData.append("file", compressedFile)

          console.log(`Subiendo imagen ${i + 1}/${fileArray.length}...`)

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Error al subir la imagen")
          }

          console.log(`Imagen ${i + 1} subida con éxito:`, data)
          uploadedUrls.push(data.url)
          
        } catch (err) {
          console.error(`Error al subir imagen ${file.name}:`, err)
          failedUploads.push(file.name)
        }
      }

      // Enviar todas las URLs al final si hay múltiples archivos
      if (multiple && onMultipleUpload && uploadedUrls.length > 0) {
        onMultipleUpload(uploadedUrls)
      } else if (!multiple && uploadedUrls.length > 0) {
        // Para upload único, usar la función original
        onUpload(uploadedUrls[0])
      } else if (multiple && uploadedUrls.length > 0) {
        // Si no hay onMultipleUpload, llamar onUpload para cada URL
        uploadedUrls.forEach(url => onUpload(url))
      }

      // Mostrar resultado final
      if (uploadedUrls.length > 0 && failedUploads.length === 0) {
        setSuccess(`${uploadedUrls.length} imagen${uploadedUrls.length > 1 ? 's' : ''} subida${uploadedUrls.length > 1 ? 's' : ''} con éxito`)
      } else if (uploadedUrls.length > 0 && failedUploads.length > 0) {
        setSuccess(`${uploadedUrls.length} imagen${uploadedUrls.length > 1 ? 's' : ''} subida${uploadedUrls.length > 1 ? 's' : ''} con éxito`)
        setError(`Error al subir: ${failedUploads.join(", ")}`)
      } else {
        setError(`Error al subir todas las imágenes: ${failedUploads.join(", ")}`)
      }

    } catch (err) {
      console.error("Error general al subir imágenes:", err)
      setError(`Error al subir las imágenes: ${err instanceof Error ? err.message : 'Error desconocido'}`)
    } finally {
      setLoading(false)
      setUploadProgress(null)
      // Limpiar el input
      e.target.value = ""
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="image">
          {multiple ? "Subir imágenes (múltiples)" : "Subir imagen"}
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="image"
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleUpload}
            disabled={loading}
            className="w-full"
          />
          {loading && (
            <div className="text-sm text-muted-foreground">
              {uploadProgress 
                ? `Procesando ${uploadProgress.current}/${uploadProgress.total}...`
                : "Procesando..."
              }
            </div>
          )}
        </div>
        
        {/* Mostrar progreso visual */}
        {loading && uploadProgress && (
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
