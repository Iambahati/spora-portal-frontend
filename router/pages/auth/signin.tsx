import React, { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/lib/auth-context"
import { loginSchema, type LoginFormData } from "@/lib/validation-schemas"
import { useI18n } from "@/lib/i18n/context"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, ArrowRight, AlertCircle, Lock, Loader2, User } from "lucide-react"
import RouterAuthLayout from "@/router/components/router-auth-layout"
import { DemoModeBanner, DevModeBanner } from "@/components/demo-mode-banner"

export default function SignInPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading, error, clearError } = useAuth()
  const { t } = useI18n()
  
  const [showPassword, setShowPassword] = useState(false)
  
  // Get the intended destination from location state
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'
  const defaultRedirect = isDemoMode ? "/profile" : "/kyc-upload"
  const from = location.state?.from?.pathname || defaultRedirect

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: isDemoMode ? (import.meta.env.VITE_DEMO_EMAIL || "user@example.com") : "",
      password: isDemoMode ? (import.meta.env.VITE_DEMO_PASSWORD || "test1234") : "",
      remember_me: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError()
      await login({
        email: data.email,
        password: data.password,
      })
      
      // Navigate to intended destination or default
      navigate(from, { replace: true })
    } catch (error) {
      // Error is handled by the auth context
      console.error('Login failed:', error)
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
              {t("auth.welcomeBack")}
            </CardTitle>
            <CardDescription className="text-lg text-gray-500">
              {t("auth.signInToAccount")}
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
              {/* Demo mode helper */}
              {isDemoMode && (
                <div className="mb-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      form.setValue('email', import.meta.env.VITE_DEMO_EMAIL || 'user@example.com')
                      form.setValue('password', import.meta.env.VITE_DEMO_PASSWORD || 'test1234')
                    }}
                    className="w-full bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100"
                  >
                    🎭 Fill Demo Credentials
                  </Button>
                </div>
              )}
              
              {/* Email input */}
              <div className="space-y-3">
                <Label 
                  htmlFor="email" 
                  className="text-sm font-semibold flex items-center gap-2"
                  style={{ color: "#6b7280" }}
                >
                  <User style={{ height: "0.875rem", width: "0.875rem", color: "#6b7280" }} />
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
                <div className="flex items-center justify-between">
                  <Label 
                    htmlFor="password" 
                    className="text-sm font-semibold flex items-center gap-2"
                    style={{ color: "#6b7280" }}
                  >
                    <Lock className="h-4 w-4" style={{ color: "#6b7280" }} />
                    {t("common.password")}
                  </Label>
                  <Link
                    to="/auth/forgot-password"
                    className="text-sm font-medium hover:underline transition-colors"
                    style={{ color: "#eb6e03" }}
                  >
                    {t("auth.forgotPassword")}
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-14 text-base pr-12 border-gray-200 rounded-xl focus:border-transparent focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                    autoComplete="current-password"
                    {...form.register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-4 hover:bg-transparent text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500 flex items-center gap-1 animate-in slide-in-from-left-2">
                    <AlertCircle className="h-3 w-3 flex-shrink-0" />
                    <span>{form.formState.errors.password.message}</span>
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
                    {t("loading.signingIn")}
                  </>
                ) : (
                  <>
                    {t("auth.signIn")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            {/* Signup link */}
            <div className="text-center pt-4">
              <p className="text-gray-500">
                {t("auth.dontHaveAccount")}{" "}
                <Link
                  to="/auth/signup"
                  className="font-semibold hover:underline transition-colors"
                  style={{ color: "#eb6e03" }}
                >
                  {t("auth.signUp")}
                </Link>
              </p>
            </div>
            
          </CardContent>
        </Card>
      </div>
    </RouterAuthLayout>
  )
}


