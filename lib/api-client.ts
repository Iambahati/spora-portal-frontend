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

// API Types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  full_name: string
  email: string
  password: string
  password_confirmation: string
}

export interface AuthResponse {
  message: string
  user: UserProfile
  token: string
}

export interface UserProfile {
  id: number
  full_name: string
  email: string
  role?: string
  investment_stage: InvestmentStage
  kyc_status: KYCStatus
  created_at: string
  updated_at: string
}

export interface InvestmentStage {
  id: number
  name: string
  display_name: string
  description: string
}

export type KYCStatus = 'not_submitted' | 'pending' | 'approved' | 'rejected'

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  email: string
  token: string
  password: string
  password_confirmation: string
}

export interface UpdateProfileRequest {
  full_name?: string
  email?: string
}

export interface TwoFactorStatus {
  enabled: boolean
  confirmed: boolean
}

export interface TwoFactorSetupResponse {
  success: boolean
  message: string
  data: {
    qr_code_url: string
    manual_entry_key: string
    recovery_codes: string[]
  }
}

export interface TwoFactorQRCodeResponse {
  success: boolean
  message: string
  data: {
    qr_code_url: string
    manual_entry_key: string
  }
}

export interface TwoFactorConfirmRequest {
  code: string // 6-digit TOTP code
}

export interface TwoFactorDisableRequest {
  password: string
}

export interface KYCSubmissionRequest {
  front: File
  back: File
  passport_photo: File
}

export interface KYCStatusResponse {
  status: KYCStatus
  submitted_at?: string
  reviewed_at?: string
  documents?: KYCDocument[]
  rejection_reason?: string
}

export interface KYCDocument {
  id: number
  type: 'front' | 'back' | 'passport_photo'
  filename: string
  status: 'pending' | 'approved' | 'rejected'
  uploaded_at: string
}

export interface DeviceSession {
  id: number
  name: string
  abilities: string[]
  last_used_at: string
  created_at: string
  is_current: boolean
  device_info: DeviceInfo
}

export interface DeviceInfo {
  device_type: 'web' | 'mobile' | 'tablet'
  browser?: string
  os?: string
  device_name?: string
}

export interface SessionsResponse {
  sessions: DeviceSession[]
  total: number
}

export interface SuccessResponse<T = any> {
  message: string
  data?: T
}

export interface ErrorResponse {
  message: string
  exception?: string
  errors?: ValidationErrors
}

export interface ValidationErrors {
  [field: string]: string[]
}

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

// Main API Client
export class APIClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  setToken(token: string) {
    this.token = token
  }

  clearToken() {
    this.token = null
  }

  // Generic HTTP methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
    })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    })
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
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json'
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      let error: ErrorResponse
      try {
        error = await response.json()
      } catch {
        error = {
          message: `HTTP ${response.status}: ${response.statusText}`,
        }
      }
      throw new APIError(error.message, response.status, error)
    }

    return response.json()
  }

  // Authentication methods
  async register(data: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async logout(): Promise<SuccessResponse> {
    return this.request<SuccessResponse>('/logout', {
      method: 'POST',
    })
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<SuccessResponse> {
    return this.request<SuccessResponse>('/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async resetPassword(data: ResetPasswordRequest): Promise<SuccessResponse> {
    return this.request<SuccessResponse>('/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Profile methods
  async getProfile(): Promise<UserProfile> {
    return this.request<UserProfile>('/user/profile')
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
}

// Import mock client for demo mode
import { mockApiClient } from './mock-api-client'

// Create a singleton instance
const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'

if (isDemoMode) {
  console.log('🎭 Demo Mode Active - Using mock API client with dummy data')
  console.log('📧 Demo Email:', import.meta.env.VITE_DEMO_EMAIL || 'user@example.com')
  console.log('🔑 Demo Password:', import.meta.env.VITE_DEMO_PASSWORD || 'test1234')
} else {
  console.log('🌐 Production Mode - Using real API client')
  console.log('🔗 API URL:', import.meta.env.VITE_API_URL || '/api')
}

export const apiClient = isDemoMode 
  ? mockApiClient
  : new APIClient(import.meta.env.VITE_API_URL || '/api')
