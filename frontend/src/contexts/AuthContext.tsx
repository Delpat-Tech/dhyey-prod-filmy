'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authAPI } from '@/lib/api'

interface User {
  id: string
  name: string
  username: string
  email: string
  avatar?: string
  role: 'user' | 'admin' | 'moderator'
  bio?: string
  location?: string
  website?: string
  joinDate?: string
  stats?: {
    followersCount: number
    followingCount: number
    storiesCount: number
  }
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  checkTokenValidity: () => Promise<boolean>
}

interface RegisterData {
  name: string
  username: string
  email: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const storedUser = localStorage.getItem('dhyey_user')
      const token = localStorage.getItem('dhyey_token')
      const tokenExpiry = localStorage.getItem('dhyey_token_expiry')
      
      if (storedUser && token) {
        // Check if token is expired
        if (tokenExpiry && new Date().getTime() > parseInt(tokenExpiry)) {
          console.log('Token expired, logging out')
          logout()
          return
        }
        
        // ✅ PERFORMANCE FIX: Trust localStorage, set user immediately
        setUser(JSON.parse(storedUser))
        
        // ✅ Validate token in background (non-blocking)
        validateTokenInBackground(token)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  // Background validation (doesn't block initial render)
  const validateTokenInBackground = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      
      if (!response.ok) {
        // Token invalid, logout user
        console.log('Token validation failed, logging out')
        logout()
      }
    } catch (error) {
      // Network error, keep user logged in (graceful degradation)
      console.error('Background token validation failed:', error)
    }
  }

  const checkTokenValidity = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('dhyey_token')
      if (!token) return false

      // Try to make an authenticated request to verify token
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      return response.ok
    } catch (error) {
      console.error('Token validation failed:', error)
      return false
    }
  }

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    setIsLoading(true)
    try {
      const data = await authAPI.login(email, password)

      // Extract user data from response
      const userData: User = {
        id: data.data.user._id,
        name: data.data.user.name,
        username: data.data.user.username,
        email: data.data.user.email,
        avatar: data.data.user.avatar,
        role: data.data.user.role || 'user'
      }

      // Calculate token expiry based on remember me
      const expiryTime = rememberMe 
        ? new Date().getTime() + (30 * 24 * 60 * 60 * 1000) // 30 days
        : new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours

      // Store user data, token, and expiry
      localStorage.setItem('dhyey_user', JSON.stringify(userData))
      localStorage.setItem('dhyey_token', data.token)
      localStorage.setItem('dhyey_token_expiry', expiryTime.toString())
      localStorage.setItem('dhyey_remember_me', rememberMe.toString())
      
      setUser(userData)
    } catch (error: any) {
      // Re-throw the error with proper message for suspended accounts
      if (error.message && error.message.includes('suspended')) {
        throw new Error('Your account has been suspended. Please contact administration for further details.')
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    setIsLoading(true)
    try {
      const data = await authAPI.register(userData)

      // Extract user data from response
      const newUser: User = {
        id: data.data.user._id,
        name: data.data.user.name,
        username: data.data.user.username,
        email: data.data.user.email,
        avatar: data.data.user.avatar,
        role: data.data.user.role || 'user'
      }

      // Store user data and token
      localStorage.setItem('dhyey_user', JSON.stringify(newUser))
      localStorage.setItem('dhyey_token', data.token)
      setUser(newUser)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Call backend logout API to invalidate refresh token
      await authAPI.logout()
    } catch (error) {
      console.error('Backend logout failed:', error)
      // Continue with local logout even if backend fails
    }
    
    // Clear local storage
    localStorage.removeItem('dhyey_user')
    localStorage.removeItem('dhyey_token')
    localStorage.removeItem('dhyey_token_expiry')
    localStorage.removeItem('dhyey_remember_me')
    setUser(null)
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login'
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('dhyey_user', JSON.stringify(updatedUser))
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    checkTokenValidity
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protected routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login'
      }
      return null
    }

    return <Component {...props} />
  }
}
