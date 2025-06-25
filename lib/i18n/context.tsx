import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { translations, type Language } from "./translations"

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  languages: { code: Language; name: string; flag: string }[]
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export const languages = [
  { code: "en" as Language, name: "English", flag: "🇺🇸" },
  { code: "sw" as Language, name: "Swahili", flag: "🇰🇪" },
]

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  // Load saved language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage)
    } else {
      // Detect browser language
      const browserLang = navigator.language
      if (browserLang.startsWith("sw")) {
        setLanguageState("sw")
      } else {
        setLanguageState("en")
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  // Translation function with nested key support
  const t = (key: string): string => {
    const keys = key.split(".")
    let value: any = translations[language]

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k]
      } else {
        // Fallback to English if key not found
        value = translations.en
        for (const fallbackKey of keys) {
          if (value && typeof value === "object" && fallbackKey in value) {
            value = value[fallbackKey]
          } else {
            return key // Return key if not found in fallback
          }
        }
        break
      }
    }

    return typeof value === "string" ? value : key
  }

  return <I18nContext.Provider value={{ language, setLanguage, t, languages }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
