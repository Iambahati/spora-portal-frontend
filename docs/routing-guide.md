# Routing Guide - NexFaster Implementation

## Overview
This guide explains the routing system in the Spora One Trust Investor Portal, which implements the NexFaster pattern using React Router for blazing-fast client-side navigation while maintaining Next.js benefits.

## Architecture Overview

### NexFaster Pattern
The NexFaster pattern combines Next.js App Router with React Router to achieve:
- **Server-Side Rendering**: Initial page load optimization
- **Client-Side Navigation**: Instant route transitions
- **Route Preloading**: Predictive loading for better UX
- **Code Splitting**: Optimized bundle sizes

### Flow Diagram
```
User Request → Next.js App Router → Shell Page → React Router App → Page Component
```

## Next.js Configuration

### `next.config.mjs`
All routes are redirected to the shell page for NexFaster processing:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    appDir: true,
    optimizePackageImports: ['lucide-react'],
  },
  
  // Redirect all routes to shell for NexFaster pattern
  async rewrites() {
    return [
      {
        source: '/auth/:path*',
        destination: '/shell',
      },
      {
        source: '/kyc-portal',
        destination: '/shell',
      },
      {
        source: '/dashboard/:path*',
        destination: '/shell',
      },
      {
        source: '/profile/:path*',
        destination: '/shell',
      },
      {
        source: '/settings/:path*',
        destination: '/shell',
      },
    ]
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
}

export default nextConfig
```

## Shell Implementation

### `/app/shell/page.tsx`
The shell page loads the React Router application:

```tsx
'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import BankLoading from '@/components/bank-loading'

// Dynamically import the router app with SSR disabled
const RouterApp = dynamic(() => import('@/router/app'), { 
  ssr: false,
  loading: () => <BankLoading />
})

export default function ShellPage() {
  return (
    <Suspense fallback={<BankLoading />}>
      <RouterApp />
    </Suspense>
  )
}
```

## React Router Configuration

### Main Router App (`/router/app.tsx`)

```tsx
'use client'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { I18nProvider } from '@/lib/i18n/context'
import { PageCacheProvider } from '@/components/page-cache-provider'
import { ThemeProvider } from '@/components/theme-provider'

// Import page components
import SignInPage from './pages/signin'
import SignUpPage from './pages/signup'
import ForgotPasswordPage from './pages/forgot-password'
import ResetPasswordPage from './pages/reset-password'
import KYCPortalPage from './pages/kyc-portal'
import DashboardPage from './pages/dashboard'
import ProfilePage from './pages/profile'
import SettingsPage from './pages/settings'
import NotFoundPage from './pages/not-found'

// Auth utilities
import { useAuthCheck } from './hooks/use-auth-check'
import { ProtectedRoute, AuthOnlyRoute } from './components/route-guards'

export default function RouterApp() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="spora-ui-theme">
      <PageCacheProvider>
        <I18nProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/auth/signin" element={
                <AuthOnlyRoute>
                  <SignInPage />
                </AuthOnlyRoute>
              } />
              
              <Route path="/auth/signup" element={
                <AuthOnlyRoute>
                  <SignUpPage />
                </AuthOnlyRoute>
              } />
              
              <Route path="/auth/forgot-password" element={
                <AuthOnlyRoute>
                  <ForgotPasswordPage />
                </AuthOnlyRoute>
              } />
              
              <Route path="/auth/reset-password" element={
                <AuthOnlyRoute>
                  <ResetPasswordPage />
                </AuthOnlyRoute>
              } />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              
              <Route path="/kyc-portal" element={
                <ProtectedRoute>
                  <KYCPortalPage />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />
              
              {/* Root redirects */}
              <Route path="/" element={<AuthRedirect />} />
              <Route path="/shell" element={<AuthRedirect />} />
              
              {/* 404 catch-all */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </I18nProvider>
      </PageCacheProvider>
    </ThemeProvider>
  )
}

// Auth redirect component
function AuthRedirect() {
  const { user, loading } = useAuthCheck()
  
  if (loading) {
    return <BankLoading />
  }
  
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth/signin" replace />
}
```

## Route Guards

### Protected Route Component

```tsx
// /router/components/route-guards.tsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthCheck } from '../hooks/use-auth-check'
import BankLoading from '@/components/bank-loading'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuthCheck()
  const location = useLocation()
  
  if (loading) {
    return <BankLoading />
  }
  
  if (!user) {
    // Redirect to login with return URL
    return <Navigate to="/auth/signin" state={{ from: location }} replace />
  }
  
  return <>{children}</>
}

export function AuthOnlyRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuthCheck()
  
  if (loading) {
    return <BankLoading />
  }
  
  if (user) {
    // Redirect authenticated users to dashboard
    return <Navigate to="/dashboard" replace />
  }
  
  return <>{children}</>
}
```

### Authentication Hook

```tsx
// /router/hooks/use-auth-check.ts
import { useState, useEffect } from 'react'
import type { UserProfile } from '@/types/api'

export function useAuthCheck() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setLoading(false)
          return
        }

        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          localStorage.removeItem('token')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  return { user, loading, setUser }
}
```

## Page Components

### Basic Page Structure

```tsx
// /router/pages/example-page.tsx
import { useTranslation } from '@/lib/i18n/context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FastLink } from '@/components/fast-link'

