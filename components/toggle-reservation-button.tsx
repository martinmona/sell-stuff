"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BookmarkIcon, BookmarkXIcon } from "lucide-react"

interface ToggleReservationButtonProps {
  productId: number
  initialReserved: boolean
  onToggle?: (newState: boolean) => void
}

export default function ToggleReservationButton({
  productId,
  initialReserved,
  onToggle,
}: ToggleReservationButtonProps) {
  const [reserved, setReserved] = useState(initialReserved)
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/products/${productId}/toggle-reservation`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        setReserved(data.reserved)
        if (onToggle) {
          onToggle(data.reserved)
        }
      } else {
        console.error("Error al cambiar estado de reserva:", await response.json())
      }
    } catch (error) {
      console.error("Error al cambiar estado de reserva:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      disabled={loading}
      title={reserved ? "Quitar reserva" : "Marcar como reservado"}
    >
      {loading ? (
        "..."
      ) : reserved ? (
        <>
          <BookmarkXIcon className="h-4 w-4 mr-2" />
          <span className="sr-only md:not-sr-only md:ml-2">Quitar reserva</span>
        </>
      ) : (
        <>
          <BookmarkIcon className="h-4 w-4 mr-2" />
          <span className="sr-only md:not-sr-only md:ml-2">Reservar</span>
        </>
      )}
    </Button>
  )
}
