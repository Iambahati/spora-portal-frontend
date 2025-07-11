import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { User, LogOut, Settings } from "lucide-react"
import type { UserProfile } from '../types/api/index'

interface ProfileDropdownProps {
  user?: UserProfile
}

export function ProfileDropdown({ user }: ProfileDropdownProps) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/auth/signin", { replace: true })
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const photo = user?.photo_url;
  const isInitials = typeof photo === 'string' && photo.length === 2 && photo === photo.toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-2 h-auto rounded-full bg-white hover:bg-gray-100 transition-colors shadow-md border border-gray-200"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 font-bold text-base shadow-sm border border-gray-300">
            {isInitials
              ? photo
              : photo
              ? <img src={photo} alt={user?.full_name} className="w-9 h-9 rounded-full object-cover border border-gray-300" />
              : user?.full_name?.split(' ').map(name => name[0]).join('').toUpperCase()}
          </div>
          <span className="text-sm font-semibold text-gray-800">
            {user?.full_name || "User Name"}
          </span>
          <svg
            className="ml-1 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64 p-0" align="end" forceMount>
        {/* Profile option */}
        <DropdownMenuItem asChild className="p-0">
          <Link
            to="/profile"
            className="flex items-center gap-3 p-4 w-full cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <User className="h-5 w-5 text-gray-500" />
            <span className="text-base text-gray-900">My profile</span>
          </Link>
        </DropdownMenuItem>
        
        {/* Logout option */}
        <DropdownMenuItem asChild className="p-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-4 w-full cursor-pointer hover:bg-gray-50 transition-colors text-left"
          >
            <LogOut className="h-5 w-5 text-gray-500" />
            <span className="text-base text-gray-900">Logout</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
