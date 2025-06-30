"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function LogoutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setLoading(true)
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      // Forzar una recarga completa para asegurar que se actualice correctamente
      window.location.href = "/admin/login"
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleLogout} disabled={loading}>
      <LogOut className="mr-2 h-4 w-4" />
      {loading ? "Cerrando sesión..." : "Cerrar sesión"}
    </Button>
  )
}
