'use client'

// Ultra-lightweight loading component for development
export default function DevLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
