import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { I18nProvider } from "@/lib/i18n/context"
import { AuthProvider, useAuthState } from "@/lib/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import BankLoading from "@/components/bank-loading"
import { lazy, Suspense } from "react"

// Lazy load page components for better performance
const SignInPage = lazy(() => import("./pages/auth/signin"))
const SignUpPage = lazy(() => import("./pages/auth/signup"))
const ForgotPasswordPage = lazy(() => import("./pages/auth/forgot-password"))
const ResetPasswordPage = lazy(() => import("./pages/auth/reset-password"))
const ActivatePage = lazy(() => import("./pages/auth/activate"))
const NDAAcceptancePage = lazy(() => import("./pages/nda-acceptance"))
const KYCUploadPage = lazy(() => import("./pages/kyc-upload"))
const DashboardPage = lazy(() => import("./pages/dashboard"))
const NotFoundPage = lazy(() => import("./pages/not-found"))
const ProfilePage = lazy(() => import("./pages/profile"))
const SettingsPage = lazy(() => import("./pages/settings"))
const AdminDashboardPage = lazy(() => import("./pages/admin/dashboard"))
const KYCOfficerDashboardPage = lazy(() => import("./pages/kyc-officer/dashboard"))
const AboutUsPage = lazy(() => import("./pages/about-us"))
const LegalPage = lazy(() => import("./pages/legal"))

// Main Router Application
export default function RouterApp() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="spora-ui-theme">
      <AuthProvider>
        <I18nProvider>
          <BrowserRouter>
            <Routes>
                {/* Public auth routes */}
                <Route path="/auth/signin" element={
                  <AuthOnlyRoute>
                    <Suspense fallback={<BankLoading />}>
                      <SignInPage />
                    </Suspense>
                  </AuthOnlyRoute>
                } />
                <Route path="/auth/signup" element={
                  <AuthOnlyRoute>
                    <Suspense fallback={<BankLoading />}>
                      <SignUpPage />
                    </Suspense>
                  </AuthOnlyRoute>
                } />
                <Route path="/auth/forgot-password" element={
                  <AuthOnlyRoute>
                    <Suspense fallback={<BankLoading />}>
                      <ForgotPasswordPage />
                    </Suspense>
                  </AuthOnlyRoute>
                } />
                <Route path="/auth/reset-password" element={
                  <AuthOnlyRoute>
                    <Suspense fallback={<BankLoading />}>
                      <ResetPasswordPage />
                    </Suspense>
                  </AuthOnlyRoute>
                } />
                <Route path="/auth/activate" element={
                  <AuthOnlyRoute>
                    <Suspense fallback={<BankLoading />}>
                      <ActivatePage />
                    </Suspense>
                  </AuthOnlyRoute>
                } />
                
                {/* Public informational routes */}
                <Route path="/about-us" element={
                  <Suspense fallback={<BankLoading />}>
                    <AboutUsPage />
                  </Suspense>
                } />
                
                <Route path="/legal" element={
                  <Suspense fallback={<BankLoading />}>
                    <LegalPage />
                  </Suspense>
                } />
                
                {/* NDA Acceptance route */}
                <Route path="/nda-acceptance" element={
                  <ProtectedRoute>
                    <Suspense fallback={<BankLoading />}>
                      <NDAAcceptancePage />
                    </Suspense>
                  </ProtectedRoute>
                } />
                
                {/* Protected routes */}
                <Route path="/kyc-upload" element={
                  <NDAProtectedRoute>
                    <Suspense fallback={<BankLoading />}>
                      <KYCUploadPage />
                    </Suspense>
                  </NDAProtectedRoute>
                } />
                
                <Route path="/dashboard" element={
                  <NDAProtectedRoute>
                    <Suspense fallback={<BankLoading />}>
                      <DashboardPage />
                    </Suspense>
                  </NDAProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <NDAProtectedRoute>
                    <Suspense fallback={<BankLoading />}>
                      <ProfilePage />
                    </Suspense>
                  </NDAProtectedRoute>
                } />
                
                <Route path="/settings" element={
                  <NDAProtectedRoute>
                    <Suspense fallback={<BankLoading />}>
                      <SettingsPage />
                    </Suspense>
                  </NDAProtectedRoute>
                } />
                
                <Route path="/admin/dashboard" element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<BankLoading />}>
                      <AdminDashboardPage />
                    </Suspense>
                  </AdminProtectedRoute>
                } />
                
                <Route path="/kyc-officer/dashboard" element={
                  <KYCOfficerProtectedRoute>
                    <Suspense fallback={<BankLoading />}>
                      <KYCOfficerDashboardPage />
                    </Suspense>
                  </KYCOfficerProtectedRoute>
                } />
                
                {/* About Us page - public route */}
                <Route path="/about-us" element={
                  <Suspense fallback={<BankLoading />}>
                    <AboutUsPage />
                  </Suspense>
                } />
                
                {/* Root redirect */}
                <Route path="/" element={<AuthRedirect />} />
                <Route path="/shell" element={<AuthRedirect />} />
                
                {/* 404 catch-all */}
                <Route path="*" element={
                  <Suspense fallback={<BankLoading />}>
                    <NotFoundPage />
                  </Suspense>
                } />
              </Routes>
            </BrowserRouter>
          </I18nProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

