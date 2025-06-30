"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

interface WhatsAppButtonProps {
  productName: string
  phoneNumber: string
  prefix?: string
}

export function WhatsAppButton({ productName, phoneNumber, prefix = "Hola! Me interesó" }: WhatsAppButtonProps) {
  const handleClick = () => {
    const message = encodeURIComponent(`${prefix} ${productName}`)
    const url = `https://wa.me/${phoneNumber}?text=${message}`
    window.open(url, "_blank")
  }

  return (
    <Button onClick={handleClick} className="w-full sm:w-auto bg-[#8A9A5B] hover:bg-[#798A4B] text-white">
      <MessageSquare className="mr-2 h-5 w-5" />
      Contactar por WhatsApp
    </Button>
  )
}
