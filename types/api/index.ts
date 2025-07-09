// All API/server types for Spora One Trust Investor Portal
// Split by domain for clarity. You can further split into multiple files if desired.

// --- Auth Types ---
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
  success: boolean
  message: string
  data: {
    user: UserProfile
    token: string
  }
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  email: string
  token: string
  password: string
  password_confirmation: string
}

// --- User/Profile Types ---
export type UserRole = 'admin' | 'onboarding-officer' | 'investor' | 'guest' | 'unknown';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot?: {
    model_type: string;
    model_id: number;
    role_id: number;
  };
}

export interface UserProfile {
  id: number
  full_name: string
  email: string
  role: UserRole
  roles?: Role[]
  status?: UserStatus
  photo_url?: string | null
  last_logged_in_at?: string | null
  email_verified_at?: string | null
  activation_token?: string | null
  activation_expires_at?: string | null
  activated_at?: string | null
  two_factor_confirmed_at?: string | null
  created_at: string
  updated_at: string
  deleted_at?: string | null
  investment_stage?: InvestmentStage
  kyc_status?: KYCStatus
  activation_stage?: ActivationStage
  nda_accepted?: boolean
}

export interface UpdateProfileRequest {
  full_name?: string
  email?: string
}

export interface InvestmentStage {
  id: number
  name: string
  display_name: string
  description: string
}

export type KYCStatus = 'not_submitted' | 'pending' | 'approved' | 'rejected'

// --- 2FA Types ---
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

// --- KYC Types ---
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

// --- Device Session Types ---
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

// --- General API Response Types ---
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

// --- Activation Types ---
export interface ActivationStage {
  stage: string
  status: string
  expires_at?: string
  is_expired?: boolean
  requires_action?: boolean
  next_step?: string
  activated_at?: string
  action_required?: string
}

export interface ActivationUser {
  id: number
  email: string
  full_name: string
  activation_stage?: ActivationStage
  status?: string
  investment_stage?: InvestmentStage
}

export interface ActivationValidateResponse {
  success: boolean
  data?: {
    user: ActivationUser
    next_step?: string
    message?: string
  }
  message: string
}

export interface ActivationUpdatePasswordResponse {
  success: boolean
  data?: {
    user: ActivationUser
    token: string
    message?: string
  }
  message: string
}

export interface ActivationResendResponse {
  success: boolean
  message: string
  data?: any
}

export interface AllUsersResponse {
  success: boolean;
  message: string;
  current_page: number;
  data: UserProfile[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: { url: string | null; label: string; active: boolean }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// --- Admin User Management Types ---
export interface AdminUserCreateRequest {
  full_name: string
  email: string
  role: 'admin' | 'onboarding-officer' | 'investor'
}

export interface AdminUserCreateResponse {
  user: UserProfile
}

export interface AdminUserUpdateRequest {
  full_name?: string
  email?: string
  password?: string
}

export interface AdminUserUpdateResponse extends UserProfile {}

export interface AdminUserDeleteResponse {
  message: string
}

export interface AdminUserStatusResponse {
  message: string
  user?: UserProfile
}

export interface AdminUserRoleResponse {
  message: string
  user?: UserProfile
}

export interface AdminUserListParams {
  search?: string;
  sort?: 'full_name' | 'email' | 'created_at' | 'status' | 'role';
  direction?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
  role?: string;
  status?: UserStatus;
}

// --- Admin Dashboard Stats ---
export interface AdminStatsRecentActivity {
  type: 'kyc_approval' | 'user_registration' | 'nda_accepted' | 'kyc_pending' | 'fund_investment';
  message: string;
  time: string | null;
  status: 'success' | 'info' | 'warning';
}

export interface AdminStatsResponse {
  totalUsers: number;
  newUsersThisMonth: number;
  fundsRaised: number;
  fundsRaisedThisMonth: number;
  pendingKYC: number;
  approvedKYC: number;
  rejectedKYC: number;
  totalNDAs: number;
  acceptedNDAs: number;
  pendingNDAs: number;
  userFeedbackCount: number;
  recentActivities: AdminStatsRecentActivity[];
}
