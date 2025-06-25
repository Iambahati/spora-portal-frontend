'use client'

import { useEffect, useState } from 'react'

interface FastLoadingProps {
  message?: string
  timeout?: number
  onTimeout?: () => void
}

export default function FastLoading({ 
  message = "Loading...", 
  timeout = 2000,
  onTimeout 
}: FastLoadingProps) {
  const [hasTimedOut, setHasTimedOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasTimedOut(true)
      onTimeout?.()
    }, timeout)

    return () => clearTimeout(timer)
  }, [timeout, onTimeout])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Logo */}
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#eb6e03] to-[#d85a02] rounded-3xl flex items-center justify-center shadow-2xl">
          <span className="text-white font-bold text-2xl">ST</span>
        </div>
        
        {/* Loading Spinner */}
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-[#eb6e03] mx-auto"></div>
          <div className="absolute inset-0 animate-ping animate-pulse rounded-full h-12 w-12 border-2 border-[#eb6e03]/30 mx-auto"></div>
        </div>
        
        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[#040956]">Spora One Trust</h2>
          <p className="text-slate-600 text-lg">{message}</p>
          {hasTimedOut && (
            <p className="text-slate-500 text-sm">
              Taking longer than expected...
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
