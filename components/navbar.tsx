import Link from "next/link"
import { Home, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  showBackButton?: boolean
  backButtonText?: string
  backButtonHref?: string
}

export function Navbar({ showBackButton = false, backButtonText = "Volver", backButtonHref = "/" }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container flex h-16 items-center">
        {showBackButton ? (
          <div className="flex items-center space-x-4">
            <Link href={backButtonHref}>
              <Button variant="ghost" className="pl-0 text-[#2B2B2B]">
                <ChevronLeft className="mr-2 h-4 w-4" />
                {backButtonText}
              </Button>
            </Link>
          </div>
        ) : (
          <Link href="/" className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-[#D55E43]" />
            <span className="font-bold text-lg text-[#2B2B2B]">Vendo Cositas</span>
          </Link>
        )}
        <div className="flex flex-1 items-center justify-end">
          {/* Podríamos añadir más elementos de navegación aquí si fuera necesario */}
        </div>
      </div>
    </header>
  )
}
