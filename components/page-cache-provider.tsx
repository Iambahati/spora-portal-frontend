'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { usePathname } from 'next/navigation'

interface PageCacheEntry {
  component: ReactNode
  timestamp: number
  preloaded?: boolean
}

interface PageCacheContextType {
  cacheComponent: (path: string, component: ReactNode) => void
  getCachedComponent: (path: string) => ReactNode | null
  preloadPage: (path: string) => void
  clearCache: () => void
}

const PageCacheContext = createContext<PageCacheContextType | null>(null)

export function PageCacheProvider({ children }: { children: ReactNode }) {
  const [cache, setCache] = useState<Map<string, PageCacheEntry>>(new Map())
  const pathname = usePathname()

  // Cache management
  const cacheComponent = (path: string, component: ReactNode) => {
    setCache(prev => {
      const newCache = new Map(prev)
      newCache.set(path, {
        component,
        timestamp: Date.now(),
        preloaded: false
      })
      return newCache
    })
  }

  const getCachedComponent = (path: string): ReactNode | null => {
    const entry = cache.get(path)
    if (!entry) return null
    
    // Cache expires after 5 minutes
    if (Date.now() - entry.timestamp > 5 * 60 * 1000) {
      setCache(prev => {
        const newCache = new Map(prev)
        newCache.delete(path)
        return newCache
      })
      return null
    }
    
    return entry.component
  }

  const preloadPage = async (path: string) => {
    if (cache.has(path)) return

    try {
      // Dynamically import the React Router page components
      let componentModule
      switch (path) {
        case '/auth/signin':
          componentModule = await import('@/router/pages/auth/signin')
          break
        case '/auth/signup':
          componentModule = await import('@/router/pages/auth/signup')
          break
        case '/kyc-portal':
          componentModule = await import('@/router/pages/kyc-portal')
          break
        case '/auth/forgot-password':
          componentModule = await import('@/router/pages/auth/forgot-password')
          break
        case '/auth/reset-password':
          componentModule = await import('@/router/pages/auth/reset-password')
          break
        default:
          return
      }

      if (componentModule?.default) {
        const Component = componentModule.default
        setCache(prev => {
          const newCache = new Map(prev)
          newCache.set(path, {
            component: <Component />,
            timestamp: Date.now(),
            preloaded: true
          })
          return newCache
        })
      }
    } catch (error) {
      console.warn(`Failed to preload page: ${path}`, error)
    }
  }

  const clearCache = () => {
    setCache(new Map())
  }

  // Aggressive preloading on mount and route changes
  useEffect(() => {
    const criticalPaths = ['/auth/signin', '/auth/signup', '/kyc-portal', '/auth/forgot-password']
    
    // Preload all critical paths
    criticalPaths.forEach(path => {
      if (path !== pathname) {
        preloadPage(path)
      }
    })

    // Preload on user interaction
    const handleInteraction = () => {
      criticalPaths.forEach(path => preloadPage(path))
    }

    // Listen for various user interactions
    document.addEventListener('mousemove', handleInteraction, { once: true })
    document.addEventListener('scroll', handleInteraction, { once: true })
    document.addEventListener('keydown', handleInteraction, { once: true })
    document.addEventListener('touchstart', handleInteraction, { once: true })

    return () => {
      document.removeEventListener('mousemove', handleInteraction)
      document.removeEventListener('scroll', handleInteraction)
      document.removeEventListener('keydown', handleInteraction)
      document.removeEventListener('touchstart', handleInteraction)
    }
  }, [pathname])

  // Clean up old cache entries periodically
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setCache(prev => {
        const newCache = new Map()
        const now = Date.now()
        
        for (const [path, entry] of prev) {
          // Keep entries that are less than 5 minutes old
          if (now - entry.timestamp < 5 * 60 * 1000) {
            newCache.set(path, entry)
          }
        }
        
        return newCache
      })
    }, 2 * 60 * 1000) // Clean every 2 minutes

    return () => clearInterval(cleanupInterval)
  }, [])

  return (
    <PageCacheContext.Provider
      value={{
        cacheComponent,
        getCachedComponent,
        preloadPage,
        clearCache,
      }}
    >
      {children}
    </PageCacheContext.Provider>
  )
}

export function usePageCache() {
  const context = useContext(PageCacheContext)
  if (!context) {
    throw new Error('usePageCache must be used within a PageCacheProvider')
  }
  return context
}
