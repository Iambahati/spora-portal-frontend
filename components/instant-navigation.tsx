'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function InstantNavigation() {
  const [isNavigating, setIsNavigating] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleStart = () => {
      setIsNavigating(true)
    }

    const handleComplete = () => {
      // Keep the loading state briefly for smooth transition
      timeoutId = setTimeout(() => {
        setIsNavigating(false)
      }, 150)
    }

    // Listen for navigation events
    const originalPush = window.history.pushState
    const originalReplace = window.history.replaceState

    window.history.pushState = function(...args) {
      handleStart()
      originalPush.apply(window.history, args)
    }

    window.history.replaceState = function(...args) {
      handleStart()
      originalReplace.apply(window.history, args)
    }

    // Listen for popstate (back/forward navigation)
    window.addEventListener('popstate', handleStart)

    // Navigation complete when pathname changes
    handleComplete()

    return () => {
      clearTimeout(timeoutId)
      window.history.pushState = originalPush
      window.history.replaceState = originalReplace
      window.removeEventListener('popstate', handleStart)
    }
  }, [pathname])

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="fixed top-0 left-0 w-full h-1 z-50 bg-gradient-to-r from-[#eb6e03] via-[#f97316] to-[#eb6e03]"
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ 
              duration: 0.8, 
              ease: 'easeInOut',
              repeat: Infinity,
            }}
            className="h-full w-1/3 bg-white/30 rounded-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
