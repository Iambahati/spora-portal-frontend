import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validation-schemas"
import { useI18n } from "@/lib/i18n/context"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, ArrowRight, AlertCircle, CheckCircle, ArrowLeft, Loader2 } from "lucide-react"
import RouterAuthLayout from "@/router/components/router-auth-layout"

export default function ForgotPasswordPage() {
  const { t } = useI18n()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      // API call to Laravel backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to send reset email")
      }

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
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold">
                {t("auth.checkYourEmail")}
              </CardTitle>
              <CardDescription className="text-lg text-gray-500">
                {t("auth.resetLinkSent")}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8 px-12 pb-12">
              <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
                <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  {t("auth.didntReceiveEmail")}
                </AlertDescription>
              </Alert>
              
              <div className="space-y-6">
                <Button
                  variant="outline"
                  onClick={() => setSuccess(false)}
                  className="w-full h-14 border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 text-base font-medium"
                >
                   {t("auth.tryDifferentEmail")}
                
                </Button>
                
                <Link to="/auth/signin">
                  <Button 
                    className="w-full h-14 text-base font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    style={{ 
                      backgroundColor: "#eb6e03", 
                      color: "white",
                      border: "none"
                    }}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t("auth.backToSignIn")}
                  </Button>
                </Link>
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
            <CardTitle className="text-3xl font-bold" style={{ color:  "#6b7280" }}>
             {t("auth.forgotPassword")}
            </CardTitle>
            <CardDescription className="text-lg text-gray-500">
             {t("auth.forgotPasswordSubtitle")}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 px-12 pb-12">
            {/* Error alert */}
            {error && (
              <Alert variant="destructive" className="animate-in fade-in-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Email input */}
              <div className="space-y-3">
                <Label 
                  htmlFor="email" 
                  className="text-sm font-semibold flex items-center gap-2"
                  style={{ color:  "#6b7280" }}
                >
                  <Mail className="h-4 w-4" style={{ color:  "#6b7280" }} />
                  {t("common.email")}
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
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

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full h-14 text-base font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{ 
                  backgroundColor: "#eb6e03", 
                  color: "white",
                  border: "none"
                }}
                disabled={isLoading || form.formState.isSubmitting}
              >
                {isLoading || form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("auth.sendingResetLink")}
                  </>
                ) : (
                  <>
                    {t("auth.sendResetLink")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Back to signin link */}
            <div className="text-center pt-4 border-t border-gray-100">
              <Link
                to="/auth/signin"
                className="inline-flex items-center gap-2 font-medium transition-colors duration-200"
                style={{ color:  "#6b7280" }}
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
