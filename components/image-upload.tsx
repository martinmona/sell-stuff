"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import imageCompression from "browser-image-compression"

interface ImageUploadProps {
  onUpload: (url: string) => void
}

export function ImageUpload({ onUpload }: ImageUploadProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen")
      setSuccess("")
      return
    }

    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const options = {
        maxSizeMB: 10,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: 0.8
      }

      console.log("Comprimiendo imagen:", file.name, `Tamaño original: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
      
      const compressedFile = await imageCompression(file, options)
      
      console.log("Imagen comprimida:", compressedFile.name, `Tamaño final: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`)

      const formData = new FormData()
      formData.append("file", compressedFile)

      console.log("Subiendo imagen comprimida...")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al subir la imagen")
      }

      console.log("Imagen subida con éxito:", data)
      setSuccess(`Imagen "${file.name}" subida con éxito (comprimida de ${(file.size / 1024 / 1024).toFixed(2)}MB a ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB)`)
      onUpload(data.url)
    } catch (err) {
      console.error("Error al subir imagen:", err)
      setError(`Error al subir la imagen: ${err instanceof Error ? err.message : 'Error desconocido'}`)
    } finally {
      setLoading(false)
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
        <Label htmlFor="image">Subir imagen</Label>
        <div className="flex items-center gap-2">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={loading}
            className="w-full"
          />
          {loading && <span className="text-sm text-muted-foreground">Comprimiendo y subiendo...</span>}
        </div>
      </div>
    </div>
  )
}
