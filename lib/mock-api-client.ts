/**
 * Mock API Client for Demo Mode
 * Provides dummy data and simulated responses for UI development
 */

import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  UserProfile,
  TwoFactorStatus,
  DeviceSession,
  KYCStatusResponse,
  SuccessResponse,
  UpdateProfileRequest,
  TwoFactorConfirmRequest,
  TwoFactorDisableRequest,
  SessionsResponse
} from './api-client'

// Mock user data
const mockUser: UserProfile = {
  id: 1,
  full_name: 'John Doe',
  email: 'user@example.com',
  investment_stage: {
    id: 2,
    name: 'kyc_approved',
    display_name: 'KYC Approved',
    description: 'Identity verified, ready to invest'
  },
  kyc_status: 'approved',
  created_at: '2024-01-15T10:30:00Z',
  updated_at: '2024-06-20T15:45:00Z'
}

// Mock officer user data
const mockOfficerUser: UserProfile = {
  id: 2,
  full_name: 'Sarah Johnson',
  email: 'officer@sporabank.com',
  role: 'onboarding-officer',
  investment_stage: {
    id: 1,
    name: 'staff_access',
    display_name: 'Staff Access',
    description: 'Staff member with limited access'
  },
  kyc_status: 'approved',
  created_at: '2024-01-10T09:00:00Z',
  updated_at: '2024-06-20T15:45:00Z'
}

// Mock admin user data
const mockAdminUser: UserProfile = {
  id: 3,
  full_name: 'Admin User',
  email: 'admin@sporabank.com',
  role: 'admin',
  investment_stage: {
    id: 1,
    name: 'admin_access',
    display_name: 'Admin Access',
    description: 'Full administrative access'
  },
  kyc_status: 'approved',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-06-20T15:45:00Z'
}

// Mock device sessions
const mockSessions: DeviceSession[] = [
  {
    id: 1,
    name: 'Chrome on macOS',
    abilities: ['*'],
    last_used_at: new Date().toISOString(),
    created_at: '2024-06-20T10:00:00Z',
    is_current: true,
    device_info: {
      device_type: 'web',
      browser: 'Firefox 139',
      os: 'Windows 10',
      device_name: 'Desktop PC'
    }
  },
  {
    id: 2,
    name: 'Safari on iPhone',
    abilities: ['*'],
    last_used_at: '2024-06-19T18:30:00Z',
    created_at: '2024-06-18T09:15:00Z',
    is_current: false,
    device_info: {
      device_type: 'mobile',
      browser: 'Safari Mobile',
      os: 'iOS 17.5',
      device_name: 'iPhone 15 Pro'
    }
  },
  {
    id: 3,
    name: 'Firefox on Windows',
    abilities: ['*'],
    last_used_at: '2024-06-15T14:20:00Z',
    created_at: '2024-06-10T16:45:00Z',
    is_current: false,
    device_info: {
      device_type: 'web',
      browser: 'Firefox 126',
      os: 'Windows 11',
      device_name: 'Desktop PC'
    }
  }
]

// Simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API responses
export class MockAPIClient {
  private isAuthenticated = false
  private twoFactorEnabled = false
  private token: string | null = null

  // Token management methods to match APIClient interface
  setToken(token: string) {
    this.token = token
    // In demo mode, any valid-looking token means the user is authenticated
    if (token && token.startsWith('mock-jwt-token')) {
      this.isAuthenticated = true
    }
  }

