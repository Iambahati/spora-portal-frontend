/**
 * API Client for Spora One Trust Investor Portal
 * Implements comprehensive type-safe API communication with Laravel Sanctum backend
 */

// Browser detection utilities
function getBrowserName(): string {
  if (typeof window === 'undefined') return 'Unknown'
  
  const userAgent = window.navigator.userAgent
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Safari')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  return 'Unknown'
}

function getOSName(): string {
  if (typeof window === 'undefined') return 'Unknown'
  
  const userAgent = window.navigator.userAgent
  if (userAgent.includes('Windows')) return 'Windows'
  if (userAgent.includes('Mac')) return 'macOS'
  if (userAgent.includes('Linux')) return 'Linux'
  if (userAgent.includes('Android')) return 'Android'
  if (userAgent.includes('iOS')) return 'iOS'
  return 'Unknown'
}

// Remove all type/interface/type alias definitions from here and import from types/api/index
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UserProfile,
  UpdateProfileRequest,
  SuccessResponse,
  ErrorResponse,
  TwoFactorStatus,
  TwoFactorSetupResponse,
  TwoFactorQRCodeResponse,
  TwoFactorConfirmRequest,
  TwoFactorDisableRequest,
  KYCSubmissionRequest,
  KYCStatusResponse,
  ActivationValidateResponse,
  ActivationUpdatePasswordResponse,
  ActivationResendResponse,
  SessionsResponse
} from '@/types/api'
import type {
  AllUsersResponse,
  AdminUserListParams,
  AdminUserCreateRequest,
  AdminUserCreateResponse,
  AdminUserUpdateRequest,
  AdminUserUpdateResponse,
  AdminUserDeleteResponse,
  AdminUserStatusResponse,
  AdminUserRoleResponse,
  AdminStatsResponse
} from '@/types/api'

// API Error class
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public response: ErrorResponse
  ) {
    super(message)
    this.name = 'APIError'
  }
}

// Request cache for deduplication
interface CachedRequest {
  promise: Promise<any>
  timestamp: number
}

// Main API Client
export class APIClient {
  private baseURL: string
  private token: string | null = null
  private requestCache = new Map<string, CachedRequest>()
  private readonly CACHE_TTL = 1000 // 1 second cache for deduplication

