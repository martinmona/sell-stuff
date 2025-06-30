"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  // Efecto para redirigir después de un login exitoso
  useEffect(() => {
    if (success) {
      // Pequeño retraso para asegurar que la cookie se haya establecido
      const redirectTimer = setTimeout(() => {
        // Forzar una recarga completa de la página para asegurar que se actualice correctamente
        window.location.href = "/admin"
      }, 1000)

      return () => clearTimeout(redirectTimer)
    }
  }, [success])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    setSuccess(false)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        console.log("Login exitoso, redirigiendo...")
        setSuccess(true)
        // La redirección se maneja en el useEffect
      } else {
        setError(data.message || "Error al iniciar sesión")
      }
    } catch (err) {
      setError("Error al conectar con el servidor")
      console.error("Error de login:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Iniciar sesión</CardTitle>
            <CardDescription>Accede al panel de administración</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <AlertDescription>Login exitoso. Redirigiendo...</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading || success}>
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
