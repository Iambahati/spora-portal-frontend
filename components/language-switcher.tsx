"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe, Check } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export function LanguageSwitcher() {
  const { language, setLanguage, languages } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find((lang) => lang.code === language)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 border-slate-200 hover:bg-slate-50 bg-white/90 backdrop-blur-sm"
        >
          <Globe className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">{currentLanguage?.name}</span>
          <span className="sm:hidden">{currentLanguage?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => {
              setLanguage(lang.code)
              setIsOpen(false)
            }}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center">
              <span className="mr-2">{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
            {language === lang.code && <Check className="h-4 w-4 text-[#eb6e03]" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
