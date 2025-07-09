import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { InvestmentStages } from '@/components/investment-stages'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import QRCode from 'qrcode'
import { useAuthState } from '@/lib/auth-context'
import { apiClient, type TwoFactorStatus, type DeviceSession } from '@/lib/api-client'
import { useToast } from '@/hooks/use-toast'
import { useI18n } from '@/lib/i18n/context'
import { 
  AlertCircle, 
  User, 
  Mail, 
  Loader2, 
  Shield, 
  ShieldCheck, 
  Monitor, 
  Smartphone, 
  Trash2, 
  MessageCircleMore, 
  Copy,
  Menu,
  X,
  Home,
  Bell,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react'

// Profile Info validation schema
const profileSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
})

type ProfileFormData = z.infer<typeof profileSchema>

const TABS = [
  { key: 'profile', label: 'profileTab.profile' },
  { key: '2fa', label: 'profileTab.twofa' },
  { key: 'sessions', label: 'profileTab.deviceSessions' },
]


// Sidebar navigation items


const SIDEBAR_ITEMS = [
  { key: 'home', label: 'sidenav.home', icon: Home, href: '/dashboard' },
  { key: 'profile', label: 'sidenav.profile', icon: User, active: true },
  { key: 'about', label: 'sidenav.aboutUs', icon: Info, href: '/about-us' },
  { key: 'notifications', label: 'sidenav.notifications', icon: Bell },
  {key: 'support', label: 'sidenav.support', icon: MessageCircleMore, href: '/support'},
]

export default function ProfilePage() {
  const [tab, setTab] = useState('profile')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, loading } = useAuthState()

  // Handle URL parameters and hash fragments for deep linking
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const hash = window.location.hash.replace('#', '')
    
    // Check for tab parameter in URL (?tab=2fa)
    const tabParam = urlParams.get('tab')
    if (tabParam && ['profile', '2fa', 'sessions'].includes(tabParam)) {
      setTab(tabParam)
    }
    
    // Check for hash fragment (#2fa)
    if (hash && ['profile', '2fa', 'sessions'].includes(hash)) {
      setTab(hash)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
      fixed lg:relative lg:translate-x-0 z-30 h-screen`}>
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">ST</span>
                </div>
                <div>
                  <h1 className="text-sm font-bold text-gray-900">Spora One Trust</h1>
                  <p className="text-xs text-gray-600">Investor Portal</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-1 h-8 w-8"
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item) => (
            <SidebarItem 
              key={item.key}
              item={item}
              collapsed={sidebarCollapsed}
              onClick={() => setMobileMenuOpen(false)}
            />
          ))}
        </nav>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Profile Settings</h1>
            </div>
            <div className="flex items-center gap-4">
              {/* Notifications Badge */}
              <div className="relative">
                <Button variant="outline" size="sm" className="p-2 h-10 w-10 rounded-full border-gray-200 hover:bg-gray-50">
                  <Bell className="h-5 w-5 text-gray-600" />
                </Button>
                <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">3</span>
                </div>
              </div>
              <ProfileDropdown 
                user={{
                  name: user?.full_name || user?.name,
                  email: user?.email,
                  avatar: user?.avatar
                }} 
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Investment Stages Progress */}
            <div className="mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-[#040956] mb-4">Account Setup Progress</h2>
                <InvestmentStages
                  currentStage="kyc-approved" // This would be dynamic based on user status
                  variant="horizontal"
                  showDescription={false}
                  className="w-full"
                />
              </div>
            </div>

            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader className="space-y-3 pb-6">
                <CardTitle className="text-2xl font-bold">
                  Account Settings
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Manage your profile information and security settings
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <TabNav tab={tab} setTab={setTab} />
                <div className="mt-6">
                  {tab === 'profile' && <ProfileInfoTab user={user} />}
                  {tab === '2fa' && <TwoFATab />}
                  {tab === 'sessions' && <DeviceSessionsTab />}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

// Sidebar Item Component
function SidebarItem({ 
  item, 
  collapsed, 
  onClick 
}: { 
  item: typeof SIDEBAR_ITEMS[0]
  collapsed: boolean
  onClick: () => void
}) {
  const { t } = useI18n()
  const Icon = item.icon
  const isActive = item.active

  const content = (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-primary text-primary-foreground' 
        : 'text-gray-700 hover:bg-gray-100'
    } ${collapsed ? 'justify-center' : ''}`}>
      <Icon className="h-5 w-5 flex-shrink-0" />
      {!collapsed && <span className="text-sm font-medium"> {t(item.label)}</span>}
    </div>
  )

  if (item.href) {
    return (
      <a href={item.href} onClick={onClick} className="block">
        {content}
      </a>
    )
  }

  return (
    <button onClick={onClick} className="w-full text-left">
      {content}
    </button>
  )
}

