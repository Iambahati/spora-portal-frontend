import { forwardRef, MouseEvent, ReactNode, useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useFastRouter } from '@/hooks/use-fast-router'
import { cn } from '@/lib/utils'

interface FastLinkProps {
  to: string
  children: ReactNode
  className?: string
  replace?: boolean
  prefetch?: boolean
  prefetchOnHover?: boolean
  prefetchOnMount?: boolean
  showProgress?: boolean
  disabled?: boolean
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

const FastLink = forwardRef<HTMLAnchorElement, FastLinkProps>(
  ({ 
    to, 
    children, 
    className, 
    replace = false, 
    prefetch = true,
    prefetchOnHover = true,
    prefetchOnMount = false,
    showProgress = false,
    disabled = false,
    onClick,
    ...props 
  }, ref) => {
    const { 
      navigate, 
      prefetch: fastPrefetch, 
      prefetchOnHover: prefetchHover,
      isNavigating 
    } = useFastRouter()
    const linkRef = useRef<HTMLAnchorElement>(null)
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Prefetch on mount if requested
    useEffect(() => {
      if (prefetchOnMount) {
        fastPrefetch(to)
      }
    }, [prefetchOnMount, to, fastPrefetch])

    const handleClick = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        e.preventDefault()
        return
      }

      e.preventDefault()
      
      if (onClick) {
        onClick(e)
      }

      // Use fast navigation for instant transition
      navigate(to, { replace })
    }, [disabled, onClick, to, navigate, replace])

    const handleMouseEnter = useCallback(() => {
      if (prefetchOnHover && prefetch) {
        // Clear any existing timeout
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current)
        }
        
        // Debounce hover prefetching
        hoverTimeoutRef.current = setTimeout(() => {
          prefetchHover(to)
        }, 50)
      }
    }, [prefetchOnHover, prefetch, to, prefetchHover])

    const handleTouchStart = useCallback(() => {
      if (prefetch) {
        // Prefetch immediately on touch for mobile
        fastPrefetch(to)
      }
    }, [prefetch, to, fastPrefetch])

    // Handle intersection observer for viewport-based prefetching
    useEffect(() => {
      const link = linkRef.current
      if (!link || !prefetchOnMount) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              fastPrefetch(to)
              observer.unobserve(entry.target)
            }
          })
        },
        { rootMargin: '100px' }
      )

      observer.observe(link)
      return () => observer.disconnect()
    }, [to, fastPrefetch, prefetchOnMount])

    // Clean up timeout on unmount
    useEffect(() => {
      return () => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current)
        }
      }
    }, [])

    return (
      <Link
        ref={(node) => {
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
          // @ts-ignore
          linkRef.current = node
        }}
        to={to}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onTouchStart={handleTouchStart}
        className={cn(
          'transition-colors duration-150 ease-in-out',
          disabled && 'pointer-events-none opacity-50',
          showProgress && isNavigating && 'opacity-75',
          className
        )}
        {...props}
      >
        {children}
        
        {/* Optional loading indicator */}
        {showProgress && isNavigating && (
          <span className="ml-2 inline-block h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
        )}
      </Link>
    )
  }
)

FastLink.displayName = 'FastLink'

// Button-style navigation component for instant routing
export const FastNavButton = forwardRef<HTMLAnchorElement, FastLinkProps & {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}>(({
  children,
  className,
  variant = 'default',
  size = 'default',
  ...props
}, ref) => {
  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  }

  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  }

  return (
    <FastLink
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      showProgress={true}
      prefetchOnHover={true}
      {...props}
    >
      {children}
    </FastLink>
  )
})

FastNavButton.displayName = 'FastNavButton'

export default FastLink
