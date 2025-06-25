import React, { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'dark' | 'light' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'dark' | 'light'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  attribute?: string
  enableSystem?: boolean
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
  attribute = 'data-theme',
  enableSystem = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('light')

  // Initialize theme from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme
    if (stored && ['dark', 'light', 'system'].includes(stored)) {
      setThemeState(stored)
    }
  }, [storageKey])

  // Handle system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      if (theme === 'system') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light'
        setResolvedTheme(systemTheme)
        document.documentElement.setAttribute(attribute, systemTheme)
      }
    }

    handleChange() // Set initial value
    mediaQuery.addEventListener('change', handleChange)
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, attribute])

  // Apply theme changes
  useEffect(() => {
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      setResolvedTheme(systemTheme)
      document.documentElement.setAttribute(attribute, systemTheme)
    } else {
      setResolvedTheme(theme)
      document.documentElement.setAttribute(attribute, theme)
    }
  }, [theme, attribute])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem(storageKey, newTheme)
  }

  const value: ThemeContextType = {
    theme,
    setTheme,
    resolvedTheme,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook to use theme context
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
