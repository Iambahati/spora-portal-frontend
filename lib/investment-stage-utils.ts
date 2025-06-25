/**
 * Investment Stage Utilities
 * 
 * Utilities for determining the current investment stage based on user status
 */

export interface UserInvestmentStatus {
  nda_accepted?: boolean
  kyc_status?: 'not_submitted' | 'pending' | 'approved' | 'rejected'
  agreement_signed?: boolean
  payment_status?: 'pending' | 'confirmed' | 'failed'
  certificate_issued?: boolean
  is_active_shareholder?: boolean
}

/**
 * Determines the current investment stage based on user status
 */
export function getCurrentInvestmentStage(userStatus: UserInvestmentStatus): string {
  // Check NDA status first
  if (!userStatus.nda_accepted) {
    return 'nda'
  }

  // Check KYC status
  if (!userStatus.kyc_status || userStatus.kyc_status === 'not_submitted') {
    return 'kyc-pending'
  }
  
  if (userStatus.kyc_status === 'pending') {
    return 'kyc-pending'
  }
  
  if (userStatus.kyc_status === 'rejected') {
    return 'kyc-pending' // Show as pending but could have different styling
  }
  
  if (userStatus.kyc_status !== 'approved') {
    return 'kyc-pending'
  }

  // KYC is approved, check agreement
  if (!userStatus.agreement_signed) {
    return 'kyc-approved'
  }

  // Agreement is signed, check payment
  if (!userStatus.payment_status || userStatus.payment_status === 'pending') {
    return 'payment-pending'
  }
  
  if (userStatus.payment_status === 'failed') {
    return 'payment-pending'
  }

  // Payment confirmed, check certificate
  if (!userStatus.certificate_issued) {
    return 'payment-confirmed'
  }

  // Certificate issued, check if active shareholder
  if (!userStatus.is_active_shareholder) {
    return 'certificate-issued'
  }

  // Fully active shareholder
  return 'active-shareholder'
}

/**
 * Gets a mock user status for demo purposes
 */
export function getMockUserStatus(stageOverride?: string): UserInvestmentStatus {
  const baseStatus: UserInvestmentStatus = {
    nda_accepted: false,
    kyc_status: 'not_submitted',
    agreement_signed: false,
    payment_status: 'pending',
    certificate_issued: false,
    is_active_shareholder: false,
  }

  // Override for demo purposes
  switch (stageOverride) {
    case 'nda':
      return baseStatus
    
    case 'kyc-pending':
      return {
        ...baseStatus,
        nda_accepted: true,
        kyc_status: 'pending',
      }
    
    case 'kyc-approved':
      return {
        ...baseStatus,
        nda_accepted: true,
        kyc_status: 'approved',
      }
    
    case 'agreement-signed':
      return {
        ...baseStatus,
        nda_accepted: true,
        kyc_status: 'approved',
        agreement_signed: true,
      }
    
    case 'payment-pending':
      return {
        ...baseStatus,
        nda_accepted: true,
        kyc_status: 'approved',
        agreement_signed: true,
        payment_status: 'pending',
      }
    
    case 'payment-confirmed':
      return {
        ...baseStatus,
        nda_accepted: true,
        kyc_status: 'approved',
        agreement_signed: true,
        payment_status: 'confirmed',
      }
    
    case 'certificate-issued':
      return {
        ...baseStatus,
        nda_accepted: true,
        kyc_status: 'approved',
        agreement_signed: true,
        payment_status: 'confirmed',
        certificate_issued: true,
      }
    
    case 'active-shareholder':
      return {
        ...baseStatus,
        nda_accepted: true,
        kyc_status: 'approved',
        agreement_signed: true,
        payment_status: 'confirmed',
        certificate_issued: true,
        is_active_shareholder: true,
      }
    
    default:
      return baseStatus
  }
}

/**
 * Gets the appropriate stage for a specific page
 */
export function getStageForPage(pageName: string): string {
  switch (pageName) {
    case 'nda-acceptance':
      return 'nda'
    case 'kyc-upload':
      return 'kyc-pending'
    case 'dashboard':
      return 'active-shareholder' // Assume users on dashboard are active
    case 'profile':
      return 'kyc-approved' // Show progress in profile
    case 'settings':
      return 'payment-confirmed' // Show advanced progress in settings
    default:
      return 'nda'
  }
}