export default function ExamplePage() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{t('page.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {t('page.description')}
          </p>
          
          <div className="flex gap-4">
            <Button onClick={() => console.log('Action')}>
              {t('common.submit')}
            </Button>
            
            <FastLink to="/dashboard">
              <Button variant="outline">
                {t('common.back')}
              </Button>
            </FastLink>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

## Performance Optimizations

### Fast Link Component

```tsx
// /components/fast-link.tsx
import { Link, LinkProps } from 'react-router-dom'
import { useRoutePreloader } from '@/hooks/use-route-preloader'

interface FastLinkProps extends LinkProps {
  preload?: boolean
}

export function FastLink({ 
  to, 
  preload = true, 
  onMouseEnter,
  children,
  ...props 
}: FastLinkProps) {
  const { preloadRoute } = useRoutePreloader()

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (preload && typeof to === 'string') {
      preloadRoute(to)
    }
    onMouseEnter?.(e)
  }

  return (
    <Link 
      to={to} 
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {children}
    </Link>
  )
}
```

### Route Preloader Hook

```tsx
// /hooks/use-route-preloader.ts
import { useCallback } from 'react'

export function useRoutePreloader() {
  const preloadRoute = useCallback((route: string) => {
    // Preload route component
    switch (route) {
      case '/dashboard':
        import('@/router/pages/dashboard')
        break
      case '/kyc-portal':
        import('@/router/pages/kyc-portal')
        break
      case '/profile':
        import('@/router/pages/profile')
        break
      // Add more routes as needed
    }
  }, [])

  return { preloadRoute }
}
```

## Adding New Routes

### Step 1: Create Page Component

```tsx
// /router/pages/new-feature.tsx
import { useTranslation } from '@/lib/i18n/context'

export default function NewFeaturePage() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {t('newFeature.title')}
      </h1>
      {/* Feature content */}
    </div>
  )
}
```

### Step 2: Add Route to Next.js Config

```javascript
// next.config.mjs
async rewrites() {
  return [
    // ...existing rewrites
    {
      source: '/new-feature',
      destination: '/shell',
    },
  ]
}
```

### Step 3: Add Route to React Router

```tsx
// /router/app.tsx
import NewFeaturePage from './pages/new-feature'

// Add to Routes
<Route path="/new-feature" element={
  <ProtectedRoute>
    <NewFeaturePage />
  </ProtectedRoute>
} />
```

### Step 4: Add Translation Keys

```tsx
// /lib/i18n/translations.ts
export const translations = {
  en: {
    // ...existing translations
    newFeature: {
      title: "New Feature",
      description: "Description of the new feature"
    }
  }
}
```

### Step 5: Add Route Preloading

```tsx
// /hooks/use-route-preloader.ts
const preloadRoute = useCallback((route: string) => {
  switch (route) {
    // ...existing cases
    case '/new-feature':
      import('@/router/pages/new-feature')
      break
  }
}, [])
```

## Navigation Components

### Navigation Menu

```tsx
// /components/navigation-menu.tsx
import { FastLink } from '@/components/fast-link'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n/context'

export function NavigationMenu() {
  const { t } = useTranslation()

  return (
    <nav className="flex gap-4">
      <FastLink to="/dashboard">
        <Button variant="ghost">
          {t('nav.dashboard')}
        </Button>
      </FastLink>
      
      <FastLink to="/kyc-portal">
        <Button variant="ghost">
          {t('nav.kyc')}
        </Button>
      </FastLink>
      
      <FastLink to="/profile">
        <Button variant="ghost">
          {t('nav.profile')}
        </Button>
      </FastLink>
    </nav>
  )
}
```

## URL Structure

### Route Patterns

```
Public Routes:
├── /auth/signin           # Sign in page
├── /auth/signup           # Sign up page  
├── /auth/forgot-password  # Password reset request
└── /auth/reset-password   # Password reset form

Protected Routes:
├── /dashboard             # Main dashboard
├── /kyc-portal           # KYC document upload
├── /profile              # User profile management
├── /settings             # User settings
└── /investments          # Investment tracking

Admin Routes (future):
├── /admin/dashboard      # Admin dashboard
├── /admin/users          # User management
└── /admin/kyc-review     # KYC review interface
```

## Error Handling

### 404 Page

```tsx
// /router/pages/not-found.tsx
import { FastLink } from '@/components/fast-link'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n/context'

export default function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-muted-foreground mb-8">
        {t('errors.pageNotFound')}
      </p>
      
      <FastLink to="/dashboard">
        <Button>
          {t('common.goHome')}
        </Button>
      </FastLink>
    </div>
  )
}
```

## Best Practices

### Performance
- Use `FastLink` for internal navigation
- Implement route preloading on hover
- Lazy load page components
- Use React.memo for expensive components

### Security
- Always validate user authentication
- Implement proper route guards
- Handle authentication state properly
- Use HTTPS in production

### UX
- Provide loading states
- Handle errors gracefully
- Implement proper navigation feedback
- Use consistent layout patterns

### SEO
- Set proper page titles
- Use semantic HTML
- Implement proper meta tags
- Consider server-side rendering for public pages

This routing system provides fast, secure, and maintainable navigation while leveraging both Next.js and React Router strengths.
