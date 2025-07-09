import React from "react"

interface EmptyStateProps {
  title?: string
  description?: React.ReactNode
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export default function EmptyState({
  title = "No Data",
  description = "There's nothing here yet.",
  icon,
  action,
  className = ""
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="mb-6">
        {icon || <SporaEmptySVG />}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <div className="text-gray-600 mb-4">{description}</div>
      {action && <div>{action}</div>}
    </div>
  )
}

function SporaEmptySVG() {
  // Modern, minimal SVG with Spora brand colors
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="32" width="80" height="48" rx="10" fill="#FFF6ED" />
      <rect x="20" y="44" width="56" height="24" rx="6" fill="#EB6E03" fillOpacity="0.12" />
      <circle cx="48" cy="32" r="16" fill="#EB6E03" fillOpacity="0.18" />
      <path d="M36 60h24M40 68h16" stroke="#EB6E03" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="48" cy="32" r="6" fill="#EB6E03" />
      <ellipse cx="48" cy="80" rx="18" ry="4" fill="#F1F5F9" />
    </svg>
  )
}
