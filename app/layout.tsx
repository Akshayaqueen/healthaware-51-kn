import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { LanguageProvider } from "@/lib/language-context"
import { ThemeProvider } from "@/lib/theme-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PWAInstall } from "@/components/pwa-install"
import { I18nHead } from "@/components/i18n-head"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RuralPulse - Rural Health Education Platform",
  description:
    "RuralPulse empowers rural communities with AI-powered health education, interactive comics, and accessible healthcare information.",
  manifest: "/manifest.json",
  themeColor: "#10b981",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  generator: "v0.app",
  openGraph: {
    siteName: "RuralPulse",
    title: "RuralPulse - Rural Health Education Platform",
    description:
      "RuralPulse empowers rural communities with AI-powered health education, interactive comics, and accessible healthcare information.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RuralPulse - Rural Health Education Platform",
    description:
      "RuralPulse empowers rural communities with AI-powered health education, interactive comics, and accessible healthcare information.",
  },
}

function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          {/* Client-side metadata sync with language */}
          <I18nHead />
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <PWAInstall />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
