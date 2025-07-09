
/**
 * Authentication Service for Spora One Trust Investor Portal
 * Handles authentication state management with browser refresh persistence
 */

import { apiClient } from './api-client'
import type { 
  UserProfile, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from '@/types/api/index'

export interface AuthState {
  user: UserProfile | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  initialized: boolean
}

type AuthStateListener = (state: AuthState) => void

class AuthService {
  private state: AuthState = {
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
    initialized: false
  }

  private listeners: Set<AuthStateListener> = new Set()
  private initializationPromise: Promise<void> | null = null

  constructor() {
    this.initialize()
  }

  /**
   * Initialize authentication state from localStorage
   * This runs once when the service is created
   */
  private async initialize(): Promise<void> {
    if (this.initializationPromise) {
      return this.initializationPromise
    }

    this.initializationPromise = this.performInitialization()
    return this.initializationPromise
  }

  private async performInitialization(): Promise<void> {
    try {
      console.log('🔐 AuthService: Initializing...')
      
      const token = localStorage.getItem('token')
      
      if (!token) {
        console.log('🔐 AuthService: No token found')
        this.updateState({
          user: null,
          loading: false,
          error: null,
          isAuthenticated: false,
          initialized: true
        })
        return
      }

      console.log('🔐 AuthService: Token found, validating...')
      
      // Set token in API client
      apiClient.setToken(token)
      
      try {
        // Validate token by fetching user profile
        const response = await apiClient.getProfile()
        
        if ((response as any)?.success && (response as any)?.data) {
          const user = (response as any).data
          console.log('✅ AuthService: User authenticated:', user.email)
          
          this.updateState({
            user,
            loading: false,
            error: null,
            isAuthenticated: true,
            initialized: true
          })
        } else {
          console.warn('⚠️ AuthService: Invalid profile response')
          this.clearAuth()
        }
      } catch (error: any) {
        console.warn('⚠️ AuthService: Token validation failed:', error.message)
        this.clearAuth()
      }
    } catch (error) {
      console.error('❌ AuthService: Initialization failed:', error)
      this.clearAuth()
    }
  }

  /**
   * Clear authentication state and localStorage
   */
  private clearAuth(): void {
    localStorage.removeItem('token')
    apiClient.clearToken()
    
    this.updateState({
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      initialized: true
    })
  }

  /**
   * Update state and notify listeners
   */
  private updateState(newState: Partial<AuthState>): void {
    this.state = { ...this.state, ...newState }
    this.notifyListeners()
  }

  /**
   * Notify all listeners of state changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state))
  }

  /**
   * Subscribe to auth state changes
   */
  subscribe(listener: AuthStateListener): () => void {
    this.listeners.add(listener)
    
    // Immediately call listener with current state
    listener(this.state)
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * Get current auth state
   */
  getState(): AuthState {
    return { ...this.state }
  }

  /**
   * Wait for initialization to complete
   */
  async waitForInitialization(): Promise<void> {
    if (this.initializationPromise) {
      await this.initializationPromise
    }
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      this.updateState({ loading: true, error: null })
      
      const response = await apiClient.login(credentials)
      
      // Handle backend response structure
      if (!(response as any).success || !(response as any).data) {
        throw new Error((response as any).message || 'Login failed')
      }
      
      const { user, token } = (response as any).data
      
      if (!user || !token) {
        throw new Error('Invalid login response: missing user or token')
      }
      
      // Store token and update state
      localStorage.setItem('token', token)
      apiClient.setToken(token)
      
      this.updateState({
        user,
        loading: false,
        error: null,
        isAuthenticated: true,
        initialized: true
      })
      
      console.log('✅ AuthService: User logged in:', user.email)
      return response as AuthResponse
    } catch (error: any) {
      console.error('❌ AuthService: Login failed:', error)
      
      this.updateState({
        loading: false,
        error: error.message || 'Login failed'
      })
      
      throw error
    }
  }

  /**
   * Register user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      this.updateState({ loading: true, error: null })
      
      const response = await apiClient.register(data)
      
      // Handle backend response structure
      if (!(response as any).success || !(response as any).data) {
        throw new Error((response as any).message || 'Registration failed')
      }
      
      const { user, token } = (response as any).data
      
      if (!user || !token) {
        throw new Error('Invalid registration response: missing user or token')
      }
      
      // Store token and update state
      localStorage.setItem('token', token)
      apiClient.setToken(token)
      
      this.updateState({
        user,
        loading: false,
        error: null,
        isAuthenticated: true,
        initialized: true
      })
      
      console.log('✅ AuthService: User registered:', user.email)
      return response as AuthResponse
    } catch (error: any) {
      console.error('❌ AuthService: Registration failed:', error)
      
      this.updateState({
        loading: false,
        error: error.message || 'Registration failed'
      })
      
      throw error
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if user is authenticated
      if (this.state.isAuthenticated) {
        await apiClient.logout()
      }
    } catch (error) {
      console.error('❌ AuthService: Logout API call failed:', error)
      // Continue with local logout even if API call fails
    } finally {
      console.log('🔐 AuthService: User logged out')
      this.clearAuth()
    }
  }

  /**
   * Forgot password
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    try {
      this.updateState({ loading: true, error: null })
      
      const response = await apiClient.forgotPassword(data)
      
      if (!(response as any).success) {
        throw new Error((response as any).message || 'Failed to send reset email')
      }
      
      this.updateState({ loading: false, error: null })
      console.log('✅ AuthService: Password reset email sent')
    } catch (error: any) {
      console.error('❌ AuthService: Forgot password failed:', error)
      
      this.updateState({
        loading: false,
        error: error.message || 'Failed to send reset email'
      })
      
      throw error
    }
  }

  /**
   * Reset password
   */
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    try {
      this.updateState({ loading: true, error: null })
      
      const response = await apiClient.resetPassword(data)
      
      if (!(response as any).success) {
        throw new Error((response as any).message || 'Password reset failed')
      }
      
      this.updateState({ loading: false, error: null })
      console.log('✅ AuthService: Password reset successful')
    } catch (error: any) {
      console.error('❌ AuthService: Reset password failed:', error)
      
      this.updateState({
        loading: false,
        error: error.message || 'Password reset failed'
      })
      
      throw error
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      if (!this.state.isAuthenticated) {
        throw new Error('User not authenticated')
      }
      
      this.updateState({ loading: true, error: null })
      
      const response = await apiClient.updateProfile(profileData)
      
      if (!(response as any).success || !(response as any).data) {
        throw new Error((response as any).message || 'Profile update failed')
      }
      
      const updatedUser = (response as any).data
      
      this.updateState({
        user: updatedUser,
        loading: false,
        error: null
      })
      
      console.log('✅ AuthService: Profile updated')
      return updatedUser
    } catch (error: any) {
      console.error('❌ AuthService: Profile update failed:', error)
      
      this.updateState({
        loading: false,
        error: error.message || 'Profile update failed'
      })
      
      throw error
    }
  }

  /**
   * Refresh user profile
   */
  async refreshUser(): Promise<void> {
    try {
      if (!this.state.isAuthenticated) return
      
      const response = await apiClient.getProfile()
      
      if ((response as any)?.success && (response as any)?.data) {
        const user = (response as any).data
        
        this.updateState({
          user,
          error: null
        })
        
        console.log('✅ AuthService: User profile refreshed')
      } else {
        console.error('❌ AuthService: Invalid refresh response')
        throw new Error('Invalid profile response')
      }
    } catch (error: any) {
      console.error('❌ AuthService: Failed to refresh user:', error)
      
      // If token is invalid, logout user
      if (error.status === 401) {
        await this.logout()
      }
      
      throw error
    }
  }

  /**
   * Clear any error state
   */
  clearError(): void {
    this.updateState({ error: null })
  }
}

// Export singleton instance
export const authService = new AuthService()
