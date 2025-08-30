"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/lib/language-context"

// Dynamically sync document.title and meta description with current language.
// Keeps server Metadata intact while ensuring client-side metadata respects language choice.
export function I18nHead() {
  const pathname = usePathname()
  const { t } = useLanguage()

  useEffect(() => {
    const routeKey = (() => {
      if (pathname === "/") return "home"
      if (pathname.startsWith("/comics")) return "comics"
      if (pathname.startsWith("/ai-podcast") || pathname.startsWith("/ai-radio")) return "podcast"
      if (pathname.startsWith("/myth-buster")) return "myth"
      if (pathname.startsWith("/healthcare-info")) return "healthcare"
      if (pathname.startsWith("/community")) return "community"
      if (pathname.startsWith("/profile")) return "profile"
      if (pathname.startsWith("/settings")) return "settings"
      return "home"
    })()

    const titleMap: Record<string, string> = {
      home: t("metaHomeTitle"),
      comics: t("metaComicsTitle"),
      podcast: t("metaPodcastTitle"),
      myth: t("metaMythTitle"),
      healthcare: t("metaHealthcareTitle"),
      community: t("metaCommunityTitle"),
      profile: t("metaProfileTitle"),
      settings: t("metaSettingsTitle"),
    }

    const descMap: Record<string, string> = {
      home: t("metaHomeDesc"),
      comics: t("metaComicsDesc"),
      podcast: t("metaPodcastDesc"),
      myth: t("metaMythDesc"),
      healthcare: t("metaHealthcareDesc"),
      community: t("metaCommunityDesc"),
      profile: t("metaProfileDesc"),
      settings: t("metaSettingsDesc"),
    }

    document.title = titleMap[routeKey]

    const ensureMeta = (name: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement("meta")
        el.setAttribute("name", name)
        document.head.appendChild(el)
      }
      return el
    }

    const ensureOg = (property: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement("meta")
        el.setAttribute("property", property)
        document.head.appendChild(el)
      }
      return el
    }

    const desc = descMap[routeKey]
    ensureMeta("description").setAttribute("content", desc)
    ensureOg("og:title").setAttribute("content", titleMap[routeKey])
    ensureOg("og:description").setAttribute("content", desc)
    ensureOg("og:site_name").setAttribute("content", t("brandName"))
    ensureMeta("twitter:title").setAttribute("content", titleMap[routeKey])
    ensureMeta("twitter:description").setAttribute("content", desc)
  }, [pathname, t])

  return null
}
