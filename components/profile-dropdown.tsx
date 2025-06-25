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
import { User, LogOut, Settings, ChevronDown, Info } from "lucide-react"

interface ProfileDropdownProps {
  user?: {
    name?: string
    email?: string
    avatar?: string
  }
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-2 h-auto rounded-full bg-white hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm font-medium text-gray-700">
            {user?.name || "User Name"}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
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
        
        {/* Settings option */}
        <DropdownMenuItem asChild className="p-0">
          <Link
            to="/settings"
            className="flex items-center gap-3 p-4 w-full cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <Settings className="h-5 w-5 text-gray-500" />
            <span className="text-base text-gray-900">Settings</span>
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
