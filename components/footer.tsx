"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">{t("brandName")}</span>
            </div>
            <p className="text-gray-400 text-sm">
              {"Empowering rural communities with AI-powered health education and accessible healthcare information."}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{"Quick Links"}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/ai-podcast" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  {t("aiPodcast")}
                </Link>
              </li>
              <li>
                <Link href="/comics" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  {t("comics")}
                </Link>
              </li>
              <li>
                <Link href="/myth-buster" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  {t("mythBuster")}
                </Link>
              </li>
              <li>
                <Link
                  href="/healthcare-info"
                  className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                >
                  {t("healthcareInfo")}
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  {t("community")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{"Support"}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  {"Help Center"}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  {"Privacy Policy"}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  {"Terms of Service"}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  {"Contact Us"}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{"Contact"}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-emerald-400" />
                <span className="text-gray-400 text-sm">{"+91 108 (Emergency)"}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-emerald-400" />
                <span className="text-gray-400 text-sm">{"support@ruralpulse.org"}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-emerald-400" />
                <span className="text-gray-400 text-sm">{"Rural Health Initiative, India"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-top border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            {"© 2024 " + t("brandName") + ". All rights reserved. Made with ❤️ for rural communities."}
          </p>
        </div>
      </div>
    </footer>
  )
}
