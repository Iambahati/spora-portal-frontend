'use client'

import { Suspense, ReactNode } from 'react'
import { usePageCache } from '@/components/page-cache-provider'
import BankLoading from '@/components/bank-loading'

interface OptimizedSuspenseProps {
  children: ReactNode
  fallback?: ReactNode
  route?: string
}

export default function OptimizedSuspense({ 
  children, 
  fallback = <BankLoading size="lg" message="Loading..." />,
  route
}: OptimizedSuspenseProps) {
  const { getCachedComponent } = usePageCache()
  
  // Try to get cached component first
  if (route) {
    const cachedComponent = getCachedComponent(route)
    if (cachedComponent) {
      return <>{cachedComponent}</>
    }
  }

  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  )
}
