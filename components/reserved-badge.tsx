import { Badge } from "@/components/ui/badge"

interface ReservedBadgeProps {
  reserved: boolean
  className?: string
}

export function ReservedBadge({ reserved, className = "" }: ReservedBadgeProps) {
  if (!reserved) return null

  return (
    <Badge variant="secondary" className={`bg-red-500 text-white hover:bg-red-600 font-semibold px-3 py-1 shadow-md ${className}`}>
      Reservado
    </Badge>
  )
}
