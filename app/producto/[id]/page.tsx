import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { ImageCarousel } from "@/components/image-carousel"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { ReservedBadge } from "@/components/reserved-badge"
import { getProductById } from "@/lib/products"
import { formatPrice } from "@/lib/utils"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const productId = Number.parseInt(params.id)

  if (isNaN(productId)) {
    notFound()
  }

  const product = await getProductById(productId)

  if (!product) {
    notFound()
  }

  // Número de WhatsApp sin el signo +
  const whatsappNumber = "5491151524949"

  // Asegurarnos de que siempre tengamos al menos una imagen
  const productImages =
    product.images && product.images.length > 0 ? product.images : [product.mainImage || "/generic-product-display.png"]

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar showBackButton={true} backButtonText="Volver" backButtonHref="/" />
      <div className="container py-6 flex-1">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <ImageCarousel images={productImages} productName={product.name} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-[#2B2B2B]">{product.name}</h1>
              <ReservedBadge reserved={product.reserved} />
            </div>
            <p className="text-2xl font-bold text-[#D55E43]">{formatPrice(product.price)}</p>

            <div className="pt-4">
              <h2 className="text-xl font-semibold mb-2 text-[#2B2B2B]">Descripción</h2>
              <p className="text-muted-foreground whitespace-pre-line">{product.description}</p>
            </div>

            <div className="pt-6">
              <WhatsAppButton
                productName={product.name}
                phoneNumber={whatsappNumber}
                prefix={product.reserved ? "Hola! Me interesó, aunque veo que está reservado:" : "Hola! Me interesó:"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
