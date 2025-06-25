'use client'

import React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { useI18n } from "@/lib/i18n/context"
import { Bell, Info, Scale } from "lucide-react"

interface NavigationHeaderProps {
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
  title?: string;
  subtitle?: string;
  showNotifications?: boolean;
}

export function NavigationHeader({ 
  user, 
  title = "Investment Dashboard", 
  subtitle,
  showNotifications = true 
}: NavigationHeaderProps) {
  const { t } = useI18n()

  return (
    <div className="border-b border-slate-200 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <svg 
                width="120" 
                height="40" 
                viewBox="0 0 200 60" 
                className="text-[#eb6e03]"
                aria-label="Spora One Trust"
              >
                <rect x="10" y="10" width="40" height="40" rx="8" fill="currentColor" className="opacity-90"/>
                <circle cx="30" cy="20" r="3" fill="white"/>
                <circle cx="30" cy="30" r="3" fill="white"/>
                <circle cx="30" cy="40" r="3" fill="white"/>
                <text x="60" y="25" fontSize="16" fontWeight="600" fill="currentColor" fontFamily="system-ui">
                  Spora One
                </text>
                <text x="60" y="42" fontSize="12" fontWeight="400" fill="currentColor" fontFamily="system-ui" className="opacity-80">
                  Trust
                </text>
              </svg>
              <div>
                <p className="text-sm text-slate-600">{title}</p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/dashboard">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-slate-600 hover:text-[#040956] hover:bg-slate-100 flex items-center gap-2"
              >
                <Info className="h-4 w-4" />
                {t("nav.dashboard")}
              </Button>
              </Link>
              <Link to="/about-us">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-slate-600 hover:text-[#040956] hover:bg-slate-100 flex items-center gap-2"
              >
                <Info className="h-4 w-4" />
                {t("nav.aboutUs")}
              </Button>
              </Link>
              <Link to="/legal">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-slate-600 hover:text-[#040956] hover:bg-slate-100 flex items-center gap-2"
              >
                <Scale className="h-4 w-4" />
                {t("nav.legal")}
              </Button>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications Badge */}
            {showNotifications && (
              <div className="relative">
                <Button variant="outline" size="sm" className="p-2 h-10 w-10 rounded-full border-slate-200 hover:bg-slate-50">
                  <Bell className="h-5 w-5 text-slate-600" />
                </Button>
                <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">3</span>
                </div>
              </div>
            )}

            {/* Profile Dropdown */}
            <ProfileDropdown user={user} />
          </div>
        </div>
      </div>
    </div>
  )
}
