import { useState, useEffect } from "react"

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: {
    name: string
    email: string
  } | null
}

export function useAuthCheck() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null
  })

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      
      if (!token) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null
        })
        return
      }

      // Validate token with your Laravel API
      const response = await fetch("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: userData
        })
      } else {
        // Invalid token, remove it
        localStorage.removeItem("auth_token")
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null
        })
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null
      })
    }
  }

  const login = (token: string, userData: any) => {
    localStorage.setItem("auth_token", token)
    setAuthState({
      isAuthenticated: true,
      isLoading: false,
      user: userData
    })
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null
    })
  }

  return {
    ...authState,
    login,
    logout,
    checkAuthStatus
  }
}
