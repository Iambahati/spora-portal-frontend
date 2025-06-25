'use client'

import React from "react"
import { cn } from "@/lib/utils"

interface BankLoadingProps {
  size?: "sm" | "md" | "lg"
  message?: string
  className?: string
}

export default function BankLoading({ 
  size = "md", 
  message = "Loading...", 
  className 
}: BankLoadingProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  }

  const logoSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  }

  const messageSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }

  return (
    <div className={cn(
      "min-h-screen flex flex-col items-center justify-center gap-4",
      "bg-background",
      className
    )}>
      {/* Simple Logo */}
      <div className={cn(
        "flex items-center justify-center",
        size === "sm" && "w-16 h-16",
        size === "md" && "w-24 h-24", 
        size === "lg" && "w-32 h-32"
      )}>
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 200 60" 
          className="text-primary"
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
      </div>

      {/* Loading Message */}
      <p className={cn(
        "text-muted-foreground text-center",
        messageSizeClasses[size]
      )}>
        {message}
      </p>

      {/* Simple Progress Bar */}
      <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary animate-pulse rounded-full w-1/3"></div>
      </div>
    </div>
  )
}
