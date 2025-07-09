/**
 * Route Guard Component - Handles role-based access control and redirects
 */

import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthState } from '@/lib/auth-context'
import { canAccessRoute, shouldRedirectFromPath, getPostLoginRedirect } from '@/lib/auth-utils'

interface RouteGuardProps {
  children: React.ReactNode
  requiredRoles?: string[]
  fallbackPath?: string
}

export function RouteGuard({ children, requiredRoles, fallbackPath = '/dashboard' }: RouteGuardProps) {
  const { user, loading } = useAuthState()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Don't do anything while loading
    if (loading || !user) {
      return
    }

    // Check if user should be redirected based on their role and current path
    if (shouldRedirectFromPath(user, location.pathname)) {
      const redirectPath = getPostLoginRedirect(user)
      navigate(redirectPath, { replace: true })
      return
    }

    // Check role-based access if specific roles are required
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      navigate(fallbackPath, { replace: true })
      return
    }

    // Check general route access permissions
    if (!canAccessRoute(user, location.pathname)) {
      const redirectPath = getPostLoginRedirect(user)
      navigate(redirectPath, { replace: true })
      return
    }
  }, [user, loading, location.pathname, navigate, requiredRoles, fallbackPath])

  // Show loading while checking
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Show nothing if user is not authenticated (auth hook should handle redirect)
  if (!user) {
    return null
  }

  return <>{children}</>
}

// Specific route guards for common use cases
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard requiredRoles={['admin']} fallbackPath="/dashboard">
      {children}
    </RouteGuard>
  )
}

export function OfficerRoute({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard requiredRoles={['admin', 'onboarding-officer']} fallbackPath="/dashboard">
      {children}
    </RouteGuard>
  )
}

export function InvestorRoute({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard requiredRoles={['investor']} fallbackPath="/auth/signin">
      {children}
    </RouteGuard>
  )
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard>
      {children}
    </RouteGuard>
  )
}
