import type React from "react"
import { useI18n } from "@/lib/i18n/context"
import { LanguageSwitcher } from "@/components/language-switcher"
import RoutePreloader from "@/components/route-preloader"

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useI18n()

  // If you want to keep prefetching, use RoutePreloader or implement with React Router if needed.

  return (
    <div className="min-h-screen flex relative">
      <RoutePreloader routes={['/kyc-upload', '/auth/signin', '/auth/signup', '/auth/forgot-password']} />
      
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
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-4">{t("brand.name")}</h1>
            <p className="text-xl mb-2">{t("brand.tagline")}</p>
            <p className="text-lg opacity-90">{t("brand.description")}</p>
          </div>
        </div>

        {/* Logo positioned at top left */}
        <div className="absolute top-8 left-8 z-20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#eb6e03] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">FB</span>
            </div>
            <span className="text-2xl font-bold text-white drop-shadow-lg">{t("brand.name")}</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white/20 backdrop-blur-sm relative z-10">
        {/* We don't need a separate mobile background overlay anymore since we have a full-screen background */}

        {/* Mobile logo */}
        <div className="lg:hidden absolute top-8 left-8 z-20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#eb6e03] rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">FB</span>
            </div>
            <span className="text-xl font-bold text-[#040956]">{t("brand.name")}</span>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="absolute top-8 right-8 z-20">
          <LanguageSwitcher />
        </div>

        <div className="relative z-10 w-full max-w-md">{children}</div>
      </div>

      {/* Footer */}
      {/* <div className="absolute bottom-8 right-8 lg:right-1/4">
        <p className="text-slate-500 text-sm">{t("brand.copyright")}</p>
      </div> */}
    </div>
  )
}