function TabNav({ tab, setTab }: { tab: string; setTab: (item: string) => void }) {
 const { t } = useI18n() 
  const handleTabChange = (newTab: string) => {
    setTab(newTab)
    // Update URL to reflect current tab for better UX and bookmarking
    const url = new URL(window.location.href)
    url.searchParams.set('tab', newTab)
    window.history.replaceState({}, '', url.toString())
  }

  return (
    <div className="flex w-full border-b border-gray-200">
      {TABS.map((item) => (
        <button
          key={item.key}
          className={`flex-1 py-3 text-center text-sm font-semibold transition-all duration-200 ${
            tab === item.key
              ? 'border-b-2 text-orange-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          style={{
            borderBottomColor: tab === item.key ? '#eb6e03' : 'transparent'
          }}
          onClick={() => handleTabChange(item.key)}
          type="button"
        >
         {t(item.label)}
        </button>
      ))}
    </div>
  )
}

function ProfileInfoTab({ user }: { user: any }) {
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const { t } = useI18n()
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      email: user?.email || '',
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    setSubmitting(true)
    setError('')
    try {
      const res = await apiClient.updateProfile(data)
      toast({ 
        title: 'Success', 
        description: 'Profile updated successfully.' 
      })
    } catch (e: any) {
      setError(e?.response?.message || 'Failed to update profile.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      {/* Error alert */}
      {error && (
        <Alert variant="destructive" className="animate-in fade-in-50 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
        </Alert>
      )}

      {/* Full Name input */}
      <div className="space-y-3">
        <Label 
          htmlFor="full_name" 
          className="text-sm font-semibold flex items-center gap-2"
          style={{ color: "#6b7280" }}
        >
          <User style={{ height: "0.875rem", width: "0.875rem", color: "#6b7280" }} />
           {t("profile.fullName")}
        </Label>
        <div className="relative">
          <Input
            id="full_name"
            type="text"
            placeholder="Enter your full name"
            className="h-14 text-base border-gray-200 rounded-xl focus:border-transparent focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
            autoComplete="name"
            {...form.register('full_name')}
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
          style={{ color: "#6b7280" }}
        >
          <Mail style={{ height: "0.875rem", width: "0.875rem", color: "#6b7280" }} />
            {t("profile.email")}
        </Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            className="h-14 text-base border-gray-200 rounded-xl focus:border-transparent focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
            autoComplete="email"
            {...form.register('email')}
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
        className="w-full h-14 text-lg font-semibold rounded-xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
        style={{ 
          backgroundColor: "#eb6e03",
          borderColor: "#eb6e03"
        }}
        disabled={submitting}
      >
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {t("profile.savingChanges")}
          </>
        ) : (
          t("profile.saveChanges")
        )}
      </Button>
    </form>
  )
}

function TwoFATab() {
  const { toast } = useToast()
  const { t } = useI18n()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [twoFactorStatus, setTwoFactorStatus] = useState<TwoFactorStatus | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [manualEntryKey, setManualEntryKey] = useState('')
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
  const [showQRCode, setShowQRCode] = useState(false)
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false)
  const [confirmationCode, setConfirmationCode] = useState('')
  const [disablePassword, setDisablePassword] = useState('')
  const [showDisableForm, setShowDisableForm] = useState(false)

  // Load 2FA status on mount
  useEffect(() => {
    loadTwoFactorStatus()
  }, [])

  // Generate QR code when qrCodeUrl is available
  useEffect(() => {
    if (qrCodeUrl && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, qrCodeUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).catch(console.error)
    }
  }, [qrCodeUrl])

  const loadTwoFactorStatus = async () => {
    setLoading(true)
    try {
      const status = await apiClient.getTwoFactorStatus()
      setTwoFactorStatus(status)
    } catch (e: any) {
      setError(e?.response?.message || 'Failed to load 2FA status.')
    } finally {
      setLoading(false)
    }
  }

  const handleEnable2FA = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await apiClient.enableTwoFactor()
      setQrCodeUrl(response.qr_code_url)
      setManualEntryKey(response.manual_entry_key)
      setRecoveryCodes(response.recovery_codes)
      setShowQRCode(true)
      setShowRecoveryCodes(false)
    } catch (e: any) {
      setError(e?.response?.message || 'Failed to enable 2FA.')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm2FA = async () => {
    if (!confirmationCode.trim()) {
      setError('Please enter the 6-digit code from your authenticator app.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await apiClient.confirmTwoFactor({ code: confirmationCode })
      setRecoveryCodes(response.recovery_codes)
      setShowQRCode(false)
      setShowRecoveryCodes(true)
      setConfirmationCode('')
      toast({ 
        title: 'Success', 
        description: 'Two-factor authentication enabled successfully.' 
      })
      await loadTwoFactorStatus()
    } catch (e: any) {
      setError(e?.response?.message || 'Invalid code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDisable2FA = async () => {
    if (!disablePassword.trim()) {
      setError('Please enter your password to disable 2FA.')
      return
    }

    setLoading(true)
    setError('')
    try {
      await apiClient.disableTwoFactor({ password: disablePassword })
      setShowDisableForm(false)
      setDisablePassword('')
      toast({ 
        title: 'Success', 
        description: 'Two-factor authentication disabled.' 
      })
      await loadTwoFactorStatus()
    } catch (e: any) {
      setError(e?.response?.message || 'Failed to disable 2FA.')
    } finally {
      setLoading(false)
    }
  }

  const copyRecoveryCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({ description: 'Recovery code copied to clipboard.' })
  }

  const copyManualKey = () => {
    navigator.clipboard.writeText(manualEntryKey)
    toast({ description: 'Manual entry key copied to clipboard.' })
  }

  if (loading && !twoFactorStatus) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Error alert */}
      {error && (
        <Alert variant="destructive" className="animate-in fade-in-50 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
        </Alert>
      )}

      {/* Current 2FA Status */}
      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
        <div className="flex items-center gap-3">
          {twoFactorStatus?.enabled ? (
            <ShieldCheck className="h-6 w-6 text-green-500" />
          ) : (
            <Shield className="h-6 w-6 text-gray-400" />
          )}
          <div>
            <p className="font-semibold text-gray-900">
              {t("twofa.twofaAuthentication")}
            </p>
            <p className="text-sm text-gray-500">
              {twoFactorStatus?.enabled ? t("common.enabled") : t("common.disabled")}
            </p>
          </div>
        </div>
        {twoFactorStatus?.enabled ? (
          <Button
            variant="outline"
            onClick={() => setShowDisableForm(true)}
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            {t("common.disabled")}
          </Button>
        ) : (
          <Button
            onClick={handleEnable2FA}
            disabled={loading}
            className="h-10 px-6 font-semibold rounded-xl transition-all duration-200"
            style={{ 
              backgroundColor: "#eb6e03",
              borderColor: "#eb6e03"
            }}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("common.settingUp")}
              </>
            ) : (
              t("twofa.enable2FA")
            )}
          </Button>
        )}
      </div>

      {/* QR Code Setup */}
      {showQRCode && (
        <div className="space-y-6 p-6 border border-gray-200 rounded-xl bg-gray-50">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t("twofa.scanQRCode")}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {t("twofa.scanQRCodeDesc")}
            </p>
            
            <div className="mx-auto mb-6 p-4 bg-white rounded-xl border inline-block">
              <canvas ref={canvasRef} />
            </div>

            {/* Manual entry option */}
            {manualEntryKey && (
              <div className="mb-6 p-4 bg-white rounded-xl border">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {t("twofa.manualEntry")}
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 text-sm bg-gray-100 rounded border font-mono">
                    {manualEntryKey}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyManualKey}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label 
              htmlFor="confirmation_code" 
              className="text-sm font-semibold text-gray-700"
            >
              {t("twofa.confirmationCode")}
            </Label>
            <Input
              id="confirmation_code"
              type="text"
              placeholder="Enter 6-digit code"
              className="h-14 text-base text-center border-gray-200 rounded-xl focus:border-transparent focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              maxLength={6}
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setShowQRCode(false)}
              variant="outline"
              className="flex-1 h-12 rounded-xl"
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleConfirm2FA}
              disabled={loading || !confirmationCode.trim()}
              className="flex-1 h-12 font-semibold rounded-xl transition-all duration-200"
              style={{ 
                backgroundColor: "#eb6e03",
                borderColor: "#eb6e03"
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.confirming")}
                </>
              ) : (
                t("twofa.confirmAndEnable")
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Recovery Codes */}
      {showRecoveryCodes && recoveryCodes.length > 0 && (
        <div className="space-y-4 p-6 border border-green-200 rounded-xl bg-green-50">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              {t("twofa.recoveryCodes")}
            </h3>
            <p className="text-sm text-green-700 mb-4">
              {t("twofa.recoveryCodesDesc")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {recoveryCodes.map((code, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200"
              >
                <code className="text-sm font-mono text-gray-900">{code}</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyRecoveryCode(code)}
                  className="h-6 w-6 p-0 hover:bg-green-100"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          <Button
            onClick={() => setShowRecoveryCodes(false)}
            className="w-full h-12 font-semibold rounded-xl transition-all duration-200"
            style={{ 
              backgroundColor: "#eb6e03",
              borderColor: "#eb6e03"
            }}
          >
            {t("twofa.savedMyRecoveryCodes")}
          </Button>
        </div>
      )}

      {/* Disable 2FA Form */}
      {showDisableForm && (
        <div className="space-y-6 p-6 border border-red-200 rounded-xl bg-red-50">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              {t("twofa.disable2FATitle")}
            </h3>
            <p className="text-sm text-red-700 mb-4">
              {t("twofa.disable2FADesc")}
            </p>
          </div>

          <div className="space-y-3">
            <Label 
              htmlFor="disable_password" 
              className="text-sm font-semibold text-gray-700"
            >
              {t("common.password")}
            </Label>
            <Input
              id="disable_password"
              type="password"
              placeholder="Enter your password"
              className="h-14 text-base border-gray-200 rounded-xl focus:border-transparent focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
              value={disablePassword}
              onChange={(e) => setDisablePassword(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setShowDisableForm(false)}
              variant="outline"
              className="flex-1 h-12 rounded-xl"
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleDisable2FA}
              disabled={loading || !disablePassword.trim()}
              className="flex-1 h-12 font-semibold rounded-xl transition-all duration-200 bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.disabling")}
                </>
              ) : (
                t("twofa.disable2FA")
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function DeviceSessionsTab() {
    const { toast } = useToast()
    const { t } = useI18n()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [sessions, setSessions] = useState<DeviceSession[]>([])
    const [revoking, setRevoking] = useState<number | null>(null)
    const [revokingAll, setRevokingAll] = useState(false)

    // Load sessions on mount
    useEffect(() => {
        loadSessions()
    }, [])

    const loadSessions = async () => {
        setLoading(true)
        setError('')
        try {
            const response = await apiClient.getSessions()
            setSessions(response.sessions)
        } catch (e: any) {
            setError(e?.response?.message || 'Failed to load device sessions.')
        } finally {
            setLoading(false)
        }
    }

    const handleRevokeSession = async (sessionId: number) => {
        setRevoking(sessionId)
        setError('')
        try {
            await apiClient.revokeSession(sessionId)
            toast({ 
                title: 'Success', 
                description: 'Session revoked successfully.' 
            })
            await loadSessions()
        } catch (e: any) {
            setError(e?.response?.message || 'Failed to revoke session.')
        } finally {
            setRevoking(null)
        }
    }

    const handleRevokeAllSessions = async () => {
        setRevokingAll(true)
        setError('')
        try {
            const response = await apiClient.revokeAllSessions()
            toast({ 
                title: 'Success', 
                description: `Revoked ${response.revoked_count} sessions.` 
            })
            await loadSessions()
        } catch (e: any) {
            setError(e?.response?.message || 'Failed to revoke all sessions.')
        } finally {
            setRevokingAll(false)
        }
    }

const getDeviceIcon = (deviceType: string, os?: string) => {
        // Check for mobile devices first
        if (deviceType === 'mobile') {
                if (os?.toLowerCase().includes('ios')) {
                        return <Smartphone className="h-5 w-5 text-blue-500" />
                }
                if (os?.toLowerCase().includes('android')) {
                        return <Smartphone className="h-5 w-5 text-green-500" />
                }
                return <Smartphone className="h-5 w-5 text-gray-400" />
        }

        // Check for tablet devices
        if (deviceType === 'tablet') {
                if (os?.toLowerCase().includes('ios') || os?.toLowerCase().includes('ipad')) {
                        return <Monitor className="h-5 w-5 text-blue-500" />
                }
                return <Monitor className="h-5 w-5 text-gray-400" />
        }

        // Desktop/web devices - check OS
        if (os) {
                const osLower = os.toLowerCase()
                if (osLower.includes('mac') || osLower.includes('darwin')) {
                        return <Monitor className="h-5 w-5 text-gray-600" />
                }
                if (osLower.includes('windows')) {
                        return <Monitor className="h-5 w-5 text-blue-600" />
                }
                if (osLower.includes('linux')) {
                        return <Monitor className="h-5 w-5 text-orange-500" />
                }
                if (osLower.includes('chrome os') || osLower.includes('chromeos')) {
                        return <Monitor className="h-5 w-5 text-green-600" />
                }
        }

        // Default fallback
        return <Monitor className="h-5 w-5 text-gray-400" />
}

    const formatLastUsed = (dateString: string) => {

        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
        if (isNaN(diffInHours)) return 'Invalid date'
        
        if (diffInHours < 1) return 'Just now'
        if (diffInHours < 24) return `${diffInHours} hours ago`
        
        const diffInDays = Math.floor(diffInHours / 24)
        if (diffInDays < 7) return `${diffInDays} days ago`
        
        return date.toLocaleDateString()
    }

    if (loading && sessions.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        )
    }

    return (
        
        <div className="space-y-6">
                
            {/* Error alert */}
            {error && (
                <Alert variant="destructive" className="animate-in fade-in-50 border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
                </Alert>
            )}

            {/* Header with revoke all button */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{t("session.activeSession")}</h3>
                    <p className="text-sm text-gray-600">
                        {t("session.activeSessionsDesc")}
                    </p>
                </div>
                {sessions.length > 1 && (
                    <Button
                        onClick={handleRevokeAllSessions}
                        disabled={revokingAll}
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                        {revokingAll ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t("common.revoking")}
                            </>
                        ) : (
                            t('session.revokeAll')
                        )}
                    </Button>
                )}
            </div>

            {/* Sessions list */}
            <div className="space-y-3">
                {sessions.map((session) => (
                    <div
                        key={session.id}
                        className={`p-4 border rounded-xl transition-all duration-200 ${
                            session.is_current 
                                ? 'border-green-200 bg-green-50' 
                                : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {getDeviceIcon(session.device_info.device_type, session.device_info.os)}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-gray-900">
                                            {session.device_info.device_name || session.name}
                                        </p>
                                        {session.is_current && (
                                            <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                                                Current Session
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        {session.device_info.browser && (
                                            <p>{session.device_info.browser} on {session.device_info.os}</p>
                                        )}
                                        <p>{t('session.lastUsed')}: {formatLastUsed(session.last_used_at)}</p>
                                    </div>
                                </div>
                            </div>

                            {!session.is_current && (
                                <Button
                                    onClick={() => handleRevokeSession(session.id)}
                                    disabled={revoking === session.id}
                                    size="sm"
                                    variant="outline"
                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                >
                                    {revoking === session.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="h-4 w-4" />
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {sessions.length === 0 && !loading && (
                <div className="text-center py-12">
                    <Monitor className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">{t('session.noActiveSessions')}</p>
                </div>
            )}

            {/* Refresh button */}
            <div className="text-center pt-4">
                <Button
                    onClick={loadSessions}
                    disabled={loading}
                    variant="outline"
                    className="h-12 px-6 rounded-xl"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           {t('common.refreshing')}
                        </>
                    ) : (
                        t('session.refreshSessions')
                    )}
                </Button>
            </div>
        </div>
    )
}
