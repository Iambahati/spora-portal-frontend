"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { useI18n } from "@/lib/i18n/context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { DemoModeBanner } from "@/components/demo-mode-banner"

interface RouterAuthLayoutProps {
  children: React.ReactNode
}

export default function RouterAuthLayout({ children }: RouterAuthLayoutProps) {
  const { t } = useI18n()

  return (
    <div className="min-h-screen flex relative">
      {/* Demo Mode Banner */}
      <DemoModeBanner />
      
      {/* Full Screen Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/banking-hero.png')`,
          }}
        />
        {/* Gradient overlay that gets stronger towards the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/40 to-black/60" />
      </div>

      {/* Content overlay (left side) */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10">
        <div className="flex flex-col justify-center px-12 py-8 text-white">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Spora One Trust
            </h1>
            <p className="text-xl mb-8 text-white/90 leading-relaxed">
              Your trusted investment partner
            </p>
          </div>
        </div>
      </div>

      {/* Form section (right side) */}
      <div className="flex-1 lg:w-1/2 relative z-10 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Language switcher */}
          <div className="absolute top-6 right-6">
            <LanguageSwitcher />
          </div>
          
          {children}
          
          {/* Footer with About Us link */}
          {/* <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <Link 
                to="/about-us"
                className="hover:text-primary transition-colors hover:underline"
              >
                About Us
              </Link>
              <span>•</span>
              <span>© 2024 Spora One Trust</span>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}