  clearToken() {
    this.token = null
    this.isAuthenticated = false
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('🎭 Mock API: Login attempt with:', credentials)
    await delay(800)
    
    // Simulate login validation for different user types
    if (credentials.email === 'user@example.com' && credentials.password === 'test1234') {
      this.isAuthenticated = true
      console.log('🎭 Mock API: Regular user login successful')
      return {
        message: 'Login successful',
        user: mockUser,
        token: 'mock-jwt-token-12345'
      }
    } else if (credentials.email === 'officer@sporabank.com' && credentials.password === 'officer123') {
      this.isAuthenticated = true
      console.log('🎭 Mock API: Officer login successful')
      return {
        message: 'Login successful',
        user: mockOfficerUser,
        token: 'mock-jwt-token-officer-67890'
      }
    } else if (credentials.email === 'admin@sporabank.com' && credentials.password === 'admin123') {
      this.isAuthenticated = true
      console.log('🎭 Mock API: Admin login successful')
      return {
        message: 'Login successful',
        user: mockAdminUser,
        token: 'mock-jwt-token-admin-54321'
      }
    } else {
      console.log('🎭 Mock API: Login failed - invalid credentials')
      throw new Error('Invalid email or password')
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    await delay(1000)
    
    if (data.password !== data.password_confirmation) {
      throw new Error('Passwords do not match')
    }
    
    this.isAuthenticated = true
    return {
      message: 'Registration successful',
      user: {
        ...mockUser,
        full_name: data.full_name,
        email: data.email,
        kyc_status: 'not_submitted',
        investment_stage: {
          id: 1,
          name: 'pending_kyc',
          display_name: 'Pending KYC',
          description: 'Please complete identity verification'
        }
      },
      token: 'mock-jwt-token-54321'
    }
  }

  async logout(): Promise<SuccessResponse> {
    await delay(300)
    this.isAuthenticated = false
    return { message: 'Logged out successfully' }
  }

  async forgotPassword(data: { email: string }): Promise<SuccessResponse> {
    await delay(600)
    return { message: 'Password reset link sent to your email' }
  }

  async resetPassword(data: any): Promise<SuccessResponse> {
    await delay(800)
    return { message: 'Password reset successfully' }
  }

  async getProfile(): Promise<UserProfile> {
    await delay(400)
    
    // In demo mode, if we have a token, we're authenticated
    if (this.token && this.token.startsWith('mock-jwt-token')) {
      this.isAuthenticated = true
      return mockUser
    }
    
    // If no valid token, throw unauthorized error
    if (!this.isAuthenticated) {
      throw new Error('Unauthorized')
    }
    
    return mockUser
  }

  async updateProfile(data: UpdateProfileRequest): Promise<{
    message: string
    user: UserProfile
  }> {
    await delay(600)
    return {
      message: 'Profile updated successfully',
      user: {
        ...mockUser,
        ...data,
        updated_at: new Date().toISOString()
      }
    }
  }

  // Two-Factor Authentication
  async getTwoFactorStatus(): Promise<TwoFactorStatus> {
    await delay(300)
    return {
      enabled: this.twoFactorEnabled,
      confirmed: this.twoFactorEnabled
    }
  }

  async enableTwoFactor(): Promise<{
    qr_code_url: string
    manual_entry_key: string
    recovery_codes: string[]
  }> {
    await delay(800)
    return {
      qr_code_url: 'otpauth://totp/SporaOneBank:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=SporaOneBank',
      manual_entry_key: 'JBSWY3DPEHPK3PXP',
      recovery_codes: [
        'a1b2c3d4',
        'e5f6g7h8',
        'i9j0k1l2',
        'm3n4o5p6',
        'q7r8s9t0',
        'u1v2w3x4',
        'y5z6a7b8',
        'c9d0e1f2'
      ]
    }
  }

  async confirmTwoFactor(data: TwoFactorConfirmRequest): Promise<{
    recovery_codes: string[]
  }> {
    await delay(600)
    
    // Simulate code validation
    if (data.code.length !== 6) {
      throw new Error('Invalid code format')
    }
    
    this.twoFactorEnabled = true
    return {
      recovery_codes: [
        'a1b2c3d4',
        'e5f6g7h8',
        'i9j0k1l2',
        'm3n4o5p6',
        'q7r8s9t0',
        'u1v2w3x4',
        'y5z6a7b8',
        'c9d0e1f2'
      ]
    }
  }

  async disableTwoFactor(data: TwoFactorDisableRequest): Promise<SuccessResponse> {
    await delay(500)
    
    if (data.password !== 'test1234') {
      throw new Error('Invalid password')
    }
    
    this.twoFactorEnabled = false
    return { message: 'Two-factor authentication disabled' }
  }

  async getTwoFactorQRCode(): Promise<{
    qr_code_url: string
    manual_entry_key: string
  }> {
    await delay(400)
    return {
      qr_code_url: 'otpauth://totp/SporaOneBank:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=SporaOneBank',
      manual_entry_key: 'JBSWY3DPEHPK3PXP'
    }
  }

  async generateRecoveryCodes(): Promise<{ recovery_codes: string[] }> {
    await delay(500)
    return {
      recovery_codes: [
        'x1y2z3a4',
        'b5c6d7e8',
        'f9g0h1i2',
        'j3k4l5m6',
        'n7o8p9q0',
        'r1s2t3u4',
        'v5w6x7y8',
        'z9a0b1c2'
      ]
    }
  }

  // Device Sessions
  async getSessions(): Promise<SessionsResponse> {
    await delay(400)
    return {
      sessions: mockSessions,
      total: mockSessions.length
    }
  }

  async revokeSession(sessionId: number): Promise<SuccessResponse> {
    await delay(500)
    return { message: 'Session revoked successfully' }
  }

  async revokeOtherSessions(): Promise<{
    message: string
    revoked_count: number
  }> {
    await delay(600)
    return {
      message: 'Other sessions revoked',
      revoked_count: mockSessions.filter(s => !s.is_current).length
    }
  }

  async revokeAllSessions(): Promise<{
    message: string
    revoked_count: number
  }> {
    await delay(700)
    return {
      message: 'All sessions revoked',
      revoked_count: mockSessions.length - 1 // Exclude current session
    }
  }

  // KYC
  async submitKYCDocuments(data: any): Promise<SuccessResponse> {
    await delay(2000) // Longer delay for file upload simulation
    return { message: 'KYC documents submitted successfully' }
  }

  async getKYCStatus(): Promise<KYCStatusResponse> {
    await delay(400)
    return {
      status: 'approved',
      submitted_at: '2024-06-15T10:30:00Z',
      reviewed_at: '2024-06-16T14:20:00Z',
      documents: [
        {
          id: 1,
          type: 'front',
          filename: 'id_front.jpg',
          status: 'approved',
          uploaded_at: '2024-06-15T10:30:00Z'
        },
        {
          id: 2,
          type: 'back',
          filename: 'id_back.jpg',
          status: 'approved',
          uploaded_at: '2024-06-15T10:31:00Z'
        },
        {
          id: 3,
          type: 'passport_photo',
          filename: 'selfie.jpg',
          status: 'approved',
          uploaded_at: '2024-06-15T10:32:00Z'
        }
      ]
    }
  }
}

// Create mock client instance
export const mockApiClient = new MockAPIClient()
