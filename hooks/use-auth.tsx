/**
 * Authentication Hook for Spora One Trust Investor Portal
 * Provides comprehensive authentication state management
 */

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient, APIError } from '@/lib/api-client'

import type { 
  UserProfile, 
  LoginCredentials, 
  RegisterData, 
  ForgotPasswordRequest, 
  ResetPasswordRequest 
} from '@/lib/api-client'
import { useToast } from '@/use-toast'

// Auth Context Type
interface AuthContextType {
  user: UserProfile | null
  loading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (data: ForgotPasswordRequest) => Promise<void>
  resetPassword: (data: ResetPasswordRequest) => Promise<void>
  refreshUser: () => Promise<void>
  clearError: () => void
}

// Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth Provider Component
interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const navigate = useNavigate()

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setLoading(false)
          return
        }

        apiClient.setToken(token)
        const userData = await apiClient.getProfile()
        setUser(userData)
      } catch (error) {
        console.error('Auth initialization failed:', error)
        localStorage.removeItem('token')
        apiClient.clearToken()
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiClient.login(credentials)
      
      // Store token and set user
      localStorage.setItem('token', response.token)
      apiClient.setToken(response.token)
      setUser(response.user)
      
      // Show success message
      toast({
        title: "Welcome back!",
        description: `Hello ${response.user.full_name}, you've successfully signed in.`,
      })
      
      // Navigate to dashboard
      navigate('/dashboard')
    } catch (err) {
      const error = err as APIError
      setError(error.message)
      
      // Show error toast
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      })
      
      throw error
    } finally {
      setLoading(false)
    }
  }, [toast, navigate])

  // Register function
  const register = useCallback(async (data: RegisterData) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiClient.register(data)
      
      // Store token and set user
      localStorage.setItem('token', response.token)
      apiClient.setToken(response.token)
      setUser(response.user)
      
      // Show success message
      toast({
        title: "Account Created!",
        description: `Welcome ${response.user.full_name}! Your account has been created successfully.`,
      })
      
      // Navigate to dashboard
      navigate('/dashboard')
    } catch (err) {
      const error = err as APIError
      setError(error.message)
      
      // Show error toast
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      })
      
      throw error
    } finally {
      setLoading(false)
    }
  }, [toast, navigate])

  // Logout function
  const logout = useCallback(async () => {
    try {
      setLoading(true)
      
      // Call logout API
      await apiClient.logout()
    } catch (error) {
      console.error('Logout API call failed:', error)
      // Continue with logout even if API call fails
    } finally {
      // Clear local state
      localStorage.removeItem('token')
      apiClient.clearToken()
      setUser(null)
      setError(null)
      setLoading(false)
      
      // Show logout message
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      })
      
      // Navigate to sign in
      navigate('/auth/signin')
    }
  }, [toast, navigate])

  // Forgot password function
  const forgotPassword = useCallback(async (data: ForgotPasswordRequest) => {
    try {
      setLoading(true)
      setError(null)
      
      await apiClient.forgotPassword(data)
      
      // Show success message
      toast({
        title: "Reset Link Sent",
        description: "Check your email for password reset instructions.",
      })
    } catch (err) {
      const error = err as APIError
      setError(error.message)
      
      // Show error toast
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive",
      })
      
      throw error
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Reset password function
  const resetPassword = useCallback(async (data: ResetPasswordRequest) => {
    try {
      setLoading(true)
      setError(null)
      
      await apiClient.resetPassword(data)
      
      // Show success message
      toast({
        title: "Password Reset",
        description: "Your password has been reset successfully. Please sign in with your new password.",
      })
      
      // Navigate to sign in
      navigate('/auth/signin')
    } catch (err) {
      const error = err as APIError
      setError(error.message)
      
      // Show error toast
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive",
      })
      
      throw error
    } finally {
      setLoading(false)
    }
  }, [toast, navigate])

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      if (!user) return
      
      const userData = await apiClient.getProfile()
      setUser(userData)
    } catch (error) {
      console.error('Failed to refresh user data:', error)
    }
  }, [user])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    refreshUser,
    clearError,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook for authentication check (used in route guards)
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

        apiClient.setToken(token)
        const userData = await apiClient.getProfile()
        setUser(userData)
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('token')
        apiClient.clearToken()
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  return { user, loading, setUser }
}
