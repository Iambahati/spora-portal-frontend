'use client'

import { useEffect, useCallback } from 'react'
import { useFastRouter } from '@/hooks/use-fast-router'

interface RoutePattern {
  from: string
  to: string[]
  weight: number
}

// Intelligent route prediction based on user patterns
const ROUTE_PATTERNS: RoutePattern[] = [
  // From home page
  { from: '/', to: ['/auth/signin', '/auth/signup'], weight: 0.8 },
  
  // From auth pages
  { from: '/auth/signin', to: ['/kyc-portal', '/', '/auth/signup'], weight: 0.9 },
  { from: '/auth/signup', to: ['/kyc-portal', '/auth/signin'], weight: 0.85 },
  { from: '/auth/forgot-password', to: ['/auth/signin', '/auth/reset-password'], weight: 0.7 },
  { from: '/auth/reset-password', to: ['/auth/signin'], weight: 0.9 },
  
  // From KYC portal
  { from: '/kyc-portal', to: ['/', '/auth/signin'], weight: 0.6 },
]

export interface RoutePreloaderProps {
  /**
   * Enable intelligent prefetching based on user patterns
   */
  enableIntelligentPrefetch?: boolean
  
  /**
   * Prefetch routes when user is idle
   */
  enableIdlePrefetch?: boolean
  
  /**
   * Delay before idle prefetching starts (ms)
   */
  idleDelay?: number
  
  /**
   * Maximum number of routes to prefetch per session
   */
  maxPrefetchCount?: number

  /**
   * Routes to prefetch
   */
  routes: string[]
}

export default function RoutePreloader({
  enableIntelligentPrefetch = true,
  enableIdlePrefetch = true,
  idleDelay = 2000,
  maxPrefetchCount = 10,
  routes,
}: RoutePreloaderProps) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/'
  const { prefetchBatch, prefetchCacheSize } = useFastRouter()

  // Intelligent prefetching based on current route
  const prefetchLikelyRoutes = useCallback(() => {
    if (!enableIntelligentPrefetch || prefetchCacheSize >= maxPrefetchCount) {
      return
    }

    const currentPattern = ROUTE_PATTERNS.find(pattern => pattern.from === pathname)
    if (currentPattern) {
      // Sort routes by weight and prefetch most likely ones
      const sortedRoutes = currentPattern.to
        .map(route => ({ route, weight: currentPattern.weight }))
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 3) // Prefetch top 3 likely routes
        .map(item => item.route)

      prefetchBatch(sortedRoutes)
    }
  }, [pathname, enableIntelligentPrefetch, prefetchBatch, prefetchCacheSize, maxPrefetchCount])

  // Idle-based prefetching
  useEffect(() => {
    if (!enableIdlePrefetch) return

    let idleTimer: NodeJS.Timeout
    let isIdle = false

    const resetIdleTimer = () => {
      if (idleTimer) clearTimeout(idleTimer)
      isIdle = false
      
      idleTimer = setTimeout(() => {
        isIdle = true
        prefetchLikelyRoutes()
      }, idleDelay)
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    
    // Set up event listeners
    events.forEach(event => {
      document.addEventListener(event, resetIdleTimer, true)
    })

    // Initial timer
    resetIdleTimer()

    return () => {
      if (idleTimer) clearTimeout(idleTimer)
      events.forEach(event => {
        document.removeEventListener(event, resetIdleTimer, true)
      })
    }
  }, [enableIdlePrefetch, idleDelay, prefetchLikelyRoutes])

  // Prefetch on route change
  useEffect(() => {
    if (enableIntelligentPrefetch) {
      // Small delay to allow current page to load first
      const timer = setTimeout(prefetchLikelyRoutes, 100)
      return () => clearTimeout(timer)
    }
  }, [pathname, enableIntelligentPrefetch, prefetchLikelyRoutes])

  // Prefetch during browser idle time using requestIdleCallback
  useEffect(() => {
    if (!enableIdlePrefetch || typeof window === 'undefined') return

    let idleCallbackId: number

    const scheduleIdlePrefetch = () => {
      if ('requestIdleCallback' in window) {
        idleCallbackId = window.requestIdleCallback(
          () => {
            prefetchLikelyRoutes()
          },
          { timeout: 5000 } // Maximum 5 seconds wait
        )
      }
    }

    // Schedule after a short delay
    const timer = setTimeout(scheduleIdlePrefetch, 1000)

    return () => {
      clearTimeout(timer)
      if (idleCallbackId && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleCallbackId)
      }
    }
  }, [pathname, enableIdlePrefetch, prefetchLikelyRoutes])

  // Prefetch on connection speed changes (when switching to faster connection)
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) return

    // Type assertion for experimental API
    const connection = (navigator as any).connection

    const handleConnectionChange = () => {
      // Prefetch more aggressively on fast connections
      if (connection?.effectiveType === '4g' && connection?.downlink > 10) {
        prefetchLikelyRoutes()
      }
    }

    connection?.addEventListener('change', handleConnectionChange)
    
    return () => {
      connection?.removeEventListener('change', handleConnectionChange)
    }
  }, [prefetchLikelyRoutes])

  // Preload critical resources based on viewport size (mobile vs desktop patterns)
  useEffect(() => {
    const isMobile = window.innerWidth < 768
    
    if (isMobile) {
      // Mobile users more likely to use auth flows
      const mobileRoutes = ['/auth/signin', '/auth/signup']
      setTimeout(() => prefetchBatch(mobileRoutes), 500)
    } else {
      // Desktop users might explore more
      const desktopRoutes = ['/kyc-portal', '/auth/signin']
      setTimeout(() => prefetchBatch(desktopRoutes), 300)
    }
  }, [prefetchBatch])

  return null // This component doesn't render anything
}
