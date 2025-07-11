/**
 * Authentication utilities for role-based redirects and access control
 */

import type { UserProfile } from './api-client'

/**
 * Determines the appropriate redirect path based on user role and state
 */
export function getPostLoginRedirect(user: UserProfile): string {
  // Handle activation state first
  if (user.activation_stage && 
      (user.activation_stage.stage !== 'completed' || user.activation_stage.requires_action)) {
    return '/auth/activate'
  }

  // Role-based redirects (with safety checks)
  switch (user.role) {
    case 'admin':
      return '/admin/dashboard'
    
    case 'onboarding-officer':
      return '/kyc-officer'
    
    case 'investor':
      // Check for incomplete stages (with safety checks for undefined properties)
      if ((user.investment_stage && user.investment_stage.name === 'PENDING_KYC') || 
          user.kyc_status === 'not_submitted') {
        return '/kyc-upload'
      }
      
      // Check for NDA acknowledgment requirement (with default if property is missing)
      if (user.nda_accepted === false) {
        return '/nda-acknowledge'
      }
      
      return '/dashboard'
    
    default:
      // If role is missing or unknown, provide a safe default
      console.warn('Unknown or missing user role:', user.role)
      return '/dashboard'
  }
}

/**
 * Determines if a user should be redirected based on their current path and role
 */
export function shouldRedirectFromPath(user: UserProfile, currentPath: string): boolean {
  const intendedPath = getPostLoginRedirect(user)
  
  // Don't redirect if already on the intended path
  if (currentPath === intendedPath) {
    return false
  }
  
  // Always redirect from auth pages after login
  if (currentPath.startsWith('/auth/')) {
    return true
  }
  
  // Redirect admin users away from non-admin pages
  if (user.role === 'admin' && !currentPath.startsWith('/admin/')) {
    return true
  }
  
  // Redirect officers away from non-officer pages
  if (user.role === 'onboarding-officer' && !currentPath.startsWith('/kyc-officer')) {
    return true
  }
  
  // Redirect investors away from admin/officer pages
  if (user.role === 'investor' && (currentPath.startsWith('/admin/') || currentPath.startsWith('/kyc-officer'))) {
    return true
  }
  
  // Check for incomplete stages that require specific pages
  if (user.role === 'investor') {
    // Force KYC completion
    if ((user.investment_stage?.name === 'PENDING_KYC' || user.kyc_status === 'not_submitted') 
        && !currentPath.startsWith('/kyc-upload')) {
      return true
    }
    
    // Force NDA acknowledgment
    if (!user.nda_accepted && !currentPath.startsWith('/nda-acknowledge')) {
      return true
    }
  }
  
  return false
}

/**
 * Gets user-friendly role display name
 */
export function getRoleDisplayName(role: string): string {
  switch (role) {
    case 'admin':
      return 'Administrator'
    case 'onboarding-officer':
      return 'Onboarding Officer'
    case 'investor':
      return 'Investor'
    case 'guest':
      return 'Guest'
    default:
      return 'User'
  }
}

/**
 * Checks if user has permission to access a route
 */
export function canAccessRoute(user: UserProfile, route: string): boolean {
  // Admin can access everything
  if (user.role === 'admin') {
    return true
  }
  
  // Officer can access KYC routes
  if (user.role === 'onboarding-officer') {
    return route.startsWith('/kyc-officer') || route === '/dashboard' || route === '/profile'
  }
  
  // Investor restrictions
  if (user.role === 'investor') {
    // Can't access admin or officer routes
    if (route.startsWith('/admin/') || route.startsWith('/kyc-officer')) {
      return false
    }
    
    // Must complete activation first
    if (user.activation_stage?.requires_action && !route.startsWith('/auth/activate')) {
      return false
    }
    
    // Must complete KYC first
    if ((user.investment_stage?.name === 'PENDING_KYC' || user.kyc_status === 'not_submitted') 
        && !route.startsWith('/kyc-upload') && !route.startsWith('/auth/') && route !== '/profile') {
      return false
    }
    
    // Must acknowledge NDA first
    if (!user.nda_accepted && !route.startsWith('/nda-acknowledge') 
        && !route.startsWith('/auth/') && !route.startsWith('/kyc-upload') && route !== '/profile') {
      return false
    }
    
    return true
  }
  
  return false
}
