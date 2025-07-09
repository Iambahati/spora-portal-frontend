/**
 * Authentication Context for Spora One Trust Investor Portal
 * Uses the centralized AuthService with proper browser refresh persistence
 */

import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService, AuthState } from './auth'
import type { 
  UserProfile, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from '@/types/api/index'

interface AuthContextType {
  // State
  user: UserProfile | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  
  // Authentication methods
  login: (credentials: LoginCredentials) => Promise<AuthResponse>
  register: (data: RegisterData) => Promise<AuthResponse>
  logout: () => Promise<void>
  forgotPassword: (data: ForgotPasswordRequest) => Promise<void>
  resetPassword: (data: ResetPasswordRequest) => Promise<void>
  
  // Profile methods
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile>
  refreshUser: () => Promise<void>
  
  // Utility methods
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>(authService.getState())

  // Subscribe to auth service changes
  useEffect(() => {
    const unsubscribe = authService.subscribe(setAuthState)
    return unsubscribe
  }, [])

  // Extract state values
  const { user, loading, error, isAuthenticated } = authState

  // --- FIX: Ensure login/register update context state and loading/error, and use response.data.user ---
  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const response = await authService.login(credentials)
      const user = response.data?.user || null
      setAuthState({
        ...authService.getState(),
        user,
        isAuthenticated: !!user,
        loading: false,
        error: null,
      })
      return response
    } catch (err: any) {
      setAuthState((prev) => ({ ...prev, loading: false, error: err?.message || 'Login failed' }))
      throw err
    }
  }

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const response = await authService.register(data)
      const user = response.data?.user || null
      setAuthState({
        ...authService.getState(),
        user,
        isAuthenticated: !!user,
        loading: false,
        error: null,
      })
      return response
    } catch (err: any) {
      setAuthState((prev) => ({ ...prev, loading: false, error: err?.message || 'Registration failed' }))
      throw err
    }
  }

  const logout = async (): Promise<void> => {
    await authService.logout()
  }

  const forgotPassword = async (data: ForgotPasswordRequest): Promise<void> => {
    await authService.forgotPassword(data)
  }

  const resetPassword = async (data: ResetPasswordRequest): Promise<void> => {
    await authService.resetPassword(data)
  }

  const updateProfile = async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
    const updatedUser = await authService.updateProfile(profileData)
    return updatedUser
  }

  const refreshUser = async (): Promise<void> => {
    await authService.refreshUser()
  }

  const clearError = (): void => {
    authService.clearError()
  }

  const contextValue: AuthContextType = {
    // State
    user,
    loading,
    error,
    isAuthenticated,
    
    // Authentication methods
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    
    // Profile methods
    updateProfile,
    refreshUser,
    
    // Utility methods
    clearError,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use authentication context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook for authentication state only (lighter version)
export function useAuthState() {
  const { user, loading, error, isAuthenticated } = useAuth()
  return { user, loading, error, isAuthenticated }
}

// Hook for authentication actions only
export function useAuthActions() {
  const { 
    login, 
    register, 
    logout, 
    forgotPassword, 
    resetPassword, 
    updateProfile, 
    refreshUser, 
    clearError
  } = useAuth()
  
  return {
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    refreshUser,
    clearError,
  }
}
