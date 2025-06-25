'use client'

import { useEffect, useState } from 'react'

interface PerformanceMetrics {
  bootTime: number
  authTime: number
  routerLoadTime: number
  totalLoadTime: number
}

let performanceStartTime = 0
let authStartTime = 0
let routerStartTime = 0

export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)

  useEffect(() => {
    // Mark boot start time
    performanceStartTime = performance.now()
    
    return () => {
      // Cleanup if component unmounts
    }
  }, [])

  const markAuthStart = () => {
    authStartTime = performance.now()
  }

  const markAuthEnd = () => {
    const authTime = performance.now() - authStartTime
    console.log(`Auth initialization took: ${authTime.toFixed(2)}ms`)
    return authTime
  }

  const markRouterStart = () => {
    routerStartTime = performance.now()
  }

  const markRouterEnd = () => {
    const routerLoadTime = performance.now() - routerStartTime
    console.log(`Router load took: ${routerLoadTime.toFixed(2)}ms`)
    return routerLoadTime
  }

  const markBootComplete = () => {
    const totalLoadTime = performance.now() - performanceStartTime
    const bootTime = performance.now() - performanceStartTime
    
    const newMetrics: PerformanceMetrics = {
      bootTime,
      authTime: authStartTime ? performance.now() - authStartTime : 0,
      routerLoadTime: routerStartTime ? performance.now() - routerStartTime : 0,
      totalLoadTime
    }
    
    setMetrics(newMetrics)
    
    console.log('Performance Metrics:', {
      'Total Boot Time': `${totalLoadTime.toFixed(2)}ms`,
      'Auth Time': `${newMetrics.authTime.toFixed(2)}ms`,
      'Router Load Time': `${newMetrics.routerLoadTime.toFixed(2)}ms`
    })
    
    return newMetrics
  }

  return {
    metrics,
    markAuthStart,
    markAuthEnd,
    markRouterStart,
    markRouterEnd,
    markBootComplete
  }
}

export function logPageTransition(from: string, to: string) {
  const startTime = performance.now()
  
  return () => {
    const transitionTime = performance.now() - startTime
    console.log(`Page transition ${from} → ${to}: ${transitionTime.toFixed(2)}ms`)
    return transitionTime
  }
}

// Global performance helper
export const performanceHelper = {
  startTime: 0,
  
  start() {
    this.startTime = performance.now()
  },
  
  end(label: string) {
    const duration = performance.now() - this.startTime
    console.log(`${label}: ${duration.toFixed(2)}ms`)
    return duration
  },
  
  measure(fn: () => any, label: string) {
    const start = performance.now()
    const result = fn()
    const duration = performance.now() - start
    console.log(`${label}: ${duration.toFixed(2)}ms`)
    return { result, duration }
  }
}
