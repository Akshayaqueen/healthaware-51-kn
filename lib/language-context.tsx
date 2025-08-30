"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Language, type TranslationKey, getTranslation } from "./i18n"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("healthaware_language") as Language
    if (savedLanguage) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("healthaware_language", lang)
  }

  const t = (key: TranslationKey) => getTranslation(key, language)

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}
