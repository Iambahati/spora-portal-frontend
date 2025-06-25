import { useNavigate, useLocation } from 'react-router-dom'
import { useCallback, useTransition, useEffect, useRef, useState } from 'react'

interface FastRouterOptions {
  replace?: boolean
  state?: any
}

interface NavigationState {
  isNavigating: boolean
  destination: string | null
  error: string | null
}

export function useFastRouter() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isPending, startTransition] = useTransition()
  const [navigationState, setNavigationState] = useState<NavigationState>({
    isNavigating: false,
    destination: null,
    error: null
  })
  
  const prefetchCache = useRef(new Set<string>())
  const navigationTimeout = useRef<NodeJS.Timeout | null>(null)

  // Common routes that might benefit from prefetching
  const commonRoutes = [
    '/auth/signin',
    '/auth/signup', 
    '/kyc-portal',
    '/dashboard',
    '/legal',
    '/'
  ]

  useEffect(() => {
    // For React Router, we can't actually prefetch routes like Next.js
    // But we can mark them as "prefetched" for our cache logic
    commonRoutes.forEach(route => {
      prefetchCache.current.add(route)
    })
  }, [])

  // Enhanced navigation function with React Router
  const navigateToRoute = useCallback((path: string, options: FastRouterOptions = {}) => {
    const { replace = false, state } = options
    
    // Clear any existing navigation timeout
    if (navigationTimeout.current) {
      clearTimeout(navigationTimeout.current)
    }

    // Set navigation state immediately for instant feedback
    setNavigationState({
      isNavigating: true,
      destination: path,
      error: null
    })

    // Mark as prefetched for cache logic
    prefetchCache.current.add(path)

    // Use React 18 transitions for non-blocking navigation
    startTransition(() => {
      try {
        navigate(path, { replace, state })
      } catch (error) {
        setNavigationState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Navigation failed'
        }))
      }
    })

    // Set timeout to clear navigation state if it takes too long
    navigationTimeout.current = setTimeout(() => {
      setNavigationState({
        isNavigating: false,
        destination: null,
        error: null
      })
    }, 5000) // 5 second timeout

  }, [navigate])

  // Reset navigation state when pathname changes (navigation complete)
  useEffect(() => {
    if (navigationTimeout.current) {
      clearTimeout(navigationTimeout.current)
    }
    
    setNavigationState({
      isNavigating: false,
      destination: null,
      error: null
    })
  }, [location.pathname])

  // Enhanced prefetch with intelligent caching (simplified for React Router)
  const prefetch = useCallback((path: string) => {
    if (!prefetchCache.current.has(path)) {
      // In React Router, we can't truly prefetch like Next.js
      // But we can mark it as "prefetched" for our cache logic
      prefetchCache.current.add(path)
      
      // Auto-expire prefetch cache after 5 minutes
      setTimeout(() => {
        prefetchCache.current.delete(path)
      }, 5 * 60 * 1000)
    }
  }, [])

  // Batch prefetch multiple routes
  const prefetchBatch = useCallback((paths: string[]) => {
    // Use requestIdleCallback for non-blocking prefetching
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        paths.forEach(path => prefetch(path))
      })
    } else {
      // Fallback to setTimeout
      setTimeout(() => {
        paths.forEach(path => prefetch(path))
      }, 0)
    }
  }, [prefetch])

  // Intelligent hover prefetching
  const prefetchOnHover = useCallback((path: string) => {
    // Delay prefetch slightly to avoid unnecessary requests
    setTimeout(() => {
      prefetch(path)
    }, 100)
  }, [prefetch])

  // Get navigation progress (useful for loading indicators)
  const getNavigationProgress = useCallback(() => {
    if (!navigationState.isNavigating) return 0
    // Simple progress simulation - in real app you might track actual loading
    return isPending ? 75 : 90
  }, [navigationState.isNavigating, isPending])

  // Force refresh current route (React Router equivalent)
  const refresh = useCallback(() => {
    // React Router doesn't have a direct refresh method
    // We can navigate to the same location to trigger a re-render
    navigate(location.pathname, { replace: true })
  }, [navigate, location.pathname])

  // Navigate back with enhanced performance
  const back = useCallback(() => {
    startTransition(() => {
      navigate(-1)
    })
  }, [navigate])

  // Navigate forward with enhanced performance  
  const forward = useCallback(() => {
    startTransition(() => {
      navigate(1)
    })
  }, [navigate])

  // Check if a route is prefetched
  const isPrefetched = useCallback((path: string) => {
    return prefetchCache.current.has(path)
  }, [])

  return {
    // Navigation methods
    navigate: navigateToRoute,
    back,
    forward,
    refresh,
    
    // Prefetching methods
    prefetch,
    prefetchBatch,
    prefetchOnHover,
    isPrefetched,
    
    // State
    isNavigating: navigationState.isNavigating || isPending,
    navigationDestination: navigationState.destination,
    navigationError: navigationState.error,
    navigationProgress: getNavigationProgress(),
    
    // Current route info
    pathname: location.pathname,
    
    // Cache info
    prefetchCacheSize: prefetchCache.current.size,
  }
}

// Hook for creating fast navigation links with hover prefetching
export function useFastLink(to: string) {
  const { navigate, prefetchOnHover, isPrefetched } = useFastRouter()
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    navigate(to)
  }, [navigate, to])
  
  const handleMouseEnter = useCallback(() => {
    prefetchOnHover(to)
  }, [prefetchOnHover, to])
  
  return {
    to,
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    'data-prefetched': isPrefetched(to),
  }
}