// Auth redirect component - checks for NDA acceptance before redirecting to main app
function AuthRedirect() {
  const { isAuthenticated, loading } = useAuthState()
  
  if (loading) {
    return <BankLoading />
  }
  
  if (isAuthenticated) {
    // Check if user has accepted NDA
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const ndaStatus = localStorage.getItem(`nda_status_${user.id}`)
    
    // Check user role and redirect appropriately
    if (user.role === 'onboarding-officer' || user.role === 'officer') {
      return <Navigate to="/kyc-officer/dashboard" replace />
    }
    
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />
    }
    
    if (!ndaStatus || ndaStatus === 'declined') {
      return <Navigate to="/nda-acceptance" replace />
    }
    
    return <Navigate to="/dashboard" replace />
  }
  
  return <Navigate to="/auth/signin" replace />
}

// Protected route wrapper - only for authenticated users
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthState()
  
  if (loading) {
    return <BankLoading />
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" replace />
  }
  
  return <>{children}</>
}

// NDA Protected route wrapper - checks for NDA acceptance before allowing access
function NDAProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthState()
  
  if (loading) {
    return <BankLoading />
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" replace />
  }
  
  // Check if user has accepted NDA
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const ndaStatus = localStorage.getItem(`nda_status_${user.id}`)
  
  if (!ndaStatus || ndaStatus === 'declined') {
    return <Navigate to="/nda-acceptance" replace />
  }
  
  if (ndaStatus !== 'accepted') {
    return <Navigate to="/nda-acceptance" replace />
  }
  
  return <>{children}</>
}

// Auth-only route wrapper - only for unauthenticated users
function AuthOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthState()
  
  if (loading) {
    return <BankLoading />
  }
  
  if (isAuthenticated) {
    // Check user role and redirect appropriately
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    
    if (user.role === 'onboarding-officer' || user.role === 'officer') {
      return <Navigate to="/kyc-officer/dashboard" replace />
    }
    
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />
    }
    
    // Check if user has accepted NDA
    const ndaStatus = localStorage.getItem(`nda_status_${user.id}`)
    
    if (!ndaStatus || ndaStatus === 'declined') {
      return <Navigate to="/nda-acceptance" replace />
    }
    
    return <Navigate to="/dashboard" replace />
  }
  
  return <>{children}</>
}

// Admin Protected route wrapper - for admin users only
function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthState()
  
  if (loading) {
    return <BankLoading />
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" replace />
  }
  
  // Check if user is admin (in real app, this would check user role from API)
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isAdmin = user.role === 'admin' || user.email?.includes('admin') // Simple admin check for demo
  
  if (isAdmin) {
    return <Navigate to="/dashboard" replace />
  }
  
  return <>{children}</>
}

// Officer Protected route wrapper - for officer users only
function KYCOfficerProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthState()
  
  if (loading) {
    return <BankLoading />
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" replace />
  }
  
  // Check if user is officer (in real app, this would check user role from API)
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isOfficer = user.role === 'onboarding-officer' || user.role === 'officer' // Officer role check
  
  if (isOfficer) {
    return <Navigate to="/dashboard" replace />
  }
  
  return <>{children}</>
}
