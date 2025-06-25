import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '@/lib/api-client'
import type { 
  UserProfile, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from '@/lib/api-client'

interface AuthContextType {
  // State
  user: UserProfile | null
  loading: boolean
  error: string | null
  
  // Authentication methods
  login: (credentials: LoginCredentials) => Promise<AuthResponse>
  register: (data: RegisterData) => Promise<AuthResponse>
  logout: () => Promise<void>
  forgotPassword: (data: ForgotPasswordRequest) => Promise<{ message: string }>
  resetPassword: (data: ResetPasswordRequest) => Promise<{ message: string }>
  
  // Profile methods
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile>
  refreshUser: () => Promise<void>
  
  // Utility methods
  clearError: () => void
  checkAuthStatus: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize authentication state
  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      setLoading(true)
      console.log('🔐 Auth Context: Initializing authentication...')
      
      // Fast development mode: Skip API calls for instant loading
      if (import.meta.env.VITE_FAST_DEV_MODE === 'true') {
        console.log('⚡ Fast development mode: Skipping API authentication')
        await new Promise(resolve => setTimeout(resolve, 100))
        setLoading(false)
        return
      }
      
      const token = localStorage.getItem('token')
      console.log('🎫 Auth Context: Token from localStorage:', token ? 'Found' : 'None')
      
      if (!token) {
        console.log('🔐 Auth Context: No token found, user not authenticated')
        setLoading(false)
        return
      }

      // Set token in API client
      apiClient.setToken(token)
      console.log('🔗 Auth Context: Token set in API client')
      
      // Shorter timeout for faster fallback - 1 second instead of 3
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 1000)
      )
      
      try {
        // Race between API call and timeout
        console.log('👤 Auth Context: Fetching user profile...')
        const userProfile = await Promise.race([
          apiClient.getProfile(),
          timeoutPromise
        ]) as UserProfile
        
        console.log('✅ Auth Context: User profile loaded:', userProfile)
        setUser(userProfile)
      } catch (apiError) {
        console.warn('API not available, using mock mode:', apiError)
        // Use mock mode when API is not available
        if (import.meta.env.VITE_DEMO_MODE === 'true') {
          const mockUser: UserProfile = {
            id: 1,
            full_name: 'Demo User',
            email: 'demo@example.com',
            investment_stage: {
              id: 1,
              name: 'pending_kyc',
              display_name: 'Pending KYC',
              description: 'KYC documents pending review'
            },
            kyc_status: 'not_submitted',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          setUser(mockUser)
        } else {
          // In production, clear invalid token
          localStorage.removeItem('token')
          apiClient.clearToken()
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error)
      // Clear invalid token
      localStorage.removeItem('token')
      apiClient.clearToken()
    } finally {
      setLoading(false)
    }
  }

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiClient.login(credentials)
      
      // Store token and update state
      localStorage.setItem('token', response.token)
      apiClient.setToken(response.token)
      setUser(response.user)
      
      return response
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }, [apiClient])

  const register = useCallback(async (data: RegisterData): Promise<AuthResponse> => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiClient.register(data)
      
      // Store token and update state
      localStorage.setItem('token', response.token)
      apiClient.setToken(response.token)
      setUser(response.user)
      
      return response
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }, [apiClient])

  const logout = useCallback(async (): Promise<void> => {
    try {
      // Call logout endpoint if user is authenticated
      if (user) {
        await apiClient.logout()
      }
    } catch (error) {
      console.error('Logout API call failed:', error)
      // Continue with local logout even if API call fails
    } finally {
      // Clear local state regardless of API call result
      localStorage.removeItem('token')
      apiClient.clearToken()
      setUser(null)
      setError(null)
    }
  }, [apiClient, user])

  const forgotPassword = useCallback(async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiClient.forgotPassword(data)
      return response
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to send password reset email'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }, [apiClient])

  const resetPassword = useCallback(async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiClient.resetPassword(data)
      return response
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to reset password'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }, [apiClient])

  const updateProfile = useCallback(async (data: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiClient.updateProfile(data)
      setUser(response.user)
      
      return response.user
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update profile'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }, [apiClient])

  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      if (!user) return
      
      const userProfile = await apiClient.getProfile()
      setUser(userProfile)
    } catch (error: any) {
      console.error('Failed to refresh user profile:', error)
      // If token is invalid, logout user
      if (error.status === 401) {
        await logout()
      }
    }
  }, [apiClient, user, logout])

  const checkAuthStatus = useCallback(async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return false

      apiClient.setToken(token)
      const userProfile = await apiClient.getProfile()
      setUser(userProfile)
      return true
    } catch (error) {
      console.error('Auth status check failed:', error)
      localStorage.removeItem('token')
      apiClient.clearToken()
      setUser(null)
      return false
    }
  }, [apiClient])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const contextValue: AuthContextType = {
    // State
    user,
    loading,
    error,
    
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
    checkAuthStatus,
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
  const { user, loading, error } = useAuth()
  return { user, loading, error, isAuthenticated: !!user }
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
    clearError,
    checkAuthStatus 
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
    checkAuthStatus,
  }
}
