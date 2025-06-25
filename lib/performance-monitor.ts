'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface PerformanceMetrics {
  navigationStart: number
  routeChangeStart: number
  routeChangeComplete: number
  prefetchCount: number
  cacheHitRate: number
}

class RouterPerformanceMonitor {
  private metrics: PerformanceMetrics = {
    navigationStart: 0,
    routeChangeStart: 0,
    routeChangeComplete: 0,
    prefetchCount: 0,
    cacheHitRate: 0,
  }

  private prefetchCache = new Set<string>()
  private routeHits = new Map<string, number>()

  startNavigation(route: string) {
    this.metrics.navigationStart = performance.now()
    this.metrics.routeChangeStart = performance.now()
    
    // Track if route was prefetched
    if (this.prefetchCache.has(route)) {
      const currentHits = this.routeHits.get(route) || 0
      this.routeHits.set(route, currentHits + 1)
    }
  }

  completeNavigation() {
    this.metrics.routeChangeComplete = performance.now()
    
    const navigationTime = this.metrics.routeChangeComplete - this.metrics.navigationStart
    
    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 Navigation completed in ${navigationTime.toFixed(2)}ms`)
      console.log(`📊 Cache hit rate: ${this.getCacheHitRate().toFixed(2)}%`)
    }
  }

  trackPrefetch(route: string) {
    this.prefetchCache.add(route)
    this.metrics.prefetchCount++
  }

  getCacheHitRate(): number {
    const totalRequests = Array.from(this.routeHits.values()).reduce((sum, hits) => sum + hits, 0)
    return totalRequests > 0 ? (totalRequests / this.metrics.prefetchCount) * 100 : 0
  }

  getMetrics(): PerformanceMetrics & { cacheHitRate: number } {
    return {
      ...this.metrics,
      cacheHitRate: this.getCacheHitRate(),
    }
  }
}

export const performanceMonitor = new RouterPerformanceMonitor()

export function useRouterPerformance() {
  const pathname = usePathname()

  useEffect(() => {
    performanceMonitor.startNavigation(pathname)
    
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      performanceMonitor.completeNavigation()
    })
  }, [pathname])

  return {
    trackPrefetch: performanceMonitor.trackPrefetch.bind(performanceMonitor),
    getMetrics: performanceMonitor.getMetrics.bind(performanceMonitor),
  }
}
