import React, { useState, useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { activatePasswordSchema, type ActivatePasswordFormData } from "@/lib/validation-schemas"
import { useI18n } from "@/lib/i18n/context"
import { apiClient } from "@/lib/api-client"
import type {
  ActivationStage,
  ActivationUser,
  UserProfile
} from '@/lib/api-client'
import { getPostLoginRedirect } from '@/lib/auth-utils'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, ArrowRight, AlertCircle, Loader2, CheckCircle2, Mail, RefreshCw } from "lucide-react"
import RouterAuthLayout from "@/router/components/router-auth-layout"

export default function ActivatePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t } = useI18n()

  const [email, setEmail] = useState<string>("")
  const [token, setToken] = useState<string>("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  
  // State management
  const [validatingToken, setValidatingToken] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [activationError, setActivationError] = useState<string>("")
  const [isExpired, setIsExpired] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)
  const [success, setSuccess] = useState(false)

  // Add state for activation details
  const [activationStage, setActivationStage] = useState<ActivationStage | null>(null)
  const [activationNextStep, setActivationNextStep] = useState<string | null>(null)
  const [activationUser, setActivationUser] = useState<ActivationUser | null>(null)

  const form = useForm<ActivatePasswordFormData>({
    resolver: zodResolver(activatePasswordSchema),
    defaultValues: {
      email: "",
      token: "",
      password: "",
      password_confirmation: "",
    },
  })

  const watchPassword = form.watch("password")

  // Calculate password strength
  useEffect(() => {
    let strength = 0
    if (watchPassword) {
      if (watchPassword.length >= 8) strength++
      if (/[A-Z]/.test(watchPassword)) strength++
      if (/[a-z]/.test(watchPassword)) strength++
      if (/[0-9]/.test(watchPassword)) strength++
      if (/[^A-Za-z0-9]/.test(watchPassword)) strength++
    }
    setPasswordStrength(strength)
  }, [watchPassword])

  // Extract query parameters and validate token
  useEffect(() => {
    const emailParam = searchParams.get("email")
    const tokenParam = searchParams.get("token")

    if (!emailParam || !tokenParam) {
      setValidatingToken(false)
      setActivationError("Missing activation parameters")
      return
    }

    setEmail(emailParam)
    setToken(tokenParam)
    
    // Set form values
    form.setValue("email", emailParam)
    form.setValue("token", tokenParam)

    // Validate the activation token
    validateActivationToken(emailParam, tokenParam)
  }, [searchParams])

  // Helper: Map activation user (possibly partial) to a valid UserProfile
  function mapActivationUserToUserProfile(user: any): UserProfile {
    // Allowed status values
    const allowedStatus = ["active", "inactive", "suspended"] as const;
    // Allowed kyc_status values
    const allowedKycStatus = ["not_submitted", "pending", "approved", "rejected"] as const;

    return {
      id: typeof user.id === "number" ? user.id : 0,
      full_name: typeof user.full_name === "string" ? user.full_name : "",
      email: typeof user.email === "string" ? user.email : "",
      role: typeof user.role === "string" ? user.role : "investor",
      created_at: typeof user.created_at === "string" ? user.created_at : new Date().toISOString(),
      updated_at: typeof user.updated_at === "string" ? user.updated_at : new Date().toISOString(),
      // status: coerce to allowed union or undefined
      status: allowedStatus.includes(user.status) ? user.status : undefined,
      // kyc_status: coerce to allowed union or default
      kyc_status: allowedKycStatus.includes(user.kyc_status) ? user.kyc_status : "not_submitted",
      // investment_stage: ensure object shape or fallback
      investment_stage: user.investment_stage && typeof user.investment_stage === "object"
        ? {
            id: typeof user.investment_stage.id === "number" ? user.investment_stage.id : 0,
            name: user.investment_stage.name || "",
            display_name: user.investment_stage.display_name || "",
            description: user.investment_stage.description || "",
          }
        : { id: 0, name: "", display_name: "", description: "" },
    };
  }

  const validateActivationToken = async (email: string, token: string) => {
    try {
      setValidatingToken(true)
      const response = await apiClient.validateActivationToken(email, token)
      if (response.success && response.data) {
        setTokenValid(true)
        setActivationError("")
        // Map activation user to UserProfile
        const user: UserProfile = mapActivationUserToUserProfile(response.data.user)
        setActivationUser(user)
        setActivationStage(response.data.user.activation_stage || null)
        setActivationNextStep(response.data.next_step || null)
      } else {
        setTokenValid(false)
        setActivationError(response.message)
        setIsExpired(
          response.message.toLowerCase().includes("expired") ||
          !!(response.data && response.data.user?.activation_stage?.is_expired)
        )
        setActivationStage(response.data?.user?.activation_stage || null)
        setActivationNextStep(response.data?.next_step || null)
      }
    } catch (error: any) {
      setTokenValid(false)
      setActivationError(error.message || "Failed to validate activation link")
      setIsExpired(error.message?.toLowerCase().includes("expired") || false)
      setActivationStage(null)
      setActivationNextStep(null)
    } finally {
      setValidatingToken(false)
    }
  }

  const onSubmit = async (data: ActivatePasswordFormData) => {
    try {
      setSubmitting(true)
      const response = await apiClient.activateAccount(data)
      if (response.success && response.data) {
        setSuccess(true)
        // Map activation user to UserProfile
        const user: UserProfile = mapActivationUserToUserProfile(response.data.user)
        setActivationUser(user)
        setActivationStage(user.activation_stage || null)
        // Store token for immediate login
        if (response.data.token) {
          localStorage.setItem('token', response.data.token)
        }
        // Use role/state-aware redirect after short delay
        const redirectPath = getPostLoginRedirect(user)
        setTimeout(() => {
          navigate(redirectPath, { replace: true })
        }, 2000)
      } else {
        form.setError("root", { message: response.message })
      }
    } catch (error: any) {
      form.setError("root", { message: error.message || "Failed to update password" })
    } finally {
      setSubmitting(false)
    }
  }

  const resendActivationEmail = async () => {
    try {
      setResending(true)
      const response = await apiClient.resendActivationEmail(email)
      if (response.success) {
        setActivationError("")
        setActivationError(response.message || "Activation email sent successfully. Please check your inbox.")
        setTimeout(() => setActivationError(""), 3000)
      } else {
        setActivationError(response.message)
      }
    } catch (error: any) {
      setActivationError(error.message || "Failed to resend activation email")
    } finally {
      setResending(false)
    }
  }

  const renderContent = () => {
    // Loading state
    if (validatingToken) {
      return (
        <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="space-y-3 text-center pb-8 pt-12">
            <CardTitle className="text-3xl font-bold">
              {t("auth.activatingAccount")}
            </CardTitle>
            <CardDescription className="text-lg text-gray-500">
              Please wait while we validate your activation link...
            </CardDescription>
          </CardHeader>
          <CardContent className="px-12 pb-12 text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-gray-600">{t("common.loading")}</p>
          </CardContent>
        </Card>
      )
    }

    // Success state
    if (success) {
      return (
        <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="space-y-3 text-center pb-8 pt-12">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-green-600">
              {t("auth.activationSuccessful")}
            </CardTitle>
            <CardDescription className="text-lg text-gray-500">
              {t("auth.passwordSetSuccessfully")}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-12 pb-12 text-center">
            <p className="text-gray-600 mb-6">{t("auth.accountReadyToUse")}</p>
            <p className="text-sm text-gray-500">Redirecting to sign in...</p>
          </CardContent>
        </Card>
      )
    }

    // Error state (invalid or expired token)
    if (!tokenValid) {
      return (
        <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="space-y-3 text-center pb-8 pt-12">
            <CardTitle className="text-3xl font-bold text-red-600">
              {t("auth.activationFailed")}
            </CardTitle>
            <CardDescription className="text-lg text-gray-500">
              {t("auth.invalidActivationLink")}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-12 pb-12 space-y-6">
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm font-medium">
                {activationError}
              </AlertDescription>
            </Alert>

            {isExpired && email && (
              <div className="text-center space-y-4">
                <p className="text-gray-600">{t("auth.checkEmailForActivation")}</p>
                <Button
                  onClick={resendActivationEmail}
                  disabled={resending}
                  variant="outline"
                  className="w-full h-12 text-base font-semibold rounded-xl border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  {resending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("auth.resendingActivationEmail")}
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      {t("auth.resendActivationEmail")}
                    </>
                  )}
                </Button>
              </div>
            )}

            <div className="text-center pt-4 border-t border-gray-200">
              <Link
                to="/auth/signin"
                className="text-primary font-medium hover:text-primary/80 transition-colors"
              >
                {t("auth.backToSignIn")}
              </Link>
            </div>
          </CardContent>
        </Card>
      )
    }

    // Valid token - show password form
    return (
      <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="space-y-3 text-center pb-8 pt-12">
          <CardTitle className="text-3xl font-bold">
            {t("auth.activateAccount")}
          </CardTitle>
          <CardDescription className="text-lg text-gray-500">
            {t("auth.activateAccountSubtitle")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 px-12 pb-12">
          {/* Form errors */}
          {form.formState.errors.root && (
            <Alert variant="destructive" className="animate-in fade-in-50 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm font-medium">
                {form.formState.errors.root.message}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email display */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                {t("common.email")}
              </Label>
                <div className="relative">
                  <Input
                    value={email}
                    disabled
                    className="h-14 text-base border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                    aria-label="Email address"
                  />
                </div>
            </div>

            {/* Password input */}
            <div className="space-y-3">
              <Label
                htmlFor="password"
                className="text-sm font-semibold flex items-center gap-2 text-gray-600"
              >
                <Lock className="h-4 w-4" />
                {t("common.password")}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="h-14 text-base pr-12 border-gray-200 rounded-xl focus:border-transparent focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                  autoComplete="new-password"
                  {...form.register("password")}
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full px-3 bg-transparent border-none text-gray-500 hover:text-primary transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Password strength indicator */}
              {watchPassword && (
                <div className="space-y-1.5 animate-in fade-in-50">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          level <= passwordStrength
                            ? passwordStrength <= 2
                              ? "bg-red-400"
                              : passwordStrength <= 3
                              ? "bg-yellow-400"
                              : "bg-green-400"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    {passwordStrength === 0 && "Password strength: Very weak"}
                    {passwordStrength === 1 && "Password strength: Weak"}
                    {passwordStrength === 2 && "Password strength: Fair"}
                    {passwordStrength === 3 && "Password strength: Good"}
                    {passwordStrength === 4 && "Password strength: Strong"}
                    {passwordStrength === 5 && "Password strength: Very strong"}
                  </p>
                </div>
              )}

              {form.formState.errors.password && (
                <p className="text-sm text-red-500 flex items-center gap-1 animate-in slide-in-from-left-2">
                  <AlertCircle className="h-3 w-3 flex-shrink-0" />
                  <span>{form.formState.errors.password.message}</span>
                </p>
              )}
            </div>

            {/* Confirm Password input */}
            <div className="space-y-3">
              <Label
                htmlFor="password_confirmation"
                className="text-sm font-semibold flex items-center gap-2 text-gray-600"
              >
                <Lock className="h-4 w-4" />
                {t("common.confirmPassword")}
              </Label>
              <div className="relative">
                <Input
                  id="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="h-14 text-base pr-12 border-gray-200 rounded-xl focus:border-transparent focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                  autoComplete="new-password"
                  {...form.register("password_confirmation")}
                />
                <Button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-0 h-full px-3 bg-transparent border-none text-gray-500 hover:text-primary transition-colors"
                  aria-label={showConfirmPassword ? "Hide password confirmation" : "Show password confirmation"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {form.formState.errors.password_confirmation && (
                <p className="text-sm text-red-500 flex items-center gap-1 animate-in slide-in-from-left-2">
                  <AlertCircle className="h-3 w-3 flex-shrink-0" />
                  <span>{form.formState.errors.password_confirmation.message}</span>
                </p>
              )}
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full h-14 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t("auth.settingPassword")}
                </>
              ) : (
                <>
                  {t("auth.activateAccount")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          {/* Sign in link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Already activated?{" "}
              <Link
                to="/auth/signin"
                className="text-primary font-medium hover:text-primary/80 transition-colors hover:underline"
              >
                {t("auth.signIn")}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <RouterAuthLayout>
      <div className="w-full max-w-md mx-auto">
        {/* Mobile branding */}
        <div className="lg:hidden text-center mb-8">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">SB</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Spora One Trust</h1>
          <p className="text-gray-600">Investor Portal</p>
        </div>

        {renderContent()}

        {/* Debug info - remove in production */}
        {/* {process.env.NODE_ENV === "development" && activationUser && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Debug Info</h3>
            <pre className="text-xs text-gray-700 whitespace-pre-wrap">
              {JSON.stringify({ email, token, activationUser, activationStage }, null, 2)}
            </pre>
          </div>
        )} */}
      </div>
    </RouterAuthLayout>
  )
}
