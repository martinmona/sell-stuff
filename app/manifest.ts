import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vendo Cositas",
    short_name: "Vendo Cositas",
    description: "No es lo que soñaste, pero está bueno igual",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF9F5",
    theme_color: "#D55E43",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
