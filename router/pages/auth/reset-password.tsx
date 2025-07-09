import React, { useState, useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/validation-schemas"
import { useI18n } from "@/lib/i18n/context"
import { apiClient } from "@/lib/api-client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle, ArrowLeft, Loader2, Lock } from "lucide-react"
import RouterAuthLayout from "@/router/components/router-auth-layout"

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t } = useI18n()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const token = searchParams.get("token")
  const email = searchParams.get("email")

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email || "",
      token: token || "",
      password: "",
      password_confirmation: "",
    },
  })

  const watchPassword = form.watch("password")
  const watchPasswordConfirmation = form.watch("password_confirmation")
  // Remove duplicate or unused state
  const passwordsMatch = !watchPassword || !watchPasswordConfirmation || watchPassword === watchPasswordConfirmation

  // Calculate password strength
  React.useEffect(() => {
    let strength = 0
    if (watchPassword) {
      if (/[A-Z]/.test(watchPassword)) strength++
      if (/[a-z]/.test(watchPassword)) strength++
      if (/[0-9]/.test(watchPassword)) strength++
      if (/[^A-Za-z0-9]/.test(watchPassword)) strength++
    }
    // Only show 'Strong' if all 4 criteria are met AND length >= 8
    if (strength === 4 && watchPassword.length >= 8) {
      setPasswordStrength(5)
    } else {
      setPasswordStrength(strength)
    }
  }, [watchPassword])

  useEffect(() => {
    if (!token || !email) {
      setError("Invalid or expired reset link. Please request a new password reset.")
    } else {
      // Set the values in the form
      form.setValue("email", email)
      form.setValue("token", token)
    }
  }, [token, email, form])

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      // Use API client
      await apiClient.resetPassword(data)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
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

          <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="space-y-3 text-center pb-8 pt-12">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 transform transition-all animate-fade-in">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold" style={{ color: "#040956" }}>
                {t("auth.passwordResetSuccessful")}
              </CardTitle>
              <CardDescription className="text-lg text-gray-500">
                {t("auth.signInWithNewPassword")}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-12 pb-12">
              <Link to="/auth/signin">
                <Button
                  className="w-full h-14 text-base font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    backgroundColor: "#eb6e03",
                    color: "white",
                    border: "none"
                  }}
                >
                  {t("auth.continueToSignIn")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </RouterAuthLayout>
    )
  }

  // Show error if invalid token/email
  if (!token || !email) {
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

          <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="space-y-3 text-center pb-8 pt-12">
              <CardTitle className="text-3xl font-bold" style={{ color: "#040956" }}>
                {t("auth.invalidResetLink")}
              </CardTitle>
              <CardDescription className="text-lg text-gray-500">
                {t("auth.invalidResetLinkMessage")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 px-12 pb-12">

              <div className="space-y-6">
                <Link to="/auth/forgot-password">
                  <Button
                    className="w-full h-14 text-base font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      backgroundColor: "#eb6e03",
                      color: "white",
                      border: "none"
                    }}
                  >
                    {t("auth.requestNewResetLink")}
                  </Button>
                </Link>

                <div className="text-center pt-2 border-t border-gray-100">
                  <Link
                    to="/auth/signin"
                    className="inline-flex items-center gap-2 font-medium transition-colors duration-200"
                    style={{ color: "#6b7280" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#d97706"
                      e.currentTarget.style.textDecoration = "underline"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#6b7280"
                      e.currentTarget.style.textDecoration = "none"
                    }}
                  >
                    <ArrowLeft className="h-4 w-4 " />
                    {t("auth.backToSignIn")}
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </RouterAuthLayout>
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

        <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="space-y-3 text-center pb-8 pt-12">
            <CardTitle className="text-3xl font-bold" style={{ color: "#040956" }}>
              {t("auth.setNewPassword")}
            </CardTitle>
            <CardDescription className="text-lg text-gray-500">
              {t("auth.resetPasswordDescription")}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 px-12 pb-12">
            {/* Error alert */}
            {error && (
              <Alert variant="destructive" className="animate-in fade-in-50 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Password input */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold flex items-center gap-2"
                    style={{ color: "#040956" }}
                  >
                    <Lock className="h-4 w-4" style={{ color: "#040956" }} />
                    {t("auth.newPassword")}
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    className="h-14 text-base border-gray-200 rounded-xl focus:border-transparent focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 pr-10"
                    {...form.register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {/* Password strength indicator and warning */}
                {watchPassword && (
                  <div className="space-y-1.5 animate-in fade-in-50">
                    {/* Strength bar - only one color at a time */}
                    <div className="flex space-x-1 mt-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 rounded-full transition-all duration-200 w-full ${passwordStrength >= i
                              ? passwordStrength <= 2
                                ? 'bg-red-400'
                                : passwordStrength <= 3
                                  ? 'bg-yellow-400'
                                  : 'bg-green-500'
                              : 'bg-gray-200'
                            }`}
                        />
                      ))}
                    </div>
                    {/* Strength label and warning */}
                    <div className="flex items-center gap-1 mt-0.5">
                      {passwordStrength <= 2 ? (
                        <AlertCircle className="h-3 w-3 text-red-500" />
                      ) : passwordStrength <= 3 ? (
                        <AlertCircle className="h-3 w-3 text-yellow-500" />
                      ) : (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      )}
                      <span className={`text-xs font-medium ${passwordStrength <= 2 ? 'text-red-500' : passwordStrength <= 3 ? 'text-yellow-500' : 'text-green-500'
                        }`}>
                        {passwordStrength <= 2 ? t('auth.passwordWeak') : passwordStrength <= 3 ? t('auth.passwordGood') : t('auth.passwordStrong')}
                      </span>
                      {passwordStrength <= 2 && (
                        <span className="ml-2 text-xs text-red-500 font-medium">
                          {t("auth.passwordTooWeak")}
                        </span>
                      )}
                    </div>
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
                  className="text-sm font-semibold flex items-center gap-2"
                  style={{ color: "#040956" }}
                >
                  <Lock className="h-4 w-4" style={{ color: "#040956" }} />
                  {t("auth.confirmNewPassword")}
                </Label>
                <div className="relative">
                  <Input
                    id="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    className="h-14 text-base border-gray-200 rounded-xl focus:border-transparent focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 pr-10"
                    {...form.register("password_confirmation")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {/* Show error if passwords do not match */}
                {!passwordsMatch && watchPassword && watchPasswordConfirmation && (
                  <p className="text-sm text-red-500 flex items-center gap-1 animate-in slide-in-from-left-2">
                    <AlertCircle className="h-3 w-3 flex-shrink-0" />
                    <span>Passwords do not match</span>
                  </p>
                )}
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
                className="w-full h-14 text-base font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  backgroundColor: "#eb6e03",
                  color: "white",
                  border: "none"
                }}
                disabled={
                  isLoading ||
                  form.formState.isSubmitting ||
                  Boolean(watchPassword && passwordStrength <= 2) ||
                  !passwordsMatch ||
                  !watchPassword ||
                  !watchPasswordConfirmation
                }
              >
                {isLoading || form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("auth.updatingPassword")}
                  </>
                ) : (
                  <>
                    {t("auth.updatePassword")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Back to signin link */}
            <div className="text-center pt-6 border-t border-gray-100">
              <Link
                to="/auth/signin"
                className="inline-flex items-center gap-2 font-medium transition-colors duration-200"
                style={{ color: "#6b7280" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#d97706"
                  e.currentTarget.style.textDecoration = "underline"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#6b7280"
                  e.currentTarget.style.textDecoration = "none"
                }}
              >
                <ArrowLeft className="h-4 w-4 " />
                {t("auth.backToSignIn")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </RouterAuthLayout>
  )
}
