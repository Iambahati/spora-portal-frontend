import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/lib/auth-context"
import { registerSchema, type RegisterFormData } from "@/lib/validation-schemas"
import { useI18n } from "@/lib/i18n/context"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, User, ArrowRight, AlertCircle, Loader2, Lock } from "lucide-react"
import RouterAuthLayout from "@/router/components/router-auth-layout"

export default function SignUpPage() {
  const navigate = useNavigate()
  const { register: registerUser, loading, error, clearError } = useAuth()
  const { t } = useI18n()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  })

  const watchPassword = form.watch("password")

  // Calculate password strength
  React.useEffect(() => {
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

  const onSubmit = async (data: RegisterFormData) => {

    try {
      clearError()
      await registerUser(data)

      // Navigate to KYC portal after successful registration
      navigate("/kyc-upload", { replace: true })
    } catch (error) {
      // Error is handled by the auth context
      console.error("Registration error:", error)
    }
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
            <CardTitle className="text-3xl font-bold">
              {t("auth.createAccount")}
            </CardTitle>
            <CardDescription className="text-lg text-gray-500">
              {t("auth.joinInvestorCommunity")}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 px-12 pb-12">
            {/* Error alerts */}
            {error && (
              <Alert variant="destructive" className="animate-in fade-in-50 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
              </Alert>
            )}

            {form.formState.errors.root && (
              <Alert variant="destructive" className="animate-in fade-in-50 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm font-medium">{form.formState.errors.root.message}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name input */}
              <div className="space-y-3">
                <Label
                  htmlFor="full_name"
                >
                  <User style={{ height: "0.875rem", width: "0.875rem", color: "#6b7280" }} />
                  {t("common.fullName")}
                </Label>
                <div className="relative">
                  <Input
                    id="full_name"
                    type="text"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    {...form.register("full_name")}
                  />
                </div>
                {form.formState.errors.full_name && (
                  <p className="text-sm text-red-500 flex items-center gap-1 animate-in slide-in-from-left-2">
                    <AlertCircle className="h-3 w-3 flex-shrink-0" />
                    <span>{form.formState.errors.full_name.message}</span>
                  </p>
                )}
              </div>

              {/* Email input */}
              <div className="space-y-3">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" style={{ color: "#6b7280" }} />
                  {t("common.email")}
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="h-14 text-base border-gray-200 rounded-xl focus:border-transparent focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                    autoComplete="email"
                    {...form.register("email")}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500 flex items-center gap-1 animate-in slide-in-from-left-2">
                    <AlertCircle className="h-3 w-3 flex-shrink-0" />
                    <span>{form.formState.errors.email.message}</span>
                  </p>
                )}
              </div>

              {/* Password input */}
              <div className="space-y-3">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold flex items-center gap-2"
                  style={{ color: "#6b7280" }}
                >
                  <Lock className="h-4 w-4" style={{ color: "#6b7280" }} />
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
                    style={{
                      position: "absolute",
                      right: "0",
                      top: "0",
                      height: "100%",
                      padding: "0 0.75rem",
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#6b7280",
                      cursor: "pointer",
                      transition: "colors 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#eb6e03")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff style={{ height: "1rem", width: "1rem" }} />
                    ) : (
                      <Eye style={{ height: "1rem", width: "1rem" }} />
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
                          className={`h-1.5 flex-1 rounded-full transition-colors ${level <= passwordStrength
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
                  className="text-sm font-semibold flex items-center gap-2"
                  style={{ color: "#6b7280" }}
                >
                  <Lock className="h-4 w-4" style={{ color: "#6b7280" }} />
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
                    style={{
                      position: "absolute",
                      right: "0",
                      top: "0",
                      height: "100%",
                      padding: "0 0.75rem",
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#6b7280",
                      cursor: "pointer",
                      transition: "colors 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#eb6e03")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
                    aria-label={showConfirmPassword ? "Hide password confirmation" : "Show password confirmation"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff style={{ height: "1rem", width: "1rem" }} />
                    ) : (
                      <Eye style={{ height: "1rem", width: "1rem" }} />
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
                className="w-full h-14 text-lg font-semibold rounded-xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                style={{
                  backgroundColor: "#eb6e03",
                  borderColor: "#eb6e03"
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t("loading.creatingAccount")}
                  </>
                ) : (
                  <>
                    {t("auth.signUp")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            {/* Sign in link */}
            <div
              style={{
                textAlign: "center",
                paddingTop: "1rem",
                borderTop: "1px solid rgba(229, 231, 235, 0.5)",
              }}
            >
              <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                 {t("auth.alreadyHaveAccount")}{" "}
                <Link
                  to="/auth/signin"
                  style={{
                    color: "#eb6e03",
                    fontWeight: "500",
                    textDecoration: "none",
                    transition: "colors 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#d97706"
                    e.currentTarget.style.textDecoration = "underline"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#eb6e03"
                    e.currentTarget.style.textDecoration = "none"
                  }}
                >
                  {t("auth.signIn")}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </RouterAuthLayout>
  )
}
