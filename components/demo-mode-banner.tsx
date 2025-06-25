/**
 * Demo Mode Banner - Shows when the app is running in demo mode
 */

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, Info } from 'lucide-react'

export function DevModeBanner() {
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'
  
  if (!isDemoMode) return null

  const demoEmail = import.meta.env.VITE_DEMO_EMAIL || 'user@example.com'
  const demoPassword = import.meta.env.VITE_DEMO_PASSWORD || 'test1234'

  return (
    <Alert className="mb-4 border-blue-200 bg-blue-50 text-blue-800">
      <Eye className="h-4 w-4" />
      <AlertDescription className="text-sm">
        <strong>🎭 Demo Mode Active</strong> - Using dummy data. Login with: <br />
        <span className="font-mono text-xs bg-blue-100 px-2 py-1 rounded mt-1 inline-block">
          📧 Email: {demoEmail} <br />
          🔑 Password: {demoPassword}
        </span>
      </AlertDescription>
    </Alert>
  )
}

export function DemoModeBanner() {
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'
  
  if (!isDemoMode || import.meta.env.NODE_ENV === 'production') return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-2 text-sm font-medium shadow-lg">
      <div className="flex items-center justify-center gap-2">
        <Eye className="h-4 w-4" />
        <span>Demo Mode - No real API calls | All data is simulated</span>
        <Info className="h-4 w-4" />
      </div>
    </div>
  )
}
