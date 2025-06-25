import { useRouter } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { performanceMonitor } from '@/lib/performance-monitor'

export function useFastNavigation() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const navigate = useCallback((path: string, options?: { replace?: boolean }) => {
    // Track navigation start for performance monitoring
    performanceMonitor.startNavigation(path)
    
    startTransition(() => {
      if (options?.replace) {
        router.replace(path)
      } else {
        router.push(path)
      }
    })
  }, [router])

  const prefetch = useCallback((path: string) => {
    router.prefetch(path)
    // Track prefetch for performance monitoring
    performanceMonitor.trackPrefetch(path)
  }, [router])

  return {
    navigate,
    prefetch,
    isPending,
  }
}
