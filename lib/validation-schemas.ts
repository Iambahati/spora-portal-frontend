import { z } from 'zod'

// Authentication Schemas
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
  remember_me: z.boolean().optional(),
})

export const registerSchema = z.object({
  full_name: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  password_confirmation: z
    .string()
    .min(1, 'Password confirmation is required'),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
})

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
})

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  token: z
    .string()
    .min(1, 'Reset token is required'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  password_confirmation: z
    .string()
    .min(1, 'Password confirmation is required'),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
})

export const activatePasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  token: z
    .string()
    .min(1, 'Activation token is required'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  password_confirmation: z
    .string()
    .min(1, 'Password confirmation is required'),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
})

// Two-Factor Authentication Schemas
export const twoFactorConfirmSchema = z.object({
  code: z
    .string()
    .min(1, 'Verification code is required')
    .length(6, 'Verification code must be 6 digits')
    .regex(/^\d{6}$/, 'Verification code must contain only numbers'),
})

export const twoFactorDisableSchema = z.object({
  password: z
    .string()
    .min(1, 'Password is required'),
})

// Profile Management Schemas
export const updateProfileSchema = z.object({
  full_name: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters')
    .optional(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional(),
  phone: z
    .string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  company: z
    .string()
    .max(100, 'Company name cannot exceed 100 characters')
    .optional()
    .or(z.literal('')),
})

export const changePasswordSchema = z.object({
  current_password: z
    .string()
    .min(1, 'Current password is required'),
  password: z
    .string()
    .min(1, 'New password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  password_confirmation: z
    .string()
    .min(1, 'Password confirmation is required'),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
}).refine((data) => data.current_password !== data.password, {
  message: "New password must be different from current password",
  path: ["password"],
})

// KYC Document Schemas
export const kycDocumentSchema = z.object({
  document_type: z.enum(['passport', 'national_id', 'driving_license'], {
    required_error: 'Please select a document type',
  }),
  front_image: z
    .instanceof(File, { message: 'Front image is required' })
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
      'Only JPEG, PNG, and WebP images are allowed'
    ),
  back_image: z
    .instanceof(File, { message: 'Back image is required' })
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
      'Only JPEG, PNG, and WebP images are allowed'
    )
    .optional(),
  selfie_image: z
    .instanceof(File, { message: 'Selfie image is required' })
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
      'Only JPEG, PNG, and WebP images are allowed'
    ),
})

// Device Session Schemas
export const createDeviceTokenSchema = z.object({
  device_name: z
    .string()
    .min(1, 'Device name is required')
    .max(50, 'Device name cannot exceed 50 characters'),
  device_type: z
    .enum(['web', 'mobile', 'tablet', 'desktop'])
    .optional(),
  browser: z
    .string()
    .max(50, 'Browser name cannot exceed 50 characters')
    .optional(),
  os: z
    .string()
    .max(50, 'OS name cannot exceed 50 characters')
    .optional(),
})

// Contact Form Schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject cannot exceed 200 characters'),
  message: z
    .string()
    .min(1, 'Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message cannot exceed 1000 characters'),
})

// Type exports for use in components
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type ActivatePasswordFormData = z.infer<typeof activatePasswordSchema>
export type TwoFactorConfirmFormData = z.infer<typeof twoFactorConfirmSchema>
export type TwoFactorDisableFormData = z.infer<typeof twoFactorDisableSchema>
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
export type KYCDocumentFormData = z.infer<typeof kycDocumentSchema>
export type CreateDeviceTokenFormData = z.infer<typeof createDeviceTokenSchema>
export type ContactFormData = z.infer<typeof contactFormSchema>

// Validation helper function
export const validateSchema = <T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean
  data?: T
  errors?: z.ZodError
} => {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error }
    }
    throw error
  }
}

// Form error helper
export const getFormErrors = (error: z.ZodError): Record<string, string> => {
  const errors: Record<string, string> = {}
  
  error.errors.forEach((err) => {
    const path = err.path.join('.')
    errors[path] = err.message
  })
  
  return errors
}