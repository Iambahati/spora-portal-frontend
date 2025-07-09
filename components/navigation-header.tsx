'use client'

import React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { useI18n } from "@/lib/i18n/context"
import { Bell } from "lucide-react"
import type { UserProfile } from '../types/api/index'

interface NavigationHeaderProps {
  user?: UserProfile;
  showNotifications?: boolean;
}

export function NavigationHeader({ 
  user, 
  showNotifications = true 
}: NavigationHeaderProps) {

  return (
    <div className="border-b border-slate-200 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Logo: strict inline SVG only, no text */}
            <div className="flex items-center">
              <img 
                src="/images/logo.jpg" 
                alt="Spora One Trust Logo" 
                className="w-25 h-12 object-contain" 
                draggable={false}
              />
            </div>
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
