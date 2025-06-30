"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
      const formData = new FormData()
      formData.append("file", file)

      console.log("Subiendo imagen:", file.name)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al subir la imagen")
      }

      console.log("Imagen subida con éxito:", data)
      setSuccess(`Imagen "${file.name}" subida con éxito`)
      onUpload(data.url)
    } catch (err) {
      console.error("Error al subir imagen:", err)
      setError("Error al subir la imagen")
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
          {loading && <span className="text-sm text-muted-foreground">Subiendo...</span>}
        </div>
      </div>
    </div>
  )
}
