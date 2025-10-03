'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('dhyey_token') || getCookie('dhyey_token')
      const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password', '/login', '/register']
      const isPublicRoute = publicRoutes.includes(pathname)

      if (!token && !isPublicRoute) {
        router.replace('/auth/login')
        return
      }

      if (token && isPublicRoute) {
        router.replace('/dashboard')
        return
      }

      setIsAuthenticated(!!token)
      setIsLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift()
    return null
  }

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <p>Loading...</p>
      </div>
    )
  }

  return <>{children}</>
}