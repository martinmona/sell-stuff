import { Badge } from "@/components/ui/badge"

interface ReservedBadgeProps {
  reserved: boolean
  className?: string
}

export function ReservedBadge({ reserved, className = "" }: ReservedBadgeProps) {
  if (!reserved) return null

  return (
    <Badge variant="secondary" className={`bg-[#D55E43]/10 text-[#D55E43] hover:bg-[#D55E43]/20 ${className}`}>
      Reservado
    </Badge>
  )
}
