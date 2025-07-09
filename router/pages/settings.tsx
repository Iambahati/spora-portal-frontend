import React from "react"
import { useAuthState } from "@/lib/auth-context"
import { NavigationHeader } from "@/components/navigation-header"
import { InvestmentStages } from "@/components/investment-stages"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useI18n } from "@/lib/i18n/context"
import { Settings, Bell, Shield, Globe, Moon } from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuthState()
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      /* Header */
      <NavigationHeader 
        user={{
          name: user?.full_name ?? "",
          email: user?.email ?? "",
          avatar: user?.photo_url ?? (user?.full_name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || undefined)
        }}
        title="Settings"
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#040956] mb-2">Settings</h1>
          <p className="text-slate-600 text-lg">
            Manage your account preferences and settings
          </p>
        </div>

        {/* Settings Content */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Investment Stages Progress */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#040956] mb-4">Account Setup Progress</h2>
            <InvestmentStages
              currentStage="payment-confirmed" // This would be dynamic based on user status
              variant="horizontal"
              showDescription={false}
              className="w-full"
            />
          </div>

          {/* Notifications */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#040956] flex items-center gap-2">
                <Bell className="h-6 w-6" />
                Notifications
              </CardTitle>
              <CardDescription className="text-lg">
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Email Notifications</Label>
                  <p className="text-sm text-slate-600">Receive updates via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Investment Updates</Label>
                  <p className="text-sm text-slate-600">Get notified about investment opportunities</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Security Alerts</Label>
                  <p className="text-sm text-slate-600">Important security notifications</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#040956] flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Privacy & Security
              </CardTitle>
              <CardDescription className="text-lg">
                Manage your privacy and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-slate-600">Add an extra layer of security</p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Session Management</Label>
                  <p className="text-sm text-slate-600">Manage active sessions and devices</p>
                </div>
                <Button variant="outline" size="sm">
                  View Sessions
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#040956] flex items-center gap-2">
                <Moon className="h-6 w-6" />
                Appearance
              </CardTitle>
              <CardDescription className="text-lg">
                Customize how the app looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Dark Mode</Label>
                  <p className="text-sm text-slate-600">Toggle dark theme</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Language & Region */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#040956] flex items-center gap-2">
                <Globe className="h-6 w-6" />
                Language & Region
              </CardTitle>
              <CardDescription className="text-lg">
                Set your language and regional preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Language</Label>
                  <p className="text-sm text-slate-600">Choose your preferred language</p>
                </div>
                <Button variant="outline" size="sm">
                  English
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