  constructor(baseURL: string) {
    this.baseURL = baseURL
    // Initialize token from localStorage if available
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      this.token = savedToken
    }
  }

  setToken(token: string) {
    this.token = token
    localStorage.setItem('token', token)
  }

  clearToken() {
    this.token = null
    localStorage.removeItem('token')
  }

  // Generic HTTP methods with request deduplication
  async get<T>(endpoint: string): Promise<T> {
    return this.requestWithDeduplication(endpoint, {
      method: 'GET',
    })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    // Don't cache POST requests
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    // Don't cache PUT requests
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    // Don't cache DELETE requests
    return this.request<T>(endpoint, {
      method: 'DELETE',
    })
  }

  // Request deduplication for GET requests
  private async requestWithDeduplication<T>(endpoint: string, options: RequestInit): Promise<T> {
    const cacheKey = `${options.method}:${endpoint}:${JSON.stringify(options.body || '')}`
    const now = Date.now()

    // Check if we have a cached request
    const cached = this.requestCache.get(cacheKey)
    if (cached && (now - cached.timestamp) < this.CACHE_TTL) {
      console.log(`🔄 API: Using cached request for ${endpoint}`)
      return cached.promise
    }

    // Make new request
    const promise = this.request<T>(endpoint, options)
    
    // Cache the promise
    this.requestCache.set(cacheKey, {
      promise,
      timestamp: now
    })

    // Clean up expired cache entries
    this.cleanupCache()

    return promise
  }

  private cleanupCache() {
    const now = Date.now()
    for (const [key, cached] of this.requestCache.entries()) {
      if (now - cached.timestamp >= this.CACHE_TTL) {
        this.requestCache.delete(key)
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'X-Device-Type': 'web',
      'X-Browser-Name': getBrowserName(),
      'X-OS-Name': getOSName(),
      'X-Device-Name': 'Investor Portal Web',
    }

    // Add headers from options if provided
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers[key] = value
        })
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          headers[key] = value
        })
      } else {
        Object.assign(headers, options.headers)
      }
    }

    // Only add Content-Type if not already set (for FormData uploads)
    if (!headers['Content-Type'] && options.body && typeof options.body === 'string') {
      headers['Content-Type'] = 'application/json'
    }

    // Always add Authorization header if token exists
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
      console.log(`🔐 API: Adding auth token for ${endpoint}`)
    } else {
      console.warn(`⚠️ API: No auth token available for ${endpoint}`)
    }

    console.log(`📡 API Request: ${options.method || 'GET'} ${url}`)
    
    const response = await fetch(url, {
      ...options,
      headers,
    })
    
    const contentType = response.headers.get('Content-Type') || ''
    
    // Handle authentication errors
    if (response.status === 401) {
      console.error(`🚫 API: Authentication failed for ${endpoint}`)
      // Clear invalid token
      this.clearToken()
      throw new APIError('Authentication is required', response.status, { message: 'Authentication is required' })
    }
    
    // Defensive: If not ok, try to parse error JSON, else fallback
    if (!response.ok) {
      let error: ErrorResponse
      if (contentType.includes('application/json')) {
        try {
          error = await response.json()
        } catch {
          error = { message: `HTTP ${response.status}: ${response.statusText}` }
        }
      } else {
        error = { message: `HTTP ${response.status}: ${response.statusText} (Non-JSON error)` }
      }
      throw new APIError(error.message, response.status, error)
    }
    
    // Defensive: Only parse as JSON if Content-Type is correct
    if (!contentType.includes('application/json')) {
      throw new APIError('Server returned a non-JSON response. Please try again later or contact support.', response.status, { message: 'Non-JSON response' })
    }
    
    const result = await response.json()
    console.log(`✅ API Response: ${endpoint}`, result)
    return result
  }

  // Authentication methods
  async register(data: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Accepts new backend response with user_type, activation_stage, nda_accepted, etc.
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async logout(): Promise<SuccessResponse> {
    return this.request<SuccessResponse>('/auth/logout', {
      method: 'POST',
    })
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<SuccessResponse> {
    return this.request<SuccessResponse>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async resetPassword(data: ResetPasswordRequest): Promise<SuccessResponse> {
    return this.request<SuccessResponse>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // --- Activation API methods ---
  async validateActivationToken(email: string, token: string): Promise<ActivationValidateResponse> {
    return this.request<ActivationValidateResponse>(`/auth/activate?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`, {
      method: 'GET',
    })
  }

  async activateAccount(data: {
    email: string
    token: string
    password: string
    password_confirmation: string
  }): Promise<ActivationUpdatePasswordResponse> {
    return this.request<ActivationUpdatePasswordResponse>('/auth/activate/update-password', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async resendActivationEmail(email: string): Promise<ActivationResendResponse> {
    return this.request<ActivationResendResponse>('/auth/activate/resend', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  // Profile methods
  async getProfile(): Promise<{ success: boolean; message: string; data: UserProfile }> {
    return this.request<{ success: boolean; message: string; data: UserProfile }>('/user/profile')
  }

  async updateProfile(data: UpdateProfileRequest): Promise<{
    message: string
    user: UserProfile
  }> {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Two-Factor Authentication methods
  async getTwoFactorStatus(): Promise<TwoFactorStatus> {
    const response = await this.request<{ success: boolean; data: TwoFactorStatus }>('/user/2fa/status')
    return response.data
  }

  async enableTwoFactor(): Promise<TwoFactorSetupResponse['data']> {
    const response = await this.request<TwoFactorSetupResponse>('/user/2fa/enable', {
      method: 'POST',
    })
    return response.data
  }

  async confirmTwoFactor(data: TwoFactorConfirmRequest): Promise<{
    recovery_codes: string[]
  }> {
    const response = await this.request<{
      success: boolean
      message: string
      data: { recovery_codes: string[] }
    }>('/user/2fa/confirm', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.data
  }

  async disableTwoFactor(data: TwoFactorDisableRequest): Promise<SuccessResponse> {
    return this.request<SuccessResponse>('/user/2fa/disable', {
      method: 'DELETE',
      body: JSON.stringify(data),
    })
  }

  async getTwoFactorQRCode(): Promise<TwoFactorQRCodeResponse['data']> {
    const response = await this.request<TwoFactorQRCodeResponse>('/user/2fa/qr-code')
    return response.data
  }

  async generateRecoveryCodes(): Promise<{ recovery_codes: string[] }> {
    const response = await this.request<{
      success: boolean
      message: string
      data: { recovery_codes: string[] }
    }>('/user/2fa/recovery-codes', {
      method: 'POST',
    })
    return response.data
  }

  // Device Session methods
  async getSessions(): Promise<SessionsResponse> {
    return this.request<SessionsResponse>('/user/sessions')
  }

  async revokeSession(tokenId: number): Promise<SuccessResponse> {
    return this.request<SuccessResponse>(`/user/sessions/${tokenId}`, {
      method: 'DELETE',
    })
  }

  async revokeOtherSessions(): Promise<{
    message: string
    revoked_count: number
  }> {
    return this.request('/user/sessions/revoke-others', {
      method: 'POST',
    })
  }

  async revokeAllSessions(): Promise<{
    message: string
    revoked_count: number
  }> {
    return this.request('/user/sessions/revoke-all', {
      method: 'POST',
    })
  }

  // KYC methods
  async submitKYCDocuments(data: KYCSubmissionRequest): Promise<SuccessResponse> {
    const formData = new FormData()
    formData.append('front', data.front)
    formData.append('back', data.back)
    formData.append('passport_photo', data.passport_photo)

    return this.request<SuccessResponse>('/user/kyc/submit', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    })
  }

  async getKYCStatus(): Promise<KYCStatusResponse> {
    return this.request<KYCStatusResponse>('/user/kyc/status')
  }

  /**
   * Fetch all users (admin only)
   */
  async getAllUsers(page: number = 1, perPage: number = 20): Promise<AllUsersResponse> {
    return this.request<AllUsersResponse>(`/admin/users?page=${page}&per_page=${perPage}`)
  }

  async getAdminUsers(params: AdminUserListParams): Promise<AllUsersResponse> {
    const query = new URLSearchParams()
    
    // Add parameters only if they have values
    if (params.search && params.search.trim()) query.append('search', params.search.trim())
    if (params.role && params.role.trim()) query.append('role', params.role)
    if (params.status && params.status.trim()) query.append('status', params.status)
    if (params.sort && params.sort.trim()) query.append('sort', params.sort)
    if (params.direction) query.append('direction', params.direction)
    if (params.page) query.append('page', params.page.toString())
    if (params.per_page) query.append('per_page', params.per_page.toString())
    
    const queryString = query.toString()
    const endpoint = queryString ? `/admin/users?${queryString}` : '/admin/users'
    
    console.log(`🔍 Admin Users Query: ${endpoint}`)
    return this.get<AllUsersResponse>(endpoint)
  }

  /**
   * Admin: Create a new user
   */
  async createAdminUser(data: AdminUserCreateRequest): Promise<AdminUserCreateResponse> {
    return this.request<AdminUserCreateResponse>(`/admin/users`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Admin: Update user details
   */
  async updateAdminUser(id: number, data: AdminUserUpdateRequest): Promise<AdminUserUpdateResponse> {
    return this.request<AdminUserUpdateResponse>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  /**
   * Admin: Delete user (soft delete)
   */
  async deleteAdminUser(id: number): Promise<AdminUserDeleteResponse> {
    return this.request<AdminUserDeleteResponse>(`/admin/users/${id}`, {
      method: 'DELETE',
    })
  }

  /**
   * Admin: Update user status (activate/suspend)
   */
  async updateAdminUserStatus(id: number, status: 'active' | 'inactive' | 'suspended'): Promise<AdminUserStatusResponse> {
    return this.request<AdminUserStatusResponse>(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  }

  /**
   * Admin: Update user role
   */
  async updateAdminUserRole(id: number, role: 'admin' | 'onboarding-officer' | 'investor'): Promise<AdminUserRoleResponse> {
    return this.request<AdminUserRoleResponse>(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    })
  }

  /**
   * Admin: Get dashboard statistics
   */
  async getAdminStats(): Promise<AdminStatsResponse> {
    return this.get<AdminStatsResponse>('/admin/stats');
  }
}

// Import mock client for demo mode
import { mockApiClient } from './mock-api-client'

// Create a singleton instance
const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'

export const apiClient = isDemoMode 
  ? mockApiClient
  : new APIClient(import.meta.env.VITE_API_URL || '/api')

export type { UserProfile, LoginCredentials, RegisterData, AuthResponse, ForgotPasswordRequest, ResetPasswordRequest, AllUsersResponse, ActivationStage, ActivationUser } from '../types/api'; // Ensure UserProfile is exported from the correct types location
