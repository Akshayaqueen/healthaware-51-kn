import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HealthAware - Modern Health Awareness Platform",
    short_name: "HealthAware",
    description:
      "Empowering rural communities with AI-powered health education, interactive comics, myth busting, and healthcare information.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    orientation: "portrait",
    scope: "/",
    icons: [
      {
        src: "/placeholder-logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/placeholder-logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["health", "education", "medical"],
    lang: "en",
    dir: "ltr",
  }
}
