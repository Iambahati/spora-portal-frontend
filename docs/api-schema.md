# API Schema Documentation

This document provides comprehensive TypeScript interfaces and types for the Spora One Trust Investor Portal API, based on the OpenAPI specification.

## Base Types

### Authentication Types

```typescript
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface AuthResponse {
  message: string;
  user: UserProfile;
  token: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}
```

### User Profile Types

```typescript
interface UserProfile {
  id: number;
  full_name: string;
  email: string;
  investment_stage: InvestmentStage;
  kyc_status: KYCStatus;
  created_at: string;
  updated_at: string;
}

interface UpdateProfileRequest {
  full_name?: string;
  email?: string;
}

type KYCStatus = 'not_submitted' | 'pending' | 'approved' | 'rejected';

interface InvestmentStage {
  id: number;
  name: string;
  display_name: string;
  description: string;
}
```

### Two-Factor Authentication Types

```typescript
interface TwoFactorStatus {
  enabled: boolean;
  confirmed: boolean;
}

interface TwoFactorSetupResponse {
  message: string;
  qr_code: string; // SVG QR code
  recovery_codes: string[];
}

interface TwoFactorConfirmRequest {
  code: string; // 6-digit TOTP code
}

interface TwoFactorDisableRequest {
  password: string;
}

interface RecoveryCodesResponse {
  message: string;
  recovery_codes: string[];
}
```

### Device Session Types

```typescript
interface DeviceSession {
  id: number;
  name: string;
  abilities: string[];
  last_used_at: string;
  created_at: string;
  is_current: boolean;
  device_info: DeviceInfo;
}

interface DeviceInfo {
  device_type: 'web' | 'mobile' | 'tablet';
  browser?: string;
  os?: string;
  device_name?: string;
}

interface SessionsResponse {
  sessions: DeviceSession[];
  total: number;
}

interface SessionStats {
  total_sessions: number;
  active_sessions: number;
  inactive_sessions: number;
  oldest_session: string;
  newest_session: string;
}

interface CreateDeviceTokenRequest {
  device_name: string;
  device_type?: string;
  browser?: string;
  os?: string;
}

interface CreateDeviceTokenResponse {
  message: string;
  token: string;
  device_name: string;
}
```

### KYC Document Types

```typescript
interface KYCSubmissionRequest {
  front: File; // Front side of ID document
  back: File; // Back side of ID document
  passport_photo: File; // Passport-style photo
}

interface KYCStatusResponse {
  status: KYCStatus;
  submitted_at?: string;
  reviewed_at?: string;
  documents?: KYCDocument[];
  rejection_reason?: string;
}

interface KYCDocument {
  id: number;
  type: 'front' | 'back' | 'passport_photo';
  filename: string;
  status: 'pending' | 'approved' | 'rejected';
  uploaded_at: string;
}
```

## API Response Types

### Success Response

```typescript
interface SuccessResponse<T = any> {
  message: string;
  data?: T;
}
```

### Error Response

```typescript
interface ErrorResponse {
  message: string;
  exception?: string;
  errors?: ValidationErrors;
}

interface ValidationErrors {
  [field: string]: string[];
}
```

### Paginated Response

```typescript
interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}
```

## API Client Configuration

### Request Headers

```typescript
interface APIHeaders {
  'Authorization'?: string; // Bearer token
  'Content-Type': 'application/json' | 'multipart/form-data';
  'Accept': 'application/json';
  'X-Device-Type'?: 'web' | 'mobile' | 'desktop';
  'X-Browser-Name'?: string;
  'X-OS-Name'?: string;
  'X-Device-Name'?: string;
}
```

### Rate Limiting

```typescript
interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp
}

// Rate limits by endpoint type
const RATE_LIMITS = {
  AUTH_ENDPOINTS: 5, // per minute
  TWO_FA_ENDPOINTS: 5, // per minute
  GENERAL_ENDPOINTS: 60, // per minute
} as const;
```

## API Endpoints

### Authentication Endpoints

```typescript
interface AuthAPI {
  register(data: RegisterData): Promise<AuthResponse>;
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  logout(): Promise<SuccessResponse>;
  forgotPassword(data: ForgotPasswordRequest): Promise<SuccessResponse>;
  resetPassword(data: ResetPasswordRequest): Promise<SuccessResponse>;
}
```

### Profile Management Endpoints

```typescript
interface ProfileAPI {
  getProfile(): Promise<UserProfile>;
  updateProfile(data: UpdateProfileRequest): Promise<{
    message: string;
    user: UserProfile;
  }>;
}
```

### Two-Factor Authentication Endpoints

```typescript
interface TwoFactorAPI {
  getStatus(): Promise<TwoFactorStatus>;
  enable(): Promise<TwoFactorSetupResponse>;
  confirm(data: TwoFactorConfirmRequest): Promise<{
    message: string;
    recovery_codes: string[];
  }>;
  disable(data: TwoFactorDisableRequest): Promise<SuccessResponse>;
  getQRCode(): Promise<{ qr_code: string }>;
  generateRecoveryCodes(): Promise<RecoveryCodesResponse>;
}
```

### Device Session Endpoints

```typescript
interface SessionAPI {
  getSessions(): Promise<SessionsResponse>;
  revokeSession(tokenId: number): Promise<SuccessResponse>;
  revokeOtherSessions(): Promise<{
    message: string;
    revoked_count: number;
  }>;
  revokeAllSessions(): Promise<{
    message: string;
    revoked_count: number;
  }>;
  getSessionStats(): Promise<SessionStats>;
  createDeviceToken(data: CreateDeviceTokenRequest): Promise<CreateDeviceTokenResponse>;
}
```

### KYC Document Endpoints

```typescript
interface KYCAPI {
  submitDocuments(data: KYCSubmissionRequest): Promise<SuccessResponse>;
  getStatus(): Promise<KYCStatusResponse>;
}
```

## API Client Implementation

```typescript
class APIClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Device-Type': 'web',
      'X-Browser-Name': this.getBrowserName(),
      'X-OS-Name': this.getOSName(),
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new APIError(error.message, response.status, error);
    }

    return response.json();
  }

  // Auth methods
  async register(data: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Profile methods
  async getProfile(): Promise<UserProfile> {
    return this.request<UserProfile>('/user/profile');
  }

  // ... other methods
}

class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public response: ErrorResponse
  ) {
    super(message);
    this.name = 'APIError';
  }
}
```

## Usage Examples

### React Hook for API Integration

```typescript
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.login(credentials);
      
      setUser(response.user);
      apiClient.setToken(response.token);
      localStorage.setItem('token', response.token);
      
      return response;
    } catch (err) {
      const error = err as APIError;
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
  };
};
```

### Form Validation with Zod

```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
```

This API schema provides complete type safety for the entire application and ensures consistency between the frontend and backend implementations.
